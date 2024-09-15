import { useState } from 'react'
import styles from '@/styles/boyu/user-party.module.scss'

import {
  FaSort,
  FaXmark,
  FaMagnifyingGlass,
  FaMoneyBill,
  FaPhone,
  FaCheck,
  FaShop,
  FaUserGroup,
} from 'react-icons/fa6'
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'

import Link from 'next/link'

export default function PartyList({
  filteredParty,
  selectedStatus,
  sortByIndex,
  activeSortIndex,
  sortOptions,
  searchKeyword,
  user,
}) {
  return (
    <>
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

      <div className={styles['party-list-th-bo']}>
        <ul className="text-center">
          <li
            className="p d-flex justify-content-center align-items-center text-center gap-3"
            onClick={() => sortByIndex(activeSortIndex === 1 ? 0 : 1)} // 切換排序方式
          >
            揪團編號 <FaSort />
          </li>
          <li
            className="p d-flex justify-content-center align-items-center text-center gap-3"
            onClick={() => sortByIndex(activeSortIndex === 3 ? 2 : 3)} // 切換排序方式
          >
            棋牌室 <FaSort />
          </li>
          <li
            className="p d-flex justify-content-center align-items-center text-center gap-3"
            onClick={() => sortByIndex(activeSortIndex === 5 ? 4 : 5)} // 切換排序方式
          >
            揪團時間 <FaSort />
          </li>
          <li className="p d-flex justify-content-center align-items-center text-center gap-3"></li>
        </ul>
      </div>
      {filteredParty.length === 0 && searchKeyword ? (
        <div className="h5 p-5">未查詢到相關結果</div>
      ) : filteredParty.length === 0 ? (
        <div className="h5 p-5">尚未有揪團紀錄</div>
      ) : (
        filteredParty.map((item) => (
          <div
            className={styles['party-list-tb-bo']}
            key={`${item.order_number}-${item.id}`}
          >
            <div
              className={`${styles['party-list-col-bo']} d-flex flex-column`}
            >
              <div className="d-none d-md-block">
                <input
                  type="checkbox"
                  id={`showDetailDesktop${item.id}`}
                  className={styles['show-detail-desktop-bo']}
                />
                <label
                  className={`${styles['list-col-head-desktop-bo']} d-none d-md-grid gap-2 `}
                  htmlFor={`showDetailDesktop${item.id}`}
                >
                  <h6>{item.order_number}</h6>
                  <h6>{item.company_name}</h6>
                  <div
                    className={`${styles['list-time-bo']} d-flex flex-column`}
                  >
                    <h6>{item.date}</h6>
                    <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center text-start">
                      <h6>{item.start_time}-</h6>
                      <h6> {item.end_time}</h6>
                    </div>
                  </div>

                  {selectedStatus === 'waiting' && (
                    <Link
                      href={`/lobby/Party/${item.id}`}
                      className={`${styles['btn-party-bo']} btn h6 d-flex justify-content-center align-items-center gap-2`}
                    >
                      <FaUserGroup />
                      <div
                        className={`${styles['btn-party-text-bo']} d-flex justify-content-center align-items-center text-center`}
                      >
                        <p>參團</p>
                        <p>詳情</p>
                      </div>
                    </Link>
                  )}
                  {selectedStatus === 'completed' && (
                    <div
                      className={`${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                    >
                      <FaCheck />
                      已完成
                    </div>
                  )}
                  {selectedStatus === 'cancelled' && (
                    <div
                      className={`${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                    >
                      <FaXmark />
                      已取消
                    </div>
                  )}
                  {selectedStatus === 'failed' && (
                    <div
                      className={`${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                    >
                      <FaXmark />
                      已流團
                    </div>
                  )}
                  <h6>
                    <FaChevronDown className={` ${styles['btn-detail-bo']}`} />
                  </h6>
                </label>
                <div
                  className={`${styles['list-col-desktop-body-bo']} flex-column flex-xl-row justify-content-between align-items-center gap-4  gap-xl-2 `}
                >
                  <div
                    className={`${styles['shop-box-bo']} d-flex  justify-content-between align-items-center`}
                  >
                    <ul className="d-flex flex-column justify-content-between align-items-start gap-1">
                      <li
                        className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                      >
                        <FaMapMarkerAlt
                          className={` ${styles['col-icon-bo']} `}
                        />
                        {item.company_address}
                      </li>
                      <li
                        className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                      >
                        <FaPhone className={` ${styles['col-icon-bo']}`} />
                        {item.company_tele}
                      </li>
                      {/* 只有當狀態為 'completed' 時才顯示桌子ID */}
                      {selectedStatus === 'completed' && (
                        <li
                          className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                        >
                          <FaShop className={` ${styles['col-icon-bo']}`} />
                          {item.table_id !== '未指定'
                            ? `${item.playroom_type} / ${item.table_number} 號桌`
                            : '未指定桌號'}
                        </li>
                      )}

                      <li
                        className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                      >
                        <FaMoneyBill className={`${styles['col-icon-bo']}`} />
                        {item.price}
                      </li>
                    </ul>

                    <div className="d-flex flex-column justify-content-between align-items-center gap-3">
                      <Link
                        href={`/lobby/Company/${item.company_id}`}
                        className={`${styles['btn-shop-detail']} btn p d-flex justify-content-center align-items-center`}
                      >
                        <FaMagnifyingGlass
                          className={` ${styles['btn-icon-bo']}`}
                        />
                        <div
                          className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
                        >
                          <p>店家</p>
                          <p>詳情</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className={styles['group-box-bo']}>
                    {item.members.map((member, index) => (
                      <div
                        key={index}
                        className={`${
                          styles['group-member-box-bo']
                        } d-flex justify-content-center align-items-center ${
                          member.id === user.id ? styles['member-self-bo'] : ''
                        } gap-3`}
                      >
                        <img
                          className={styles['member-img-bo']}
                          src={`/images/boyu/users/user${member.id}.jpg`} // 動態生成圖片路徑
                          alt={member.name}
                        />
                        <div className={`${styles['member-text-box']} d-flex`}>
                          <p>{member.role}</p>
                          <p>{member.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="d-block d-md-none">
                <input
                  type="checkbox"
                  id={`showDetailMobile${item.id}`}
                  className={styles['show-detail-mobile-bo']}
                />
                <label
                  className={`${styles['list-col-head-mobile-bo']} d-flex d-md-none justify-content-between align-items-center text-center`}
                  htmlFor={`showDetailMobile${item.id}`}
                >
                  <div className="d-flex flex-column justify-content-center align-items-start gap-2 text-start ">
                    <div className="d-flex justify-content-between w-100">
                      <h6>{item.order_number}</h6>
                    </div>
                    <h6>{item.company_name}</h6>
                    <div
                      className={`${styles['list-time-bo']} d-flex text-start`}
                    >
                      <h6>{item.date}</h6>
                      <h6>
                        {item.start_time} - {item.end_time}
                      </h6>
                    </div>
                  </div>
                  <div></div>
                  <div className="d-flex justify-content-center align-items-center gap-4">
                    {selectedStatus === 'waiting' && (
                      <Link
                        href={`/lobby/Party/${item.id}`}
                        className={`${styles['btn-party-bo']} btn h6 d-flex justify-content-center align-items-center gap-2`}
                      >
                        <FaUserGroup />
                        <div
                          className={`${styles['btn-party-text-bo']} d-flex justify-content-center align-items-center text-center`}
                        >
                          <p>參團</p>
                          <p>詳情</p>
                        </div>
                      </Link>
                    )}
                    {selectedStatus === 'completed' && (
                      <div
                        className={`${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                      >
                        <FaCheck />
                        已完成
                      </div>
                    )}
                    {selectedStatus === 'cancelled' && (
                      <div
                        className={`${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                      >
                        <FaXmark />
                        已取消
                      </div>
                    )}
                    {selectedStatus === 'failed' && (
                      <div
                        className={`${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                      >
                        <FaXmark />
                        已流團
                      </div>
                    )}
                    <h6>
                      <FaChevronDown
                        className={` ${styles['btn-detail-bo']}`}
                      />
                    </h6>
                  </div>
                </label>
                <div
                  className={`${styles['list-col-mobile-body-bo']} flex-column fle flex-xl-row justify-content-between align-items-center gap-4  gap-xl-2 `}
                >
                  <div
                    className={`${styles['shop-box-bo']} d-flex  flex-column flex-sm-row justify-content-between align-items-center`}
                  >
                    <ul className="d-flex flex-column justify-content-between align-items-start gap-1">
                      <li
                        className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                      >
                        <FaMapMarkerAlt
                          className={` ${styles['col-icon-bo']} `}
                        />
                        {item.company_address}
                      </li>
                      <li
                        className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                      >
                        <FaPhone className={` ${styles['col-icon-bo']}`} />
                        {item.company_tele}
                      </li>
                      {/* 只有當狀態為 'completed' 時才顯示桌子ID */}
                      {selectedStatus === 'completed' && (
                        <li
                          className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                        >
                          <FaShop className={` ${styles['col-icon-bo']}`} />
                          {item.table_id !== '未指定'
                            ? `${item.playroom_type} / ${item.table_number} 號桌`
                            : '未指定桌號'}
                        </li>
                      )}

                      <li
                        className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                      >
                        <FaMoneyBill className={`${styles['col-icon-bo']}`} />
                        {item.price}
                      </li>
                    </ul>

                    <div className="d-flex flex-row flex-sm-column justify-content-between align-items-center gap-3">
                      <Link
                        href={`/lobby/Company/${item.company_id}`}
                        className={`${styles['btn-shop-detail']} btn p d-flex justify-content-center align-items-center`}
                      >
                        <FaMagnifyingGlass
                          className={` ${styles['btn-icon-bo']}`}
                        />
                        <div
                          className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
                        >
                          <p>店家</p>
                          <p>詳情</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className={styles['group-box-bo']}>
                    {item.members.map((member, index) => (
                      <div
                        key={index}
                        className={`${
                          styles['group-member-box-bo']
                        } d-flex justify-content-center align-items-center ${
                          member.id === user.id ? styles['member-self-bo'] : ''
                        } gap-3`}
                      >
                        <img
                          className={styles['member-img-bo']}
                          src={`/images/boyu/users/user${member.id}.jpg`} // 動態生成圖片路徑
                          alt={member.name}
                        />
                        <div className={`${styles['member-text-box']} d-flex`}>
                          <p>{member.role}</p>
                          <p>{member.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  )
}
