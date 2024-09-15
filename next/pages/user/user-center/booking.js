import React, { useState, useContext, useEffect } from 'react'
import UserCenterLayout from '@/components/layout/user-center-layout'
import { AuthContext } from '@/context/AuthContext'
import styles from '@/styles/boyu/user-booking.module.scss'
import Swal from 'sweetalert2'
import BookingStatusTabs from '@/components/user-booking/BookingStatusTabs'
import SearchBox from '@/components/user-booking/SearchBox'
import SortOptions from '@/components/user-booking/SortOptions'
import BookingTableHeader from '@/components/user-booking/BookingTableHeader'
import BookingList from '@/components/user-booking/BookingList'

export default function UserBooking() {
  const [activeSortIndex, setActiveSortIndex] = useState(0)
  const { user } = useContext(AuthContext)
  const [selectedStatus, setSelectedStatus] = useState('booked')
  const [booking, setBooking] = useState([])

  const [visibleCount, setVisibleCount] = useState(5) // 預設顯示的項目數量

  const [searchQuery, setSearchQuery] = useState('') // 用來存儲用戶輸入值的狀態
  const [searchKeyword, setSearchKeyword] = useState('') // 新增搜尋關鍵字狀態

  // 排序方式列表
  const sortOptions = [
    { label: '預訂編號從大到小', key: 'order_number', order: 'desc' },
    { label: '預訂編號從小到大', key: 'order_number', order: 'asc' },
    { label: '棋牌室從A到Z', key: 'company_name', order: 'asc' },
    { label: '棋牌室從Z到A', key: 'company_name', order: 'desc' },
    { label: '預訂時間從早到晚', key: 'date', order: 'asc' },
    { label: '預訂時間從晚到早', key: 'date', order: 'desc' },
  ]

  const changeStatus = (status) => {
    setSelectedStatus(status)
  }

  const sortBooking = (key, order) => {
    const sortedBookings = [...booking].sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1
      } else {
        return a[key] < b[key] ? 1 : -1
      }
    })
    setBooking(sortedBookings)
  }

  const sortByIndex = (index) => {
    setActiveSortIndex(index)
    const { key, order } = sortOptions[index]
    sortBooking(key, order)
  }

  const formatTime = (time) => {
    return time.split(':').slice(0, 2).join(':')
  }

  useEffect(() => {
    if (user && user.id) {
      const query = searchKeyword
        ? `?search=${encodeURIComponent(searchKeyword)}`
        : ''

      fetch(
        `http://localhost:3005/api/user-booking/${user.id}/${selectedStatus}${query}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            // 處理 bookings 並加入 members 資料

            const bookingsWithMembers = data.data.bookings.map((booking) => {
              return {
                ...booking,
                members: [
                  {
                    role: '主揪',
                    name: booking.main_username,
                    id: booking.user_main,
                  },
                  booking.join1_username
                    ? {
                        role: '參團',
                        name: booking.join1_username,
                        id: booking.user_join1,
                      }
                    : null,
                  booking.join2_username
                    ? {
                        role: '參團',
                        name: booking.join2_username,
                        id: booking.user_join2,
                      }
                    : null,
                  booking.join3_username
                    ? {
                        role: '參團',
                        name: booking.join3_username,
                        id: booking.user_join3,
                      }
                    : null,
                ].filter((member) => member !== null), // 過濾掉空的成員
              }
            })

            // 處理時間格式和價格
            const transformedBookings = bookingsWithMembers.map((booking) => ({
              ...booking,
              playroom_type: booking.playroom_type === 0 ? '大廳' : '包廂',
              price: Math.floor(booking.total_price),
              start_time: formatTime(booking.start_time),
              end_time: formatTime(booking.end_time),
            }))

            // 更新狀態
            setBooking(transformedBookings)
            // 重置 visibleCount 當 activeTab 改變時
            setVisibleCount(5)
          } else {
            console.error('Failed to fetch bookings:', data.message)
          }
        })
        .catch((error) => {
          console.error('Error fetching bookings:', error)
        })
    }
  }, [selectedStatus, searchKeyword, user])

  const triggerSearch = () => {
    setSearchKeyword(searchQuery) // 當按下搜尋按鈕時，將用戶輸入的值賦予 searchKeyword
  }

  // 當輸入框內容改變時執行的函數
  const searchInputChange = (e) => {
    const inputValue = e.target.value
    setSearchQuery(inputValue)

    // 如果輸入框為空，觸發顯示所有最愛的動作
    if (inputValue === '') {
      setSearchKeyword('') // 重設為空字串以顯示所有最愛
    }
  }

  const cancelBooking = (bookingId) => {
    Swal.fire({
      title: '您確定要取消預訂嗎？',
      html: `<span class="p">取消後將無法恢復！</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認取消',
      cancelButtonText: '取消操作',
      customClass: {
        popup: `${styles['swal-popup-bo']}`,
        title: 'h6',
        icon: `${styles['swal-icon-bo']}`,
        confirmButton: `${styles['swal-btn-bo']}`,
        cancelButton: `${styles['swal-btn-cancel-bo']}`,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3005/api/user-booking/cancel/${bookingId}`, {
          method: 'PUT',
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 'success') {
              Swal.fire({
                title: '已取消！',
                html: `<span class="p">您的預訂已被取消，請前往信箱查看詳情。</span>`,
                icon: 'success',
                confirmButtonText: '確認',
                customClass: {
                  popup: `${styles['swal-popup-bo']}`,
                  title: 'h6',
                  icon: `${styles['swal-icon-bo']}`,
                  confirmButton: `${styles['swal-btn-bo']}`,
                  cancelButton: `${styles['swal-btn-cancel-bo']}`,
                },
              }).then(() => {
                // 更新預訂狀態並跳轉到已取消狀態
                setSelectedStatus('cancelled')
                setBooking((prevBookings) =>
                  prevBookings.filter((item) => item.id !== bookingId)
                )
              })
            } else {
              Swal.fire({
                title: '錯誤！',
                html: `<span class="p">${data.message}</span>`,
                icon: 'error',
                confirmButtonText: '確認',
                customClass: {
                  popup: `${styles['swal-popup-bo']}`,
                  title: 'h6',
                  icon: `${styles['swal-icon-bo']}`,
                  confirmButton: `${styles['swal-btn-bo']}`,
                  cancelButton: `${styles['swal-btn-cancel-bo']}`,
                },
              })
            }
          })
          .catch((error) => {
            console.error('Error updating booking:', error)
            Swal.fire({
              title: '錯誤！',
              html: `<span class="p">無法取消預訂。</span>`,
              icon: 'error',
              confirmButtonText: '確認',
              customClass: {
                popup: `${styles['swal-popup-bo']}`,
                title: 'h6',
                icon: `${styles['swal-icon-bo']}`,
                confirmButton: `${styles['swal-btn-bo']}`,
                cancelButton: `${styles['swal-btn-cancel-bo']}`,
              },
            })
          })
      }
    })
  }

  const LoadMore = () => {
    setVisibleCount((prevCount) => {
      const remainingItems = booking.length - prevCount
      const increment = 5
      return remainingItems > increment
        ? prevCount + increment
        : prevCount + remainingItems
    })
  }

  return (
    <>
      <div className={`${styles['user-booking-box-bo']}   w-100`}>
        <SearchBox
          searchQuery={searchQuery}
          onSearchChange={searchInputChange}
          onSearch={triggerSearch}
        />

        <div className={`${styles['booking-list-box-bo']} flex-column d-flex`}>
          <BookingStatusTabs
            selectedStatus={selectedStatus}
            changeStatus={changeStatus}
          />

          <div
            className={`${styles['booking-list-body-bo']} d-flex flex-column justify-content-center text-center`}
          >
            <SortOptions
              sortOptions={sortOptions}
              activeSortIndex={activeSortIndex}
              sortByIndex={sortByIndex}
            />

            <BookingTableHeader
              activeSortIndex={activeSortIndex}
              sortByIndex={sortByIndex}
            />

            <BookingList
              user={user}
              booking={booking}
              selectedStatus={selectedStatus}
              cancelBooking={cancelBooking}
            />
          </div>
        </div>
      </div>
    </>
  )
}
UserBooking.getLayout = function (page) {
  return <UserCenterLayout>{page}</UserCenterLayout>
}
