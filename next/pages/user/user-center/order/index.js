import React, { useEffect, useState, useContext } from 'react'
import OrderList from '@/components/order/orderList'
import { useRouter } from 'next/router'
import { useCart } from '@/hooks/use-cart'
import UserCenterLayout from '@/components/layout/user-center-layout'

export default function OrderListHome() {
  return (
    <>
      <OrderList />
    </>
  )
}

OrderListHome.getLayout = function (page) {
  return <UserCenterLayout>{page}</UserCenterLayout>
}
