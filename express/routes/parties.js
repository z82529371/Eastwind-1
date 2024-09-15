import express from 'express'
import 'dotenv/config.js'
import connection from '##/configs/mysql-promise.js'
import { generateBookingNumber } from '../utils/idGenerator.js'
import fetch from 'node-fetch'
import { checkAndUpdateExpiredParties } from '../utils/partyUtils.js'

const router = express.Router()
//判定區域
const areaToCity = {
  北區: ['台北市', '新北市', '桃園市', '基隆市'],
  中區: [
    '台中市',
    '新竹縣',
    '苗栗縣',
    '彰化縣',
    '南投縣',
    '雲林縣',
    '嘉義縣',
    '新竹市',
  ],
  南區: ['臺南市', '高雄市', '屏東縣', '嘉義市'],
}

// 輔助函數：檢查並更新派對狀態
async function checkAndUpdatePartyStatus(partyId) {
  const [party] = await connection.execute('SELECT * FROM party WHERE id = ?', [
    partyId,
  ])
  console.log(party)

  if (party.length > 0) {
    const partyData = party[0]
    const allPositionsFilled =
      partyData.userID_main !== 0 &&
      partyData.userID_join1 !== 0 &&
      partyData.userID_join2 !== 0 &&
      partyData.userID_join3 !== 0

    if (allPositionsFilled) {
      await connection.execute(
        'UPDATE party SET status = "full" WHERE id = ?',
        [partyId]
      )
      try {
        await createBookingForFullParty(partyData)
        // createBookingForFullParty 成功後會將狀態更新為 "completed"
      } catch (error) {
        console.error(`為派對 ${partyId} 自動創建預訂失敗:`, error)
        // 更新狀態為 'failed'
        await connection.execute(
          'UPDATE party SET status = "failed" WHERE id = ?',
          [partyId]
        )
      }
    }
  }
}

// 輔助函數：重新排序派對成員
async function reorderPartyMembers(partyId) {
  const [party] = await connection.execute(
    'SELECT userID_main, userID_join1, userID_join2, userID_join3 FROM party WHERE id = ?',
    [partyId]
  )

  if (party.length === 0) return

  const { userID_main, userID_join1, userID_join2, userID_join3 } = party[0]
  const members = [userID_join1, userID_join2, userID_join3].filter(
    (id) => id !== 0
  )

  // 更新派對成員順序
  await connection.execute(
    `UPDATE party SET 
     userID_join1 = ?, 
     userID_join2 = ?, 
     userID_join3 = ? 
     WHERE id = ?`,
    [...members, ...Array(3 - members.length).fill(0), partyId]
  )
}

async function createBookingForFullParty(partyData) {
  const bookingNumber = generateBookingNumber('DB')
  const bookingPayload = {
    numerical_order: bookingNumber,
    date: partyData.date,
    start_time: partyData.start_at,
    end_time: partyData.end_at,
    playroom_type:
      partyData.playroom_type === 0 || partyData.playroom_type === 1
        ? partyData.playroom_type
        : 0,
    notes: `自動為派對 ${partyData.numerical_order} 創建的預訂`,
    total_price: partyData.total_price,
    company_id: partyData.company_id,
    user_id: partyData.userID_main, // 假設主揪ID為用戶ID
    status: 'full',
    party_id: partyData.id,
  }

  try {
    const response = await fetch('http://localhost:3005/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload),
    })

    if (!response.ok) {
      throw new Error('Booking API 請求失敗')
    }

    const result = await response.json()
    console.log(result)

    await connection.execute(
      'UPDATE party SET booking_id = ?, table_id = ?, status = "completed" WHERE id = ?',
      [result.id, result.tableId, partyData.id]
    )
    console.log(
      `為派對 ${partyData.numerical_order} 成功創建預訂，預訂號碼：${result.id}，桌號：${result.tableId}，狀態更新為 completed`
    )
    return { bookingId: result.id, tableId: result.tableId }
  } catch (error) {
    console.error('自動訂桌失敗:', error)
    throw error
  }
}
//抓取派對總數
router.get('/', async (req, res) => {
  try {
    await checkAndUpdateExpiredParties()
    //頁面規則
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 9
    const offset = (page - 1) * limit
    //字串搜尋規則
    const search = req.query.search || '' // 從請求中獲取搜尋字串
    const searchTerm = `%${search}%` // 使用 `%` 進行部分匹配
    //區域搜尋規則
    const area = req.query.area || ''
    //抓取規則

    let query = `
    SELECT SQL_CALC_FOUND_ROWS 
    p.*,
    DATE_FORMAT(CONCAT(p.date, ' ', p.start_at), '%Y-%m-%dT%H:%i:%s') as start_time,
    DATE_FORMAT(CONCAT(p.date, ' ', p.end_at), '%Y-%m-%dT%H:%i:%s') as end_time,
    (
      (p.userID_main != 0) +
      (p.userID_join1 != 0) +
      (p.userID_join2 != 0) +
      (p.userID_join3 != 0)
    ) as player_count,
    c.name as company_name,
    c.city,
    c.district
  FROM 
    party p
    JOIN company c ON p.company_id = c.id
  WHERE 
  c.name LIKE ?
  AND
    p.date >= CURDATE()
    AND (
      (p.userID_main != 0) +
      (p.userID_join1 != 0) +
      (p.userID_join2 != 0) +
      (p.userID_join3 != 0)
    ) < 4
     AND p.status ='waiting'

    `

    let queryParams = [searchTerm]

    if (area && areaToCity[area]) {
      const cities = areaToCity[area]
      query += ` AND c.city IN (${cities.map(() => '?').join(',')})`
      queryParams = [...queryParams, ...cities]
    }

    query += ` ORDER BY p.date ASC, p.start_at ASC LIMIT ? OFFSET ?`
    queryParams.push(limit, offset)

    const [parties] = await connection.execute(query, queryParams)
    // 獲取總數
    const [countResult] = await connection.execute(
      'SELECT FOUND_ROWS() as total'
    )

    const total = countResult[0].total
    const totalPages = Math.ceil(total / limit)
    if (parties.length === 0) {
      return res.status(404).json({ message: '沒有找到可加入的派對' })
    }

    res.json({
      data: parties,
      currentPage: page,
      totalPages: totalPages,
      totalItems: total,
    })
  } catch (err) {
    console.error('Database query error:', err)
    res.status(500).json({ error: '獲取派對資料時出錯' })
  }
})

