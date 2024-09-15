import express from 'express'
import multer from 'multer'
import cors from 'cors'
import connection from '##/configs/mysql-promise.js'
import 'dotenv/config.js'

const router = express.Router()
const upload = multer()

// 設定CORS白名單和選項
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

app.use(cors(corsOptions))
app.use(express.json())

// 撈取商品資料的API
router.get('/products', async (req, res) => {
  try {
    const queryCategory1 = `
      SELECT 
        product.id, 
        product.name AS product_name, 
        product.price, 
        product.img,
        product_category.name AS category_name, 
        brand.name AS brand_name,
        product.category_id
      FROM 
        product 
      INNER JOIN 
        product_category ON product.category_id = product_category.id 
      INNER JOIN 
        brand ON product.brand_id = brand.id
      WHERE 
        product.category_id = 1
      ORDER BY RAND() 
      LIMIT 15    `

    const queryCategory5 = `
      SELECT 
        product.id, 
        product.name AS product_name, 
        product.price, 
        product.img,
        product_category.name AS category_name, 
        brand.name AS brand_name,
        product.category_id
      FROM 
        product 
      INNER JOIN 
        product_category ON product.category_id = product_category.id 
      INNER JOIN 
        brand ON product.brand_id = brand.id
      WHERE 
        product.category_id = 5
      ORDER BY RAND() 
      LIMIT 15
    `

    const [rowsCategory1] = await connection.execute(queryCategory1)
    const [rowsCategory5] = await connection.execute(queryCategory5)

    res.json({
      status: 'success',
      mahjongProducts: rowsCategory1,
      boardGameProducts: rowsCategory5,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
