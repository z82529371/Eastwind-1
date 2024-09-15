import React, { useState, useEffect, useRef } from 'react'
import styles from '@/styles/boyu/register.module.scss'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import RegisterForm from '@/components/regitster/RegisterForm'
import CompanyRegisterForm from '@/components/regitster/CompanyRegisterForm'

export default function Register() {
  const router = useRouter()

  // 狀態管理：電子信箱是否已驗證、各種錯誤訊息、表單數據
  const [emailVerified, setEmailVerified] = useState(false) // 判斷電子信箱是否已驗證
  const [emailError, setEmailError] = useState('') // 存放電子信箱的錯誤訊息
  const [accountError, setAccountError] = useState('') // 存放帳號的錯誤訊息
  const [passwordError, setPasswordError] = useState('') // 存放密碼的錯誤訊息
  const [checkPasswordError, setCheckPasswordError] = useState('') // 新增確認密碼的錯誤訊息
  const [generalError, setGeneralError] = useState('') // 存放一般錯誤訊息

  // 表單數據狀態
  const [formData, setFormData] = useState({
    email: '',
    account: '',
    password: '',
    checkPassword: '', // 使用 checkPassword 替代確認密碼欄位
  })

  // 處理表單輸入變更
  const onInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const checkUniqueValues = async () => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/register/check-unique',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            account: formData.account,
          }),
        }
      )

      const result = await response.json()

      if (result.emailExists) {
        setEmailError('電子信箱已被註冊')
      }

      if (result.accountExists) {
        setAccountError('帳號已被註冊')
      }

      return result.emailExists || result.accountExists
    } catch (error) {
      setGeneralError('伺服器錯誤，請稍後再試')
      return true // 在錯誤情況下假設有錯，防止錯誤情況下繼續註冊
    }
  }

  const validateCreds = () => {
    const accountRegex = /^(?=.*[a-zA-Z]).{6,}$/
    const passwordRegex = /^(?=.*[a-zA-Z]).{6,}$/

    if (!accountRegex.test(formData.account)) {
      setAccountError('帳號應至少6碼，且需包含至少一個英文字')
      return false
    }

    if (!passwordRegex.test(formData.password)) {
      setPasswordError('密碼應至少6碼，且需包含至少一個英文字')
      return false
    }

    if (formData.account === formData.password) {
      setAccountError('帳號和密碼不可相同')
      return false
    }

    return true
  }

  // 提交註冊表單的邏輯
  const submitForm = async (event) => {
    event.preventDefault()

    if (!emailVerified) {
      setEmailError('請先驗證電子信箱')
      return
    }

    // 清除之前的錯誤訊息
    setEmailError('')
    setAccountError('')
    setPasswordError('')
    setCheckPasswordError('')
    setGeneralError('')

    // 驗證確認密碼是否一致
    if (formData.password !== formData.checkPassword) {
      setCheckPasswordError('密碼和確認密碼不一致')
      return
    }

    // 驗證帳號和密碼格式
    if (!validateCreds()) {
      return
    }

    // 檢查唯一性
    const isUnique = await checkUniqueValues()

    if (isUnique) {
      return // 如果帳號或電子信箱已存在，直接返回，阻止提交
    }

    // 發送註冊請求
    try {
      const response = await fetch(
        'http://localhost:3005/api/register/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      const result = await response.json()

      if (result.status === 'success') {
        console.log('保存前的 formData:', formData)

        // 先保存帳號和密碼到 localStorage
        localStorage.setItem('registeredAccount', formData.account)
        localStorage.setItem('registeredPassword', formData.password)

        // 然後顯示成功提示框
        Swal.fire({
          title: '註冊成功！',
          html: `<span class="p">歡迎加入！</span>`,
          icon: 'success',
          customClass: {
            popup: `${styles['swal-popup-bo']}`,
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`,
            confirmButton: `${styles['swal-btn-bo']}`,
          },
          confirmButtonText: '確認',
        }).then(() => {
          console.log('localStorage 設置完成', {
            account: localStorage.getItem('registeredAccount'),
            password: localStorage.getItem('registeredPassword'),
          })

          // 清除 sessionStorage 中的 verifiedEmail 和 emailVerifiedStorage
          sessionStorage.removeItem('verifiedEmail')
          sessionStorage.removeItem('emailVerified')
          router.push('/login')
        })
      } else {
        setEmailError(result.errors?.email || '')
        setAccountError(result.errors?.account || '')
        setPasswordError(result.errors?.password || '')
        setGeneralError(result.message || '發生錯誤，請稍後再試')
      }
    } catch (error) {
      setGeneralError('發生未知錯誤，請稍後再試')
    }
  }

  // 發送驗證信的邏輯
  const SendEmail = async () => {
    // 電子信箱格式的正則表達式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(formData.email)) {
      setEmailError('請提供有效的電子信箱')
      return
    }

    if (!formData.email) {
      setEmailError('電子信箱不可為空')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3005/api/register/send-verification',
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        }
      )

      const result = await response.json()

      if (result.status === 'success') {
        // 顯示驗證信發送成功的 SweetAlert
        Swal.fire({
          title: '驗證信已發送',
          html: `<span class="p">請檢查您的電子信箱以完成驗證！</span>`,
          icon: 'success',
          customClass: {
            popup: `${styles['swal-popup-bo']}`, // 自訂整個彈出視窗的 class
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`, // 添加自定義 class
            confirmButton: `${styles['swal-btn-bo']}`, // 添加自定義按鈕 class
          },
          confirmButtonText: '確認', // 修改按鈕文字
        })
        router.push('/login') // 跳轉到優惠券頁面
      } else {
        setEmailError(result.message)
      }
    } catch (error) {
      setGeneralError('無法連接伺服器，請稍後再試')
    }
  }

  // 初始化時檢查 sessionStorage 是否有已驗證的 email
  useEffect(() => {
    const { email, status, error } = router.query

    if (status === 'success' && email) {
      sessionStorage.setItem('emailVerified', 'true')
      sessionStorage.setItem('verifiedEmail', email)

      // 清理 URL 中的參數
      router.replace('/user/register', undefined, { shallow: true })
    } else if (error) {
      // 顯示錯誤訊息
      console.error('Verification Error:', error)
    }
  }, [router.query])

  // 當路由準備好時，從 sessionStorage 中檢查是否有已驗證的電子信箱
  useEffect(() => {
    if (router.isReady) {
      const verifiedEmail = sessionStorage.getItem('verifiedEmail')
      const emailVerifiedStorage = sessionStorage.getItem('emailVerified')

      if (emailVerifiedStorage === 'true' && verifiedEmail) {
        setFormData((prevData) => ({
          ...prevData,
          email: verifiedEmail, // 從 sessionStorage 中獲取已驗證 email
        }))
        setEmailVerified(true)
      }
    }
  }, [router.isReady])

  // 處理使用者註冊表單的交互效果
  const userBoxRef = useRef(null)
  const userFormRef = useRef(null)

  useEffect(() => {
    const userBox = userBoxRef.current
    const userForm = userFormRef.current
    const userInputs = userForm.querySelectorAll('input')

    // 點擊表單外部時，切換表單的 active 狀態
    const toggleFormActive = (event) => {
      if (!userForm.contains(event.target)) {
        userForm.classList.toggle(styles.active)
      }
    }

    // 當滑鼠離開表單區域時，取消 active 狀態
    const deactivateForm = () => {
      if (!userForm.classList.contains(styles['form-focused'])) {
        userForm.classList.remove(styles.active)
      }
    }

    // 當表單獲得焦點時，激活表單
    const focusInput = () => {
      userBox.classList.add(styles.hover)
      userForm.classList.add(styles['form-focused'])
    }

    // 當表單失去焦點時，取消激活狀態
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

    // 點擊表單外部時，切換表單的 active 狀態
    const toggleFormActive = (event) => {
      if (!companyForm.contains(event.target)) {
        companyForm.classList.toggle(styles.active)
      }
    }

    // 當滑鼠離開表單區域時，取消 active 狀態
    const deactivateForm = () => {
      if (!companyForm.classList.contains(styles['form-focused'])) {
        companyForm.classList.remove(styles.active)
      }
    }

    // 當表單獲得焦點時，激活表單
    const focusInput = () => {
      companyBox.classList.add(styles.hover)
      companyForm.classList.add(styles['form-focused'])
    }

    // 當表單失去焦點時，取消激活狀態
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
      className={`${styles['register-box-bo']} d-flex flex-column flex-md-row justify-content-center align-items-center`}
    >
      {/* 使用者註冊區域 */}
      <div
        className={`${styles['user-register-section-bo']} d-flex flex-column justify-content-center align-items-center`}
        ref={userBoxRef}
      >
        <div className={`${styles['user-register-title-bo']} d-flex`}>
          <h3>會</h3>
          <h3>員</h3>
          <h3>註</h3>
          <h3>冊</h3>
        </div>
        <RegisterForm
          formData={formData}
          onInputChange={onInputChange}
          emailError={emailError}
          accountError={accountError}
          passwordError={passwordError}
          checkPasswordError={checkPasswordError}
          submitForm={submitForm}
          SendEmail={SendEmail}
          userFormRef={userFormRef}
        />
      </div>

      {/* 公司註冊區域 */}
      <div
        className={`${styles['company-register-section-bo']} d-flex flex-column gap-5 justify-content-center align-items-center`}
        ref={compBoxRef}
      >
        <div className={`${styles['company-register-title-bo']} d-flex`}>
          <h3>企</h3>
          <h3>業</h3>
          <h3>註</h3>
          <h3>冊</h3>
        </div>
        <CompanyRegisterForm compFormRef={compFormRef} />
      </div>
    </section>
  )
}
