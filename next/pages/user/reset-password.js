import React, { useState, useEffect, useRef } from 'react'
import styles from '@/styles/boyu/forgot.module.scss'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import UserResetPasswordForm from '@/components/reset-password/UserResetPasswordForm'
import CompanyResetPasswordForm from '@/components/reset-password/CompanyResetPasswordForm'
export default function ResetPassword() {
  const router = useRouter()

  // 定義狀態以管理表單輸入和錯誤訊息
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  useEffect(() => {
    // 在 component mount 時檢查 localStorage 中的 token，確保存在重設密碼的驗證資料
    const token = localStorage.getItem('resetPasswordToken')

    if (!token) {
      Swal.fire({
        title: '錯誤',
        html: `<span class="p">無法找到重設密碼的驗證資料，請重新驗證。</span>`,
        icon: 'error',
        customClass: {
          popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
          confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
        },
        confirmButtonText: '確認', // 修改按鈕文字
      }).then(() => {
        router.push('/user/forgot-password')
      })
    }
  }, [])

  // 重設密碼的函數
  const resetPassword = async (event) => {
    event.preventDefault()

    setPasswordError('')
    setConfirmPasswordError('')

    const token = localStorage.getItem('resetPasswordToken')
    const account = localStorage.getItem('resetAccount') // 讀取 account

    // 驗證輸入的新密碼是否符合要求
    if (!password) {
      setPasswordError('請輸入新密碼')
      return
    }

    const passwordPattern = /^(?=.*[A-Za-z]).{6,}$/

    if (!passwordPattern.test(password)) {
      setPasswordError('密碼需至少6碼，且包含一個英文字母')
      return
    }

    if (password === account) {
      setPasswordError('新密碼不能與帳號相同')
      return
    }

    if (!confirmPassword) {
      setConfirmPasswordError('請確認新密碼')
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('兩次輸入的密碼不一致')
      return
    }

    // 發送重設密碼請求
    try {
      const response = await fetch(
        'http://localhost:3005/api/forgot-password/reset-password',
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ token, password }),
        }
      )

      const result = await response.json()

      if (result.status === 'success') {
        Swal.fire({
          title: '密碼已重設成功！',
          html: `<span class="p">請使用新密碼登入。</span>`,
          icon: 'success',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        }).then(() => {
          // 清理 localStorage 中的 token
          localStorage.setItem('savedAccount', account) // 存儲 account 到 localStorage
          localStorage.removeItem('resetPasswordToken')
          router.push('/login')
        })
      } else {
        setPasswordError(result.message)
      }
    } catch (error) {
      setPasswordError('發生未知錯誤，請稍後再試')
    }
  }

  // 處理使用者重設密碼表單的交互效果
  const userBoxRef = useRef(null)
  const userFormRef = useRef(null)

  useEffect(() => {
    const userBox = userBoxRef.current
    const userForm = userFormRef.current
    if (userForm) {
      const userInputs = userForm.querySelectorAll('input')

      const toggleFormActive = (event) => {
        if (!userForm.contains(event.target)) {
          userForm.classList.toggle(styles.active)
        }
      }

      const deactivateForm = () => {
        if (!userForm.classList.contains(styles['form-focused'])) {
          userForm.classList.remove(styles.active)
        }
      }

      const focusInput = () => {
        userBox.classList.add(styles.hover)
        userForm.classList.add(styles['form-focused'])
      }

      const blurInput = () => {
        userForm.classList.remove(styles['form-focused'])
        if (!userForm.contains(document.activeElement)) {
          userBox.classList.remove(styles.hover)
        }
      }

      userBox.addEventListener('click', toggleFormActive)
      userBox.addEventListener('mouseleave', deactivateForm)

      userInputs.forEach((input) => {
        input.addEventListener('focus', focusInput)
        input.addEventListener('blur', blurInput)
      })

      return () => {
        userBox.removeEventListener('click', toggleFormActive)
        userBox.removeEventListener('mouseleave', deactivateForm)
        userInputs.forEach((input) => {
          input.removeEventListener('focus', focusInput)
          input.removeEventListener('blur', blurInput)
        })
      }
    }
  }, [])

  // 處理公司重設密碼表單的交互效果
  const compBoxRef = useRef(null)
  const compFormRef = useRef(null)

  useEffect(() => {
    const companyBox = compBoxRef.current
    const companyForm = compFormRef.current
    // const companyInputs = companyForm.querySelectorAll('input')

    if (companyForm) {
      const companyInputs = companyForm.querySelectorAll('input')
      const toggleFormActive = (event) => {
        if (!companyForm.contains(event.target)) {
          companyForm.classList.toggle(styles.active)
        }
      }

      const deactivateForm = () => {
        if (!companyForm.classList.contains(styles['form-focused'])) {
          companyForm.classList.remove(styles.active)
        }
      }

      const focusInput = () => {
        companyBox.classList.add(styles.hover)
        companyForm.classList.add(styles['form-focused'])
      }

      const blurInput = () => {
        companyForm.classList.remove(styles['form-focused'])
        if (!companyForm.contains(document.activeElement)) {
          companyBox.classList.remove(styles.hover)
        }
      }

      companyBox.addEventListener('click', toggleFormActive)
      companyBox.addEventListener('mouseleave', deactivateForm)

      companyInputs.forEach((input) => {
        input.addEventListener('focus', focusInput)
        input.addEventListener('blur', blurInput)
      })

      return () => {
        companyBox.removeEventListener('click', toggleFormActive)
        companyBox.removeEventListener('mouseleave', deactivateForm)
        companyInputs.forEach((input) => {
          input.removeEventListener('focus', focusInput)
          input.removeEventListener('blur', blurInput)
        })
      }
    }
  }, [])

  // 渲染重設密碼頁面
  return (
    <section
      className={`${styles['forgot-box-bo']} d-flex flex-column flex-md-row justify-content-center align-items-center`}
    >
      {/* 使用者重設密碼區域 */}
      <div
        className={`${styles['user-forgot-section-bo']} d-flex flex-column justify-content-center align-items-center`}
        ref={userBoxRef}
      >
        <div className={`${styles['user-forgot-title-bo']} d-flex`}>
          <h3>會</h3>
          <h3>員</h3>
          <h3>重</h3>
          <h3>設</h3>
          <h3>密</h3>
          <h3>碼</h3>
        </div>
        <UserResetPasswordForm
          password={password}
          confirmPassword={confirmPassword}
          passwordError={passwordError}
          confirmPasswordError={confirmPasswordError}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          resetPassword={resetPassword}
          userFormRef={userFormRef}
        />
      </div>

      {/* 公司重設密碼區域 */}
      <div
        className={`${styles['company-forgot-section-bo']} d-flex flex-column gap-5 justify-content-center align-items-center`}
        ref={compBoxRef}
      >
        <div className={`${styles['company-forgot-title-bo']} d-flex`}>
          <h3>企</h3>
          <h3>業</h3>
          <h3>重</h3>
          <h3>設</h3>
          <h3>密</h3>
          <h3>碼</h3>
        </div>
        <CompanyResetPasswordForm
          resetPassword={resetPassword}
          compFormRef={compFormRef}
        />
        {/* <div
          className={`${styles['company-forgot-box-bo']} justify-content-center align-items-center`}
          ref={compFormRef}
        >
          <form
            onSubmit={resetPassword}
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
                placeholder="新密碼"
              />
            </div>
            <div
              className={`${styles['company-forgot-btn-box-bo']} d-flex justify-content-center align-items-center`}
            >
              <Link
                href="/login"
                className={`${styles['btn-company-forgot-bo']} btn h6 d-flex justify-content-between align-items-center`}
              >
                取消重設
                <FaXmark />
              </Link>

              <button
                type="submit"
                className={`${styles['btn-company-forgot-bo']} btn h6 d-flex justify-content-between align-items=center`}
              >
                重設密碼
                <FaCheck />
              </button>
            </div>
          </form>
        </div> */}
      </div>
    </section>
  )
}
