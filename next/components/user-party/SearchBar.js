import React from 'react'
import styles from '@/styles/boyu/user-party.module.scss'
import { FaMagnifyingGlass } from 'react-icons/fa6'

export default function SearchBar({
  searchQuery,
  searchInputChange,
  triggerSearch,
}) {
  return (
    <div
      className={`${styles['search-box-bo']} d-flex flex-column flex-sm-row justify-content-center align-items-center gap-lg-4 gap-3 `}
    >
      <h6>搜尋</h6>
      <input
        type="text"
        placeholder="請輸入店名或揪團編號"
        className={`${styles['input-search-bo']} p`}
        value={searchQuery}
        onChange={searchInputChange}
      />
      <button
        className={`${styles['btn-search']} h6 d-flex justify-content-between align-items-center`}
        onClick={triggerSearch}
      >
        <FaMagnifyingGlass />
      </button>
    </div>
  )
}
