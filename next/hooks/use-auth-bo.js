import { useContext } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'

const useAuth = () => {
  const { setUser, token, setToken } = useContext(AuthContext)
  const router = useRouter()

  // 集中處理 localStorage 操作

  const setLocalStorageTokens = (accessToken, refreshToken) => {
    console.log('Storing tokens:', { accessToken, refreshToken }) // 打印token到console
    localStorage.setItem('accessToken', accessToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  const clearLocalStorageTokens = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const login = async (account, password) => {
    const url = 'http://localhost:3005/api/user/login'
    const data = { account, password }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log('Login result:', result) // 檢查是否有 isNewUser 參數

      if (result.status === 'success') {
        const newAccessToken = result.accessToken
        const newRefreshToken = result.refreshToken
        const isNewUser = result.isNewUser // 接收 isNewUser

        setToken(newAccessToken)
        setLocalStorageTokens(newAccessToken, newRefreshToken)

        return {
          success: true,
          token: newAccessToken,
          name: result.name,
          isNewUser,
        }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: '無法連接伺服器，請稍後再試' }
    }
  }

  const logout = async () => {
    const url = 'http://localhost:3005/api/user/logout'

    try {
      await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // 清除 token 和 user 狀態
      setToken(undefined)
      setUser(undefined)

      clearLocalStorageTokens()
      router.push('/home')
    } catch (error) {
      console.error('Logout error:', error)
      alert('登出失敗，請稍後再試')
    }
  }

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (!storedRefreshToken) return
    try {
      const response = await fetch(
        'http://localhost:3005/api/user/refresh-token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
        }
      )

      const result = await response.json()
      if (result.status === 'success') {
        const newAccessToken = result.accessToken
        setToken(newAccessToken)
        localStorage.setItem('accessToken', newAccessToken)
      } else {
        console.error('Failed to refresh access token:', result.message)
        logout()
      }
    } catch (error) {
      console.error('Refresh token error:', error)
      logout()
    }
  }

  return {
    login,
    logout,
    refreshToken,
  }
}

export default useAuth
