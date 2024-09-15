import express from 'express'
import 'dotenv/config.js'
import connection from '##/configs/mysql-promise.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let query = `SELECT * FROM rules_tags`
    console.log('Executing query:', query)
    const [rules] = await connection.execute(query)

    if (rules.length === 0) {
      return res.status(404).json({ message: '沒有找到規則' })
    }

    res.json(rules)
  } catch(err) {
    console.error('Database query error:', err)
    res.status(500).json({ error: '獲取店面資料出錯' })
  }
})

export default router
