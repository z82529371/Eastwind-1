// 引入 Firebase 的核心函數來初始化應用程式和處理認證
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useEffect } from 'react'
import { firebaseConfig } from './firebase-config' // 將 Firebase 設定值從配置檔案中引入

// 使用 Firebase 的自定義 hook
const useFirebase = () => {
  useEffect(() => {
    // 初始化 Firebase 應用程式，這段程式只會在組件掛載時執行一次
    initializeApp(firebaseConfig)
  }, []) // 空的依賴陣列確保此 effect 只執行一次

  // 使用 Google 提供者進行彈窗登入
  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider() // 初始化 Google 認證提供者
    const auth = getAuth() // 初始化 Firebase 認證

    try {
      // 使用彈窗的方式進行 Google 登入
      const result = await signInWithPopup(auth, provider)
      const user = result.user // 取得成功登入的使用者資料
      console.log(user)

      // 返回 Google 登入成功後的用戶資料
      return user
    } catch (error) {
      // 如果登入過程中發生錯誤，進行錯誤處理
      console.log('Google Sign-In Error:', error)

      // 處理彈窗被阻止的情況
      if (error.code === 'auth/popup-blocked') {
        alert('彈窗被阻止，請允許瀏覽器彈窗以完成登入。')
      } else {
        // 其他錯誤提示
        alert('發生錯誤，請稍後再試。')
      }

      // 返回錯誤以便在外層處理
      throw error
    }
  }

  // 返回可供使用的登入函數
  return {
    loginGoogle,
  }
}

// 將自定義的 Firebase hook 匯出供其他組件使用
export default useFirebase
