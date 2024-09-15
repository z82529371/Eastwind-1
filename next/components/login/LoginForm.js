import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import Link from 'next/link'
import styles from '@/styles/boyu/login.module.scss'
import FastLogin from '@/components/login/FastLogin'

export default function LoginForm({
  account,
  setAccount,
  password,
  setPassword,
  accountError,
  passwordError,
  onLogin,
  onGoogleLoginSuccess,
  goLineLogin,
  isHovered,
  setIsHovered,
  isLineHovered,
  setIsLineHovered,
  userFormRef,
}) {
  return (
    <form
      className={`${styles['user-login-box-bo']} justify-content-center align-items-center`}
      ref={userFormRef}
    >
      <div
        className={`${styles['user-login-form-bo']} d-flex flex-column justify-content-center align-items-center`}
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
        className={`${styles['user-login-option-bo']} d-flex justify-content-center align-items-center h6 `}
      >
        <ul className="d-flex gap-3  justify-content-center align-items-center">
          <li>
            <Link href="/user/forgot-password">忘記密碼</Link>
          </li>
          <li>|</li>
          <li>
            <Link href="/user/register">立即註冊</Link>
          </li>
        </ul>
      </div>
      <div
        className={`${styles['user-login-btn-bo']} d-flex justify-content-center align-items-center mb-4`}
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

      {/* 嵌入 FastLogin 組件 */}
      <FastLogin
        onGoogleLoginSuccess={onGoogleLoginSuccess}
        goLineLogin={goLineLogin}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        isLineHovered={isLineHovered}
        setIsLineHovered={setIsLineHovered}
      />
    </form>
  )
}
