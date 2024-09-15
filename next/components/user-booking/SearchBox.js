import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import styles from '@/styles/boyu/user-booking.module.scss'

export default function SearchBox({ searchQuery, onSearchChange, onSearch }) {
  return (
    <div
      className={`${styles['search-box-bo']} d-flex flex-column flex-sm-row justify-content-center align-items-center gap-lg-4 gap-3 `}
    >
      <h6>搜尋</h6>
      <input
        type="text"
        placeholder="請輸入店名或預訂編號"
        className={`${styles['input-search-bo']} p`}
        value={searchQuery}
        onChange={onSearchChange}
      />
      <button
        className={`${styles['btn-search']} h6 d-flex justify-content-between align-items-center`}
        onClick={onSearch}
      >
        <FaMagnifyingGlass />
      </button>
    </div>
  )
}