// 在 parties.js 中

router.get('/:id', async (req, res) => {
  try {
    await checkAndUpdateExpiredParties()
    const { id } = req.params
    const { uid } = req.query
    console.log(uid, '0000')
    const query = `
    SELECT 
      p.*,
      DATE_FORMAT(CONCAT(p.date, ' ', p.start_at), '%Y-%m-%dT%H:%i:%s') as start_time,
      DATE_FORMAT(CONCAT(p.date, ' ', p.end_at), '%Y-%m-%dT%H:%i:%s') as end_time,
   
      c.name as company_name,
      c.address,
      c.rating,
      c.tele,
      c.open_time,
      c.close_time,
      c.vip,
      c.lobby,
      GROUP_CONCAT(DISTINCT CONCAT(st.name, ':', st.icon)) AS services,
      GROUP_CONCAT(DISTINCT cp.img) AS company_photos,
      ${uid ? ' CASE WHEN favorite.object_id IS NOT NULL THEN TRUE ELSE FALSE END AS fav,' : ''}

      u1.username AS main_user_name,
      u2.username AS join1_user_name,
      u3.username AS join2_user_name,
      u4.username AS join3_user_name,

      u1.user_img AS main_user_img,
      u2.user_img  AS join1_user_img,
      u3.user_img  AS join2_user_img,
      u4.user_img AS join3_user_img 
      
      FROM
      party p
    JOIN 
      company c ON p.company_id = c.id
    LEFT JOIN 
      company_photo cp ON c.id = cp.room_id
    LEFT JOIN 
      services_for_company sfc ON c.id = sfc.company_id
    LEFT JOIN 
      services_tags st ON sfc.services_id = st.id
    LEFT JOIN 
      user u1 ON p.userID_main = u1.id
    LEFT JOIN 
      user u2 ON p.userID_join1 = u2.id
    LEFT JOIN 
      user u3 ON p.userID_join2 = u3.id
    LEFT JOIN 
      user u4 ON p.userID_join3 = u4.id

      ${uid ? 'LEFT JOIN favorite ON favorite.object_id = c.id AND favorite.object_type = "company" AND favorite.user_id = ' + uid : ''}


    WHERE  
      p.id = ? 
      AND p.date >= CURDATE()
 
    GROUP BY 
      p.id
    ORDER BY 
      p.date ASC, p.start_at ASC;
    `
    const [party] = await connection.execute(query, [id])

    console.log(party)
    if (party.length === 0) {
      return res.status(404).json({ message: '沒有找到可加入的派對' })
    }

    // 将 services 字符串转换为统一的数组格式
    const servicesArray = party[0].services
      ? party[0].services.split(',').map((service) => {
          const [name, icon] = service.split(':')
          return { name, icon: `<${icon} />` }
        })
      : []

    // 构建响应格式
    const response = {
      ...party[0],
      services: servicesArray,
    }

    res.json(response)
  } catch (err) {
    console.error('Database query error:', err)
    res.status(500).json({ error: '獲取派對資料時出錯' })
  }
})

