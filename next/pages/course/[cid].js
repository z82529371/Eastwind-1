import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

export default function ClassDetail() {
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      console.log(router.query)
    }
  }, [router.isReady])

  return <div>ClassDetail</div>
}
