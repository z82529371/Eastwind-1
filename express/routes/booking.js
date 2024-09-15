import express from 'express'
import 'dotenv/config.js'
import connection from '##/configs/mysql-promise.js'
import { generateBookingNumber } from '../utils/idGenerator.js'
const router = express.Router()

router.post('/', async (req, res) => {
  const numerical_order = generateBookingNumber('DB') 
  const {
    date,
    start_time,
    end_time,
    playroom_type,
    notes,
    total_price,
    company_id,
    user_id, 
    party_id,
  } = req.body

  console.log(
    date,
    start_time,
    end_time,
    playroom_type,
    notes,
    total_price,
    company_id,
    user_id
  )
  console.log(req.body)
  if (
    !date ||
    !start_time ||
    !end_time ||
    playroom_type === undefined ||
    total_price === undefined ||
    !company_id||
    !user_id
  ) {
    return res.status(400).json({ error: '缺少必要的預訂信息' })
  }

  // 驗證 playroom_type 是否為有效值
  if (playroom_type !== 0 && playroom_type !== 1) {
    return res.status(400).json({ error: '無效的遊戲室類型' })
  }

  try {
    // 查找該公司下可用的桌子
    const findAvailableTableQuery = `
    SELECT mt.id, c.name AS company_name
    FROM mahjong_table mt
    JOIN company c ON c.id = mt.company_id
    LEFT JOIN booking_record br ON mt.id = br.table_id 
      AND br.date = ? 
      AND ((br.start_time <= ? AND br.end_time > ?)
        OR (br.start_time < ? AND br.end_time >= ?))
    WHERE c.id = ?
      AND mt.playroom_type = ?
      AND mt.is_deleted = 0
      AND br.id IS NULL
    ORDER BY mt.id
    LIMIT 1
  `

    const [availableTables] = await connection.execute(
      findAvailableTableQuery,
      [
        date,
        start_time,
        start_time,
        end_time,
        end_time,
        company_id,
        playroom_type,
      ]
    )
    if (availableTables.length === 0) {
      return res.status(400).json({ error: '所選時段沒有可用的桌子' })
    }

    const availableTableId = availableTables[0].id

    // 插入預訂記錄
    const insertQuery = `
      INSERT INTO booking_record 
      (numerical_order,user_id, table_id, date, start_time, end_time, playroom_type, notes, total_price, status,party_id) 
      VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `

    const [result] = await connection.execute(insertQuery, [
      numerical_order,
      user_id,
      availableTableId,
      date,
      start_time,
      end_time,
      playroom_type,
      notes || null,
      total_price,
      'booked',
      party_id
    ])

    if (result.affectedRows === 1) {
      res.status(201).json({
        message: '預訂成功創建',
        id: result.insertId,
        tableId: availableTableId,
      })
    } else {
      throw new Error('預訂創建失敗')
    }
  } catch (error) {
    console.error('Database query error:', error)
    res.status(500).json({ error: '創建預訂時發生錯誤' })
  }
})

export default router
