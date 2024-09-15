import React from 'react'
import styles from '@/styles/boyu/user-info.module.scss'

export default function UserDetailInfo({ userData }) {
  const birthDate = userData.birth.replace(/-/g, ' / ')

  return (
    <div
      className={`${styles['detail-information-box-bo']} col-12 col-lg-8 d-flex flex-column justify-content-center align-items-center`}
    >
      <div className={`${styles['detail-information-title-bo']} h5`}>
        詳細資訊
      </div>
      <div
        className={`${styles['detail-information-form-bo']} justify-content-center align-items-center d-flex flex-column`}
      >
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>姓名</h6>
          <div
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
          >
            {userData.username}
          </div>
        </div>
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>性別</h6>
          <div
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
          >
            {userData.gender}
          </div>
        </div>
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>生日</h6>
          <div
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
          >
            {birthDate}
          </div>
        </div>
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>地址</h6>
          <div
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
          >
            {`${userData.city} ${userData.address}`}
          </div>
        </div>
        <div
          className={`${styles['info-col-bo']} d-flex justify-content-center flex-column flex-sm-row`}
        >
          <h6 className={`${styles['info-name-bo']} h6`}>手機</h6>
          <div
            className={`${styles['info-text-bo']} h6 d-flex align-items-center`}
          >
            {userData.phone}
          </div>
        </div>
      </div>
    </div>
  )
}
