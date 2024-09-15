import React from 'react'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import Link from 'next/link'
import styles from '@/styles/boyu/register.module.scss'

export default function RegisterForm({
  formData,
  onInputChange,
  emailError,
  accountError,
  passwordError,
  checkPasswordError,
  submitForm,
  SendEmail,
  userFormRef,
}) {
  return (
    <div
      className={`${styles['user-register-box-bo']} justify-content-center align-items-center`}
      ref={userFormRef}
    >
      <form
        onSubmit={submitForm}
        className={`${styles['user-register-form-bo']} d-flex flex-column justify-content-center align-items-center`}
      >
        <div className={styles['form-group-bo']}>
          <div
            className={`${styles['email-box-bo']} d-flex justify-content-end align-items-start`}
          >
            <button
              type="button"
              onClick={SendEmail}
              className={`${styles['btn-get-CAPTCHA-bo']} btn`}
            >
              點擊驗證
            </button>
          </div>
          <input
            name="email"
            type="email"
            className={`h6 ${styles['form-input-bo']} ${styles['input-email-bo']}`}
            placeholder="電子信箱"
            value={formData.email}
            onChange={onInputChange}
          />
          {emailError && (
            <div className={`p ${styles['text-error-bo']}`}>{emailError}</div>
          )}
        </div>
        <div className={styles['form-group-bo']}>
          <input
            name="account"
            type="text"
            className={`h6 ${styles['form-input-bo']}`}
            placeholder="帳號"
            value={formData.account}
            onChange={onInputChange}
          />
          {accountError && (
            <div className={`p ${styles['text-error-bo']}`}>{accountError}</div>
          )}
        </div>
        <div className={styles['form-group-bo']}>
          <input
            name="password"
            type="password"
            className={`h6 ${styles['form-input-bo']}`}
            placeholder="密碼"
            value={formData.password}
            onChange={onInputChange}
          />
          {passwordError && (
            <div className={`p ${styles['text-error-bo']}`}>
              {passwordError}
            </div>
          )}
        </div>
        <div className={styles['form-group-bo']}>
          <input
            name="checkPassword"
            type="password"
            className={`h6 ${styles['form-input-bo']}`}
            placeholder="確認密碼"
            value={formData.checkPassword}
            onChange={onInputChange}
          />
          {checkPasswordError && (
            <div className={`p ${styles['text-error-bo']}`}>
              {checkPasswordError}
            </div>
          )}
        </div>
      </form>

      <div
        className={`${styles['user-register-btn-box-bo']} d-flex justify-content-center align-items-center`}
      >
        <Link
          href="/login"
          className={`${styles['btn-user-register-bo']} btn h6 d-flex justify-content-between align-items-center`}
        >
          取消註冊
          <FaXmark />
        </Link>

        <button
          onClick={submitForm}
          type="submit"
          className={`${styles['btn-user-register-bo']} btn h6 d-flex justify-content-between align-items-center`}
        >
          確定註冊 <FaCheck />
        </button>
      </div>
    </div>
  )
}
