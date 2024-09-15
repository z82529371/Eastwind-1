import axiosInstance, { fetcher } from './axios-instance'
import useSWR from 'swr'

/**
 * 檢查會員狀態使用
 */
export const checkAuth = async () => {
  return await axiosInstance.get('/auth/check')
}
/**
 * Google Login(Firebase)登入用，providerData為登入後得到的資料
 */
export const googleLogin = async (providerData = {}) => {
  return await axiosInstance.post('/google-login', providerData)
}

/**
 * LINE Login登入用，要求line登入的網址
 */
export const lineLoginRequest = async () => {
  // 向後端(express/node)伺服器要求line登入的網址，因密鑰的關係需要由後端產生
  axiosInstance.get('/line-login/login').then((res) => {
    console.log(res.data.url)
    // 重定向到line 登入頁
    if (res.data.url) {
      window.location.href = res.data.url
    }
  })
}
/**
 * LINE Login登入用，處理line方登入後，向我們的伺服器進行登入動作。query為router.query
 */
export const lineLoginCallback = async (query) => {
  // 構造查詢字串
  const qs = new URLSearchParams({
    ...query,
  }).toString()

  try {
    // 使用 fetch 發送 GET 請求到正確的後端 URL
    const response = await fetch(
      `http://localhost:3005/api/line-login/callback?${qs}`,
      {
        credentials: 'include', // 確保請求攜帶憑證（如 cookies）
      }
    )

    if (!response.ok) {
      // 如果 response 狀態碼不是 200-299，則手動拋出錯誤
      const errorMessage = `HTTP error! status: ${response.status}, statusText: ${response.statusText}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    // 解析並返回 JSON 格式的響應數據
    const data = await response.json()
    return data // 返回數據，讓調用者使用
  } catch (error) {
    // 捕捉並記錄錯誤
    console.error('Login Callback Error:', error.message || error)
    throw error // 將錯誤拋出，以便外部處理
  }
}

/**
 * LINE 登出用
 */
export const lineLogout = async (line_uid) => {
  return await axiosInstance.get(`/line-login/logout?line_uid=${line_uid}`)
}
/**
 * 登入用，loginData = { username, passsword }
 */
export const login = async (loginData = {}) => {
  return await axiosInstance.post('/auth/login', loginData)
}
/**
 * 登出用
 */
export const logout = async () => {
  return await axiosInstance.post('/auth/logout', {})
}
/**
 * 載入會員id的資料用，需要登入後才能使用。此API路由會檢查JWT中的id是否符合本會員，不符合會失敗。
 */
export const getUserById = async (id = 0) => {
  return await axiosInstance.get(`/users/${id}`)
}
/**
 * 忘記密碼/OTP 要求一次性密碼
 */
export const requestOtpToken = async (email = '') => {
  return await axiosInstance.post('/reset-password/otp', { email })
}
/**
 * 忘記密碼/OTP 重設密碼
 */
export const resetPassword = async (email = '', password = '', token = '') => {
  return await axiosInstance.post('/reset-password/reset', {
    email,
    token,
    password,
  })
}
/**
 * 註冊用
 */
export const register = async (user = {}) => {
  return await axiosInstance.post('/users', user)
}
/**
 * 修改會員一般資料用(排除password, username, email)
 */
export const updateProfile = async (id = 0, user = {}) => {
  return await axiosInstance.put(`/users/${id}/profile`, user)
}
/**
 * 修改會員頭像用，需要用FormData
 */
export const updateProfileAvatar = async (formData) => {
  return await axiosInstance.post(`/users/upload-avatar`, formData)
}
/**
 * 修改會員密碼專用, password = { originPassword, newPassword }
 */
export const updatePassword = async (id = 0, password = {}) => {
  return await axiosInstance.put(`/users/${id}/password`, password)
}
/**
 * 獲得會員有加在我的最愛的商品id，回傳為id陣列
 */
export const getFavs = async () => {
  return await axiosInstance.get('/favorites')
}
/**
 * 新增商品id在該會員的我的最愛清單中的
 */
export const addFav = async (pid) => {
  return await axiosInstance.put(`/favorites/${pid}`)
}
/**
 * 移除商品id在該會員的我的最愛清單中的
 */
export const removeFav = async (pid) => {
  return await axiosInstance.delete(`/favorites/${pid}`)
}

export const useUser = (id) => {
  const { data, error, isLoading } = useSWR(`/users/${id}`, fetcher)

  return {
    data,
    isLoading,
    isError: error,
  }
}

// 解析accessToken用的函式
export const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}
