import React from 'react'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import Link from 'next/link'
import styles from '@/styles/boyu/forgot.module.scss'

export default function ForgotPasswordForm({
  email,
  account,
  emailError,
  accountError,
  setEmail,
  setAccount,
  sendResetEmail,
  userFormRef,
}) {
  return (
    <div
      className={`${styles['user-forgot-box-bo']} justify-content-center align-items-center`}
      ref={userFormRef}
    >
      <form
        onSubmit={sendResetEmail}
        className={`${styles['user-forgot-form-bo']} d-flex flex-column justify-content-center align-items-center`}
      >
        <div className={styles['form-group-bo']}>
          <input
            name="email"
            type="email"
            className={`h6 ${styles['form-input-bo']} ${styles['input-email-bo']}`}
            placeholder="電子信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          {accountError && (
            <div className={`p ${styles['text-error-bo']}`}>{accountError}</div>
          )}
        </div>
      </form>

      <div
        className={`${styles['user-forgot-btn-box-bo']} d-flex justify-content-center align-items-center`}
      >
        <Link
          href="/login"
          className={`${styles['btn-user-forgot-bo']} btn h6 d-flex justify-content-between align-items-center`}
        >
          取消重設
          <FaXmark />
        </Link>

        <button
          onClick={sendResetEmail}
          type="submit"
          className={`${styles['btn-user-forgot-bo']} btn h6 d-flex justify-content-between align-items-center`}
        >
          驗證信箱 <FaCheck />
        </button>
      </div>
    </div>
  )
}
