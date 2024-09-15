import React from 'react'
import styles from '@/styles/boyu/user-favorite.module.scss'

export default function FavoriteTabs({ activeTab, onTabChange }) {
  return (
    <div className={styles['favorite-list-head-bo']}>
      <ul
        className={`${styles['favorite-state-box-bo']} d-flex justify-content-around align-items-center text-center`}
      >
        <li>
          <button
            onClick={() => onTabChange('product')}
            className={`${styles['favorite-state-bo']} h5 ${
              activeTab === 'product' ? styles['state-choose-bo'] : ''
            }`}
          >
            商品
          </button>
        </li>
        <li>
          <button
            onClick={() => onTabChange('company')}
            className={`${styles['favorite-state-bo']} h5 ${
              activeTab === 'company' ? styles['state-choose-bo'] : ''
            }`}
          >
            棋牌室
          </button>
        </li>
        <li>
          <button
            onClick={() => onTabChange('course')}
            className={`${styles['favorite-state-bo']} h5 ${
              activeTab === 'course' ? styles['state-choose-bo'] : ''
            }`}
          >
            課程
          </button>
        </li>
      </ul>
    </div>
  )
}
