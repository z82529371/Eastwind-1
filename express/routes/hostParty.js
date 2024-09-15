import express from 'express'
import 'dotenv/config.js'
import connection from '##/configs/mysql-promise.js'
import { customAlphabet } from 'nanoid'

const router = express.Router()
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 10)

function generateShortId() {
  return nanoid()
}

router.post('/', async (req, res) => {
  const numerical_order = generateShortId()
  const {
    date,
    start_time,
    end_time,
    playroom_type,
    notes,
    total_price,
    company_id,
    rules,
    user_id,
  } = req.body
  const userID_main = user_id  ;

  if (
    !date ||
    !start_time ||
    !end_time ||
    playroom_type === undefined ||
    total_price === undefined ||
    !company_id ||
    !userID_main
  ) {
    return res.status(400).json({ error: '缺少必要的預訂信息' })
  }

  try {
    // 插入預訂記錄
    const [partyResult] = await connection.execute(
      `INSERT INTO party
       (numerical_order, userID_main, userID_join1,
        userID_join2,
        userID_join3, company_id, date, start_at, end_at, playroom_type, notes, total_price, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`,
      [
        numerical_order,
        userID_main,
        0,
        0,
        0,
        company_id,
        date,
        start_time,
        end_time,
        playroom_type,
        notes || null,
        total_price,
        'waiting',
      ]
    )

    const partyId = partyResult.insertId

    // 插入規則關聯到 rules_for_party 表
    if (rules && rules.length > 0) {
      const insertRulesQuery = `
        INSERT INTO rules_for_party (party_id, rule_id, valid)
        VALUES ?
      `
      const ruleValues = rules.map((ruleId) => [partyId, ruleId, 1])
      await connection.query(insertRulesQuery, [ruleValues])
    }

    res.status(201).json({
      message: '派對成功創建',
      id: partyId,
      numerical_order: numerical_order,
      status: 'pending',
    })
  } catch (error) {
    console.error('Database query error:', error)
    res.status(500).json({ error: '創建預訂時發生錯誤' })
  }
})
export default router
