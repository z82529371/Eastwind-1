import React from 'react'
import { FaSort, FaCheck } from 'react-icons/fa6'
import styles from '@/styles/boyu/user-booking.module.scss'

export default function SortOptions({
  sortOptions,
  activeSortIndex,
  sortByIndex,
}) {
  return (
    <div className="d-flex justify-content-end align-items-center d-md-none">
      <button
        className={`${styles['btn-sort-bo']} btn p`}
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        排序方式
        <FaSort />
      </button>

      <div
        className={`${styles['offcanvas-bo']} offcanvas offcanvas-end`}
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul
            className={`${styles['sort-list-bo']} d-flex flex-column justify-content-center align-items-start`}
          >
            <li className="h5">排序方式</li>
            {sortOptions.map((option, index) => (
              <li
                key={index}
                className={`h6 d-flex justify-content-between align-items-center gap-5 ${styles['sort-list-li-bo']}`}
                onClick={() => sortByIndex(index)}
              >
                {option.label}
                <FaCheck
                  className={` ${activeSortIndex === index ? '' : 'd-none'}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
