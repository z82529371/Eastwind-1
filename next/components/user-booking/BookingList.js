import React from 'react'
import BookingItem from './BookingItem'
import styles from '@/styles/boyu/user-booking.module.scss'

export default function BookingList({
  booking,
  selectedStatus,
  cancelBooking,
  user,
}) {
  return (
    <div>
      {booking.length === 0 ? (
        <div className="h5 p-5">尚未有訂位紀錄</div>
      ) : (
        booking.map((item) => (
          <BookingItem
            user={user}
            key={item.order_number}
            item={item}
            selectedStatus={selectedStatus}
            cancelBooking={cancelBooking}
          />
        ))
      )}
    </div>
  )
}
