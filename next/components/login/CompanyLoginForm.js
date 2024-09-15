import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import styles from '@/styles/boyu/login.module.scss'

export default function CompanyLoginForm({
  account,
  setAccount,
  password,
  setPassword,
  accountError,
  passwordError,
  onLogin,
  compFormRef,
}) {
  return (
    <div
      className={`${styles['company-login-box-bo']} justify-content-center align-items-center`}
      ref={compFormRef}
    >
      <div
        className={`${styles['company-login-form-bo']} d-flex flex-column gap-3 justify-content-center align-items-center`}
      >
        <div className={styles['form-group-bo']}>
          <input
            name="account"
            type="text"
            className={`h6 ${styles['form-input-bo']}`}
            placeholder="帳號"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <div className={`p ${styles['text-error-bo']}`}>
              {passwordError}
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles['company-login-option-bo']} d-flex justify-content-center align-items-center h6`}
      >
        <ul className="d-flex gap-3">
          <li>
            <a href="">忘記密碼</a>
          </li>
          <li>|</li>
          <li>
            <a href="">立即註冊</a>
          </li>
        </ul>
      </div>
      <div
        className={`${styles['company-login-btn-bo']} d-flex justify-content-center align-items-center`}
      >
        <button
          type="button"
          className={`${styles['btn-user-login-bo']}  btn h6 d-flex justify-content-between align-items-center`}
          onClick={onLogin}
        >
          登入
          <FaCheck />
        </button>
      </div>
    </div>
  )
}
