import React from 'react'
import styles from '@/styles/boyu/user-info.module.scss'

export default function UserBasicInfo({ userData }) {
  return (
    <div
      className={`${styles['default-information-box-bo']} col-12 col-lg-8 d-flex flex-column justify-content-center align-items-center`}
    >
      <div className={`${styles['default-information-title-bo']} h5`}>
        基本資訊
      </div>
      <div
        className={`${styles['default-information-form-bo']} justify-content-center align-items-center d-flex flex-column`}
      >
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>email</h6>
          <div
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
          >
            {userData.email}
          </div>
        </div>
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>帳號</h6>
          <div
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
          >
            {userData.account}
          </div>
        </div>
      </div>
    </div>
  )
}
