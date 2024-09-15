import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import PartyNav from '../partypages/PartyNav'
import { setHours, setMinutes, addHours } from 'date-fns'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import styles from '@/styles/gw/_BookingRightArea.module.scss'

export default function BookingRightArea({ companyData, user }) {
  const router = useRouter()
  const [bookingData, setBookingData] = useState({
    date: new Date(),
    start_time: null,
    end_time: null,
    playroom_type: '',
    notes: '',
    rules: [],
    company_id: companyData.id,
    total_price: 0,
    user_id: '',
  })
  console.log(bookingData)

  const [rules, setRules] = useState([])
  const [errors, setErrors] = useState({})

  const [totalHours, setTotalHours] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/rules')
        if (!response.ok) {
          throw new Error('Failed to fetch rules')
        }
        const data = await response.json()
        setRules(data)
      } catch (error) {
        console.error('Error fetching rules:', error)
        setErrors((prev) => ({ ...prev, rules: 'Failed to load rules' }))
      }
    }
    fetchRules()
    const now = new Date()
    const minutes = now.getMinutes()
    const roundedMinutes = Math.ceil(minutes / 30) * 30
    const defaultStartTime = setMinutes(
      setHours(now, now.getHours()),
      roundedMinutes
    )

    const defaultEndTime = addHours(defaultStartTime, 2)

    setBookingData((prev) => ({
      ...prev,
      start_time: defaultStartTime,
      end_time: defaultEndTime,
    }))
  }, [])

  useEffect(() => {
    if (
      bookingData.start_time &&
      bookingData.end_time &&
      bookingData.playroom_type
    ) {
      const hours = calculateTotalHours(
        bookingData.start_time,
        bookingData.end_time
      )
      const calculatedTotalPrice = calculateTotalPrice(
        hours,
        bookingData.playroom_type
      )
      setTotalHours(hours)
      setTotalPrice(calculatedTotalPrice)

      // 更新 bookingData 中的 total_price
      setBookingData((prev) => ({
        ...prev,
        total_price: calculatedTotalPrice,
      }))
    }
  }, [bookingData.start_time, bookingData.end_time, bookingData.playroom_type])

  const calculateTotalHours = (start, end) => {
    const diffMs = end - start
    const diffHours = diffMs / (1000 * 60 * 60)
    return Math.max(0, Math.round(diffHours * 2) / 2) // 四舍五入到最近的 0.5 小时
  }

  const calculateTotalPrice = (hours, playroom_type) => {
    const hourlyRate =
      Number(playroom_type) === 0 ? companyData.lobby : companyData.vip
    console.log(hourlyRate)
    return hours * hourlyRate
  }
  const handleDateChange = (date) => {
    setBookingData({ ...bookingData, date })
  }
  const handleStartTimeChange = (time) => {
    const endTime = addHours(time, 2)
    setBookingData((prev) => ({ ...prev, start_time: time, end_time: endTime }))
  }
  const handleEndTimeChange = (time) => {
    setBookingData((prev) => ({ ...prev, end_time: time }))
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingData({ ...bookingData, [name]: value })
  }

  const handleRuleChange = (e) => {
    const { value, checked } = e.target
    setBookingData((prev) => ({
      ...prev,
      rules: checked
        ? [...prev.rules, value]
        : prev.rules.filter((rule) => rule !== value),
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if (bookingData.date < currentDate) {
      newErrors.date = '預訂日期不能在當前日期之前'
    }

    if (bookingData.start_time >= bookingData.end_time) {
      newErrors.time = '結束時間必須晚於開始時間'
    }

    if (!bookingData.playroom_type) {
      newErrors.playroom_type = '請選擇一個大廳'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    if (!user) {
      Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能進行預訂或揪團。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '前往登入',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.isConfirmed) {
          // 在這裡添加重定向到登入頁面的邏輯
          router.push('/login')
          // 例如：window.location.href = '/login'
          console.log('重定向到登入頁面')
        }
      })

      setErrors((prev) => ({ ...prev, submit: '請先登入後再進行預訂' }))
      return
    }
    if (validateForm()) {
      try {
        const bookingPayload = {
          // id 由数据库自动生成
          // table_id 由后端分配
          user_id: user.id,
          date: bookingData.date.toISOString().split('T')[0],
          start_time: bookingData.start_time.toTimeString().split(' ')[0],
          end_time: bookingData.end_time.toTimeString().split(' ')[0],
          status: 'booked', // 假设初始状态为 pending
          // created_at 由后端或数据库自动生成
          playroom_type: parseInt(bookingData.playroom_type),
          notes: bookingData.notes || '',
          total_price: totalPrice,
          company_id: companyData.id, // 添加公司 ID
          party_id: null,
        }

        const result = await Swal.fire({
          title: '確認預定',
          html: `
            <p>日期: ${bookingData.date.toLocaleDateString()}</p>
            <p>開始時間: ${bookingData.start_time.toLocaleTimeString()}</p>
            <p>結束時間: ${bookingData.end_time.toLocaleTimeString()}</p>
            <p>大廳類型: ${
              bookingData.playroom_type === '0' ? '大廳' : '包廂'
            }</p>
            <p>總價: $${totalPrice.toFixed(2)}</p>
          `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '確認預定',
          cancelButtonText: '取消',
        })
        if (result.isConfirmed) {
          const response = await fetch('http://localhost:3005/api/booking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingPayload),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to submit booking')
          }

          const bookingResult = await response.json()
          console.log('訂單已創建:', bookingResult)
          Swal.fire({
            title: '預定成功！',
            text: `您的桌號是: ${bookingResult.tableId}`,
            icon: 'success',
            confirmButtonText: '確定',
          }).then((result) => {
            if (result.isConfirmed) {
              // 跳轉到其他頁面，例如用戶的訂單頁面
              router.push('/user/user-center/booking')
            }
          })
        }
        // const response = await fetch('http://localhost:3005/api/booking', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(bookingPayload),
        // })

        // if (!response.ok) {
        //   const errorData = await response.json()
        //   throw new Error(errorData.error || 'Failed to submit booking')
        // }

        // const result = await response.json()
        // console.log('訂單已創建:', result)
        // alert(`預訂成功創建！您的桌號是: ${result.tableId}`)
      } catch (error) {
        console.error('創建訂單失敗:', error)
        Swal.fire({
          title: '錯誤',
          text: error.message || '提交訂單失敗，請稍後再試',
          icon: 'error',
          confirmButtonText: '確定',
        })
      }
    }
  }
  const handleSubmitParty = async (e) => {
    e.preventDefault()
    if (!user) {
      Swal.fire({
        title: '請先登入',
        text: '您需要先登入才能進行預訂或揪團。',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '前往登入',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.isConfirmed) {
          // 在這裡添加重定向到登入頁面的邏輯
          router.push('/login')
          // 例如：window.location.href = '/login'
          console.log('重定向到登入頁面')
        }
      })

      setErrors((prev) => ({ ...prev, submit: '請先登入後再進行預訂' }))
      return
    }
    if (validateForm()) {
      try {
        const formatTime = (date) => {
          return date ? date.toTimeString().split(' ')[0] : null
        }
        const partyData = {
          ...bookingData,
          user_id: user.id,
          date: bookingData.date.toISOString().split('T')[0], // 格式化日期
          start_time: formatTime(bookingData.start_time),
          end_time: formatTime(bookingData.end_time),
        }
        console.log('Submitting party data:', partyData)
        // 使用 Swal 顯示確認彈窗
        const result = await Swal.fire({
          title: '確認揪團',
          html: `
      <p>日期: ${bookingData.date.toLocaleDateString()}</p>
      <p>開始時間: ${formatTime(bookingData.start_time)}</p>
      <p>結束時間: ${formatTime(bookingData.end_time)}</p>
      <p>大廳類型: ${bookingData.playroom_type === '0' ? '大廳' : '包廂'}</p>
      <p>總價: $${totalPrice.toFixed(2)}</p>
    `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '確認揪團',
          cancelButtonText: '取消',
        })

        if (result.isConfirmed) {
          const response = await fetch('http://localhost:3005/api/hostParty', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(partyData),
          })
          if (!response.ok) {
            throw new Error('Failed to submit booking')
          }
          const partyResult = await response.json()
          console.log('派對已創建:', partyResult)

          // 顯示成功訊息並提供跳轉選項
          Swal.fire({
            title: '揪團成功！',
            text: `您的桌號是: ${partyResult.numerical_order}`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: '前往用戶資料',
            cancelButtonText: '查看派對詳情',
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // 跳轉到用戶資料頁面
              router.push('/user/user-center/party')
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // 跳轉到派對詳情頁面
              router.push(`/lobby/Party/${partyResult.id}`) // 假設派對詳情頁面的路由是 /party/:id
            }
          })
        }
      } catch (error) {
        console.error('創建派對失敗:', error)
        Swal.fire({
          title: '錯誤',
          text: error.message || '提交派對失敗，請稍後再試',
          icon: 'error',
          confirmButtonText: '確定',
        })
      }
    }
  }

  return (
    <div
      className={`${styles.bookingRightArea} ${styles.stickyBooking} col-lg-4 col-md-6 col-sm-12`}
    >
 
      <ul className="nav nav-tabs nav-fill " id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active p"
            id="booking-tab"
            data-bs-toggle="tab"
            data-bs-target="#booking-pane"
            type="button"
            role="tab"
            aria-controls="booking-pane"
            aria-selected="true"
          >
            訂桌
          </button>
        </li>

        <li className="nav-item" role="presentation">
          <button
            className="nav-link p"
            id="party-tab"
            data-bs-toggle="tab"
            data-bs-target="#party-pane"
            type="button"
            role="tab"
            aria-controls="party-pane"
            aria-selected="false"
          >
            揪團
          </button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="booking-pane"
          role="tabpanel"
          aria-labelledby="booking-tab"
          tabIndex="0"
        >
          <div className=" card border-0 border-start border-end border-bottom">
            <div className="card-body">
              <h5 className="card-title mb-4">{companyData.name}</h5>

              <form onSubmit={handleSubmitBooking}>
                <div className="d-flex mb-3">
                  <label htmlFor="datepicker" className="form-label me-3">
                    <h6>選擇日期</h6>
                  </label>
                  <DatePicker
                    id="datepicker"
                    selected={bookingData.date}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    className="form-control w-100"
                    minDate={new Date()}
                  />
                  {errors.date && (
                    <div className="text-danger">{errors.date}</div>
                  )}
                </div>

                <div className={`mb-3 ${styles.timeControl}`}>
                  <div className="d-flex">
                    <label htmlFor="start_time" className="form-label me-3">
                      <h6>開始時間</h6>
                    </label>
                    <DatePicker
                      selected={bookingData.start_time}
                      onChange={handleStartTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="form-control"
                      minTime={setHours(setMinutes(new Date(), 0), 0)}
                      maxTime={setHours(setMinutes(new Date(), 30), 23)}
                    />
                  </div>

                  <div className="d-flex">
                    <label htmlFor="end_time" className="form-label me-3">
                      <h6>結束時間</h6>
                    </label>
                    <DatePicker
                      selected={bookingData.end_time}
                      onChange={handleEndTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="form-control"
                      minTime={setHours(setMinutes(new Date(), 0), 0)}
                      maxTime={setHours(setMinutes(new Date(), 30), 23)}
                    />
                  </div>
                  {errors.time && (
                    <div className="text-danger">{errors.time}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="playroom_type" className="form-label">
                    <h5>大廳選擇</h5>
                  </label>
                  <select
                    id="playroom_type"
                    name="playroom_type"
                    className="form-select p"
                    value={bookingData.playroom_type}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                    required
                  >
                    <option value="">選擇大廳</option>
                    <option value="0">大廳</option>
                    <option value="1">包廂</option>
                  </select>
                  {errors.playroom_type && (
                    <div className="text-danger">{errors.playroom_type}</div>
                  )}
                </div>

                <div className="mb-3">
                  <h6>總時長: {totalHours} 小時</h6>
                  <h6>總價: ${totalPrice.toFixed(2)}</h6>
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary w-100 ${styles.customBtn}`}
                >
                  預訂
                </button>
                {errors.submit && (
                  <div className="text-danger mt-2">{errors.submit}</div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* <div
          className="tab-pane fade"
          id="party-pane"
          role="tabpanel"
          aria-labelledby="party-tab"
          tabIndex="0"
        > */}
        <div
          className="card tab-pane fade border-0 border-start border-end border-bottom"
          id="party-pane"
          role="tabpanel"
          aria-labelledby="party-tab"
          tabIndex="0"
        >
          <div className="card-body">
            <h5 className="card-title mb-4">{companyData.name}</h5>

            <form onSubmit={handleSubmitParty}>
              <div className="mb-3 ">
                <label htmlFor="datepicker" className="form-label  me-3">
                  <h6>選擇日期</h6>
                </label>
                <DatePicker
                  id="datepicker"
                  selected={bookingData.date}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  className="form-control w-100"
                  minDate={new Date()}
                />
                {errors.date && (
                  <div className="text-danger">{errors.date}</div>
                )}
              </div>

              <div className={`mb-3 ${styles.timeControl}`}>
                <div>
                  <label htmlFor="start_time" className="form-label me-3">
                    <h6>開始時間</h6>
                  </label>
                  <DatePicker
                    selected={bookingData.start_time}
                    onChange={handleStartTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="form-control"
                    minTime={setHours(setMinutes(new Date(), 0), 0)}
                    maxTime={setHours(setMinutes(new Date(), 30), 23)}
                  />
                </div>

                <div>
                  <label htmlFor="end_time" className="form-label me-3">
                    <h6>結束時間</h6>
                  </label>
                  <DatePicker
                    selected={bookingData.end_time}
                    onChange={handleEndTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="form-control"
                    minTime={setHours(setMinutes(new Date(), 0), 0)}
                    maxTime={setHours(setMinutes(new Date(), 30), 23)}
                  />
                </div>
                {errors.time && (
                  <div className="text-danger">{errors.time}</div>
                )}
              </div>
              <div className="mb-3">
                <h5>規則選擇</h5>
                {rules.map((rule) => (
                  <div key={rule.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={rule.id}
                      value={rule.id}
                      checked={bookingData.rules.includes(rule.id.toString())}
                      onChange={handleRuleChange}
                    />
                    <label className="form-check-label p" htmlFor={rule.id}>
                      {rule.name}
                    </label>
                  </div>
                ))}
                {errors.rules && (
                  <div className="text-danger">{errors.rules}</div>
                )}
              </div>
              <div className={`${styles['gw-bb']} mb-3`}>
                <label htmlFor="playroom_type" className="form-label">
                  <h5>大廳選擇</h5>
                </label>
                <select
                  id="playroom_type"
                  name="playroom_type"
                  className="form-select p"
                  value={bookingData.playroom_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">選擇大廳</option>
                  <option value="0">大廳</option>
                  <option value="1">包廂</option>
                </select>
                {errors.playroom_type && (
                  <div className="text-danger">{errors.playroom_type}</div>
                )}
              </div>

              <div className="mb-3">
                <h6>總時長: {totalHours} 小時</h6>
                <h6>總價: ${totalPrice.toFixed(2)}</h6>
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-100 ${styles.customBtn}`}
              >
                預訂
              </button>
              {errors.submit && (
                <div className="text-danger mt-2">{errors.submit}</div>
              )}
            </form>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}
