import React, { useState, useEffect, useRef } from 'react'
import styles from '@/styles/boyu/forgot.module.scss'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import ForgotPasswordForm from '@/components/forgot-password/ForgotPasswordForm'
import CompanyForgotPasswordForm from '@/components/forgot-password/CompanyForgotPasswordForm'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [account, setAccount] = useState('')
  const [emailError, setEmailError] = useState('')
  const [accountError, setAccountError] = useState('')

  // 發送重設密碼的驗證信函數
  const sendResetEmail = async (event) => {
    event.preventDefault()

    // 清除之前的錯誤訊息
    setAccountError('')
    setEmailError('')

    let hasError = false

    // 檢查帳號
    if (!account) {
      setAccountError('請輸入帳號')
      hasError = true
    }

    // 檢查電子信箱
    if (!email) {
      setEmailError('請輸入電子信箱')
      hasError = true
    }

    if (hasError) {
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3005/api/forgot-password/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ email, account }),
        }
      )

      const result = await response.json()

      if (result.status === 'success') {
        localStorage.setItem('resetAccount', account)
        localStorage.setItem('resetPasswordToken', result.token)
        Swal.fire({
          title: '重設密碼郵件已發送！',
          html: `<span class="p">請檢查您的電子信箱以完成密碼重設。</span>`,
          icon: 'success',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        }).then(() => {
          router.push('/login')
        })
      } else {
        if (result.message.includes('帳號')) {
          setAccountError(result.message)
        }

        if (
          result.message.includes('電子信箱') ||
          result.message.includes('匹配')
        ) {
          setEmailError(result.message)
        }
      }
    } catch (error) {
      setAccountError('發生未知錯誤，請稍後再試')
      setEmailError('發生未知錯誤，請稍後再試')
    }
  }

  // 處理使用者重設密碼表單的交互效果
  const userBoxRef = useRef(null)
  const userFormRef = useRef(null)

  useEffect(() => {
    const userBox = userBoxRef.current
    const userForm = userFormRef.current
    const userInputs = userForm.querySelectorAll('input')

    // 點擊表單外部時切換表單的 active 狀態
    const toggleFormActive = (event) => {
      if (!userForm.contains(event.target)) {
        userForm.classList.toggle(styles.active)
      }
    }

    // 當表單失去焦點時，移除 active 狀態
    const deactivateForm = () => {
      if (!userForm.classList.contains(styles['form-focused'])) {
        userForm.classList.remove(styles.active)
      }
    }

    // 當表單中的 input 獲得焦點時，設置表單為 focused 狀態
    const focusInput = () => {
      userBox.classList.add(styles.hover)
      userForm.classList.add(styles['form-focused'])
    }

    // 當表單中的 input 失去焦點時，移除 focused 狀態
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
  }, [])

  // 處理公司註冊表單的交互效果
  const compBoxRef = useRef(null)
  const compFormRef = useRef(null)

  useEffect(() => {
    const companyBox = compBoxRef.current
    const companyForm = compFormRef.current
    const companyInputs = companyForm.querySelectorAll('input')

    // 點擊表單外部時切換表單的 active 狀態
    const toggleFormActive = (event) => {
      if (!companyForm.contains(event.target)) {
        companyForm.classList.toggle(styles.active)
      }
    }

    // 當表單失去焦點時，移除 active 狀態
    const deactivateForm = () => {
      if (!companyForm.classList.contains(styles['form-focused'])) {
        companyForm.classList.remove(styles.active)
      }
    }

    // 當表單中的 input 獲得焦點時，設置表單為 focused 狀態
    const focusInput = () => {
      companyBox.classList.add(styles.hover)
      companyForm.classList.add(styles['form-focused'])
    }

    // 當表單中的 input 失去焦點時，移除 focused 狀態
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
  }, [])

  // 渲染表單頁面
  return (
    <section
      className={`${styles['forgot-box-bo']} d-flex flex-column flex-md-row justify-content-center align-items-center`}
    >
      {/* 使用者忘記密碼區域 */}
      <div
        className={`${styles['user-forgot-section-bo']} d-flex flex-column justify-content-center align-items-center`}
        ref={userBoxRef}
      >
        <div className={`${styles['user-forgot-title-bo']} d-flex`}>
          <h3>會</h3>
          <h3>員</h3>
          <h3>信</h3>
          <h3>箱</h3>
          <h3>驗</h3>
          <h3>證</h3>
        </div>
        <ForgotPasswordForm
          email={email}
          account={account}
          emailError={emailError}
          accountError={accountError}
          setEmail={setEmail}
          setAccount={setAccount}
          sendResetEmail={sendResetEmail}
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
          <h3>信</h3>
          <h3>箱</h3>
          <h3>驗</h3>
          <h3>證</h3>
        </div>
        <CompanyForgotPasswordForm compFormRef={compFormRef} />
      </div>
    </section>
  )
}
