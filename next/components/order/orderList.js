import React, { useEffect, useState, useContext } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'
import styles from '@/styles/bearlong/orderList.module.scss'
import { FaCircle } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'

export default function OrderList() {
  const { user, loading } = useContext(AuthContext)
  const { handleAdd = () => {}, handleShow = () => {}, show } = useCart()
  const router = useRouter()
  let status_now = router.query.status_now
    ? router.query.status_now
    : '付款完成'
  const [status, setStatus] = useState('付款完成')
  const [orderInfo, setOrderInfo] = useState([
    {
      pay_method: '',
      status_now: '',
      order_date: '',
      total: 0,
      delivery_method: '',
      delivery_address: '{}',
      numerical_order: '',
      order_detail_count: 1,
      first_item_image: '005.webp',
    },
  ])
  const statusMapping = {
    付款完成: { displayText: '待出貨', color: 'var(--primary)' },
    已出貨: { displayText: '待收貨', color: 'var(--primary-dark)' },
    已完成: { displayText: '已完成', color: 'var(--background)' },
    已評論: { displayText: '已完成', color: 'var(--background)' },
    已取消: { displayText: '已取消', color: 'var(--text-hover-color)' },
    '退貨/款': { displayText: '退貨/款', color: 'var(--error-color)' },
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user) {
          const url = `http://localhost:3005/api/order?id=${user.id}&status_now=${status_now}`
          const response = await fetch(url)
          const result = await response.json()
          if (result.status === 'success') {
            const updatedOrderInfo = result.data.orderInfo.map((order) => {
              // 嘗試將 delivery_address 轉換為 JSON 對象
              order.delivery_address = JSON.parse(order.delivery_address)
              return order
            })
            setOrderInfo(updatedOrderInfo)
          } else {
            console.log(result.data.message)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (router.isReady && !loading) {
      if (user) {
        fetchUserInfo()
        setStatus(status_now)
      } else if (!user && loading === false) {
        alert('請先登入會員')
        router.push('/login')
      }
    }
  }, [router.isReady, user, router.query])

  return (
    <>
      <div className={styles['main']}>
        <div className={styles['menber-info-box-bo']}>
          <div className={styles['orderListTitle-bl']}>
            <ul className="d-flex justify-content-between align-items-center px-0 px-md-5">
              <button
                className={`h6   ${
                  status === '付款完成' ? styles['active'] : ''
                }`}
                onClick={() => {
                  router.push('/user/user-center/order?status_now=付款完成')
                }}
              >
                <li className={`h6`}>待出貨</li>
              </button>
              <button
                className={`h6  ${status === '已出貨' ? styles['active'] : ''}`}
                onClick={() => {
                  router.push('/user/user-center/order?status_now=已出貨')
                }}
              >
                <li className={`h6`}>待收貨</li>
              </button>
              <button
                className={`h6   ${
                  status === '已完成' || status === '已評論'
                    ? styles['active']
                    : ''
                }`}
                onClick={() => {
                  router.push('/user/user-center/order?status_now=已完成')
                }}
              >
                <li className={`h6`}>已完成</li>
              </button>
              <button
                className={`h6  ${status === '已取消' ? styles['active'] : ''}`}
                onClick={() => {
                  router.push('/user/user-center/order?status_now=已取消')
                }}
              >
                <li className={`h6 `}>已取消</li>
              </button>
              <button
                className={`h6   ${
                  status === '退貨/款' ? styles['active'] : ''
                }`}
                onClick={() => {
                  router.push('/user/user-center/order?status_now=退貨/款')
                }}
              >
                <li className={`h6`}>退貨/款</li>
              </button>
            </ul>
          </div>
          <div className={styles['orderList-bl']}>
            {orderInfo.length > 0 ? (
              orderInfo.map((v) => {
                const currentStatus = statusMapping[v.status_now] || {
                  displayText: '未知狀態',
                  color: 'var(--default-color)',
                }
                const objectIds = v.object_ids ? v.object_ids.split(',') : []
                const objectTypes = v.object_types
                  ? v.object_types.split(',')
                  : []
                const quantitys = v.quantitys ? v.quantitys.split(',') : []
                const prices = v.prices ? v.prices.split(',') : []

                const orderDetails = objectIds.map((id, index) => ({
                  id: Number(id),
                  object_type: objectTypes[index],
                  quantity: Number(quantitys[index]),
                  price: Number(prices[index]),
                }))
                return (
                  <div
                    key={v.numerical_order}
                    className={styles['orderCard-bl']}
                  >
                    <div className={styles['cardTitle-bl']}>
                      <p>
                        {v.order_date}{' '}
                        <span className="d-block d-lg-inline">
                          訂單編號: {v.numerical_order}
                        </span>
                      </p>
                    </div>
                    <div
                      className={`d-flex flex-column flex-md-row justify-content-between align-items-md-center ${styles['cardBody-bl']}`}
                    >
                      <div
                        className={`d-flex justify-content-between ${styles['orderInfo-bl']}`}
                      >
                        <div
                          className={`d-flex flex-column justify-content-around ${styles['imgGroup-bl']}`}
                        >
                          <div className={`${styles['imgBox']} me-3`}>
                            <Image
                              src={`/images/${v.object_type}/${v.first_item_image}`}
                              width={200}
                              height={200}
                              alt=""
                              className={`${styles.img}`}
                            />
                          </div>
                          <div
                            className={`${styles['imgBox']} me-3 d-none ${
                              v.order_detail_count <= 1 ? '' : 'd-md-grid'
                            } mt-4 h6`}
                          >
                            + {v.order_detail_count - 1}
                          </div>
                        </div>
                        <div
                          className={`${styles['orderContent-bl']} flex-grow-1 d-flex flex-column justify-content-around`}
                        >
                          <p>
                            狀態:
                            <span
                              className="ms-3 d-inline-flex justify-content-center align-items-center gap-1"
                              style={{ color: currentStatus.color }}
                            >
                              <FaCircle size={12} />
                              {currentStatus.displayText}
                            </span>
                          </p>
                          <p>
                            寄送:{' '}
                            {v.delivery_method === '宅配' ||
                            v.delivery_method === '7-11店到店'
                              ? v.delivery_address.city +
                                ' ' +
                                v.delivery_address.address
                              : '自取'}
                          </p>
                          <p>
                            付款方式:{' '}
                            {v.pay_method === 'credit'
                              ? '信用卡'
                              : v.pay_method}
                          </p>
                          <div className="d-flex d-md-inline justify-content-between align-items-center">
                            <p>總價: NT. {v.total}</p>
                            <span className="span d-inline d-md-none p">
                              {' '}
                              共 {v.order_detail_count} 樣商品
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${styles['btnGroup-bl']} d-flex flex-md-column justify-content-around justify-content-md-between`}
                      >
                        <button
                          type="button"
                          className={`${styles['orderBtn-bl']} d-md-grid p mb-0 mb-md-3`}
                          onClick={() => {
                            orderDetails.forEach((detail) => {
                              handleAdd(
                                detail,
                                detail.object_type,
                                detail.quantity
                              )
                            })
                            router.push('/checkout')
                          }}
                        >
                          再買一次
                        </button>
                        <Link
                          type="button"
                          className={`${styles['orderBtn-bl']} d-md-grid p`}
                          href={`/user/user-center/order/${v.numerical_order}`}
                        >
                          查看訂單細節
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="d-grid justify-content-center align-items-center mt-5 h6 text-center">
                <Image
                  src={`/cart.png`}
                  width={200}
                  height={200}
                  alt=""
                  className={`${styles.img} mb-5`}
                />
                您沒有 {statusMapping[status]?.displayText || '此狀態'} 的訂單
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
