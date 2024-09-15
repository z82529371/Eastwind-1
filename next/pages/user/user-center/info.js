import { useContext, useEffect, useState } from 'react'
import UserBasicInfo from '@/components/user-info/UserBasicInfo'
import UserImage from '@/components/user-info/UserImage'
import UserDetailInfo from '@/components/user-info/UserDetailInfo'
import UserCreditCards from '@/components/user-info/UserCreditCards'
import styles from '@/styles/boyu/user-info.module.scss'
import { FaEdit } from 'react-icons/fa'
import Link from 'next/link'
import { AuthContext } from '@/context/AuthContext'
import UserCenterLayout from '@/components/layout/user-center-layout'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

export default function UserInfo() {
  const router = useRouter()

  // 從 AuthContext 中獲取 user 狀態
  const { user } = useContext(AuthContext)
  const [userData, setUserData] = useState(null) // 管理用戶資料的狀態
  const [cards, setCards] = useState([]) // 管理用戶信用卡資訊的狀態
  const [imageSrc, setImageSrc] = useState('') // 管理用戶圖片的狀態

  // 當 userData 更新時，更新圖片 URL
  useEffect(() => {
    if (userData) {
      const imgSrc = userData.user_img
        ? `/images/boyu/users/${userData.user_img}.jpg?${new Date().getTime()}`
        : userData.photo_url
        ? userData.photo_url
        : userData.gender === '男'
        ? '/images/boyu/users/user-male-default.svg'
        : '/images/boyu/users/user-female-default.svg'

      setImageSrc(imgSrc)
    }
  }, [userData])

  // 處理修改成功後的彈窗顯示邏輯
  useEffect(() => {
    const updateSuccess = sessionStorage.getItem('updateSuccess')
    const isFirstEdit = sessionStorage.getItem('isFirstEdit')

    if (updateSuccess) {
      if (isFirstEdit === 'true') {
        Swal.fire({
          title: '填寫成功！',
          html: `<span class="p">填寫資料完成，獲得歡迎優惠券！</span>`,
          icon: 'success',
          confirmButtonText: '查看優惠券',
          customClass: {
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`,
            confirmButton: `${styles['swal-btn-bo']}`,
          },
        }).then(() => {
          sessionStorage.removeItem('isFirstEdit') // 清除標誌
          router.push('/user/user-center/coupon') // 跳轉到優惠券頁面
        })
      } else {
        Swal.fire({
          title: '修改成功！',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            title: 'h6',
            icon: `${styles['swal-icon-bo']}`,
            confirmButton: `${styles['swal-btn-bo']}`,
          },
        })
      }

      sessionStorage.removeItem('updateSuccess') // 清除成功訊息
    }
  }, [user])

  // 當 user 更新時，從後端 API 獲取用戶資料和信用卡資訊
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3005/api/user/user/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            setUserData(data.data) // 成功獲取並設置 userData
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })

      fetch(`http://localhost:3005/api/user/user/${user.id}/cards`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            setCards(data.data) // 成功獲取並設置信用卡資料
          }
        })
        .catch((error) => {
          console.error('Error fetching cards data:', error)
        })
    }
  }, [user])

  // 如果用戶資料尚未加載完成，返回 null
  if (!user || !userData) {
    return null
  }

  // 格式化日期
  const createdAt = userData.created_at.split(' ')[0].replace(/-/g, ' / ')
  const birthDate = userData.birth.replace(/-/g, ' / ')

  return (
    <div className={`${styles['user-info-box-bo']} w-100`}>
      <div className={`${styles['info-form-box-bo']} flex-column d-flex`}>
        <div
          className={`${styles['info-default-box-bo']} row justify-content-center align-items-center gap-5 gap-lg-0`}
        >
          {/* 用戶基本資訊區塊 */}
          <UserBasicInfo userData={userData} />
          {/* 用戶圖片區塊 */}

          <UserImage
            imageSrc={imageSrc}
            createdAt={createdAt}
            userData={userData}
          />
        </div>

        <div
          className={`${styles['info-detail-box-bo']} row justify-content-center align-items-start  gap-5 gap-lg-0`}
        >
          {/* 用戶詳細資訊區塊 */}
          <UserDetailInfo userData={userData} />
          {/* 用戶信用卡資訊區塊 */}
          <UserCreditCards cards={cards} />
        </div>

        {/* 修改資訊按鈕區塊 */}
        <div
          className={`${styles['info-btn-box-bo']} d-flex justify-content-center align-items-center`}
        >
          <button className={`${styles['btn-edit-info-bo']} btn h6 `}>
            <Link
              className={`${styles['link']} d-flex justify-content-center align-items-center  gap-5`}
              href="/user/user-center/info-edit"
            >
              修改資訊
              <FaEdit />
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}

// 指定 UserCenterLayout 作為此頁面的佈局
UserInfo.getLayout = function (page) {
  return <UserCenterLayout>{page}</UserCenterLayout>
}
