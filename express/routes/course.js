import express from 'express'
import dbPromise from '##/configs/mysql-promise.js'
import multer from 'multer'
import moment from 'moment'
// import cors from 'cors'
import mysql from 'mysql2/promise.js'
// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用
import sequelize from '#configs/db.js'

const router = express.Router()
// GET 獲得所有資料，加入分頁與搜尋字串功能，單一資料表處理
router.get('/', async (req, res) => {
  let { search } = req.query
  let filter

  try {
    const [list] = await dbPromise.execute(
      'SELECT `course`.*,`course_category`.`ch_name` FROM `course` JOIN `course_category` ON `course`.`category_id` = `course_category`.`course_id`;'
    )

    if (!list || list.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: '沒有找到任何課程',
      })
    }

    return res.status(200).json({
      status: 'success',
      data: { courses: list },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      status: 'error',
      message: '獲取課程列表時發生錯誤',
    })
  }
})

// 獲得所有資料，加入分頁與搜尋字串功能，單一資料表處理
// courses/qs?page=1&keyword=Ele&orderby=id,asc&perpage=10&price_range=1500,10000
// router.get('/qs', async (req, res, next) => {
//   // 獲取網頁的搜尋字串
//   const {
//     page,
//     keyword,
//     orderby,
//     perpage,
//     price_range,
//   } = req.query

// //   // TODO: 這裡可以檢查各query string正確性或給預設值，檢查不足可能會產生查詢錯誤

// // 建立資料庫搜尋條件
// const conditions = []

// // 關鍵字，keyword 使用 `name LIKE '%keyword%'`
// conditions[0] = keyword ? `name LIKE '%${keyword}%'` : ''

// //   // 品牌，brand_ids 使用 `brand_id IN (4,5,6,7)`
// //   conditions[1] = brand_ids ? `brand_id IN (${brand_ids})` : ''

// //   // 分類，cat_ids 使用 `cat_id IN (1, 2, 3, 4, 5)`
// //   conditions[2] = cat_ids ? `cat_id IN (${cat_ids})` : ''

// //   // 顏色: FIND_IN_SET(1, color) OR FIND_IN_SET(2, color)
// //   conditions[3] = getFindInSet(colors, 'color')

// //   // 標籤: FIND_IN_SET(3, tag) OR FIND_IN_SET(2, tag)
// //   conditions[4] = getFindInSet(tags, 'tag')

// //   // 尺寸: FIND_IN_SET(3, size) OR FIND_IN_SET(2, size)
// //   conditions[5] = getFindInSet(sizes, 'size')

// // 價格
// conditions[6] = getBetween(price_range, 'price', 1500, 10000)

// // 各條件為AND相接(不存在時不加入where從句中)
// const where = getWhere(conditions, 'AND')

// // 排序用，預設使用id, asc
// const order = getOrder(orderby)

// // 分頁用
// // page預設為1，perpage預設為10
// const perpageNow = Number(perpage) || 10
// const pageNow = Number(page) || 1
// const limit = perpageNow
// // page=1 offset=0; page=2 offset= perpage * 1; ...
// const offset = (pageNow - 1) * perpageNow

// const sqlCourses = `SELECT * FROM course ${where} ${order} LIMIT ${limit} OFFSET ${offset}`
// const sqlCount = `SELECT COUNT(*) AS count FROM course ${where}`

// console.log(sqlCourses)

// const courses = await sequelize.query(sqlCourses, {
//   type: QueryTypes.SELECT, //執行為SELECT
//   raw: true, // 只需要資料表中資料
// })

// const data = await sequelize.query(sqlCount, {
//   type: QueryTypes.SELECT, //執行為SELECT
//   raw: true, // 只需要資料表中資料
//   plain: true, // 只需一筆資料
// })

// //   // 查詢
// //   // const total = await countWithQS(where)
// //   // const courses = await getCoursesWithQS(where, order, limit, offset)

// //   // json回傳範例
// //   //
// //   // {
// //   //   total: 100,
// //   //   perpage: 10,
// //   //   page: 1,
// //   //   data:[
// //   //     {id:123, name:'',...},
// //   //     {id:123, name:'',...}
// //   //   ]
// //   // }

//   const result = {
//     total: data.count,
//     perpage: Number(perpage),
//     page: Number(page),
//     data: courses,
//   }

//   res.json(result)
// })

// 獲得單筆資料
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const { uid } = req.query
    console.log(uid)
    const [courses] = await dbPromise.execute(
      // 'SELECT `course`.*, `course_category`.`name` AS `category_name` FROM course JOIN `course_category` ON `course_category`.`id` = `course`.`category_id` WHERE `course`.`id` = ?',
      'SELECT `course`.*, `course_category`.`ch_name` AS `category_name`' +
        `${uid ? ', CASE WHEN `favorite`.`id` IS NOT NULL THEN TRUE ELSE FALSE END AS `fav`' : ''}` +
        ' FROM `course`' +
        ' JOIN `course_category` ON `course_category`.`id` = `course`.`category_id`' +
        `${uid ? ' LEFT JOIN `favorite` ON `favorite`.`object_id` = `course`.`id` AND `favorite`.`object_type` = "course" AND `favorite`.`user_id` = ' + uid : ''}` +
        ' WHERE `course`.`id` = ?',
      [id]
    )

    if (courses.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: '找不到該課程',
        data: { id: '提供的課程ID不存在' },
      })
    }
    console.log(
      'SELECT `course`.*, `course_category`.`ch_name` AS `category_name`' +
        `${uid ? ', CASE WHEN `favorite`.`id` IS NOT NULL THEN TRUE ELSE FALSE END AS `fav`' : ''}` +
        ' FROM `course`' +
        ' JOIN `course_category` ON `course_category`.`id` = `course`.`category_id`' +
        `${uid ? ' LEFT JOIN `favorite` ON `favorite`.`id` = `course`.`id` AND `favorite`.`object_type` = "course" AND `favorite`.`user_id` = ' + uid : ''}` +
        ' WHERE `course`.`id` = ?',
      id
    )
    const course = courses[0]
    return res.status(200).json({ status: 'success', data: { course } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      status: 'error',
      message: '伺服器內部錯誤，請稍後再試',
    })
  }
})

// // 獲得所有資料(測試用，不適合資料太多使用)
// // router.get('/', async (req, res, next) => {
// //   const courses = await Course.findAll({ raw: true })
// //   res.json({ status: 'success', data: { courses } })
// // })

export default router
