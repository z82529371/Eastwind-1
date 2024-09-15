import { useContext, useEffect, useRef, useState } from 'react'
import styles from '@/styles/boyu/login.module.scss'
import useAuth from '@/hooks/use-auth-bo'
import useFirebase from '@/hooks/use-firebase-bo'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'
import { lineLoginCallback } from '@/services/user'
import LoginForm from '@/components/login/LoginForm'
import CompanyLoginForm from '@/components/login/CompanyLoginForm'

export default function Login() {
  const router = useRouter()

  // 定義狀態來管理表單輸入值和錯誤訊息
  const [account, setAccount] = useState('') // 保存帳號的狀態
  const [password, setPassword] = useState('') // 保存密碼的狀態
  const [accountError, setAccountError] = useState('') // 保存帳號錯誤訊息的狀態
  const [passwordError, setPasswordError] = useState('') // 保存密碼錯誤訊息的狀態
  const { login } = useAuth() // 從 useAuth 中解構獲取  和 setUser
  const { loginGoogle } = useFirebase() // 使用 Google 登入功能
  const { setUser } = useContext(AuthContext) // 獲取 AuthContext 中的上下文資料
  const [isHovered, setIsHovered] = useState(false) // 定義 Google logo 的 hover 狀態
  const [isLineHovered, setIsLineHovered] = useState(false) // 定義 Line logo 的 hover 狀態

  // 從 localStorage 中讀取賬號並設置到狀態中
  useEffect(() => {
    const storedAccount = localStorage.getItem('savedAccount') || '' // 從 localStorage 取得已保存的帳號
    setAccount(storedAccount)
  }, [])

  // 如果已註冊過帳號，從 localStorage 讀取帳號和密碼
  useEffect(() => {
    const storedAccount = localStorage.getItem('registeredAccount') || ''
    const storedPassword = localStorage.getItem('registeredPassword') || ''

    if (storedAccount && storedPassword) {
      setAccount(storedAccount)
      setPassword(storedPassword)
    }
  }, [])

  // 處理登入邏輯
  const onLogin = async (event) => {
    event.preventDefault()

    // 重置錯誤訊息
    setAccountError('')
    setPasswordError('')

    // 檢查是否填寫帳號和密碼
    if (!account) {
      setAccountError('請填寫帳號')
      return
    }

    if (!password) {
      setPasswordError('請填寫密碼')
      return
    }

    try {
      const result = await login(account, password) // 等待登入結果

      if (result.success) {
        onLoginSuccess(result.name, result.isNewUser) // 確保這裡傳遞了 isNewUser
      } else {
        // 根據返回的錯誤訊息設置相應的錯誤狀態
        if (result.message.includes('帳號')) {
          setAccountError(result.message)
        }
        if (result.message.includes('密碼')) {
          setPasswordError(result.message)
        }
      }
    } catch (error) {
      setAccountError('發生未知錯誤，請稍後再試') // 捕獲異常並設置錯誤訊息
    }
  }

  // 處理Google登入的回調邏輯
  const onGoogleLoginSuccess = async () => {
    try {
      const providerData = await loginGoogle() // 確保 loginGoogle 返回的是完整的使用者資料
      const { uid, email, displayName, photoURL } = providerData

      const response = await fetch('http://localhost:3005/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_uid: uid,
          email,
          displayName,
          photoURL,
        }), // 發送使用者資訊到後端
      })

      const result = await response.json()
      console.log('Login Result:', result)

      if (result.status === 'success') {
        // 保存登錄的 Token
        localStorage.setItem('refreshToken', result.refreshToken)
        localStorage.setItem('accessToken', result.accessToken)

        // 設置用戶資料
        setUser({
          id: result.id,
          name: result.name,
          email: email,
          photoURL: photoURL,
        })

        if (result.isNewUser) {
          // 如果是新用戶，顯示歡迎提示並跳轉到主頁
          localStorage.setItem('showWelcomeAlert', 'true')
          window.location.href = '/home'
        } else {
          // 新增歡迎回來的 SweetAlert
          Swal.fire({
            title: '登入成功！',
            html: `<span class="p">${result.name} 歡迎回來！</span>`,
            icon: 'success',
            customClass: {
              popup: `${styles['swal-popup-bo']}`,
              title: 'h6',
              icon: `${styles['swal-icon-bo']}`,
              confirmButton: `${styles['swal-btn-bo']}`,
            },
            confirmButtonText: '確認',
          }).then(() => {
            window.location.href = '/home'
          })
        }
      } else {
        // 顯示 Google 登入失敗提示
        Swal.fire({
          title: 'Google 登入失敗',
          html: `<span class="p">請稍後再試</span>`,
          icon: 'error',
          confirmButtonText: '確認',
          customClass: {
            popup: `${styles['swal-popup-bo']}`,
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`,
            confirmButton: `${styles['swal-btn-bo']}`,
          },
        })
      }
    } catch (error) {
      console.log('Login Error:', error)
      Swal.fire({
        title: '登入錯誤',
        html: `<span class="p">發生未知錯誤，請稍後再試</span>`,
        icon: 'error',
        confirmButtonText: '確認',
        customClass: {
          popup: `${styles['swal-popup-bo']}`,
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`,
          confirmButton: `${styles['swal-btn-bo']}`,
        },
      })
    }
  }

  // 處理 Line 登入邏輯
  const goLineLogin = async () => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/line-login/login',
        {
          credentials: 'include', // 確保請求攜帶憑證（如 cookies）
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url // 重定向至 Line 登錄頁面
      }
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  // 處理 Line 登入後的回調邏輯，將用戶信息傳遞至後端
  const callbackLineLogin = async (query) => {
    try {
      const res = await lineLoginCallback(query)

      // 處理回應邏輯
      if (res.status === 'success' && res.data) {
        const { accessToken, refreshToken, returnUser, isNewUser } = res.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        // 設置用戶資料
        setUser({
          id: returnUser.id,
          name: returnUser.username,
          google_uid: returnUser.google_uid,
          line_uid: returnUser.line_uid,
          isNewUser, // 設定使用者狀態是否為新會員
        })

        if (isNewUser) {
          // 如果是新用戶，顯示歡迎提示並跳轉到主頁
          localStorage.setItem('showWelcomeAlert', 'true')
          window.location.href = '/home'
        } else {
          // 顯示歡迎回來提示
          Swal.fire({
            title: '登入成功！',
            html: `<span class="p">${returnUser.username} 歡迎回來！</span>`,
            icon: 'success',
            customClass: {
              popup: `${styles['swal-popup-bo']}`,
              title: 'h6',
              icon: `${styles['swal-icon-bo']}`,
              confirmButton: `${styles['swal-btn-bo']}`,
            },
            confirmButtonText: '確認',
          }).then(() => {
            window.location.href = '/home'
          })
        }
      } else {
        throw new Error('Line 登入失敗')
      }
    } catch (error) {
      console.error('Line login callback error:', error)
      // 錯誤處理邏輯
    }
  }

  // 從 line 登入畫面後回調到本頁面用
  useEffect(() => {
    if (router.isReady) {
      // 判斷是否有 query.code，若無則不處理
      if (!router.query.code) return
      // 發送至後端伺服器得到 line 會員資料
      callbackLineLogin(router.query)
    }
  }, [router.isReady, router.query])

  // 成功登入後的處理邏輯
  const onLoginSuccess = (name, isNewUser) => {
    localStorage.removeItem('registeredAccount')
    localStorage.removeItem('registeredPassword')
    if (isNewUser) {
      localStorage.setItem('showWelcomeAlert', 'true')
      window.location.href = '/home'
    } else {
      Swal.fire({
        title: '登入成功！',
        html: `<span class="p">${name} 歡迎回來！</span>`,
        icon: 'success',
        customClass: {
          popup: `${styles['swal-popup-bo']}`,
          title: 'h6',
          icon: `${styles['swal-icon-bo']}`,
          confirmButton: `${styles['swal-btn-bo']}`,
        },
        confirmButtonText: '確認',
      }).then(() => {
        localStorage.removeItem('registeredAccount')
        localStorage.removeItem('registeredPassword')
      })
    }
  }

  // 處理使用者登入表單的交互效果
  const userBoxRef = useRef(null)
  const userFormRef = useRef(null)
  const compBoxRef = useRef(null)
  const compFormRef = useRef(null)

  useEffect(() => {
    const userBox = userBoxRef.current
    const userForm = userFormRef.current

    if (!userBox || !userForm) return

    const userInputs = userForm.querySelectorAll('input')

    const toggleFormActive = (event) => {
      if (!userForm.contains(event.target)) {
        userForm.classList.toggle(styles.active) // 點擊時切換表單的 active 樣式
      }
    }

    const deactivateForm = () => {
      if (!userForm.classList.contains(styles['form-focused'])) {
        userForm.classList.remove(styles.active) // 當表單未聚焦時，移除 active 樣式
      }
    }

    const focusInput = () => {
      userBox.classList.add(styles.hover)
      userForm.classList.add(styles['form-focused']) // 當輸入框獲得焦點時添加 focused 樣式
    }

    const blurInput = () => {
      userForm.classList.remove(styles['form-focused'])
      if (!userForm.contains(document.activeElement)) {
        userBox.classList.remove(styles.hover) // 當輸入框失去焦點且不在表單內時移除 hover 樣式
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

  // 處理公司登入表單的交互效果
  useEffect(() => {
    const companyBox = compBoxRef.current
    const companyForm = compFormRef.current

    if (!companyBox || !companyForm) return

    const companyInputs = companyForm.querySelectorAll('input')

    const toggleFormActive = (event) => {
      if (!companyForm.contains(event.target)) {
        companyForm.classList.toggle(styles.active) // 點擊時切換表單的 active 樣式
      }
    }

    const deactivateForm = () => {
      if (!companyForm.classList.contains(styles['form-focused'])) {
        companyForm.classList.remove(styles.active) // 當表單未聚焦時，移除 active 樣式
      }
    }

    const focusInput = () => {
      companyBox.classList.add(styles.hover)
      companyForm.classList.add(styles['form-focused']) // 當輸入框獲得焦點時添加 focused 樣式
    }

    const blurInput = () => {
      companyForm.classList.remove(styles['form-focused'])
      if (!companyForm.contains(document.activeElement)) {
        companyBox.classList.remove(styles.hover) // 當輸入框失去焦點且不在表單內時移除 hover 樣式
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

  // 渲染登入頁面
  return (
    <section
      className={`${styles['login-box-bo']} d-flex flex-column flex-md-row justify-content-center align-items-center`}
    >
      {/* 使用者登入區域 */}
      <div
        className={`${styles['user-login-section-bo']} d-flex flex-column justify-content-center align-items-center`}
        ref={userBoxRef}
      >
        <div className={`${styles['user-login-title-bo']} d-flex`}>
          <h3>會</h3>
          <h3>員</h3>
          <h3>登</h3>
          <h3>入</h3>
        </div>
        <div></div>
        <LoginForm
          account={account}
          setAccount={setAccount}
          password={password}
          setPassword={setPassword}
          accountError={accountError}
          passwordError={passwordError}
          onLogin={onLogin}
          onGoogleLoginSuccess={onGoogleLoginSuccess}
          userFormRef={userFormRef}
          goLineLogin={goLineLogin}
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isLineHovered={isLineHovered}
          setIsLineHovered={setIsLineHovered}
        />
      </div>

      {/* 公司登入區域 */}
      <div
        className={`${styles['company-login-section-bo']} d-flex flex-column gap-5 justify-content-center align-items-center`}
        ref={compBoxRef}
      >
        <div className={`${styles['company-login-title-bo']} d-flex`}>
          <h3>企</h3>
          <h3>業</h3>
          <h3>登</h3>
          <h3>入</h3>
        </div>
        <CompanyLoginForm
          account={account}
          setAccount={setAccount}
          password={password}
          setPassword={setPassword}
          accountError={accountError}
          passwordError={passwordError}
          onLogin={onLogin}
          compFormRef={compFormRef}
        />
      </div>
    </section>
  )
}
