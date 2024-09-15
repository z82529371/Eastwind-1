import React from 'react'
import { FaXmark, FaCheck } from 'react-icons/fa6'
import Link from 'next/link'
import styles from '@/styles/boyu/forgot.module.scss'

export default function UserResetPasswordForm({
  password,
  confirmPassword,
  passwordError,
  confirmPasswordError,
  setPassword,
  setConfirmPassword,
  resetPassword,
  userFormRef,
}) {
  return (
    <div
      className={`${styles['user-forgot-box-bo']} justify-content-center align-items-center`}
      ref={userFormRef}
    >
      <form
        onSubmit={resetPassword}
        className={`${styles['user-forgot-form-bo']} d-flex flex-column justify-content-center align-items-center`}
      >
        <div className={styles['form-group-bo']}>
          <input
            type="password"
            className={`h6 ${styles['form-input-bo']} `}
            placeholder="新密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <div className={`p ${styles['text-error-bo']}`}>
              {passwordError}
            </div>
          )}
        </div>
        <div className={styles['form-group-bo']}>
          <input
            type="password"
            className={`h6 ${styles['form-input-bo']} }`}
            placeholder="確認密碼"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && (
            <div className={`p ${styles['text-error-bo']}`}>
              {confirmPasswordError}
            </div>
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
          onClick={resetPassword}
          type="submit"
          className={`${styles['btn-user-forgot-bo']} btn h6 d-flex justify-content-between align-items-center`}
        >
          重設密碼 <FaCheck />
        </button>
      </div>
    </div>
  )
}
