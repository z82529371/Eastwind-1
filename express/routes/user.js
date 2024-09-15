import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import connection from '##/configs/mysql-promise.js'
import 'dotenv/config.js'

const router = express.Router()
const secretKey = 'boyuboyuboyuIamBoyu'
const upload = multer()

// 設定 CORS 白名單和選項
const whitelist = ['http://localhost:550  0', 'http://localhost:3000']
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

// 初始化資料庫資料
let users = []
;(async () => {
  try {
    const [result] = await connection.query(
      'SELECT * FROM `user` WHERE valid = 1'
    )
    users = result
  } catch (err) {
    console.error('資料庫查詢失敗:', err)
  }
})()

// 撈取所有會員資料
router.get('/users', (req, res) => {
  if (users.length > 0) {
    res.status(200).json(users)
  } else {
    res.status(500).json({ error: '無法撈取會員資料' })
  }
})

// 撈取個別會員資料
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id
  console.log('User ID:', userId)
  try {
    const [user] = await connection.query(
      'SELECT * FROM `user` WHERE `id` = ? AND `valid` = 1 LIMIT 1',
      [userId]
    )
    console.log('Query Result:', user)
    if (user.length === 0) {
      return res.status(404).json({ status: 'fail', message: '用戶不存在' })
    }
    res.status(200).json({
      status: 'success',
      data: {
        id: user[0].id,
        google_uid: user[0].google_uid,
        username: user[0].username,
        google_name: user[0].google_name,
        account: user[0].account,
        password: user[0].password,
        city: user[0].city,
        address: user[0].address,
        phone: user[0].phone,
        email: user[0].email,
        birth: user[0].birth,
        gender: user[0].gender,
        user_img: user[0].user_img,
        photo_url: user[0].photo_url,
        created_at: user[0].created_at,
        updated_at: user[0].updated_at,
      },
    })
  } catch (error) {
    console.error('資料庫查詢失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 撈取用戶的信用卡資訊
router.get('/user/:id/cards', async (req, res) => {
  const userId = req.params.id

  try {
    const [cards] = await connection.query(
      'SELECT id, card_name, card_number, card_type, exp_date, status FROM credit_card WHERE user_id = ? AND status = "Active"',
      [userId]
    )

    if (cards.length === 0) {
      return res.status(404).json({ status: 'fail', message: '無信用卡資料' })
    }

    res.status(200).json({ status: 'success', data: cards })
  } catch (error) {
    console.error('資料庫查詢失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 使用者登入
router.post('/login', upload.none(), async (req, res) => {
  const { account, password } = req.body
  if (!account) {
    return res.status(401).json({ status: 'fail', message: '請填寫帳號' })
  }
  if (!password) {
    return res.status(401).json({ status: 'fail', message: '請填寫密碼' })
  }
  try {
    const [user] = await connection.query(
      'SELECT * FROM `user` WHERE `account` = ? AND `valid` = 1 LIMIT 1',
      [account]
    )
    if (user.length === 0) {
      return res
        .status(401)
        .json({ status: 'fail', message: '請確認帳號是否正確' })
    } else if (user[0].password !== password) {
      return res
        .status(401)
        .json({ status: 'fail', message: '請確認密碼是否正確' })
    }

    // 判斷是否為新用戶
    const isNewUser = user[0].first_edit_completed === 0

    const accessToken = jwt.sign(
      { id: user[0].id, account: user[0].account },
      secretKey,
      { expiresIn: '30m' }
    )
    const refreshToken = jwt.sign(
      { id: user[0].id, account: user[0].account },
      secretKey,
      { expiresIn: '7d' }
    )
    res.status(200).json({
      status: 'success',
      message: '使用者登入',
      accessToken,
      refreshToken,
      name: user[0].username,
      isNewUser, // 確保將 isNewUser 返回給前端
    })
  } catch (error) {
    console.error('資料庫查詢失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 使用者登出
router.get('/logout', checkToken, (req, res) => {
  const { account } = req.decoded
  res.clearCookie('accessToken', { httpOnly: true, path: '/' })
  res.clearCookie('SESSION_ID', { httpOnly: true, path: '/' })
  if (account) {
    const token = jwt.sign({ id: undefined, account: undefined }, secretKey, {
      expiresIn: '-1s',
    })
    console.log('Received Token:', token)
    res.status(200).json({ status: 'success', token, message: '使用者已登出' })
  } else {
    res.status(401).json({ status: 'fail', message: '登出失敗, 請稍後再試' })
  }
})

// 檢查使用者登入狀態
router.get('/status', checkToken, (req, res) => {
  const { account, password } = req.decoded
  if (account) {
    const token = jwt.sign({ account, password }, secretKey, {
      expiresIn: '30m',
    })
    res.status(200).json({ status: 'success', token, message: '使用者登入中' })
  } else {
    res.status(400).json({ status: 'error', message: '驗證錯誤, 請重新登入' })
  }
})

// 刷新 token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res
      .status(403)
      .json({ status: 'fail', message: 'Refresh Token 未提供' })
  }
  try {
    const decoded = jwt.verify(refreshToken, secretKey)
    if (!decoded) {
      return res
        .status(403)
        .json({ status: 'fail', message: '無效的 Refresh Token' })
    }
    const newAccessToken = jwt.sign(
      { id: decoded.id, account: decoded.account },
      secretKey,
      { expiresIn: '30m' }
    )
    res.status(200).json({
      status: 'success',
      accessToken: newAccessToken,
    })
  } catch (error) {
    console.error('Refresh Token verification failed:', error)
    res.status(403).json({ status: 'fail', message: '無效的 Refresh Token' })
  }
})

// 驗證 JWT token
function checkToken(req, res, next) {
  let token = req.get('Authorization')
  if (token) {
    token = token.slice(7)
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.error('Token verification failed:', error.message)
        return res
          .status(401)
          .json({ status: 'fail', message: `登入驗證失效: ${error.message}` })
      } else {
        req.decoded = decoded
        console.log('Token successfully decoded:', decoded)
        next()
      }
    })
  } else {
    console.error('Token not provided or invalid format')
    res.status(401).json({ status: 'fail', message: '無驗證資料, 請重新登入' })
  }
}

export default router
