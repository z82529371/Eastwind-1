import React, { useEffect, useState, useContext } from 'react'
import styles from '@/styles/bearlong/orderDetail.module.scss'
import { FaCheck, FaArrowRightLong } from 'react-icons/fa6'

export default function OrderStatus({ status = [] }) {
  const getStatusUpdateAt = (statuses, targetStatus) => {
    const statusObj = statuses.find((status) => status.status === targetStatus)
    return statusObj ? statusObj.update_at : null
  }
  const [paymentStatus, setPaymentStatus] = useState(
    getStatusUpdateAt(status, '付款完成')
  )
  const [shipmentStatus, setShipmentStatus] = useState(
    getStatusUpdateAt(status, '已出貨')
  )
  const [completionStatus, setCompletionStatus] = useState(
    getStatusUpdateAt(status, '已完成')
  )
  const [reviewStatus, setReviewStatus] = useState(
    getStatusUpdateAt(status, '已評論')
  )

  const lastStatus = status.length > 0 ? status[status.length - 1].status : null

  console.log(lastStatus)

  useEffect(() => {
    setPaymentStatus(getStatusUpdateAt(status, '付款完成'))
    setShipmentStatus(getStatusUpdateAt(status, '已出貨'))
    setCompletionStatus(getStatusUpdateAt(status, '已完成'))
    setReviewStatus(getStatusUpdateAt(status, '已評論'))
  }, [status])
  return (
    <>
      <div
        className={`${styles['status-bl']} d-flex justify-content-between align-items-start`}
      >
        <div
          className={`${styles['statusBox-bl']} text-center d-md-flex flex-column justify-content-between align-items-center d-none`}
        >
          <div
            className={`${
              styles['checkStatus-bl']
            } d-flex justify-content-center align-items-center ${
              paymentStatus ? styles.active : ''
            }`}
          >
            <FaCheck className={`p ${paymentStatus ? '' : 'd-none'}`} />
          </div>
          <p>{paymentStatus ? '訂單成立' : '尚未付款'}</p>
          {paymentStatus ? paymentStatus : ''}
        </div>
        <div
          className={`${styles['statusBox-bl']} text-center d-md-flex flex-column justify-content-between align-items-center d-none`}
        >
          <div
            className={`${
              styles['checkStatus-bl']
            } d-flex justify-content-center align-items-center ${
              shipmentStatus ? styles.active : ''
            }`}
          >
            <FaCheck className={`p ${shipmentStatus ? '' : 'd-none'}`} />
          </div>
          <p>{shipmentStatus ? '已出貨' : '待出貨'}</p>
          {shipmentStatus ? shipmentStatus : ''}
        </div>
        <div
          className={`${styles['statusBox-bl']} text-center d-md-flex d-none flex-column justify-content-between align-items-center`}
        >
          <div
            className={`${
              styles['checkStatus-bl']
            } d-flex justify-content-center align-items-center ${
              completionStatus ? styles.active : ''
            }`}
          >
            <FaCheck className={`p ${completionStatus ? '' : 'd-none'}`} />
          </div>
          <p>{completionStatus ? '訂單完成' : '待收貨'}</p>
          {completionStatus ? completionStatus : ''}
        </div>
        <div
          className={`${styles['statusBox-bl']} text-center  flex-column justify-content-between align-items-center d-md-flex d-none`}
        >
          <div
            className={`${
              styles['checkStatus-bl']
            } d-flex justify-content-center align-items-center ${
              reviewStatus ? styles.active : ''
            }`}
          >
            <FaCheck className={`p ${reviewStatus ? '' : 'd-none'}`} />
          </div>
          <p>{reviewStatus ? '評論完成' : '尚未評論'}</p>
          {reviewStatus ? reviewStatus : ''}
        </div>
        <div
          className={`${styles['statusBox-bl']} text-center d-flex d-md-none flex-column justify-content-between align-items-center`}
        >
          <div
            className={`${styles['checkStatus-bl']} d-flex justify-content-center align-items-center ${styles.active}`}
          >
            <FaCheck className={`p ${paymentStatus ? '' : 'd-none'}`} />
          </div>
          <p>
            {lastStatus === '已評論'
              ? '訂單完成'
              : lastStatus === '已完成'
              ? '訂單完成'
              : lastStatus === '已出貨'
              ? '已出貨'
              : lastStatus === '付款完成'
              ? '訂單成立'
              : '尚未付款'}
          </p>
          {lastStatus === '已評論'
            ? completionStatus
            : getStatusUpdateAt(status, lastStatus)}
        </div>
        <div
          className={`${styles['statusBox-bl']} text-center d-flex d-md-none flex-column justify-content-between align-items-center`}
        >
          <div
            className={`${
              styles['checkStatus-bl']
            } d-flex justify-content-center align-items-center ${
              lastStatus === '已評論' ? styles.active : ''
            }`}
          >
            <FaCheck
              className={`p ${lastStatus === '已評論' ? '' : 'd-none'}`}
            />
          </div>
          <p>
            {' '}
            {lastStatus === '已評論'
              ? '評論完成'
              : lastStatus === '已完成'
              ? '尚未評論'
              : lastStatus === '已出貨'
              ? '待收貨'
              : lastStatus === '付款完成'
              ? '待出貨'
              : '尚未付款'}
          </p>
          {lastStatus === '已評論' ? getStatusUpdateAt(status, lastStatus) : ''}
        </div>
        <div className={`${styles['line']} d-none d-md-block`} />
        <div className={`${styles['arrow']} d-grid d-md-none`}>
          <FaArrowRightLong className="h3" />
        </div>
      </div>
    </>
  )
}
