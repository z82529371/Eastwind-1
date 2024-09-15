import express from 'express'
import cors from 'cors'
import connection from '##/configs/mysql-promise.js'
import 'dotenv/config.js'

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

// 撈取所有可領取的優惠券
router.get('/active/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    // 檢查用戶是否已經完成了第一次修改
    const [user] = await connection.query(
      'SELECT first_edit_completed FROM user WHERE id = ?',
      [userId]
    )

    // 查詢該用戶尚未領取的所有有效優惠券，排除「新會員優惠」優惠券
    const [coupons] = await connection.query(
      'SELECT coupons.* FROM `coupons` ' +
        'LEFT JOIN `coupons_for_user` ON coupons.id = coupons_for_user.coupon_id AND coupons_for_user.user_id = ? ' +
        'WHERE coupons_for_user.coupon_id IS NULL AND coupons.name != "新會員優惠" ' +
        'AND coupons.valid_to > NOW()' +
        'ORDER BY coupons.id DESC',
      [userId]
    )

    res.status(200).json({ status: 'success', data: coupons })
  } catch (error) {
    console.error('資料庫查詢失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 撈取用戶未使用的優惠券
router.get('/unused/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    // 從資料庫中選取該用戶尚未使用且仍在有效期內的優惠券
    const [couponsUnused] = await connection.query(
      'SELECT `coupons_for_user`.*, `coupons`.`name`, `coupons`.`discount_type`, `coupons`.`discount_value`, `coupons`.`valid_from`, `coupons`.`valid_to`, `coupons`.`limit_value` ' +
        'FROM `coupons_for_user` ' +
        'INNER JOIN `coupons` ON `coupons_for_user`.`coupon_id` = `coupons`.`id` ' +
        'WHERE `coupons_for_user`.`user_id` = ? AND `coupons_for_user`.`status` = "unused" AND `coupons`.`valid_to` > NOW() ' +
        'ORDER BY `coupons`.`id` DESC',
      [userId]
    )
    res.status(200).json({ status: 'success', data: couponsUnused })
  } catch (error) {
    console.error('資料庫查詢失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 撈取用戶已使用的優惠券
router.get('/used/:userId', async (req, res) => {
  const userId = req.params.userId // 取得路徑中的 userId

  try {
    // 從資料庫中選取該用戶已使用的優惠券
    const [couponsUsed] = await connection.query(
      'SELECT `coupons_for_user`.*, `coupons`.`name`, `coupons`.`discount_type`, `coupons`.`discount_value`, `coupons`.`valid_from`, `coupons`.`valid_to`, `coupons`.`limit_value` ' +
        'FROM `coupons_for_user` ' +
        'INNER JOIN `coupons` ON `coupons_for_user`.`coupon_id` = `coupons`.`id` ' +
        'WHERE `coupons_for_user`.`user_id` = ? AND `coupons_for_user`.`status` = "used" ' +
        'ORDER BY `coupons`.`id` DESC',
      [userId]
    )
    res.status(200).json({ status: 'success', data: couponsUsed })
  } catch (error) {
    console.error('資料庫查詢失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 領取優惠券
router.post('/add/:userId', async (req, res) => {
  const { couponId } = req.body
  const userId = req.params.userId

  console.log('Received couponId:', couponId)
  console.log('Received userId:', userId)

  try {
    // 檢查優惠券是否存在且在有效期內
    const [coupon] = await connection.query(
      'SELECT * FROM `coupons` WHERE `id` = ? AND `valid_from` <= NOW() AND `valid_to` > NOW() LIMIT 1',
      [couponId]
    )

    // 如果沒有找到符合條件的優惠券，返回 404 錯誤
    if (!coupon || coupon.length === 0) {
      return res
        .status(404)
        .json({ status: 'fail', message: '優惠券不存在或不可領取' })
    }
    console.log('Coupon query result:', coupon) // 檢查查詢結果
    // 檢查用戶是否已經領取過此優惠券
    const [existing] = await connection.query(
      'SELECT * FROM `coupons_for_user` WHERE `user_id` = ? AND `coupon_id` = ? LIMIT 1',
      [userId, couponId]
    )

    console.log('Existing coupon for user:', existing)

    // 如果已經領取過，返回 400 錯誤
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ status: 'fail', message: '您已經領取過此優惠券' })
    }

    // 插入用戶領取的優惠券記錄，狀態設為 "unused"
    await connection.query(
      'INSERT INTO `coupons_for_user` (user_id, coupon_id, status, createTime) VALUES (?, ?, "unused", NOW())',
      [userId, couponId]
    )

    res.status(200).json({ status: 'success', message: '優惠券領取成功' })
  } catch (error) {
    console.error('資料庫操作失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 兌換優惠券代碼
router.post('/redeem-code/:userId', async (req, res) => {
  const { code } = req.body
  const userId = req.params.userId

  try {
    // 檢查優惠券代碼是否存在且在有效期內
    const [coupon] = await connection.query(
      'SELECT * FROM `coupons` WHERE `code` = ? AND `valid_from` < NOW() AND `valid_to` > NOW() LIMIT 1',
      [code]
    )

    // 如果優惠券代碼無效或已過期，返回 404 錯誤
    if (!coupon || coupon.length === 0) {
      return res
        .status(404)
        .json({ status: 'fail', message: '優惠券代碼無效或已過期' })
    }

    const couponId = coupon[0].id

    // 檢查用戶是否已經兌換過此優惠券
    const [existing] = await connection.query(
      'SELECT * FROM `coupons_for_user` WHERE `user_id` = ? AND `coupon_id` = ? LIMIT 1',
      [userId, couponId]
    )

    // 如果用戶已經兌換過此優惠券，返回 400 錯誤
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ status: 'fail', message: '您已經兌換過此優惠券' })
    }

    // 插入用戶兌換的優惠券記錄，狀態設為 "unused"
    await connection.query(
      'INSERT INTO `coupons_for_user` (user_id, coupon_id, status, createTime) VALUES (?, ?, "unused", NOW())',
      [userId, couponId]
    )

    res.status(200).json({ status: 'success', message: '優惠券兌換成功' })
  } catch (error) {
    console.error('資料庫操作失敗:', error)
    res.status(500).json({ status: 'fail', message: '伺服器內部錯誤' })
  }
})

// 生成隨機三碼的英文字母和數字
function randomCode() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// 發送歡迎優惠券的路由
router.post('/send-welcome-coupon/:userId', async (req, res) => {
  const userId = req.params.userId
  const welcomeCouponCode = `WELCOME${randomCode()}` // 獨特的優惠券代碼
  const now = new Date()
  const validFrom = now.toISOString().split('T')[0] // 現在日期
  const validTo = new Date(now.setDate(now.getDate() + 7))
    .toISOString()
    .split('T')[0] // 有效期 7 天

  try {
    // 檢查用戶是否已經完成了第一次修改
    const [user] = await connection.query(
      'SELECT first_edit_completed FROM user WHERE id = ?',
      [userId]
    )

    if (user.length === 0 || user[0].first_edit_completed === true) {
      return res.status(403).json({
        status: 'fail',
        message: '此優惠券僅限於首次資料編輯的用戶',
      })
    }

    // 檢查用戶是否已經領取過此優惠券

    const [existing] = await connection.query(
      'SELECT * FROM coupons_for_user WHERE user_id = ? AND coupon_id = (SELECT id FROM coupons WHERE name = ? ORDER BY created_at DESC LIMIT 1) LIMIT 1',
      [userId, '新會員優惠']
    )

    // 如果用戶已經領取過，返回錯誤
    if (existing.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: '您已經領取過歡迎優惠券',
      })
    }

    // 插入新的優惠券到 coupons 表
    const [result] = await connection.query(
      'INSERT INTO coupons (name, code, discount_type, discount_value, valid_from, valid_to, limit_value, usage_limit, created_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        '新會員優惠',
        welcomeCouponCode,
        'percent', // 折扣類型
        10, // 折扣值
        validFrom,
        validTo,
        0, // 低消
        1, // 使用限制
      ]
    )

    const couponId = result.insertId

    // 插入用戶領取的優惠券記錄，狀態設為 "unused"
    await connection.query(
      'INSERT INTO coupons_for_user (user_id, coupon_id, status, createTime) VALUES (?, ?, "unused", NOW())',
      [userId, couponId]
    )

    // 更新用戶的 first_edit_completed 狀態
    await connection.query(
      'UPDATE user SET first_edit_completed = true WHERE id = ?',
      [userId]
    )

    res.status(200).json({
      status: 'success',
      message: '歡迎優惠券發送成功',
    })
  } catch (error) {
    console.error('發送優惠券時發生錯誤:', error)
    res.status(500).json({
      status: 'fail',
      message: '伺服器內部錯誤',
    })
  }
})

export default router
