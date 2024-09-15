import React, { useEffect, useState, useContext } from 'react'

import styles from '@/styles/bearlong/orderDetail.module.scss'
import Image from 'next/image'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export default function OrderInfo({
  orderInfo = [{}],
  orderDetail = [{}],
  oid = '',
  handleCommentShow = () => {},
}) {
  let subtotal = 0

  const notifyAndReceipt = () => {
    Swal.fire({
      title: '確認收貨?',
      text: '確定商品品項及數量都正確!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b79347',
      cancelButtonColor: '#747474',
      confirmButtonText: '完成訂單',
      cancelButtonText: '取消',
      customClass: {
        popup: `h5`,
        title: `h4`,
        confirmButton: `p me-3`,
        cancelButton: `p`,
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleChangeStatus()
      }
    })
  }

  const handleChangeStatus = async () => {
    try {
      const url = `http://localhost:3005/api/order/${oid}`
      const response = await fetch(url, {
        method: 'PUT',
      })
      const result = await response.json()
      if (result.status === 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          customClass: {
            popup: `h6`,
            title: `h4`,
            content: `h1`,
          },
          title: `確認收貨!`,
          showConfirmButton: false,
          timer: 1500,
        })
        setTimeout(() => {
          handleCommentShow()
        }, 1500)
      }
    } catch (error) {
      console.log(error)
      toast.error(`收貨失敗，請洽客服人員`, {
        style: {
          border: '1px solid #d71515',
          padding: '20px',
          fontSize: '20px',
          color: '#d71515',
        },
        iconTheme: {
          primary: '#d71515',
          secondary: '#ffffff',
          fontSize: '20px',
        },
      })
    }
  }
  return (
    <>
      <div className={`${styles['orderInfo-bl']} d-flex`}>
        <div className={`${styles['leftArea-bl']}`}>
          <div className={`${styles['infoBox-bl']} mb-4`}>
            <div className={`${styles['infoTitle-bl']}`}>
              <h6>收件人資訊</h6>
            </div>
            <div className={`${styles['infoBody-bl']}`}>
              <div className={`${styles['receiver']} d-flex mb-4`}>
                <span className={`${styles['title']} p me-3`}>收件人</span>
                <p>{orderInfo.recipient}</p>
              </div>
              <div className={`${styles['address']} d-flex mb-4`}>
                <span className={`${styles['title']} p me-3`}>寄送</span>
                <p>
                  {orderInfo.delivery_method === '宅配' ||
                  orderInfo.delivery_method === '7-11店到店'
                    ? `${orderInfo.delivery_address.city} ${orderInfo.delivery_address.address}`
                    : '自取'}
                </p>
              </div>
              <div className={`${styles['receiverPhone']} d-flex mb-4`}>
                <span className={`${styles['title']} p me-3`}>收件人電話</span>
                <p>{orderInfo.phone}</p>
              </div>
            </div>
          </div>
          <div className={`${styles['infoBox-bl']}`}>
            <div className={`${styles['infoTitle-bl']}`}>
              <h6>訂單內容</h6>
            </div>
            <div className={`${styles['infoBody-bl']}`}>
              {orderDetail.map((v, i) => {
                subtotal += v.price * v.quantity
                return (
                  <div
                    key={i}
                    className={`${styles['orderItem-bl']} d-flex mb-5`}
                  >
                    <div className={`${styles['itemContent-bl']}`}>
                      <div className={`${styles['itemImg-bl']}`}>
                        <Image
                          src={`/images/${v.object_type}/${v.img}`}
                          width={200}
                          height={200}
                          alt=""
                          className={`${styles.img}`}
                        />
                      </div>
                      <div className={`${styles['itemTitle-bl']}  ms-3`}>
                        <p>{v.name}</p>
                      </div>
                    </div>
                    <div
                      className={`${styles['itemAmount-bl']}  d-flex justify-content-center align-items-center p-0`}
                    >
                      <p className={`${styles['amount']}`}>
                        x <span>{v.quantity}</span>
                      </p>
                    </div>
                    <div
                      className={`${styles['itemPrice-bl']} d-flex justify-content-end align-items-center p-0`}
                    >
                      <p>NT$ {v.price}</p>
                    </div>
                  </div>
                )
              })}

              <div className={`${styles['orderprice-bl']}`}>
                <div
                  className={`${styles['subtotal-price-box-bl']} d-flex justify-content-between justify-content-md-end align-items-center my-3`}
                >
                  <p>小計</p>
                  <div className={`${styles['num-bl']}`}>
                    <p>NT$ {subtotal}</p>
                  </div>
                </div>
                <div
                  className={`${styles['discount-price-box-bl']} d-flex justify-content-between justify-content-md-end align-items-center mb-3`}
                >
                  <p>折扣</p>
                  <div
                    className={`${styles['num-bl']} ${styles['discount-bl']}`}
                  >
                    <p>
                      {orderInfo.total === subtotal
                        ? ''
                        : `-NT$ ${
                            subtotal -
                            orderInfo.total +
                            (orderInfo.delivery_method === '宅配' ? 60 : 0)
                          }`}
                    </p>
                  </div>
                </div>
                <div
                  className={`${styles['delivery-price-box-bl']} d-flex justify-content-between justify-content-md-end align-items-center mb-3`}
                >
                  <p>運費</p>
                  <div className={`${styles['num-bl']}`}>
                    <p>NT$ {orderInfo.delivery_method === '宅配' ? 60 : 0}</p>
                  </div>
                </div>
                <div
                  className={`${styles['total-price-box-bl']} d-flex justify-content-between justify-content-md-end align-items-center`}
                >
                  <p>總計</p>
                  <div className={`${styles['num-bl']} ${styles['totle-bl']}`}>
                    <h6>NT$ {orderInfo.total}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles['rightArea-bl']} px-md-3`}>
          <div className={`${styles['infoBox-bl']} mb-4`}>
            <div className={`${styles['infoTitle-bl']}`}>
              <h6>付款資訊</h6>
            </div>
            <div className={`${styles['infoBody-bl']}`}>
              <div className={`${styles['payType-bl']} d-flex mb-4`}>
                <span className={`${styles['title']} p me-3`}>付款方式</span>
                <p>
                  {orderInfo.pay_method === 'credit'
                    ? '信用卡'
                    : orderInfo.pay_method}
                </p>
              </div>
              <div
                className={`${styles['cardNumber-bl']} d-flex justify-content-start align-items-center mb-4`}
              >
                <span className={`${styles['title']} p me-3`}>卡號末碼</span>
                <p>
                  {orderInfo.pay_info.creditNum4
                    ? orderInfo.pay_info.creditNum4
                    : ''}
                </p>
              </div>
              <div className={`${styles['payTime-bl']} d-flex mb-4`}>
                <span className={`${styles['title']} p me-3`}>交易時間</span>
                <p>{orderInfo.order_date}</p>
              </div>
            </div>
          </div>
          <div className={`${styles['infoBox-bl']} mb-4`}>
            <div className={`${styles['infoTitle-bl']}`}>
              <h6>訂單備註</h6>
            </div>
            <div className={`${styles['infoBody-bl']}`}>
              <div className={`${styles['payType-bl']} d-flex p`}>
                {orderInfo.remark}
              </div>
            </div>
          </div>
          <div
            className={`${styles['btnGroup-bl']} d-flex flex-column flex-lg-row justify-content-center align-items-center`}
          >
            <button
              className={`${styles['openFull-bl']} ${styles['btnOrder-bl']} ${styles['btnComment-bl']} me-0 me-lg-3 mb-lg-0 mb-3`}
              onClick={() => {
                if (orderInfo.status_now !== '已出貨') {
                  handleCommentShow()
                } else {
                  notifyAndReceipt()
                }
              }}
              disabled={orderInfo.status_now === '付款完成'}
            >
              {orderInfo.status_now === '已出貨' ||
              orderInfo.status_now === '付款完成'
                ? '確認收貨'
                : '商品評論'}
            </button>
            {/* <button
              className={`${styles['btnOrder-bl']} ${styles['btnRefund-bl']}`}
            >
              退貨退款
            </button> */}
          </div>
        </div>
      </div>
    </>
  )
}
