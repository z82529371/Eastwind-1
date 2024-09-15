import React, { useState, useContext, useEffect } from 'react'
import UserCenterLayout from '@/components/layout/user-center-layout'
import { AuthContext } from '@/context/AuthContext'
import styles from '@/styles/boyu/user-party.module.scss'
import { useRouter } from 'next/router'
import SearchBar from '@/components/user-party/SearchBar'
import PartyListHead from '@/components/user-party/PartyListHead'
import PartyStateFilter from '@/components/user-party/PartyStateFilter'
import PartyList from '@/components/user-party/PartyList'

export default function UserParty() {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const [activeSortIndex, setActiveSortIndex] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState('waiting')
  const [party, setParty] = useState([])
  const [role, setRole] = useState('主揪') // 新增角色狀態

  const [searchQuery, setSearchQuery] = useState('') // 用來存儲用戶輸入值的狀態
  const [searchKeyword, setSearchKeyword] = useState('') // 新增搜尋關鍵字狀態

  // 如果 `user` 不存在，提前返回 `null`，避免後續渲染發生錯誤
  useEffect(() => {
    if (!user || !user.username) {
      router.push('/home')
    }
  }, [])

  // 排序方式列表
  const sortOptions = [
    { label: '揪團編號從大到小', key: 'order_number', order: 'desc' },
    { label: '揪團編號從小到大', key: 'order_number', order: 'asc' },
    { label: '棋牌室從 A 到 Z ', key: 'company_name', order: 'asc' },
    { label: '棋牌室從 Z 到 A ', key: 'company_name', order: 'desc' },
    { label: '揪團時間從早到晚', key: 'date', order: 'asc' },
    { label: '揪團時間從晚到早', key: 'date', order: 'desc' },
  ]

  const changeStatus = (status) => {
    setSelectedStatus(status)
  }

  const changeRole = (newRole) => {
    setRole(newRole)
  }

  const sortParty = (key, order) => {
    const sortedParty = [...party].sort((a, b) => {
      let valueA, valueB

      if (key === 'date') {
        valueA = new Date(`${a.date}T${a.start_time}`)
        valueB = new Date(`${b.date}T${b.start_time}`)
      } else if (key === 'company_name') {
        // 忽略大小寫比較公司名稱
        valueA = a[key].toLowerCase()
        valueB = b[key].toLowerCase()
      } else {
        // 其他情況下的排序處理
        valueA = a[key]
        valueB = b[key]
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    setParty(sortedParty)
  }

  const sortByIndex = (index) => {
    setActiveSortIndex(index)
    const { key, order } = sortOptions[index]
    sortParty(key, order)
  }

  const formatTime = (time) => {
    return time.split(':').slice(0, 2).join(':')
  }

  const triggerSearch = () => {
    setSearchKeyword(searchQuery) // 按下搜尋按鈕時，根據 `searchQuery` 設置 `searchKeyword`
  }

  // 當輸入框內容改變時執行的函數
  const searchInputChange = (e) => {
    const inputValue = e.target.value
    setSearchQuery(inputValue)

    if (inputValue === '') {
      setSearchKeyword('') // 當輸入框為空時，設置 `searchKeyword` 為空，這樣會顯示全部結果
    }
  }

  useEffect(() => {
    if (user && user.id) {
      let apiUrl = `http://localhost:3005/api/user-party/${user.id}/${selectedStatus}`

      if (role === '主揪') {
        apiUrl = `http://localhost:3005/api/user-party/${user.id}/${selectedStatus}`
      } else if (role === '參團') {
        apiUrl = `http://localhost:3005/api/user-party/join/${user.id}/${selectedStatus}`
      }

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            const transformedPartys = data.data.partys.map((party) => {
              const membersArray = [
                {
                  role: '主揪',
                  name: party.main_username,
                  id: party.user_main,
                },
              ]
              if (party.join1_username) {
                membersArray.push({
                  role: '參團',
                  name: party.join1_username,
                  id: party.user_join1,
                })
              }
              if (party.join2_username) {
                membersArray.push({
                  role: '參團',
                  name: party.join2_username,
                  id: party.user_join2,
                })
              }
              if (party.join3_username) {
                membersArray.push({
                  role: '參團',
                  name: party.join3_username,
                  id: party.user_join3,
                })
              }

              return {
                ...party,
                playroom_type: party.playroom_type === 0 ? '大廳' : '包廂',
                price: Math.floor(party.total_price),
                start_time: formatTime(party.start_at),
                end_time: formatTime(party.end_at),
                members: membersArray,
              }
            })
            setParty(transformedPartys)
          } else {
            console.error('Failed to fetch parties:', data.message)
          }
        })
        .catch((error) => {
          console.error('Error fetching parties:', error)
        })
    }
  }, [selectedStatus, role, user])

  const filteredParty = party.filter((item) => {
    if (!user) return false

    const matchCompanyName = item.company_name.includes(searchKeyword)
    const matchOrderNumber = item.order_number
      .toString()
      .includes(searchKeyword)

    if (role === '主揪') {
      return (
        item.main_username === user.username &&
        (matchCompanyName || matchOrderNumber)
      )
    } else if (role === '參團') {
      return (
        [
          item.join1_username,
          item.join2_username,
          item.join3_username,
        ].includes(user.username) &&
        (matchCompanyName || matchOrderNumber)
      )
    }
    return false
  })

  return (
    <div className={`${styles['user-party-box-bo']}   w-100`}>
      <SearchBar
        searchQuery={searchQuery}
        searchInputChange={searchInputChange}
        triggerSearch={triggerSearch}
      />

      <div className={`${styles['party-list-box-bo']} flex-column d-flex`}>
        <PartyListHead role={role} changeRole={changeRole} />
        <div
          className={`${styles['party-list-body-bo']} d-flex flex-column justify-content-center text-center`}
        >
          <PartyStateFilter
            selectedStatus={selectedStatus}
            changeStatus={changeStatus}
          />

          <PartyList
            searchKeyword={searchKeyword}
            filteredParty={filteredParty}
            selectedStatus={selectedStatus}
            sortByIndex={sortByIndex}
            activeSortIndex={activeSortIndex}
            sortOptions={sortOptions}
            user={user}
          />
        </div>
      </div>
    </div>
  )
}
UserParty.getLayout = function (page) {
  return <UserCenterLayout>{page}</UserCenterLayout>
}
