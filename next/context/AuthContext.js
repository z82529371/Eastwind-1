import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'

// 創建 AuthContext，用於在應用中提供全局的身份驗證狀態
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // 狀態管理：token 和 user 信息
  const [token, setToken] = useState(undefined)
  const [user, setUser] = useState(undefined)
  const [isInitialized, setIsInitialized] = useState(false) // 用於追蹤是否初始化完成
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const loginRoute = '/login' // 登入頁面的路徑
  const protectedRoutes = ['/'] // 需要身份驗證的受保護路徑

  // 初始化身份驗證狀態，檢查舊的 accessToken 和 refreshToken
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedUser = JSON.parse(localStorage.getItem('user'))
        const noReload = localStorage.getItem('noReload')
        if (noReload) {
          localStorage.removeItem('noReload')
          return
        } // 從 localStorage 中獲取保存的 user 資料
        if (savedUser) {
          setUser(savedUser) // 如果有保存的用戶資料，設置 user 狀態
        } else {
          const oldToken = localStorage.getItem('accessToken')
          const refreshToken = localStorage.getItem('refreshToken')

          if (oldToken) {
            const user = await checkToken(oldToken) // 驗證舊的 accessToken
            if (user) {
              setUser(user) // 設置用戶狀態
              setToken(oldToken) // 設置 token 狀態
            } else if (refreshToken) {
              const newAccessToken = await refreshAccessToken(refreshToken) // 使用 refreshToken 獲取新的 accessToken
              if (newAccessToken) {
                setToken(newAccessToken) // 更新 token 狀態
                localStorage.setItem('accessToken', newAccessToken) // 存儲新的 accessToken 到 localStorage
              } else {
                // localStorage.removeItem('accessToken') // 刪除無效的 accessToken
                // localStorage.removeItem('refreshToken') // 刪除無效的 refreshToken
                router.push(loginRoute) // 重定向到登入頁面
              }
            } else {
              // localStorage.removeItem('accessToken') // 如果沒有 refreshToken，刪除舊的 accessToken
              router.push(loginRoute) // 重定向到登入頁面
            }
          }
        }
      }
      setLoading(false)
      setIsInitialized(true) // 初始化完成
    }

    initializeAuth() // 初始化身份驗證狀態
  }, [])

  // 當 token 改變時觸發，驗證並設置用戶狀態
  useEffect(() => {
    if (token) {
      const verifyAndSetUser = async () => {
        const result = await checkToken(token) // 驗證當前的 token
        if (result && result.account) {
          setUser(result) // 設置用戶狀態
        } else {
          setToken(undefined) // 如果 token 無效，清除 token 狀態

          // localStorage.removeItem('accessToken') // 刪除無效的 accessToken
          router.push(loginRoute) // 重定向到登入頁面
        }
        setLoading(false)
      }

      verifyAndSetUser() // 驗證並設置用戶狀態
    }
  }, [token])

  // 在初始化完成後，根據 user 狀態進行頁面重定向
  useEffect(() => {
    if (isInitialized) {
      if (!user && protectedRoutes.includes(router.pathname)) {
        router.push(loginRoute) // 如果用戶未登入且在受保護路徑，重定向到登入頁面
      } else if (user && router.pathname === loginRoute) {
        router.push('/home') // 如果用戶已登入且在登入頁面，重定向到首頁
      }
    }
  }, [isInitialized, router.isReady, router.pathname, user])

  // 函數：檢查並驗證 token 的有效性
  const checkToken = async (token) => {
    const secretKey = 'boyuboyuboyuIamBoyu' // 請確保 secretKey 已經設置

    if (!secretKey) {
      console.error('Secret key is not defined!')
      return null
    }

    try {
      const decoded = jwt.verify(token, secretKey)
      if (decoded && decoded.id) {
        const response = await fetch(
          `http://localhost:3005/api/user/user/${decoded.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const result = await response.json()
        return result.status === 'success' ? result.data : null
      }
    } catch (err) {
      console.error('Token verification error:', err.message)

      if (err.message === 'jwt expired') {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken)
          if (newAccessToken) {
            setToken(newAccessToken) // 更新 token 狀態
            localStorage.setItem('accessToken', newAccessToken) // 存儲新的 accessToken 到 localStorage
            return checkToken(newAccessToken) // 再次驗證新的 token
          } else {
            // localStorage.removeItem('accessToken') // 刪除無效的 accessToken
            // localStorage.removeItem('refreshToken') // 刪除無效的 refreshToken
          }
        }
        router.push('/login') // 重定向到登入頁面
      }

      return null
    }
  }

  // 函數：使用 refreshToken 來獲取新的 accessToken
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(
        'http://localhost:3005/api/user/refresh-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        }
      )
      const result = await response.json()
      return result.status === 'success' ? result.accessToken : null
    } catch (error) {
      console.error('Failed to refresh access token:', error)
      return null
    }
  }

  // 函數：更新用戶圖片
  const updateUserImage = (newImage) => {
    setUser((prevUser) => ({
      ...prevUser,
      user_img: newImage,
    }))
  }

  // 函數：更新用戶名字
  const updateUserUsername = (newUsername) => {
    setUser((prevUser) => ({
      ...prevUser,
      username: newUsername,
    }))
  }

  // 更新用戶性別
  const updateUserGender = (newGender) => {
    setUser((prevUser) => ({
      ...prevUser,
      gender: newGender,
    }))
  }

  // 返回 AuthContext.Provider，提供 user、setUser、token 和 setToken 的上下文
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        updateUserImage,
        updateUserUsername,
        updateUserGender,

        loading,
        setLoading,
      }}
    >
      {children} {/* 將子組件包裝在 Provider 中 */}
    </AuthContext.Provider>
  )
}
