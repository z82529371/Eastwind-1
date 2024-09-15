import React, { useState, useEffect, useContext } from 'react'
import AdminCenterLayout from '@/components/layout/admin-layout'
import styles from '@/styles/bearlong/arrival.module.scss'
import { FaSort, FaMagnifyingGlass } from 'react-icons/fa6'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { AuthContext } from '@/context/AuthContext'

export default function Arrival() {
  const router = useRouter()
  const { user, loading } = useContext(AuthContext)
  const { search, date, delivery_method } = router.query
  const [data, setData] = useState([{}])
  const [sort, setSort] = useState('order_date')
  const [dates, setDates] = useState([])
  const [searchBox, setSearchBox] = useState('')
  const [filteredData, setFilteredData] = useState([
    {
      id: 0,
      numerical_order: '',
      delivery_method: '',
      order_date: '',
      recipient: '',
    },
  ])
  const [check, setCheck] = useState([])

  const getData = async () => {
    try {
      const url = `http://localhost:3005/api/arrival`
      const response = await fetch(url)
      const result = await response.json()
      if (result.status === 'success') {
        const { arrival } = result.data
        setData(arrival)
        const dates = [...new Set(arrival.map((item) => item.order_date))]
        setDates(dates)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSort = (field) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return sort === field ? -1 : 1
      if (a[field] > b[field]) return sort === field ? 1 : -1
      return 0
    })
    setFilteredData(sortedData)
    setSort(sort === field ? '' : field)
  }

  const handleCheck = (v) => {
    setCheck((prevCheck) => {
      if (prevCheck.includes(v)) {
        return prevCheck.filter((item) => item !== v)
      } else {
        return [...prevCheck, v]
      }
    })
  }

  const handleSumbit = async () => {
    try {
      const url = 'http://localhost:3005/api/arrival'
      const body = JSON.stringify({
        order_ids: check,
      })
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      })
      const result = await response.json()
      if (result.status === 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '訂單已出貨!',
          customClass: {
            popup: `h6`,
            title: `h4`,
            content: `h1`,
          },
          showConfirmButton: false,
          timer: 1500,
        })
        setCheck([])
        const { arrival } = result.data
        setData(arrival)
        const dates = [...new Set(arrival.map((item) => item.order_date))]
        setDates(dates)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const notifyAndNoCheck = () => {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: '未選擇出貨訂單',
      customClass: {
        popup: `h6`,
        title: `h4`,
        content: `h1`,
      },
      showConfirmButton: false,
      timer: 1500,
    })
  }

  const notifyAndChange = (info) => {
    Swal.fire({
      title: '確認出貨?',
      html: `<pre>${info}</pre>`,
      icon: 'warning',
      showCancelButton: true,
      customClass: {
        popup: `h6`,
        title: `h4`,
        content: `h1`,
        confirmButton: `p me-2`,
        cancelButton: `p `,
      },
      confirmButtonColor: '#b79347',
      cancelButtonColor: '#d33',
      confirmButtonText: '確認送出',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSumbit()
      }
    })
  }

  useEffect(() => {
    if (router.isReady && !loading) {
      if (user) {
        if (user.id !== 62 || (!user && loading === false)) {
          alert('請由正常管道進入')
          router.push('/home')
        }
      } else {
        router.push('/home')
      }
    }
  }, [router.isReady, user])
  useEffect(() => {
    let filtered = data

    if (search) {
      const lowerCaseSearch = search.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.recipient.toLowerCase().includes(lowerCaseSearch) ||
          item.numerical_order
            .toString()
            .toLowerCase()
            .includes(lowerCaseSearch)
      )
    }

    if (date) {
      filtered = filtered.filter((item) => item.order_date === date)
    }

    if (delivery_method) {
      filtered = filtered.filter(
        (item) => item.delivery_method === delivery_method
      )
    }

    setFilteredData(filtered)
  }, [search, date, delivery_method, data])

  useEffect(() => {
    getData()
  }, [])
  return (
    <>
      <div className={styles['main']}>
        <div className={styles['menber-info-box-bo']}>
          <div className="d-flex justify-content-between">
            <h5 className="">待出貨列表</h5>
            <button
              className={`btn btn-primary mb-3 p ${styles.btn}`}
              onClick={() => {
                let templete = ''
                const numericalOrders = data
                  .filter((item) => check.includes(item.id))
                  .map((item) => item.numerical_order)
                templete = numericalOrders.join('\n')
                if (templete.length > 0) {
                  notifyAndChange(templete)
                } else {
                  notifyAndNoCheck()
                }
              }}
            >
              送出
            </button>
          </div>
          <div className="d-flex">
            <div className="input-group mb-3 me-2">
              <input
                type="text"
                className="form-control"
                value={searchBox}
                onChange={(e) => {
                  setSearchBox(e.target.value)
                }}
              />
              <button
                className={`input-group-text p ${styles.search}`}
                id="inputGroup-sizing-default"
                onClick={(e) => {
                  router.push(
                    '/admin/arrival?search=' +
                      searchBox +
                      (date ? `&date=${date}` : '') +
                      (delivery_method
                        ? `&delivery_method=${delivery_method}`
                        : '')
                  )
                  setSearchBox('')
                }}
              >
                <FaMagnifyingGlass />
              </button>
            </div>
            <select
              className="form-select mb-3 p me-2"
              onChange={(e) => {
                router.push(
                  '/admin/arrival?delivery_method=' +
                    e.target.value +
                    (date ? `&date=${date}` : '')
                )
              }}
              value={delivery_method || ''}
            >
              <option value="">全部</option>
              <option value="宅配">宅配</option>
              <option value="自取">自取</option>
              <option value="7-11店到店">7-11店到店</option>
            </select>
            <select
              value={date || ''}
              className="form-select mb-3 p"
              onChange={(e) => {
                router.push(
                  '/admin/arrival?date=' +
                    e.target.value +
                    (delivery_method
                      ? `&delivery_method=${delivery_method}`
                      : '')
                )
              }}
            >
              <option value="">全部</option>
              {dates.map((v, i) => {
                return (
                  <option key={i} value={v}>
                    {v}
                  </option>
                )
              })}
            </select>
          </div>

          <table
            className={`${styles['table-bl']} table  table-striped table-bordered p `}
          >
            <thead className=" h6">
              <tr>
                <th>流水編號</th>
                <th className="text-center">
                  收件人{' '}
                  <button
                    className={styles.sort}
                    onClick={() => {
                      handleSort('recipient')
                    }}
                  >
                    <FaSort />
                  </button>
                </th>
                <th className="text-center">
                  出貨方式{' '}
                  <button
                    className={styles.sort}
                    onClick={() => {
                      handleSort('delivery_method')
                    }}
                  >
                    <FaSort />
                  </button>
                </th>
                <th className="text-center">
                  訂單日期{' '}
                  <button
                    className={styles.sort}
                    onClick={() => {
                      handleSort('order_date')
                    }}
                  >
                    <FaSort />
                  </button>
                </th>
                <th className="text-center">出貨</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((v, i) => {
                return (
                  <tr key={i}>
                    <td>{v.numerical_order}</td>
                    <td className="text-center">{v.recipient}</td>
                    <td className="text-center">{v.delivery_method}</td>
                    <td className="text-center">{v.order_date}</td>
                    <td className="text-center">
                      <label htmlFor={`arrival${v.id}`}>
                        <input
                          name="arrival"
                          id={`arrival${v.id}`}
                          type="checkbox"
                          value={v.id}
                          checked={check.includes(v.id)}
                          onChange={() => handleCheck(v.id)}
                        />
                        確認出貨
                      </label>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

Arrival.getLayout = function (page) {
  return <AdminCenterLayout>{page}</AdminCenterLayout>
}
