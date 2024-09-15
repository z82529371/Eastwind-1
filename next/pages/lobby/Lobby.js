import React, { useState, useEffect, useCallback, useMemo } from 'react'
import JoinBTN from '@/components/roomList/joinBtn'
import BTNGroup from '@/components/roomList/BtnGroup'
import PageNext from '@/components/roomList/PageNext'
import RoomCard from '@/components/roomList/RoomCard'
import CompanyCard from '@/components/roomList/CompanyCard'
import RoomSearch from '@/components/roomList/RoomSearch'
import styles from '@/styles/gw/_Lobby.module.scss'
import { useRouter } from 'next/router'

export default function Lobby() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeView, setActiveView] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedArea, setSelectedArea] = useState(null)
  const itemsPerPage = 9
  const router = useRouter()

  const fetchData = async (view, page = 1, search = '', area = null) => {
    setLoading(true)
    setError(null)
    try {
      const endpoint = view === 'join' ? 'parties' : 'company'
      const url = `http://localhost:3005/api/${endpoint}?page=${page}&search=${encodeURIComponent(
        search
      )}&area=${encodeURIComponent(area || '')}`
      console.log('Fetching data from:', url)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Received data:', result)

      if (!result || !result.data) {
        throw new Error('Received invalid data format from server')
      }

      setData(result.data)
      setTotalPages(result.totalPages || 0)
      setCurrentPage(result.currentPage || 1)
      setTotalItems(result.totalItems || 0)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(
        `獲取${view === 'join' ? '派對' : '店家'}數據時出錯: ${error.message}`
      )
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const view = router.query.view || 'join'
    if (view !== activeView) {
      setActiveView(view)
      fetchData(view, 1, searchTerm, selectedArea)
    }
  }, [router.query.view, activeView, fetchData, searchTerm, selectedArea])

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term)
      setCurrentPage(1)
      fetchData(activeView, 1, term, selectedArea)
    },
    [activeView, fetchData, selectedArea]
  )

  const handleViewChange = useCallback(
    (view) => {
      router.push(`/lobby/Lobby?view=${view}`, undefined, { shallow: true })
    },
    [router]
  )

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage)
      fetchData(activeView, newPage, searchTerm, selectedArea)
    },
    [activeView, searchTerm, fetchData, selectedArea]
  )

  const handleAreaChange = useCallback(
    (area) => {
      setSelectedArea(area)
      setCurrentPage(1)
      fetchData(activeView, 1, searchTerm, area)
    },
    [activeView, fetchData, searchTerm]
  )

  const renderedCards = data.map((item) =>
    activeView === 'join' ? (
      <RoomCard key={item.id} party={item} />
    ) : (
      <CompanyCard key={item.id} company={item} />
    )
  )

  return (
    <div className="container">
      <div className={styles.topBar}>
        <JoinBTN activeView={activeView} onViewChange={handleViewChange} />
        <RoomSearch onSearch={handleSearch} />
        <BTNGroup onAreaChange={handleAreaChange} selectedArea={selectedArea} />
        <div className={styles.totalCount}>
          共 <span className={styles.numberContainer}>{totalItems}</span> 個
          {activeView === 'join' ? '揪團' : '店家'}
        </div>
      </div>

      <div className={styles.cardArea}>{renderedCards}</div>

      <PageNext
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  )
}
