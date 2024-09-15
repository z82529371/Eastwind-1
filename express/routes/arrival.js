import express from 'express'
const router = express.Router()
import { getIdParam } from '#db-helpers/db-tool.js'
import dbPromise from '##/configs/mysql-promise.js'
import moment from 'moment'

// 檢查空物件, 轉換req.params為數字
import multer from 'multer'
const upload = multer()

//此oid為流水編號

router.get('/', async (req, res) => {
  let regiArr = []

  try {
    const [arrival] = await dbPromise.execute(
      'SELECT `id`,`numerical_order`, `delivery_method`, `order_date`, `recipient`  FROM `user_order` WHERE status_now = "付款完成" ORDER BY `order_date` DESC'
    )

    res.status(200).json({
      status: 'success',
      data: {
        message: '已取得資訊',
        arrival,
      },
    })
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

router.put('/', upload.none(), async (req, res) => {
  const { order_ids } = req.body
  if (!order_ids) {
    return res
      .status(400)
      .json({ status: 'error', data: { message: '沒有選擇訂單' } })
  }

  const now = moment().format('YYYY-MM-DD HH:mm:ss')
  try {
    for (const order_id of order_ids) {
      const [result] = await dbPromise.execute(
        'INSERT INTO `order_status` (`id`, `order_id`, `status`, `update_at`) VALUES (NULL, ?, ?, ?);',
        [order_id, '已出貨', now]
      )

      if (result.insertId) {
        await dbPromise.execute(
          'UPDATE `user_order` SET `status_now` = "已出貨" WHERE `id` =?',
          [order_id]
        )
      }
    }

    const [arrival] = await dbPromise.execute(
      'SELECT `id`,`numerical_order`, `delivery_method`, `order_date`, `recipient`  FROM `user_order` WHERE status_now = "付款完成" ORDER BY `order_date` DESC'
    )

    res.status(200).json({
      status: 'success',
      data: {
        message: '修改完成',
        arrival,
      },
    })
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

export default router
