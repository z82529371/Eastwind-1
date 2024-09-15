import React from 'react'
import styles from '@/styles/boyu/user-favorite.module.scss'
import { FaMagnifyingGlass } from 'react-icons/fa6'

export default function SearchBar({
  searchQuery,
  onSearchInputChange,
  onTriggerSearch,
}) {
  return (
    <div
      className={`${styles['search-box-bo']} d-flex flex-column flex-sm-row justify-content-center align-items-center gap-lg-4 gap-3 `}
    >
      <h6>搜尋最愛</h6>
      <input
        type="text"
        placeholder="請輸入關鍵字"
        className={`${styles['input-search-bo']} p`}
        value={searchQuery} // 綁定搜尋關鍵字
        onChange={onSearchInputChange} // 更新搜尋關鍵字並監聽輸入
      />
      <button
        className={`${styles['btn-search']} h6 d-flex justify-content-between align-items-center`}
        onClick={onTriggerSearch} // 點擊後觸發搜尋
      >
        <FaMagnifyingGlass />
      </button>
    </div>
  )
}
