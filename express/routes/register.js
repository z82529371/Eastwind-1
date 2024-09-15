import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import transporter from '##/configs/mail.js'
import connection from '##/configs/mysql-promise.js'
import 'dotenv/config.js'

const router = express.Router()

// 設定CORS白名單和選項
// 設置允許的CORS來源，並配置CORS選項以允許攜帶憑證（如Cookie）
const whitelist = ['http://localhost:5500', 'http://localhost:3000']
const corsOptions = {
  credentials: true,
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

// 註冊 API
// 處理用戶註冊請求，驗證輸入，檢查電子郵件是否已註冊，並將新用戶資料存入數據庫
router.post('/register', async (req, res) => {
  const { email, account, password } = req.body

  let errors = {}

  // 檢查電子郵件是否有效
  if (!email) {
    errors.email = '請填入電子信箱'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.email = '請提供有效的電子信箱'
    }
  }

  // 檢查帳號是否有效
  const accountRegex = /^(?=.*[a-zA-Z]).{6,}$/
  if (!account) {
    errors.account = '請填入帳號'
  } else if (!accountRegex.test(account)) {
    errors.account = '帳號應至少6碼，包含至少一個英文字'
  }

  // 檢查密碼是否有效
  const passwordRegex = /^(?=.*[a-zA-Z]).{6,}$/
  if (!password) {
    errors.password = '請填入密碼'
  } else if (!passwordRegex.test(password)) {
    errors.password = '密碼應至少6碼，包含至少一個英文字'
  }

  // 如果有任何驗證錯誤，返回錯誤響應
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ status: 'fail', errors })
  }

  try {
    // 檢查電子郵件是否已經被註冊
    const [existingUserByEmail] = await connection.execute(
      'SELECT * FROM user WHERE email = ?',
      [email]
    )

    if (existingUserByEmail.length > 0) {
      return res.status(400).json({
        status: 'fail',
        errors: { email: '電子信箱已被註冊' },
      })
    }

    // 將新用戶的電子郵件、帳號和密碼存入數據庫
    const [result] = await connection.execute(
      'INSERT INTO user (email, account, password) VALUES (?, ?, ?)',
      [email, account, password]
    )

    console.log('User registered:', result)
    return res.status(200).json({
      status: 'success',
      message: '註冊成功',
    })
  } catch (err) {
    console.error('Error during registration:', err)
    return res.status(500).json({
      status: 'fail',
      message: '伺服器錯誤，請稍後再試',
    })
  }
})

// 驗證電子信箱 API
// 處理用戶通過電子郵件驗證註冊請求，驗證 token，並根據結果重定向
router.get('/verify-email', async (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.redirect('http://localhost:3000/user/register') // 無效 token 的情況
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const email = decoded.email

    // 將驗證成功的 email 和狀態作為 query 參數重定向到前端
    return res.redirect(
      `http://localhost:3000/user/register?email=${encodeURIComponent(email)}&status=success`
    )
  } catch (err) {
    console.error('Error during email verification:', err)
    return res.redirect('http://localhost:3000/user/register?error=驗證失敗') // 驗證失敗也重定向到註冊頁面
  }
})

// 發送驗證信 API
// 處理用戶請求發送驗證信件，生成 token，並通過電子郵件發送驗證連結
router.post('/send-verification', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res
      .status(400)
      .json({ status: 'fail', message: '請提供有效的電子信箱' })
  }

  try {
    // 檢查電子郵件是否已經被註冊
    const [existingUser] = await connection.execute(
      'SELECT * FROM user WHERE email = ?',
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: '電子信箱已被註冊',
      })
    }

    // 生成驗證 token
    const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    })

    // 構建驗證鏈接
    const verifyUrl = `http://localhost:3005/api/register/verify-email?token=${verifyToken}`

    // 配置電子郵件內容

    const mailOptions = {
      from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
      to: email,
      subject: '只欠東風-註冊電子信箱驗證',
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
                <h1>只欠東風 - 註冊電子信箱驗證</h1>
              </div>
              <div class="content">
                <p>您好，</p>
                <p>請點擊下方按鈕以驗證您的電子信箱：</p>
                <a class="p" href="${verifyUrl}" target="_blank">驗證信箱</a>
                <p>如果您沒有註冊過此帳號，請忽略此郵件。</p>
                <p>敬上，</p>
                <p>東風開發團隊。</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    // 發送驗證郵件
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('Error sending verification email:', err)
        return res.status(500).json({
          status: 'error',
          message: '無法發送驗證郵件',
        })
      } else {
        return res.status(200).json({
          status: 'success',
          message: '驗證信件已發送，請檢查您的電子信箱',
        })
      }
    })
  } catch (error) {
    console.error('Error in /send-verification route:', error)
    return res.status(500).json({
      status: 'error',
      message: '伺服器錯誤，請稍後再試',
    })
  }
})

// 檢查帳號與email唯一性
router.post('/check-unique', async (req, res) => {
  const { email, account, userId } = req.body

  try {
    const [emailResult] = await connection.execute(
      'SELECT id FROM user WHERE email = ? AND id != ?',
      [email, userId || 0] // 用 0 代替 null，防止 SQL 出錯
    )

    const [accountResult] = await connection.execute(
      'SELECT id FROM user WHERE account = ? AND id != ?',
      [account, userId || 0]
    )

    const emailExists = emailResult.length > 0
    const accountExists = accountResult.length > 0

    res.status(200).json({ emailExists, accountExists })
  } catch (error) {
    console.error('Error checking uniqueness:', error)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
