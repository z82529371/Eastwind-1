import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'
import dbPromise from '##/configs/mysql-promise.js'
import multer from 'multer'

import authenticate from '#middlewares/authenticate.js'
import sequelize from '#configs/db.js'
const { Favorite } = sequelize.models
const upload = multer()

// 獲得某會員id的有加入到我的最愛清單中的商品id們
// 此路由只有登入會員能使用
router.get('/', async (req, res) => {
  const { id } = req.query
  try {
    const [fav] = await dbPromise.execute(
      'SELECT * FROM `favorite` WHERE `user_id` = ?',
      [id]
    )

    res
      .status(200)
      .json({ status: 'success', data: { message: '已取得最愛', fav } })
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

router.post('/:id', upload.none(), async (req, res, next) => {
  const oid = req.params.id
  const { uid, type } = req.body
  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `favorite` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = ?',
      [uid, oid, type]
    )

    if (existingItem.length > 0) {
      return res
        .status(400)
        .json({ status: 'error', data: { message: '該產品已在收藏內' } })
    }
    const [result] = await dbPromise.execute(
      'INSERT INTO `favorite` (`id`, `user_id`, `object_id`, `object_type`) VALUES (NULL, ?, ?, ?)',
      [uid, oid, type]
    )
    if (result.insertId) {
      const [fav] = await dbPromise.execute(
        'SELECT * FROM `favorite` WHERE `user_id` = ? AND `object_type` = ?',
        [uid, type]
      )
      res
        .status(201)
        .json({ status: 'success', data: { message: '新增成功', fav } })
    } else {
      res.status(400).json({ status: 'error', data: { message: '新增失敗' } })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

router.delete('/:id', upload.none(), async (req, res, next) => {
  const oid = req.params.id
  const { uid, type } = req.body
  try {
    const [existingItem] = await dbPromise.execute(
      'SELECT * FROM `favorite` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = ?',
      [uid, oid, type]
    )

    if (existingItem.length <= 0) {
      return res.status(400).json({
        status: 'error',
        data: { message: '收藏內無該商品，刪除失敗' },
      })
    }
    const [result] = await dbPromise.execute(
      'DELETE FROM `favorite` WHERE `user_id` = ? AND `object_id` = ? AND `object_type` = ?',
      [uid, oid, type]
    )
    if (result.affectedRows >= 1) {
      const [fav] = await dbPromise.execute(
        'SELECT * FROM `favorite` WHERE `user_id` = ? AND `object_type` = ?',
        [uid, type]
      )
      res
        .status(200)
        .json({ status: 'success', data: { message: '刪除成功', fav } })
    } else {
      res.status(400).json({ status: 'error', data: { message: '刪除失敗' } })
    }
  } catch (err) {
    res.status(400).json({ status: 'error', data: { message: err.message } })
  }
})

export default router
