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

router.get('/:userId', async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({ status: 'error', message: '缺少用戶 ID' })
  }

  try {
    const query = `
      SELECT course.*, favorite.id AS favorite_id, 'course' AS type
      FROM favorite
      JOIN course ON favorite.object_id = course.id
      WHERE favorite.user_id = ?
      UNION ALL
      SELECT product.*, favorite.id AS favorite_id, 'product' AS type
      FROM favorite
      JOIN product ON favorite.object_id = product.id
      WHERE favorite.user_id = ?
      UNION ALL
      SELECT company.*, favorite.id AS favorite_id, 'company' AS type
      FROM favorite
      JOIN company ON favorite.object_id = company.id
      WHERE favorite.user_id = ?
    `

    const [favorites] = await connection.execute(query, [
      userId,
      userId,
      userId,
    ])

    res.status(200).json({ status: 'success', data: { favorites } })
  } catch (err) {
    console.error('Database query failed:', err.stack || err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// 特定會員的最愛，並可根據關鍵字搜尋
router.get('/:userId/:type', async (req, res) => {
  const { userId, type } = req.params
  const { search } = req.query // 從查詢參數中獲取搜尋關鍵字

  if (!userId || !type) {
    return res
      .status(400)
      .json({ status: 'error', message: '缺少用戶 ID 或類型' })
  }

  try {
    let query = ''
    let params = [userId] // 用戶ID

    // 根據 activeTab 的不同構建不同的查詢語句
    switch (type) {
      case 'course':
        query = `
          SELECT 
              course.id , 
              course.images, 
              course.course_name AS course_name, 
              course.price, 
              course_category.ch_name AS category_name, 
              favorite.id AS favorite_id
          FROM favorite
          JOIN course ON favorite.object_id = course.id
          JOIN course_category ON course.category_id = course_category.id
          WHERE favorite.user_id = ? 
          AND favorite.object_type = 'course'
          ${search ? `AND (course.course_name LIKE ? OR course_category.ch_name LIKE ?)` : ''}
        `
        if (search) {
          params.push(`%${search}%`, `%${search}%`)
        }
        break

      case 'product':
        query = `
          SELECT 
              product.id , 
              brand.name AS brand_name,   
              product.img AS image, 
              product.name AS name, 
              product.price, 
              favorite.id AS favorite_id
          FROM 
              favorite
          JOIN 
              product ON favorite.object_id = product.id
          JOIN 
              brand ON  product.brand_id = brand.id
          WHERE 
              favorite.user_id = ?
              AND favorite.object_type = 'product'
              ${search ? `AND (product.name LIKE ? OR brand.name LIKE ?)` : ''}
        `
        if (search) {
          params.push(`%${search}%`, `%${search}%`)
        }
        break

      case 'company':
        query = `
      SELECT 
          company.id, 
          company.name,
          MIN(company.rating) AS rating, -- 這裡可能需要使用聚合函數來處理
          MIN(company.user_ratings_total) AS user_rating_total,
          MIN(company.address) AS address,
          MIN(company.tele) AS phone,
          MIN(company.close_time) AS close_time,
          MIN(company_photo.img) AS image,
          favorite.id AS favorite_id
      FROM 
          favorite
      JOIN 
          company ON favorite.object_id = company.id
      LEFT JOIN 
          company_photo ON company_photo.room_id = company.id
      WHERE 
          favorite.user_id = ?
          AND favorite.object_type = 'company'
      ${search ? `AND (company.name LIKE ? OR company.address LIKE ?)` : ''}
      GROUP BY 
          company.id;

        `
        if (search) {
          params.push(`%${search}%`, `%${search}%`)
        }
        break

      default:
        return res
          .status(400)
          .json({ status: 'error', data: { message: '無效的類型' } })
    }

    const [favorites] = await connection.execute(query, params)
    res
      .status(200)
      .json({ status: 'success', data: { message: '已取得最愛', favorites } })
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// 刪除最愛
router.delete('/:userId/:favoriteId', upload.none(), async (req, res) => {
  const { userId, favoriteId } = req.params

  try {
    const [existingItem] = await connection.execute(
      'SELECT * FROM favorite WHERE id = ? AND user_id = ?',
      [favoriteId, userId]
    )

    if (existingItem.length <= 0) {
      return res
        .status(400)
        .json({ status: 'error', message: '收藏內無該項目，刪除失敗' })
    }

    const [result] = await connection.execute(
      'DELETE FROM favorite WHERE id = ? AND user_id = ?',
      [favoriteId, userId]
    )

    if (result.affectedRows > 0) {
      res.status(200).json({ status: 'success', message: '刪除成功' })
    } else {
      res.status(400).json({ status: 'error', message: '刪除失敗' })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
})

export default router
