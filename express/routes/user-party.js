import express from 'express'
import cors from 'cors'
import multer from 'multer'
import 'dotenv/config.js'
import connection from '##/configs/mysql-promise.js'

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

router.get('/:userId/:status', async (req, res) => {
  const { userId, status } = req.params

  if (!userId || !status) {
    return res
      .status(400)
      .json({ status: 'error', message: '缺少用戶 ID 或狀態' })
  }

  try {
    const query = `
      SELECT DISTINCT
        party.id,
        party.numerical_order as order_number,
        COALESCE(party.table_id, '') as table_id,
        party.userID_main as user_main,
        user_main.username as main_username,
        party.userID_join1 as user_join1,
        COALESCE(user_join1.username, '') as join1_username,
        party.userID_join2 as user_join2,
        COALESCE(user_join2.username, '') as join2_username,
        party.userID_join3 as user_join3,
        COALESCE(user_join3.username, '') as join3_username,
        party.date,
        party.start_at,
        party.end_at,
        party.status,
        party.created_at,
        party.playroom_type,
        party.notes,
        party.total_price,
        party.company_id,
        company.name AS company_name,
        company.tele AS company_tele,
        company.address AS company_address,
        (SELECT COUNT(*) FROM mahjong_table WHERE company_id = company.id AND id <= mahjong_table.id) AS table_number
      FROM 
        party
      LEFT JOIN 
        company ON party.company_id = company.id
      LEFT JOIN 
        user AS user_main ON party.userID_main = user_main.id
      LEFT JOIN 
        user AS user_join1 ON party.userID_join1 = user_join1.id
      LEFT JOIN 
        user AS user_join2 ON party.userID_join2 = user_join2.id
      LEFT JOIN 
        user AS user_join3 ON party.userID_join3 = user_join3.id
      WHERE 
        (party.userID_main = ? OR party.userID_join1 = ? OR party.userID_join2 = ? OR party.userID_join3 = ?)
        AND party.status = ?
      ORDER BY 
        party.date DESC,
        party.start_at DESC;
    `
    const [partys] = await connection.execute(query, [
      userId,
      userId,
      userId,
      userId,
      status,
    ])
    res.status(200).json({ status: 'success', data: { partys } })
  } catch (err) {
    console.error('Database query failed:', err.stack || err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

router.get('/join/:userId/:status', async (req, res) => {
  const { userId, status } = req.params

  if (!userId || !status) {
    return res
      .status(400)
      .json({ status: 'error', message: '缺少用戶 ID 或狀態' })
  }

  try {
    const query = `
    SELECT DISTINCT
        party.id,
        party.numerical_order as order_number,
        COALESCE(party.table_id, '') as table_id,
        party.userID_main as user_main,
        user_main.username as main_username,
        party.userID_join1 as user_join1,
        COALESCE(user_join1.username, '') as join1_username,
        party.userID_join2 as user_join2,
        COALESCE(user_join2.username, '') as join2_username,
        party.userID_join3 as user_join3,
        COALESCE(user_join3.username, '') as join3_username,
        party.date,
        party.start_at,
        party.end_at,
        party.status,
        party.created_at,
        party.playroom_type,
        party.notes,
        party.total_price,
        party.company_id,
        company.name AS company_name,
        company.tele AS company_tele,
        company.address AS company_address,
        (SELECT COUNT(*) FROM mahjong_table WHERE company_id = company.id AND id <= mahjong_table.id) AS table_number
      FROM 
        party
      LEFT JOIN 
        company ON party.company_id = company.id
      LEFT JOIN 
        user AS user_main ON party.userID_main = user_main.id
      LEFT JOIN 
        user AS user_join1 ON party.userID_join1 = user_join1.id
      LEFT JOIN 
        user AS user_join2 ON party.userID_join2 = user_join2.id
      LEFT JOIN 
        user AS user_join3 ON party.userID_join3 = user_join3.id
      WHERE 
        (party.userID_main = ? OR party.userID_join1 = ? OR party.userID_join2 = ? OR party.userID_join3 = ?)
        AND party.status = ?
      ORDER BY 
        party.date DESC,
        party.start_at DESC;
    `
    const [partys] = await connection.execute(query, [
      userId,
      userId,
      userId,
      userId,
      status,
    ])
    res.status(200).json({ status: 'success', data: { partys } })
  } catch (err) {
    console.error('Database query failed:', err.stack || err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

export default router
