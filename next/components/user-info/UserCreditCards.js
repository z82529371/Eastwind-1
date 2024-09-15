import React from 'react'
import styles from '@/styles/boyu/user-info.module.scss'
import { HiCreditCard } from 'react-icons/hi2'
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa6'

export default function UserCreditCards({ cards }) {
  return (
    <div
      className={`${styles['detail-card-box-bo']}  col-12 col-lg-4 d-flex flex-column justify-content-start align-items-center`}
    >
      <div className={`${styles['detail-card-title-bo']} h5`}>信用卡</div>
      <div
        className={`${styles['detail-card-list-bo']} d-flex flex-column  gap-4 gap-md-5 gap-lg-4`}
      >
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div
              key={index}
              className={`${styles['card-col-bo']} d-flex justify-content-center align-items-center`}
            >
              <div
                className={`${styles['card-body-bo']} d-flex justify-content-between align-items-center`}
              >
                <div className={styles['icon-card-box-bo']}>
                  <HiCreditCard className={`${styles['icon-card-bo']}`} />
                </div>
                <div className={styles['card-text-box-bo']}>
                  <div
                    className={`${styles['card-text-up-bo']} d-flex align-items-center`}
                  >
                    <p>{card.card_name}</p>
                  </div>
                  <div
                    className={`${styles['card-text-down-bo']} d-flex justify-content-center align-items-center gap-1`}
                  >
                    <div
                      className={` d-flex justify-content-center align-items-center gap-1`}
                    >
                      <p className={`text-center`}>**** ****</p>
                      <p className={`text-center`}>
                        **** {card.card_number.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles['icon-card-date-bo']} d-flex flex-column justify-content-center align-items-center`}
                >
                  <p className={styles['card-type-bo']}>
                    {card.card_type === 'Visa' && (
                      <FaCcVisa className={`${styles['icon-card-bo']}`} />
                    )}
                    {card.card_type === 'MasterCard' && (
                      <FaCcMastercard className={`${styles['icon-card-bo']}`} />
                    )}
                    {/* 如果不是 Visa 或 MasterCard，顯示默認圖標 */}
                    {!['Visa', 'MasterCard'].includes(card.card_type) && (
                      <HiCreditCard className={`${styles['icon-card-bo']}`} />
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>尚未新增信用卡</p>
        )}
      </div>
    </div>
  )
}
