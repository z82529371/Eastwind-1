import express from 'express'
const router = express.Router()
import dbPromise from '##/configs/mysql-promise.js'
import multer from 'multer'
import moment from 'moment'

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'
const upload = multer()
let total = 0
const cartTotal = (cart) => {
  cart.forEach((cartItem) => {
    total += cartItem.quantity * cartItem.price
  })
}
// 得到userID 為 ID 的購物車
router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const [cart] = await dbPromise.execute(
      'SELECT `cart`.*, COALESCE(`product`.`name`, `course`.`course_name`) AS `item_name`, COALESCE(`product`.`img`, `course`.`images`) AS `img`, COALESCE(`brand`.`name`, `course_category`.`ch_name`) AS `brand_name` FROM `cart` LEFT JOIN `product` ON `cart`.`object_id` = `product`.`id` AND `cart`.`object_type` = "product" LEFT JOIN `brand` ON `product`.`brand_id` = `brand`.`id` LEFT JOIN `course` ON `cart`.`object_id` = `course`.`id` AND `cart`.`object_type` = "course"  LEFT JOIN `course_category` ON `course`.`category_id` = `course_category`.`id` WHERE `user_id` = ?',
      [id]
    )
    const [top] = await dbPromise.execute(
      'SELECT `product`.`id`, `product`.`name`, `product`.`price`, `product`.`img`, `product_category`.`name` AS `category_name`, `brand`.`name` AS `brand_name`,  MAX(`product_images`.`img`) AS `img2`, ROUND(AVG(`comment`.`star`), 1) AS `average_star` FROM `product` JOIN `product_category` ON `product_category`.`id` = `product`.`category_id` AND `product_category`.`valid` = 1 JOIN `brand` ON `brand`.`id` = `product`.`brand_id` AND `brand`.`valid` = 1 LEFT JOIN `product_images` ON `product_images`.`product_id` = `product`.`id` LEFT JOIN `comment` ON `comment`.`object_id` = `product`.`id` AND `comment`.`object_type` = "product" GROUP BY `product`.`id`, `product`.`name`, `product`.`price`, `product`.`img`, `product_category`.`name`, `brand`.`name` ORDER BY `average_star` DESC LIMIT 4'
    )

    res
      .status(200)
      .json({ status: 'success', data: { message: '已取得購物車', cart, top } })
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

