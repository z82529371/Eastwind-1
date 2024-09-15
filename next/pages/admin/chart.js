import React, { useState, useEffect, useContext } from 'react'
import BarChartRegistration from '@/components/test/barChartRegistration'
import BarChartOrder from '@/components/test/barChartOrder'
import BarChartPatry from '@/components/test/barChartParty'
import BarChartBooking from '@/components/test/barChartBooking'
import PieChartGender from '@/components/test/pieChartGender'
import PieChartAge from '@/components/test/pieChartAge'
import PieChartPbCate from '@/components/test/pieCharPbCate'
import PieChartComplete from '@/components/test/pieCharComplete'
import PieChartArea from '@/components/test/pieChartArea'
import LineChartIncome from '@/components/test/lineChartIncome'
import LineChartHour from '@/components/test/lineChartHour'
import AdminCenterLayout from '@/components/layout/admin-layout'
import styles from '@/styles/bearlong/chart.module.scss'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'

export default function Chart() {
  const router = useRouter()
  const { user, loading } = useContext(AuthContext)

  // 確認window(瀏覽器)開始運作
  const [data, setData] = useState([{}])
  const getData = async () => {
    try {
      const url = `http://localhost:3005/api/chart`
      const response = await fetch(url)
      const result = await response.json()
      if (result.status === 'success') {
        const { message, ...data } = result.data
        setData(data)
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getData()

    const intervalId = setInterval(() => {
      getData()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (router.isReady && !loading) {
      if (user) {
        if (user.id !== 62 || (!user && loading === false)) {
          alert('請由正常管道進入')
          router.push('/home')
        }
      } else {
        router.push('/home')
      }
    }
  }, [router.isReady, user])

  return (
    <>
      <div className={styles['main']}>
        <div className={styles['menber-info-box-bo']}>
          <h3 className="m-4">會員結構</h3>
          <div
            className={`${styles.chartBox} d-flex justify-content-center align-items-center flex-column mb-3`}
          >
            <h5>每月註冊</h5>
            <BarChartRegistration statistics={data.regiArr} />
          </div>
          <div
            className={`${styles.chartBox} d-flex justify-content-around align-items-center mb-5`}
          >
            <div
              className={`d-flex justify-content-center align-items-center flex-column ${styles.twoBox} `}
            >
              <h5>男女比</h5>
              <PieChartGender statistics={data.genderArr} />
            </div>
            <div
              className={`d-flex justify-content-center align-items-center flex-column ${styles.twoBox} `}
            >
              <h5>年齡分布</h5>
              <PieChartAge statistics={data.ageArr} />
            </div>
          </div>
          <h3 className="m-4">商品銷售</h3>
          <div
            className={`${styles.chartBox} d-flex justify-content-around align-items-center mb-3`}
          >
            <div
              className={`d-flex justify-content-center align-items-center flex-column ${styles.twoBox} `}
            >
              <h5>營收占比</h5>
              <PieChartPbCate statistics={data.pdCateArr} />
            </div>
            <div className="d-flex justify-content-start align-items-start flex-column">
              <h3>累積銷售</h3>
              <h3>NT: {data.total}</h3>
            </div>
          </div>
          <div
            className={`${styles.chartBox} d-flex justify-content-center align-items-center flex-column mb-3`}
          >
            <h5>訂單數量</h5>
            <BarChartOrder statistics={data.orderArr} />
          </div>
          <div
            className={`${styles.chartBox} d-flex justify-content-center align-items-center flex-column mb-5`}
          >
            <h5>每月營收</h5>
            <LineChartIncome statistics={data.incomeArr} />
          </div>
          <h3 className="m-4">棋牌室</h3>
          <div
            className={`${styles.chartBox} d-flex justify-content-center align-items-center flex-column mb-3`}
          >
            <h5>每月訂桌數</h5>
            <BarChartBooking statistics={data.bookingArr} />
          </div>
          <div
            className={`${styles.chartBox} d-flex justify-content-center align-items-center flex-column mb-3`}
          >
            <h5>每月創團數</h5>
            <BarChartPatry statistics={data.partyArr} />
          </div>
          <div
            className={`${styles.chartBox} d-flex justify-content-center align-items-center flex-column mb-3`}
          >
            <h5>小時熱區</h5>
            <LineChartHour statistics={data.hourArr} />
          </div>
          <div
            className={`${styles.chartBox} d-flex justify-content-around align-items-center mb-3`}
          >
            <div
              className={`d-flex justify-content-center align-items-center flex-column ${styles.twoBox} `}
            >
              <h5>成團率</h5>
              <PieChartComplete statistics={data.completeArr} />
            </div>
            <div
              className={`d-flex justify-content-center align-items-center flex-column ${styles.twoBox} `}
            >
              <h5>訂桌熱區</h5>
              <PieChartArea statistics={data.areaArr} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Chart.getLayout = function (page) {
  return <AdminCenterLayout>{page}</AdminCenterLayout>
}
