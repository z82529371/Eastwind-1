import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import transporter from '##/configs/mail.js'
import connection from '##/configs/mysql-promise.js'
import 'dotenv/config.js'

const router = express.Router()

// 設定CORS白名單和選項
const whitelist = ['http://localhost:5500', 'http://localhost:3000'] // 設置允許的CORS來源
const corsOptions = {
  credentials: true, // 允許攜帶憑證（例如Cookie）
  origin(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true) // 允許請求
    } else {
      callback(new Error('不允許傳遞資料')) // 否則拒絕請求
    }
  },
}

const app = express()
app.use(cors(corsOptions)) // 使用CORS中間件，應用CORS設置
app.use(express.json()) // 使用JSON中間件來解析請求體中的JSON資料

// 發送忘記密碼驗證信 API
router.post('/forgot-password', async (req, res) => {
  const { email, account } = req.body

  if (!email) {
    return res
      .status(400)
      .json({ status: 'fail', message: '請提供有效的電子信箱' })
  }

  if (!account) {
    return res.status(400).json({ status: 'fail', message: '請提供帳號' })
  }

  try {
    // 檢查帳號是否存在
    const [userByAccount] = await connection.execute(
      'SELECT * FROM user WHERE account = ?',
      [account]
    )

    if (userByAccount.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: '無此帳號',
      })
    }

    // 檢查該帳號是否有對應的電子信箱
    const [emailByAccount] = await connection.execute(
      'SELECT * FROM user WHERE account = ? AND email = ?',
      [account, email]
    )

    if (emailByAccount.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: '帳號與電子信箱不匹配',
      })
    }

    // 如果帳號和電子信箱匹配，繼續處理
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    })

    // 構建不含 token 的重設密碼連結
    const resetUrl = `http://localhost:3000/user/reset-password`

    const mailOptions = {
      from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
      to: email,
      subject: '只欠東風-重設密碼請求',
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
                <h1>只欠東風 - 重設密碼請求</h1>
              </div>
              <div class="content">
                <p>您好，</p>
                <p>請點擊下方按鈕以重設您的密碼：</p>
                <a class="p" href="${resetUrl}" target="_blank">重設密碼</a>
                <p>如果您沒有發起此請求，請忽略此郵件。</p>
                <p>敬上，</p>
                <p>東風開發團隊。</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('Error sending reset password email:', err)
        return res.status(500).json({
          status: 'error',
          message: '無法發送重設密碼郵件',
        })
      } else {
        // 回傳 token 給前端
        return res.status(200).json({
          status: 'success',
          message: '重設密碼郵件已發送，請檢查您的電子信箱',
          token, // 將 token 發送給前端存儲
        })
      }
    })
  } catch (error) {
    console.error('Error in /forgot-password route:', error)
    return res.status(500).json({
      status: 'error',
      message: '伺服器錯誤，請稍後再試',
    })
  }
})

// 重設密碼 API
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({
      status: 'fail',
      message: '無效的請求，缺少必要的參數',
    })
  }

  // 密碼需至少6碼，且包含一個英文字母
  const passwordPattern = /^(?=.*[A-Za-z]).{6,}$/

  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      status: 'fail',
      message: '密碼需至少6碼，且包含一個英文字母',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const email = decoded.email

    // 從資料庫中獲取用戶的帳號和密碼
    const [user] = await connection.execute(
      'SELECT account, password FROM user WHERE email = ?',
      [email]
    )

    if (user.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: '用戶不存在',
      })
    }

    const { account, password: currentPassword } = user[0]

    // 檢查新密碼是否與帳號相同
    if (password === account) {
      return res.status(400).json({
        status: 'fail',
        message: '新密碼不能與帳號相同',
      })
    }

    // 檢查新密碼是否與舊密碼相同
    if (currentPassword === password) {
      // 假設密碼未加密
      return res.status(400).json({
        status: 'fail',
        message: '新密碼不能與舊密碼相同',
      })
    }

    // 不加密密碼，直接更新資料庫
    await connection.execute('UPDATE user SET password = ? WHERE email = ?', [
      password,
      email,
    ])

    return res.status(200).json({
      status: 'success',
      message: '密碼已重設，請使用新密碼登入',
    })
  } catch (error) {
    console.error('Error decoding token or updating password:', error.message)
    return res.status(500).json({
      status: 'error',
      message: '伺服器錯誤，請稍後再試',
    })
  }
})

export default router