// 新增product產品 ID 為 oid的產品進 userID 為 id的購物車
router.post('/:id/product/:oid', upload.none(), async (req, res) => {
  const id = req.params.id
  const oid = req.params.oid
  const { quantity, price } = req.body
  const today = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "product"',
      [id, oid]
    )

    if (existingItem.length > 0) {
      return res
        .status(400)
        .json({ status: 'error', data: { message: '該產品已在購物車中' } })
    }

    const [result] = await dbPromise.execute(
      'INSERT INTO `cart` (`id`, `user_id`, `object_id`, `object_type`, `quantity`, `price`, `added_at`) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
      [id, oid, 'product', quantity, price, today]
    )

    if (result.insertId) {
      const [cart] = await dbPromise.execute(
        'SELECT `cart`.*, COALESCE(`product`.`name`, `course`.`course_name`) AS `item_name`, COALESCE(`product`.`img`, `course`.`images`) AS `img`, COALESCE(`brand`.`name`, `course_category`.`ch_name`) AS `brand_name` FROM `cart` LEFT JOIN `product` ON `cart`.`object_id` = `product`.`id` AND `cart`.`object_type` = "product" LEFT JOIN `brand` ON `product`.`brand_id` = `brand`.`id` LEFT JOIN `course` ON `cart`.`object_id` = `course`.`id` AND `cart`.`object_type` = "course"  LEFT JOIN `course_category` ON `course`.`category_id` = `course_category`.`id` WHERE `user_id` = ?',
        [id]
      )
      let total = 0

      cartTotal(cart)
      res
        .status(201)
        .json({ status: 'success', data: { message: '新增成功', cart, total } })
    } else {
      res.status(400).json({ status: 'error', data: { message: '新增失敗' } })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

// 新增course產品 ID 為 oid的產品進 userID 為 id的購物車
router.post('/:id/course/:oid', upload.none(), async (req, res) => {
  const id = req.params.id
  const oid = req.params.oid
  const { quantity, price } = req.body
  const today = moment().format('YYYY-MM-DD HH:mm:ss.SSS')

  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "course"',
      [id, oid]
    )

    if (existingItem.length > 0) {
      // 如果存在，返回錯誤信息
      return res
        .status(400)
        .json({ status: 'error', data: { message: '該產品已在購物車中' } })
    }

    const [result] = await dbPromise.execute(
      'INSERT INTO `cart` (`id`, `user_id`, `object_id`, `object_type`, `quantity`, `price`, `added_at`) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
      [id, oid, 'course', quantity, price, today]
    )

    if (result.insertId) {
      const [cart] = await dbPromise.execute(
        'SELECT `cart`.*, COALESCE(`product`.`name`, `course`.`course_name`) AS `item_name`, COALESCE(`product`.`img`, `course`.`images`) AS `img`, COALESCE(`brand`.`name`, `course_category`.`ch_name`) AS `brand_name` FROM `cart` LEFT JOIN `product` ON `cart`.`object_id` = `product`.`id` AND `cart`.`object_type` = "product" LEFT JOIN `brand` ON `product`.`brand_id` = `brand`.`id` LEFT JOIN `course` ON `cart`.`object_id` = `course`.`id` AND `cart`.`object_type` = "course"  LEFT JOIN `course_category` ON `course`.`category_id` = `course_category`.`id` WHERE `user_id` = ?',
        [id]
      )
      let total = 0

      cartTotal(cart)

      res
        .status(201)
        .json({ status: 'success', data: { message: '新增成功', cart, total } })
    } else {
      res.status(400).json({ status: 'error', data: { message: '新增失敗' } })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

// 更新product產品 ID 為 oid的產品進 userID 為 id的購物車
router.put('/:id/product/:oid', upload.none(), async (req, res) => {
  const id = req.params.id
  const oid = req.params.oid
  const { quantity } = req.body

  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "product"',
      [id, oid]
    )

    if (existingItem.length <= 0) {
      // 如果存在，返回錯誤信息
      return res.status(400).json({
        status: 'error',
        data: { message: '購物車內無該商品，更新失敗' },
      })
    }

    const [result] = await dbPromise.execute(
      'UPDATE `cart` SET `quantity` = ? WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "product"',
      [quantity, id, oid]
    )
    if (result.changedRows >= 1) {
      const [cart] = await dbPromise.execute(
        'SELECT `cart`.*, COALESCE(`product`.`name`, `course`.`course_name`) AS `item_name`, COALESCE(`product`.`img`, `course`.`images`) AS `img`, COALESCE(`brand`.`name`, `course_category`.`ch_name`) AS `brand_name` FROM `cart` LEFT JOIN `product` ON `cart`.`object_id` = `product`.`id` AND `cart`.`object_type` = "product" LEFT JOIN `brand` ON `product`.`brand_id` = `brand`.`id` LEFT JOIN `course` ON `cart`.`object_id` = `course`.`id` AND `cart`.`object_type` = "course"  LEFT JOIN `course_category` ON `course`.`category_id` = `course_category`.`id` WHERE `user_id` = ?',
        [id]
      )
      total = 0
      cartTotal(cart)

      res
        .status(200)
        .json({ status: 'success', data: { message: '更新成功', cart, total } })
    } else {
      res.status(400).json({
        status: 'error',
        data: { message: '更新失敗或未改變任何資料' },
      })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

// 更新course產品 ID 為 oid的產品進 userID 為 id的購物車
router.put('/:id/course/:oid', upload.none(), async (req, res) => {
  const id = req.params.id
  const oid = req.params.oid
  const { quantity } = req.body

  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "course"',
      [id, oid]
    )

    if (existingItem.length <= 0) {
      return res.status(400).json({
        status: 'error',
        data: { message: '購物車內無該商品，更新失敗' },
      })
    }

    const [result] = await dbPromise.execute(
      'UPDATE `cart` SET `quantity` = ? WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "course"',
      [quantity, id, oid]
    )

    if (result.changedRows >= 1) {
      const [cart] = await dbPromise.execute(
        'SELECT `cart`.*, COALESCE(`product`.`name`, `course`.`course_name`) AS `item_name`, COALESCE(`product`.`img`, `course`.`images`) AS `img`, COALESCE(`brand`.`name`, `course_category`.`ch_name`) AS `brand_name` FROM `cart` LEFT JOIN `product` ON `cart`.`object_id` = `product`.`id` AND `cart`.`object_type` = "product" LEFT JOIN `brand` ON `product`.`brand_id` = `brand`.`id` LEFT JOIN `course` ON `cart`.`object_id` = `course`.`id` AND `cart`.`object_type` = "course"  LEFT JOIN `course_category` ON `course`.`category_id` = `course_category`.`id` WHERE `user_id` = ?',
        [id]
      )
      let total = 0

      cartTotal(cart)

      res
        .status(200)
        .json({ status: 'success', data: { message: '更新成功', cart, total } })
    } else {
      res.status(400).json({
        status: 'error',
        data: { message: '更新失敗或未改變任何資料' },
      })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

// 刪除userID 為 id購物車內product產品 ID 為 oid的產品
router.delete('/:id/product/:oid', upload.none(), async (req, res) => {
  const id = req.params.id
  let oid = req.params.oid
  oid = parseInt(oid)

  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "product"',
      [id, oid]
    )

    if (existingItem.length <= 0) {
      return res.status(400).json({
        status: 'error',
        data: { message: '購物車內無該商品，刪除失敗' },
      })
    }

    const [result] = await dbPromise.execute(
      'DELETE FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "product"',
      [id, oid]
    )

    if (result.affectedRows >= 1) {
      const [cart] = await dbPromise.execute(
        'SELECT `cart`.*, COALESCE(`product`.`name`, `course`.`course_name`) AS `item_name`, COALESCE(`product`.`img`, `course`.`images`) AS `img`, COALESCE(`brand`.`name`, `course_category`.`ch_name`) AS `brand_name` FROM `cart` LEFT JOIN `product` ON `cart`.`object_id` = `product`.`id` AND `cart`.`object_type` = "product" LEFT JOIN `brand` ON `product`.`brand_id` = `brand`.`id` LEFT JOIN `course` ON `cart`.`object_id` = `course`.`id` AND `cart`.`object_type` = "course"  LEFT JOIN `course_category` ON `course`.`category_id` = `course_category`.`id` WHERE `user_id` = ?',
        [id]
      )
      let total = 0

      cartTotal(cart)

      res
        .status(200)
        .json({ status: 'success', data: { message: '刪除成功', cart, total } })
    } else {
      res.status(400).json({
        status: 'error',
        data: { message: '刪除失敗' },
      })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

// 刪除userID 為 id購物車內product產品 ID 為 oid的產品
router.delete('/:id/course/:oid', upload.none(), async (req, res) => {
  const id = req.params.id
  let oid = req.params.oid
  oid = parseInt(oid)

  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "course"',
      [id, oid]
    )

    if (existingItem.length <= 0) {
      return res.status(400).json({
        status: 'error',
        data: { message: '購物車內無該商品，刪除失敗' },
      })
    }

    const [result] = await dbPromise.execute(
      'DELETE FROM `cart` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = "course"',
      [id, oid]
    )

    if (result.affectedRows >= 1) {
      const [cart] = await dbPromise.execute(
        'SELECT `cart`.*, COALESCE(`product`.`name`, `course`.`course_name`) AS `item_name`, COALESCE(`product`.`img`, `course`.`images`) AS `img`, COALESCE(`brand`.`name`, `course_category`.`ch_name`) AS `brand_name` FROM `cart` LEFT JOIN `product` ON `cart`.`object_id` = `product`.`id` AND `cart`.`object_type` = "product" LEFT JOIN `brand` ON `product`.`brand_id` = `brand`.`id` LEFT JOIN `course` ON `cart`.`object_id` = `course`.`id` AND `cart`.`object_type` = "course"  LEFT JOIN `course_category` ON `course`.`category_id` = `course_category`.`id` WHERE `user_id` = ?',
        [id]
      )
      let total = 0

      cartTotal(cart)

      res
        .status(200)
        .json({ status: 'success', data: { message: '刪除成功', cart, total } })
    } else {
      res.status(400).json({
        status: 'error',
        data: { message: '刪除失敗' },
      })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

// 清空userID 為 ID 的購物車
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const [cart] = await dbPromise.execute(
      'DELETE FROM `cart` WHERE `user_id` = ?',
      [id]
    )

    if (cart.affectedRows > 0) {
      res.status(200).json({
        status: 'success',
        data: { message: '已清空購物車' },
      })
    } else {
      res
        .status(404) // 如果沒有找到符合條件的記錄，返回 404 Not Found
        .json({
          status: 'error',
          data: { message: '清空購物車錯誤' },
        })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

export default router
