// Firebase 的專案設定值，從 Firebase 控制台取得
const firebaseConfig = {
  apiKey: 'AIzaSyBsIeIzXTdZk4RPiwmuHVi2n27zQOPRjwU', // Firebase API 金鑰
  authDomain: 'react-test-e84f6.firebaseapp.com', // Firebase 認證的網域
  projectId: 'react-test-e84f6', // Firebase 專案ID
  storageBucket: 'react-test-e84f6.appspot.com', // Firebase 存儲桶（用於存放檔案）
  messagingSenderId: '1077454373020', // Firebase 發送訊息的 ID
  appId: '1:1077454373020:web:807add77fcd4858fcc2d59', // Firebase 應用程式 ID
}

// 匯出 Firebase 設定供其他模組使用
export { firebaseConfig }
