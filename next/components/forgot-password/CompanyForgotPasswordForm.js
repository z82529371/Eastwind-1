import React from 'react'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import styles from '@/styles/boyu/forgot.module.scss'

export default function CompanyForgotPasswordForm({ compFormRef }) {
  return (
    <div
      className={`${styles['company-forgot-box-bo']} justify-content-center align-items-center`}
      ref={compFormRef}
    >
      <form
        className={`${styles['company-forgot-form-bo']} d-flex flex-column gap-3 justify-content-center align-items-center`}
      >
        <div className={styles['form-group-bo']}>
          <div
            className={`${styles['email-box-bo']} d-flex justify-content-end align-items-start`}
          >
            <button className={`${styles['btn-get-CAPTCHA-bo']} btn`}>
              點擊驗證
            </button>
          </div>
          <input
            type="text"
            className={`h6 ${styles['form-input-bo']} ${styles['input-taxID-bo']}`}
            placeholder="統編"
          />
        </div>
        <div className={styles['form-group-bo']}>
          <input
            type="text"
            className={`h6 ${styles['form-input-bo']}`}
            placeholder="帳號"
          />
        </div>
        <div className={styles['form-group-bo']}>
          <input
            type="password"
            className={`h6 ${styles['form-input-bo']}`}
            placeholder="密碼"
          />
        </div>
      </form>

      <div
        className={`${styles['company-forgot-btn-box-bo']} d-flex justify-content-center align-items-center`}
      >
        <button
          className={`${styles['btn-company-forgot-bo']} btn h6 d-flex justify-content-between align-items-center`}
        >
          取消註冊
          <FaXmark />
        </button>
        <button
          className={`${styles['btn-company-forgot-bo']} btn h6 d-flex justify-content-between align-items=center`}
        >
          確定註冊
          <FaCheck />
        </button>
      </div>
    </div>
  )
}
