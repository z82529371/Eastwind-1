import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useEffect } from 'react'
import { firebaseConfig } from './firebase-config'

// 初始化 Firebase
const useFirebase = () => {
  useEffect(() => {
    initializeApp(firebaseConfig)
  }, [])

  // 使用 Google 進行彈窗登入
  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log(user)

      // 返回 Google 登入成功的用戶資料
      return user
    } catch (error) {
      console.log('Google Sign-In Error:', error)

      if (error.code === 'auth/popup-blocked') {
        alert('彈窗被阻止，請允許瀏覽器彈窗以完成登入。')
      } else {
        alert('發生錯誤，請稍後再試。')
      }
      // 返回錯誤以便處理
      throw error
    }
  }

  return {
    loginGoogle,
  }
}

export default useFirebase
