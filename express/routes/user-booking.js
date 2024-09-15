import express from 'express'
import cors from 'cors'
import multer from 'multer'
import 'dotenv/config.js'
import connection from '##/configs/mysql-promise.js'
import transporter from '##/configs/mail.js'

const upload = multer()
const router = express.Router()

// 設定CORS白名單和選項
const whitelist = ['http://localhost:5500', 'http://localhost:3000']
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('不允許傳遞資料'))
    }
  },
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

router.get('/:userId', async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({ status: 'error', message: '缺少用戶 ID' })
  }

  try {
    const query = `
      SELECT * FROM booking_record WHERE user_id = ?
    `
    const [bookings] = await connection.execute(query, [userId])
    res.status(200).json({ status: 'success', data: { bookings } })
  } catch (err) {
    console.error('Database query failed:', err.stack || err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

router.get('/:userId/:status', async (req, res) => {
  const { userId, status } = req.params
  const { search } = req.query // 取得搜尋關鍵字

  if (!userId || !status) {
    return res
      .status(400)
      .json({ status: 'error', message: '缺少用戶 ID 或狀態' })
  }

  try {
    let query = `
       SELECT 
          booking_record.id,
          booking_record.numerical_order as order_number,
          booking_record.table_id,
          booking_record.user_id,
          booking_record.date,
          booking_record.start_time,
          booking_record.end_time,
          booking_record.status,
          booking_record.created_at,
          booking_record.playroom_type,
          booking_record.notes,
          booking_record.total_price,
          booking_record.party_id,
          mahjong_table.id AS table_id,
          mahjong_table.company_id AS company_id,
          company.name AS company_name,
          company.tele AS company_tele,
          company.address AS company_address,
          user.username AS username,
          (SELECT COUNT(*) FROM mahjong_table WHERE company_id = company.id AND id <= mahjong_table.id) AS table_number,
          party.userID_main as user_main,
          user_main.username as main_username,
          party.userID_join1 as user_join1,
          COALESCE(user_join1.username, '') as join1_username,
          party.userID_join2 as user_join2,
          COALESCE(user_join2.username, '') as join2_username,
          party.userID_join3 as user_join3,
          COALESCE(user_join3.username, '') as join3_username
      FROM 
          booking_record
      JOIN 
          mahjong_table ON booking_record.table_id = mahjong_table.id
      JOIN 
          company ON mahjong_table.company_id = company.id
      JOIN 
          user ON booking_record.user_id = user.id
      LEFT JOIN 
          party ON booking_record.party_id = party.id
      LEFT JOIN 
          user AS user_main ON party.userID_main = user_main.id
      LEFT JOIN 
          user AS user_join1 ON party.userID_join1 = user_join1.id
      LEFT JOIN 
          user AS user_join2 ON party.userID_join2 = user_join2.id
      LEFT JOIN 
          user AS user_join3 ON party.userID_join3 = user_join3.id
      WHERE 
          booking_record.user_id = ? AND booking_record.status = ?
    `

    if (search) {
      query +=
        ' AND (company.name LIKE ? OR booking_record.numerical_order LIKE ?)'
    }

    query += `
      ORDER BY 
          booking_record.date DESC,
          booking_record.start_time DESC;
    `

    const queryParams = search
      ? [userId, status, `%${search}%`, `%${search}%`]
      : [userId, status]

    const [bookings] = await connection.execute(query, queryParams)

    // 將成員資料組合成陣列
    const bookingsWithMembers = bookings.map((booking) => {
      return {
        ...booking,
        members: [
          { id: booking.user_main, username: booking.main_username },
          { id: booking.user_join1, username: booking.join1_username },
          { id: booking.user_join2, username: booking.join2_username },
          { id: booking.user_join3, username: booking.join3_username },
        ].filter((member) => member.username), // 過濾掉空的成員
      }
    })

    res
      .status(200)
      .json({ status: 'success', data: { bookings: bookingsWithMembers } })
  } catch (err) {
    console.error('Database query failed:', err.stack || err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

const sendCancellationEmail = (email, bookingDetails) => {
  // 將日期格式化為 YYYY / MM / DD
  const formattedDate = new Date(bookingDetails.date)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, ' / ')

  // 將時間格式化為 HH : MM，並在冒號兩邊加入空格
  const formattedStartTime = bookingDetails.start_time
    .slice(0, 5)
    .replace(':', ' : ')
  const formattedEndTime = bookingDetails.end_time
    .slice(0, 5)
    .replace(':', ' : ')

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '您的預訂已取消',
    text: `尊敬的用戶，您的預訂號為 ${bookingDetails.order_number} 的預訂已取消。`,
    html: `
        <!DOCTYPE html>
        <html lang="zh-TW">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 550px;
                margin: 0 auto;
                background-color: #2b4d37;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px solid #dddddd;
              }
              .header h1 {
                color: #faf7f0;
                margin: 0;
                font-size: 24px;
              }
              .content {
                margin: 20px 0;
                line-height: 1.5;
              }
              .content p {
                margin: 0 0 10px;
              }
              .content a {
                display: inline-block;
                padding: 10px 20px;
                margin: 0 0 10px;
                background-color: #b79347;
                color: #faf7f0;
                text-decoration: none;
                border-radius: 5px;
              }
              p,
              .p {
                color: #faf7f0;
                font-weight: 900;
                font-size: 16px;
                @media screen and (max-width: 768px) {
                  font-size: 14px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>只欠東風 - 取消預訂通知</h1>
              </div>
              <div class="content">
                <p>您好，</p>
                <p>您的預訂號為 <strong>${bookingDetails.order_number}</strong> 的預訂已取消。</p>
                <p>詳情如下：</p>
                <p style="text-indent: 20px;">店家名稱：${bookingDetails.company_name}</p>
                <p style="text-indent: 20px;">預訂日期：${formattedDate}</p>
                <p style="text-indent: 20px;">開始時間：${formattedStartTime}</p>
                <p style="text-indent: 20px;">結束時間：${formattedEndTime}</p>   
                <p>如果您有任何問題，請隨時聯繫我們。</p>
                <p>感謝您的使用！</p>
                <p>敬上，</p>
                <p>東風開發團隊。</p>
              </div>
            </div>
          </body>
        </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}

router.put('/cancel/:bookingId', async (req, res) => {
  const { bookingId } = req.params

  if (!bookingId) {
    return res.status(400).json({ status: 'error', message: '缺少預訂 ID' })
  }

  try {
    // 獲取預訂信息並包括公司名稱以發送郵件
    const query = `
      SELECT 
        booking_record.numerical_order AS order_number,
        booking_record.*,
        company.name AS company_name
      FROM 
        booking_record
      JOIN 
        mahjong_table ON booking_record.table_id = mahjong_table.id
      JOIN 
        company ON mahjong_table.company_id = company.id
      WHERE 
        booking_record.id = ?
    `

    const [bookings] = await connection.execute(query, [bookingId])

    const bookingDetails = bookings[0]

    if (!bookingDetails) {
      return res.status(404).json({ status: 'error', message: '找不到該預訂' })
    }

    // 更新預訂狀態為已取消
    const updateQuery = `
      UPDATE booking_record
      SET status = 'cancelled'
      WHERE id = ?
    `
    const [result] = await connection.execute(updateQuery, [bookingId])

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: '找不到該預訂' })
    }

    // 發送取消郵件
    const [user] = await connection.execute(
      `SELECT email FROM user WHERE id = ?`,
      [bookingDetails.user_id]
    )

    const userEmail = user[0].email
    console.log(bookingDetails)
    console.log(user)
    await sendCancellationEmail(userEmail, bookingDetails)

    res.status(200).json({ status: 'success', message: '預訂已取消' })
  } catch (err) {
    console.error('Database query failed:', err.stack || err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

export default router
