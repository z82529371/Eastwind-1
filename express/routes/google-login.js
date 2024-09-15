import express from 'express'
import dbPromise from '##/configs/mysql-promise.js'
import jsonwebtoken from 'jsonwebtoken'
import 'dotenv/config.js'

const router = express.Router()
const secretKey = 'boyuboyuboyuIamBoyu'

// 使用者 Google 登入
router.post('/', async (req, res) => {
  console.log('Received body:', JSON.stringify(req.body))

  try {
    const { google_uid, email, displayName, photoURL } = req.body

    // 查詢資料庫中是否存在該 Google UID 的使用者
    let [rows] = await dbPromise.execute(
      'SELECT id, username, google_uid, first_edit_completed FROM user WHERE google_uid = ?',
      [google_uid]
    )

    let returnUser = {
      id: null,
      username: '',
      google_uid: '',
      first_edit_completed: 0,
    }

    if (rows.length > 0) {
      // Google UID 存在，直接使用該使用者資料
      returnUser = {
        id: rows[0].id,
        username: rows[0].username,
        google_uid: rows[0].google_uid,
        first_edit_completed: rows[0].first_edit_completed,
      }
    } else {
      [rows] = await dbPromise.execute(
        'SELECT id, username, first_edit_completed FROM user WHERE email = ?',
        [email]
      )

      if (rows.length > 0) {
        // email 存在，認定為原會員，更新該使用者的 Google UID
        const userId = rows[0].id
        await dbPromise.execute(
          'UPDATE user SET google_uid = ?, photo_url = ? WHERE id = ?',
          [google_uid, photoURL, userId]
        )

        returnUser = {
          id: userId,
          username: rows[0].username,
          google_uid: google_uid,
          first_edit_completed: rows[0].first_edit_completed,
        }
      } else {
        // email 也不存在，認定為新會員
        const [result] = await dbPromise.execute(
          'INSERT INTO user (username, email, google_uid, photo_url) VALUES (?, ?, ?, ?)',
          [displayName, email, google_uid, photoURL]
        )
        returnUser = {
          id: result.insertId,
          username: displayName,
          google_uid: google_uid,
          first_edit_completed: 0, // 新插入的會員，未完成編輯
        }
      }
    }

    // 判斷是否為新會員（未完成首次編輯）
    const isNewMember = returnUser.first_edit_completed === 0

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

    return res.json({
      status: 'success',
      message: 'Google 登入成功',
      id: returnUser.id,
      accessToken,
      refreshToken,
      name: returnUser.username,
      isNewUser: isNewMember, // 根據 first_edit_completed 判定是否為新會員
    })
  } catch (error) {
    console.error('Google 登入失敗:', error)
    return res
      .status(500)
      .json({ status: 'fail', message: '伺服器錯誤，請稍後再試' })
  }
})

export default router
