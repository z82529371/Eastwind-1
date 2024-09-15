import express from 'express'
const router = express.Router()
import { getIdParam } from '#db-helpers/db-tool.js'
import dbPromise from '##/configs/mysql-promise.js'
import moment from 'moment'

// 檢查空物件, 轉換req.params為數字
import multer from 'multer'
const upload = multer()

//此oid為流水編號
router.get('/:oid', async (req, res) => {
  const oid = req.params.oid
  try {
    const [orderInfo] = await dbPromise.execute(
      'SELECT `uo`.`id`,`uo`.`numerical_order`,`uo`.`user_id`, `uo`.`delivery_method`, `uo`.`delivery_address`,  `uo`.`recipient`,   `uo`.`pay_method`,   `uo`.`pay_info`,  `uo`.`total`,  `uo`.`coupons_id`,   `uo`.`discount_info`,   `uo`.`remark`,   `uo`.`status_now`,  `uo`.`order_date`, `u`.`phone`, COUNT(`od`.`id`) AS `order_detail_count`, `od`.`object_type`, GROUP_CONCAT(`od`.`object_id`) AS `object_ids`, GROUP_CONCAT(`od`.`object_type`) AS `object_types`,GROUP_CONCAT(`od`.`name`) AS `names`, GROUP_CONCAT(`od`.`quantity`) AS `quantitys`, GROUP_CONCAT(`od`.`price`) AS `prices`,GROUP_CONCAT( CASE WHEN `od`.`object_type` = "product" THEN `p`.`img` WHEN `od`.`object_type` = "course" THEN `c`.`images` END ) AS all_item_images, GROUP_CONCAT(`od`.`comment_status`) AS `comment_status` FROM `user_order` `uo` JOIN `order_detail` `od` ON `uo`.`id` = `od`.`order_id`LEFT JOIN `user` `u` ON `uo`.`user_id` = `u`.`id` LEFT JOIN `product` `p` ON `od`.`object_id` = `p`.`id` AND  `od`.`object_type` = "product" LEFT JOIN `course` `c` ON `od`.`object_id` = `c`.`id` AND `od`.`object_type` = "course" WHERE `uo`.`numerical_order` = ?  GROUP BY `uo`.`id` ORDER BY `od`.`id` ASC',
      [oid]
    )

    if (orderInfo.length > 0) {
      const newObjectIds = orderInfo[0].object_ids
        ? orderInfo[0].object_ids.split(',')
        : []
      const newObjectTypes = orderInfo[0].object_types
        ? orderInfo[0].object_types.split(',')
        : []

      const newNames = orderInfo[0].names ? orderInfo[0].names.split(',') : []
      const newImages = orderInfo[0].all_item_images
        ? orderInfo[0].all_item_images.split(',')
        : []
      const newQuantitys = orderInfo[0].quantitys
        ? orderInfo[0].quantitys.split(',')
        : []
      const newPrices = orderInfo[0].prices
        ? orderInfo[0].prices.split(',')
        : []
      const newComment_status = orderInfo[0].comment_status
        ? orderInfo[0].comment_status.split(',')
        : []

      const orderDetails = newObjectIds.map((id, index) => ({
        id: Number(id),
        object_type: newObjectTypes[index],
        name: newNames[index],
        img: newImages[index],
        quantity: Number(newQuantitys[index]),
        price: Number(newPrices[index]),
        comment_status: Number(newComment_status[index]),
      }))
      const {
        object_ids,
        object_types,
        names,
        all_item_images,
        order_detail_count,
        object_type,
        prices,
        quantitys,
        comment_status,
        ...newOrderInfo
      } = orderInfo[0]

      const [status] = await dbPromise.execute(
        'SELECT * FROM `order_status` WHERE `order_id` = ?',
        [orderInfo[0].id]
      )

      const [comment] = await dbPromise.execute(
        'SELECT * FROM `comment` WHERE `order_id` = ?',
        [orderInfo[0].id]
      )
      res.status(200).json({
        status: 'success',
        data: {
          message: '已取得資訊',
          orderInfo: newOrderInfo,
          status,
          orderDetails,
          comment,
        },
      })
    } else {
      res.status(400).json({ status: 'error', data: { message: '查無訂單' } })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

router.get('/', async (req, res) => {
  if (!req.query.id) {
    return res.json({ status: 'error', message: '用戶不存在' })
  }
  const { id, status_now } = req.query

  let query
  let params = [id] // 默認參數僅包含 user_id

  if (status_now === '已完成' || status_now === '已評論') {
    query = `SELECT uo.pay_method, uo.status_now, uo.order_date, uo.total, uo.delivery_method,
                  uo.delivery_address, uo.numerical_order, COUNT(od.id) AS order_detail_count,
                  od.object_type, GROUP_CONCAT(od.object_id) AS object_ids,
                  GROUP_CONCAT(od.object_type) AS object_types, GROUP_CONCAT(od.quantity) AS quantitys,
                  GROUP_CONCAT(od.price) AS prices,
                  CASE WHEN od.object_type = 'product' THEN p.img
                       WHEN od.object_type = 'course' THEN c.images
                  END AS first_item_image
           FROM user_order uo
           JOIN order_detail od ON uo.id = od.order_id
           LEFT JOIN product p ON od.object_id = p.id AND od.object_type = 'product'
           LEFT JOIN course c ON od.object_id = c.id AND od.object_type = 'course'
           WHERE uo.user_id = ? AND (uo.status_now = '已完成' OR uo.status_now = '已評論')
           GROUP BY uo.id
           ORDER BY od.id DESC`
  } else {
    query = `SELECT uo.pay_method, uo.status_now, uo.order_date, uo.total, uo.delivery_method,
                  uo.delivery_address, uo.numerical_order, COUNT(od.id) AS order_detail_count,
                  od.object_type, GROUP_CONCAT(od.object_id) AS object_ids,
                  GROUP_CONCAT(od.object_type) AS object_types, GROUP_CONCAT(od.quantity) AS quantitys,
                  GROUP_CONCAT(od.price) AS prices,
                  CASE WHEN od.object_type = 'product' THEN p.img
                       WHEN od.object_type = 'course' THEN c.images
                  END AS first_item_image
           FROM user_order uo
           JOIN order_detail od ON uo.id = od.order_id
           LEFT JOIN product p ON od.object_id = p.id AND od.object_type = 'product'
           LEFT JOIN course c ON od.object_id = c.id AND od.object_type = 'course'
           WHERE uo.user_id = ? AND uo.status_now = ?
           GROUP BY uo.id
           ORDER BY od.id DESC`
    params.push(status_now) // 當 status_now 不是 '已完成' 時，將其添加到參數中
  }

  try {
    const [orderInfo] = await dbPromise.execute(query, params)

    res.status(200).json({
      status: 'success',
      data: { message: '已取得資訊', orderInfo },
    })
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

router.post('/comment', upload.none(), async (req, res) => {
  const datas = req.body
  const time = moment().format('YYYY-MM-DD HH:mm:ss')
  const today = moment().format('YYYY-MM-DD')
  const order_id = datas[0].order_id
  try {
    for (const comment of datas) {
      const { user_id, order_id, object_id, object_type, star, content } =
        comment
      const [result] = await dbPromise.execute(
        'INSERT INTO `comment` (`id`, `user_id`, `order_id`, `object_id`, `object_type`, `star`, `content`, `date`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, order_id, object_id, object_type, star, content, today]
      )
      if (result.insertId) {
        dbPromise.execute(
          'UPDATE `order_detail` SET `comment_status` = ? WHERE `order_id` = ? AND object_id = ? AND object_type = ?',
          [1, order_id, object_id, object_type]
        )
      }
    }
    dbPromise.execute(
      'INSERT INTO `order_status` (`id`, `order_id`, `status`, `update_at`) VALUES (NULL, ?, ?, ?);',
      [order_id, '已評論', time]
    )
    dbPromise.execute(
      'UPDATE `user_order` SET `status_now` = ? WHERE `user_order`.`id` = ?;',
      ['已評論', order_id]
    )

    const [comments] = await dbPromise.execute(
      'SELECT * FROM `comment` WHERE `order_id` = ?',
      [order_id]
    )

    const [orderDetails] = await dbPromise.execute(
      'SELECT od.*, CASE WHEN od.object_type = "product" THEN p.img WHEN od.object_type = "course" THEN c.images ELSE NULL END AS img FROM order_detail od LEFT JOIN product p ON od.object_type = "product" AND od.object_id = p.id LEFT JOIN course c ON od.object_type = "course" AND od.object_id = c.id WHERE od.order_id = ?',
      [order_id]
    )
    const [status] = await dbPromise.execute(
      'SELECT * FROM `order_status` WHERE `order_id` = ?',
      [order_id]
    )

    res.status(200).json({
      status: 'success',
      data: { message: '寫入成功', comments, status, orderDetails },
    })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
})

router.put('/:oid', upload.none(), async (req, res) => {
  const oid = req.params.oid
  const time = moment().format('YYYY-MM-DD HH:mm:ss')
  try {
    const [orderInfo] = await dbPromise.execute(
      'SELECT * FROM `user_order` WHERE `numerical_order` = ?',
      [oid]
    )

    if (orderInfo.length > 0) {
      const order_id = orderInfo[0].id
      dbPromise.execute(
        'INSERT INTO `order_status` (`id`, `order_id`, `status`, `update_at`) VALUES (NULL, ?, ?, ?);',
        [order_id, '已完成', time]
      )
      dbPromise.execute(
        'UPDATE `user_order` SET `status_now` = ? WHERE `user_order`.`id` = ?;',
        ['已完成', order_id]
      )

      const [status] = await dbPromise.execute(
        'SELECT * FROM `order_status` WHERE `order_id` = ?',
        [order_id]
      )

      res.status(200).json({
        status: 'success',
        data: { message: '寫入成功', status },
      })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
})

export default router
