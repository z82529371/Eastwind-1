import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import cors from 'cors'
import dbPromise from '##/configs/mysql-promise.js'
import line_login from '#services/line-login.js'
import 'dotenv/config.js'

const router = express.Router()

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

const secretKey = 'boyuboyuboyuIamBoyu'
const channel_id = process.env.LINE_CHANNEL_ID
const channel_secret = process.env.LINE_CHANNEL_SECRET
const callback_url = process.env.LINE_LOGIN_CALLBACK_URL

const LineLogin = new line_login({
  channel_id,
  channel_secret,
  callback_url,
  scope: 'openid profile',
  prompt: 'consent',
  bot_prompt: 'normal',
})

// ------------ 產生登入網址路由 ------------
router.get('/login', LineLogin.authJson())

// ------------ Line 登入回調路由 ------------
router.get(
  '/callback',
  LineLogin.callback(
    async (req, res, next, token_response) => {
      try {
        console.log(token_response)

        const line_uid = token_response.id_token.sub

        let returnUser = {
          id: 0,
          username: '',
          google_uid: '',
          line_uid: '',
          first_edit_completed: 0, // 新增欄位，預設未完成首次編輯
        }

        let [rows] = await dbPromise.execute(
          'SELECT id, username, google_uid, line_uid, first_edit_completed FROM user WHERE line_uid = ?',
          [line_uid]
        )

        if (rows.length > 0) {
          // 找到已有使用者，判定為原會員
          const dbUser = rows[0]
          returnUser = {
            id: dbUser.id,
            username: dbUser.username,
            google_uid: dbUser.google_uid,
            line_uid: dbUser.line_uid,
            first_edit_completed: dbUser.first_edit_completed,
          }
        } else {
          // 沒有找到使用者，插入新使用者，設定first_edit_completed為0
          const [result] = await dbPromise.execute(
            'INSERT INTO user (username, email, line_uid, line_access_token, photo_url, first_edit_completed) VALUES (?, ?, ?, ?, ?, ?)',
            [
              token_response.id_token.name,
              '',
              line_uid,
              token_response.access_token,
              token_response.id_token.picture,
              0, // 新使用者未完成首次編輯
            ]
          )

          returnUser = {
            id: result.insertId,
            username: token_response.id_token.name,
            google_uid: '',
            line_uid,
            first_edit_completed: 0, // 新使用者，預設未完成首次編輯
          }
        }

        // 生成 accessToken 和 refreshToken
        const accessToken = jsonwebtoken.sign(
          { id: returnUser.id, username: returnUser.username },
          secretKey,
          {
            expiresIn: '30m',
          }
        )

        const refreshToken = jsonwebtoken.sign(
          { id: returnUser.id, username: returnUser.username },
          secretKey,
          { expiresIn: '7d' }
        )

        // 使用httpOnly cookie來讓瀏覽器端儲存access token
        res.cookie('accessToken', accessToken, { httpOnly: true })

        // 確保回傳的 JSON 結構正確
        return res.json({
          status: 'success',
          data: {
            returnUser,
            accessToken,
            refreshToken,
            isNewUser: returnUser.first_edit_completed === 0, // 判定是否為新會員
          },
        })
      } catch (error) {
        console.error('Line login callback error:', error)
        return res.json({ status: 'error', message: error.message })
      }
    },
    (req, res, next, error) => {
      console.error('Line login fail:', error)
      return res.json({ status: 'error', message: error.message })
    }
  )
)

export default router
