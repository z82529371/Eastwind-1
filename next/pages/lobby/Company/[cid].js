import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from 'react'
import BookingLeftArea from '@/components/BookingPage/BookingLeftArea'
import BookingRightArea from '@/components/BookingPage/BookingRightArea'
import styles from '@/styles/gw/_partypage.module.scss'
import { AuthContext } from '@/context/AuthContext'

import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

export default function CompanyPage() {
  const router = useRouter()
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  console.log(user)

  useEffect(() => {
    if (!router.isReady) return

    const { cid } = router.query
    console.log('Company ID:', cid)

    if (cid) {
      setLoading(true)
      fetch(`http://localhost:3005/api/company/${cid}${user ? `?uid=${user.id}` : ''}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          if (data) {
            setCompanyData(data)
            console.log(data)
          } else {
            throw new Error('No data received')
          }
        })
        .catch((error) => {
          console.error('Error fetching company data:', error)
          setError(error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [router.isReady,user])


  const handleFavToggle = async (object_id, type) => {
    const fav = companyData.fav
    const url = `http://localhost:3005/api/favorites/${object_id}`
    const method = fav ? 'DELETE' : 'POST'
    const body = JSON.stringify({
      uid: user.id,
      type: type,
    })
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })
      const result = await response.json()
      if (result.status === 'success') {
        toast.success(
          `${method === 'POST' ? '商品已加入收藏!' : '商品已移除收藏!'}`,
          {
            style: {
              border: `1px solid ${method === 'POST' ? '#55c57a' : '#d71515'}`,
              padding: '16px',
              fontSize: '16px',
              color: '#0e0e0e',
            },
            iconTheme: {
              primary: `${method === 'POST' ? '#55c57a' : '#d71515'}`,
              secondary: '#ffffff',
              fontSize: '16px',
            },
          }
        )
        const nextParty = { ...companyData, fav: !companyData.fav }
        console.log(nextParty)
        setCompanyData(nextParty)
      } else {
        console.log(result.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (!router.isReady || loading) return <div>載入中...</div>
  if (error) return <div>錯誤：{error}</div>
  if (!companyData) return <div>找不到公司資料</div>

  return (
    <div className="container">
      <div className={styles.main}>
      <Toaster position="bottom-right" reverseOrder={false} />

        <BookingLeftArea handleFavToggle={handleFavToggle} user={user} companyData={companyData} />
        <BookingRightArea user={user} companyData={companyData} />
      </div>
    </div>
  )
}