router.post('/:id/join', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  try {
    await checkAndUpdateExpiredParties()
    // 檢查派對是否存在且有空位
    const [party] = await connection.execute(
      'SELECT * FROM party WHERE id = ? AND date >= CURDATE() AND status IN ("waiting", "full") AND (userID_join1 = 0 OR userID_join2 = 0 OR userID_join3 = 0)',
      [id]
    )

    if (party.length === 0) {
      return res.status(404).json({ error: '派對不存在或已滿員' })
    }

    // 確定要更新的欄位
    let updateField = ''
    if (party[0].userID_join1 === 0) updateField = 'userID_join1'
    else if (party[0].userID_join2 === 0) updateField = 'userID_join2'
    else if (party[0].userID_join3 === 0) updateField = 'userID_join3'

    // 更新派對資料
    await connection.execute(
      `UPDATE party SET ${updateField} = ? WHERE id = ?`,
      [userId, id]
    )

    // 使用輔助函數檢查並更新派對狀態
    await checkAndUpdatePartyStatus(id)

    res.status(200).json({ message: '成功加入派對' })
  } catch (error) {
    console.error('加入派對失敗:', error)
    res.status(500).json({ error: '加入派對時發生錯誤' })
  }
})

router.post('/:id/leave', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body
  console.log('Debug: Leaving party', { id, userId })
  try {
    await checkAndUpdateExpiredParties()
    // 首先，獲取派對信息
    const [party] = await connection.execute(
      'SELECT * FROM party WHERE id = ? AND status IN ("waiting", "full")',
      [id]
    )

    if (party.length === 0) {
      return res.status(404).json({ error: '派對不存在或已取消' })
    }

    const partyData = party[0]

    // 確定用戶的位置並更新
    let updateField = null
    if (partyData.userID_join1 == userId) updateField = 'userID_join1'
    else if (partyData.userID_join2 == userId) updateField = 'userID_join2'
    else if (partyData.userID_join3 == userId) updateField = 'userID_join3'

    if (!updateField) {
      return res.status(400).json({ error: '用戶不在此派對中' })
    }

    // 更新派對資料，將用戶 ID 設為 0
    const [result] = await connection.execute(
      `UPDATE party SET ${updateField} = 0 WHERE id = ?`,
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: '更新派對資料失敗' })
    }

    console.log('Update result:', result)

    // 重新排序派對成員
    await reorderPartyMembers(id)

    // 檢查並更新派對狀態
    await checkAndUpdatePartyStatus(id)

    // 獲取更新後的派對資料
    const [updatedParty] = await connection.execute(
      'SELECT * FROM party WHERE id = ?',
      [id]
    )

    res.status(200).json({
      message: '成功離開派對',
      updatedParty: updatedParty[0],
    })
  } catch (error) {
    console.error('離開派對失敗:', error)
    res.status(500).json({ error: '離開派對時發生錯誤' })
  }
})

router.post('/:id/cancel', async (req, res) => {
  const { id } = req.params
  const { userId } = req.body
  console.log(userId)
  // 映射 userId 到 userID_main
  const userID_main = userId

  const conn = await connection.getConnection()

  try {
    // 檢查是否為派對主揪且派對狀態為 booked、full 或 completed
    const [party] = await connection.execute(
      'SELECT * FROM party WHERE id = ? AND userID_main = ? AND status IN ("waiting", "full", "completed")',
      [id, userID_main]
    )

    if (party.length === 0) {
      return res.status(403).json({ error: '只有派對主揪可以取消未開始的派對' })
    }
    console.log(party)
    const partyData = party[0]
    // 添加額外檢查
    if (!partyData) {
      return res.status(404).json({ error: '找不到指定的派對' })
    }
    // 開始一個事務
    await conn.beginTransaction()

    await conn.execute('UPDATE party SET status = "cancelled" WHERE id = ?', [
      id,
    ])

    // 如果派對已經有預訂（狀態為 completed），則取消相應的預訂
    if (partyData.status === 'completed' && partyData.booking_id) {
      await conn.execute(
        'UPDATE booking_record SET status = "cancelled" WHERE id = ?',
        [partyData.booking_id]
      )
    }

    // 提交事務
    await conn.commit()

    res.status(200).json({ message: '派對已成功取消' })
  } catch (error) {
    await conn.rollback()
    throw error
    console.error('取消派對失敗:', error)
    res.status(200).json({ error: '取消派對時發生錯誤' })
  }
})

export default router
