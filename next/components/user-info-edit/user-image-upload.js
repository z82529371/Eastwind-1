import React from 'react'
import styles from '@/styles/boyu/user-info-edit.module.scss'
import { FaEdit } from 'react-icons/fa'

export default function UserImageUpload({
  imageSrc,
  user,
  createdAt,
  fileInputRef,
  onFileChange,
}) {
  return (
    <div
      className={`${styles['default-img-box-bo']} ${styles['move-up-bo']} col-12 col-lg-4 d-flex flex-column justify-content-center align-items-center position-relative`}
    >
      <div className={styles['user-img-box-bo']}>
        <img
          className={`${styles['user-img-bo']}`}
          src={imageSrc}
          alt={user?.username || 'User'}
        />

        <button
          type="button"
          className={`${styles['btn-edit-img']} btn`}
          onClick={() => fileInputRef.current.click()} // 觸發文件輸入點擊事件
        >
          <FaEdit />
        </button>
      </div>
      <div
        className={`${styles['create-date-box-bo']} h6 text-center d-flex justify-content-center align-items-center`}
      >
        <h6>創建日期&nbsp;:&nbsp;</h6>
        <h6>{createdAt}</h6>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} // 隱藏文件輸入
        onChange={onFileChange}
        accept="image/*" // 限制只能選擇圖片文件
      />
    </div>
  )
}
