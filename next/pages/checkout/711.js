import { useShip711StoreCallback } from '@/hooks/use-ship-711-store'
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { useCart } from '@/hooks/use-cart'

export default function Callback() {
  const { user, loading } = useContext(AuthContext)
  useShip711StoreCallback()
  // 呼叫回送到母視窗用的勾子函式

  return <></>
}
