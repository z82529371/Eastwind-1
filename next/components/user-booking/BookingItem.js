import React from 'react'
import {
  FaSort,
  FaBan,
  FaXmark,
  FaMagnifyingGlass,
  FaMoneyBill,
  FaShop,
  FaCheck,
  FaPhone,
  FaUserGroup,
} from 'react-icons/fa6'
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'
import Link from 'next/link'
import styles from '@/styles/boyu/user-booking.module.scss'

export default function BookingItem({
  user,
  item,
  selectedStatus,
  cancelBooking,
}) {
  // 檢查 user 和 item 是否存在
  if (!user || !item) {
    return null // 如果資料不存在，返回空
  }

  // 如果有 party_id，使用 Party Layout
  if (item.party_id) {
    return (
      <div className={`${styles['booking-list-col-bo']} d-flex flex-column`}>
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
            <div className={`${styles['list-time-bo']} d-flex flex-column`}>
              <h6>{item.date}</h6>
              <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center text-start">
                <h6>{item.start_time}-</h6>
                <h6> {item.end_time}</h6>
              </div>
            </div>

            {/* 狀態判斷：waiting, completed, cancelled, failed */}
            {selectedStatus === 'booked' && (
              <Link
                href={`/lobby/Party/${item.party_id}`}
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
                <FaCheck /> 已完成
              </div>
            )}
            {selectedStatus === 'cancelled' && (
              <div
                className={`${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
              >
                <FaXmark /> 已取消
              </div>
            )}

            <h6>
              <FaChevronDown className={` ${styles['btn-detail-bo']}`} />
            </h6>
          </label>
          <div
            className={`${styles['list-col-desktop-body-bo']} flex-column flex-xl-row justify-content-between align-items-center gap-4 gap-xl-2`}
          >
            <div
              className={`${styles['shop-box-bo']} d-flex justify-content-between align-items-center`}
            >
              <ul className="d-flex flex-column justify-content-between align-items-start gap-1">
                <li
                  className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                >
                  <FaMapMarkerAlt className={` ${styles['col-icon-bo']} `} />
                  {item.company_address}
                </li>
                <li
                  className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                >
                  <FaPhone className={` ${styles['col-icon-bo']}`} />
                  {item.company_tele}
                </li>
                {selectedStatus === 'completed' && (
                  <li
                    className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                  >
                    <FaShop className={` ${styles['col-icon-bo']} `} />
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
                  <FaMagnifyingGlass className={` ${styles['btn-icon-bo']}`} />
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
              <div className={`${styles['list-time-bo']} d-flex text-start`}>
                <h6>{item.date}</h6>
                <h6>
                  {item.start_time} - {item.end_time}
                </h6>
              </div>
            </div>
            <div></div>
            <div className="d-flex justify-content-center align-items-center gap-4">
              {selectedStatus === 'booked' && (
                <Link
                  href={`/lobby/Party/${item.party_id}`}
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
              <h6>
                <FaChevronDown className={` ${styles['btn-detail-bo']}`} />
              </h6>
            </div>
          </label>
          <div
            className={`${styles['list-col-body-bo']} flex-column fle flex-xl-row justify-content-between align-items-center gap-4  gap-xl-2 `}
          >
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

            <div
              className={`${styles['shop-box-bo']} d-flex  flex-column flex-sm-row justify-content-between align-items-center`}
            >
              <ul className="d-flex flex-column justify-content-between align-items-start gap-1">
                <li
                  className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
                >
                  <FaMapMarkerAlt className={` ${styles['col-icon-bo']} `} />
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
                  <FaMagnifyingGlass className={` ${styles['btn-icon-bo']}`} />
                  <div
                    className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
                  >
                    <p>店家</p>
                    <p>詳情</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles['booking-list-tb-bo']}>
      <div className={`${styles['booking-list-col-bo']} d-flex flex-column`}>
        <div className="d-none d-md-block">
          <input
            type="checkbox"
            id={`showDetailDesktop${item.id}`}
            className={styles['show-detail-desktop-bo']}
          />
          <label
            className={`${styles['list-col-head-desktop-bo']} d-none d-md-grid text-center`}
            htmlFor={`showDetailDesktop${item.id}`}
          >
            <h6>{item.order_number}</h6>
            <h6>{item.company_name}</h6>
            <div
              className={`${styles['list-time-bo']} d-flex flex-column flex-row`}
            >
              <h6>{item.date}</h6>
              <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center text-start">
                <h6>{item.start_time}-</h6>
                <h6> {item.end_time}</h6>
              </div>
            </div>
            {selectedStatus === 'booked' && (
              <button
                className={`${styles['btn-cancel-bo']} btn h6 d-flex justify-content-center align-items-center gap-2`}
                onClick={() => cancelBooking(item.id)}
              >
                <FaBan />
                <div
                  className={`${styles['btn-cancel-text-bo']} d-flex justify-content-center align-items-center text-center`}
                >
                  <p>取消</p>
                  <p>預訂</p>
                </div>
              </button>
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
            <h6>
              <FaChevronDown className={` ${styles['btn-detail-bo']}`} />
            </h6>
          </label>
          <div
            className={`${styles['list-col-desktop-body-bo']} flex-column flex-sm-row justify-content-between align-items-center gap-2`}
          >
            <ul className="d-flex flex-column justify-content-between align-items-start gap-1">
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
              >
                <FaMapMarkerAlt className={`${styles['col-icon-bo']}`} />
                {item.company_address}
              </li>
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center`}
              >
                <FaPhone className={`${styles['col-icon-bo']}`} />
                {item.company_tele}
              </li>
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center`}
              >
                <FaShop className={`${styles['col-icon-bo']}`} />
                {item.playroom_type} / {item.table_number} 號桌
              </li>
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center`}
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
                <FaMagnifyingGlass className={` ${styles['btn-icon-bo']}`} />
                <div
                  className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
                >
                  <p>店家</p>
                  <p>詳情</p>
                </div>
              </Link>
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
            className={`${styles['list-col-head-mobile-bo']} d-flex d-md-none justify-content-between align-items-center gap-2 text-start`}
            htmlFor={`showDetailMobile${item.id}`}
          >
            <div
              className={`d-flex flex-column justify-content-center align-items-start gap-2 `}
            >
              <div className="d-flex justify-content-between w-100">
                <h6>{item.order_number}</h6>
              </div>
              <h6>{item.company_name}</h6>
              <div
                className={`${styles['list-time-bo']} d-flex flex-row text-start flex-lg-row`}
              >
                <h6>{item.date}</h6>
                <h6>
                  {item.start_time} - {item.end_time}
                </h6>
              </div>
            </div>
            <div></div>
            <div className="d-flex justify-content-center align-items-center gap-4 ">
              {selectedStatus === 'booked' && (
                <button
                  className={`${styles['btn-cancel-bo']} btn h6 d-flex justify-content-center align-items-center gap-2`}
                  onClick={() => cancelBooking(item.id)}
                >
                  <FaBan />
                  <div
                    className={`${styles['btn-cancel-text-bo']} d-flex justify-content-center align-items-center text-center`}
                  >
                    <p>取消</p>
                    <p>預訂</p>
                  </div>
                </button>
              )}
              {selectedStatus === 'completed' && (
                <div
                  className={` ${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                >
                  <FaCheck />
                  已完成
                </div>
              )}
              {selectedStatus === 'cancelled' && (
                <div
                  className={` ${styles['state-text-bo']} h6 d-flex justify-content-center align-items-center gap-2`}
                >
                  <FaXmark />
                  已取消
                </div>
              )}
              <h6>
                <FaChevronDown className={` ${styles['btn-detail-bo']}`} />
              </h6>
            </div>
          </label>
          <div
            className={`${styles['list-col-body-bo']} flex-column flex-sm-row justify-content-between align-items-center gap-2`}
          >
            <ul className="d-flex flex-column justify-content-between align-items-start gap-1 ">
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center text-start`}
              >
                <FaMapMarkerAlt className={`${styles['col-icon-bo']}`} />
                {item.company_address}
              </li>
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center`}
              >
                <FaPhone className={`${styles['col-icon-bo']}`} />
                {item.company_tele}
              </li>
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center`}
              >
                <FaShop className={`${styles['col-icon-bo']}`} />
                {item.playroom_type} / {item.table_number} 號桌
              </li>
              <li
                className={`${styles['list-text-bo']} p d-flex justify-content-center align-items-center`}
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
                <FaMagnifyingGlass className={` ${styles['btn-icon-bo']}`} />
                <div
                  className={`${styles['btn-text-bo']} d-flex justify-content-center align-items-center text-center`}
                >
                  <p>店家</p>
                  <p>詳情</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
