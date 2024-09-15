import React, { useEffect, useState, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/aa/classDetail.module.scss'
import CategoryLink from '@/components/course/category-link'
import CourseInfo from '@/components/course/course-info'
import Content from '@/components/course/content'
import Recommends from '@/components/course/recommends'
import PacmanLoader from 'react-spinners/PacmanLoader'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import VideoPlayer from '@/components/course/video'
import { Button } from 'react-bootstrap'
import { AuthContext } from '@/context/AuthContext'
import { useCart } from '@/hooks/use-cart'
import { FaHeart } from 'react-icons/fa6'
import { CiHeart } from 'react-icons/ci'

const override = {
  display: 'block',
  margin: '0 auto',
  // borderColor: 'red',
}

export default function Detail() {
  const { handleAdd = () => {}, handleShow = () => {}, cart } = useCart()
  const { user } = useContext(AuthContext)
  const [courses, setCourses] = useState([])

  const [data, setData] = useState({
    course: {
      id: 0,
      course_name: '',
      category_id: 0,
      content: [],
      price: 0,
      on_datetime: '0000-00-00',
      off_datetime: null,
      created_at: '0000-00-00',
      updated_at: null,
      images: '',
      ch_name: '',
    },
  })
  const router = useRouter()
  const [pages, setPages] = useState(1)
  const [category, setCategory] = useState({})
  const [videoUrl, setVideoUrl] = useState(`/video/go3.mp4`)
  const [isPaused, setIsPaused] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { course_id, category_id, id } = router.query
  const chapterRef = useRef(null)

  // 向伺服器連線的程式碼；向伺服器fetch獲取資料
  const getCourses = async () => {
    const apiURL = `http://localhost:3005/api/course/${id}${
      user ? `?uid=${user.id}` : ''
    }`
    console.log(user)
    try {
      const res = await fetch(apiURL)
      const data = await res.json()

      // 設定到狀態中 ==> 觸發re-render(進入update階段)
      if (data.status === 'success') {
        setCourses(data.data.course)
        // setCategory(data.data.courses)
        console.log(data.data.courses)

        setTimeout(() => {
          setIsLoading(false)
        }, 0)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 樣式2: didMount
  // 首次render之後(after)執行一次，之後不會再執行
  useEffect(() => {
    if (router.isReady) {
      getCourses()
      // , getCategory()
    }
  }, [router.isReady, router.query, user])

  // 滾動到 "章節" 的函數
  const scrollToChapter = () => {
    // 檢查 chapterRef.current 是否存在
    if (chapterRef.current) {
      // 如果存在，則平滑滾動到該元素
      chapterRef.current.scrollIntoView({ behavior: 'smooth' })
    } else {
      // 如果不存在，可以添加一些錯誤處理或日誌記錄
      console.log('無法找到章節元素')
    }
  }

  // 切換收縮狀態的函數
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev) // 切換狀態
  }

  const handleFavToggle = async (id, type) => {
    const fav = courses.fav
    console.log(fav)
    const url = `http://localhost:3005/api/favorites/${id}`
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
          `${method === 'POST' ? '商品已加入收藏' : '商品已移除收藏'}`,
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
        const nextCourse = { ...courses, fav: !courses.fav }
        setCourses(nextCourse)
        // setData({ ...data, course: nextCourse })
      } else {
        console.log(result.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleStyToggle = async () => {
    {
      courses.fav ? <FaHeart fontSize={24} /> : <CiHeart fontSize={24} />
    }
    {
      courses.fav ? `加入` : `移除`
    }
  }

  // const loader = (
  //   <PacmanLoader
  //     color="#ff6600"
  //     loading={isLoading}
  //     cssOverride={override}
  //     size={30}
  //     aria-label="Loading Spinner"
  //     data-testid="loader"
  //     z-index={999}
  //   />
  // )
  const Loader = ({ isLoading, color = '#ff6600', size = 30 }) => {
    return (
      <PacmanLoader
        color={color}
        loading={isLoading}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
        z-index={999}
      />
    )
  }

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className={`${styles.container} ${styles['desktopdetail-aa']}`}>
        <div className={styles['detailsec1-aa']}>
          <div className={`${styles['text141-aa']} ${styles['text-hover']}`}>
            <h6>
              <Link
                className={styles['card-link-n']}
                href={`/course/classList`}
              >
                <span>所有課程 </span>
              </Link>
              &gt;
              <CategoryLink contentData={courses} />
            </h6>
          </div>
          <div className={styles['desec1box-aa']}>
            <div className={styles['de1-ins-aa']}>
              <VideoPlayer
                videoUrl={videoUrl}
                // thumbnailUrl="../../public/images/aa/${courses.images}"
              />
            </div>

            <div className={styles['detextright1-aa']}>
              <div className={styles['detextright2-aa']}>
                <div className={styles['detextright1-aa']}>
                  <h4>{courses.course_name}</h4>
                </div>
              </div>
              <div className={styles['detextright3-aa']}>
                <div className={styles['textrighth51-aa']}>
                  <h5>上架日期: {courses.on_datetime}</h5>
                </div>
                <button
                  className={styles['fav1-aa']}
                  onClick={() => {
                    if (user) {
                      handleFavToggle(courses.id, 'course')
                      handleStyToggle()
                    } else {
                      toast.error('請先登入會員')
                      return
                    }
                  }}
                >
                  <h6>{courses.fav ? `移除` : `加入`}收藏</h6>
                  {courses.fav ? (
                    <FaHeart fontSize={24} />
                  ) : (
                    <CiHeart fontSize={24} />
                  )}
                </button>

                <div className={styles['textrighth52-aa']}>
                  <h5>類別：{courses.category_name}</h5>
                </div>
              </div>
              <div className={styles['detextright4-aa']}>
                <h5>{courses.content}</h5>
              </div>
              <div className={styles['detextright5-aa']}>
                <h4>NT$ {courses.price}</h4>
                <div className={styles['chh6-aa']}>
                  {/* <div className={styles['chh61-aa']}>
                    <button
                      className={styles['chh62-aa']}
                      onClick={scrollToChapter}
                    >
                      <h6>查看章節</h6>
                    </button>
                  </div> */}
                  {/* <h6 style={{ color: 'var(--text-hover, #747474)' }}>
                    總時長 60 分鐘
                  </h6> */}
                </div>
              </div>
              <div className={styles['detextright6-aa']}>
                <button
                  className={styles['BTNde1-aa']}
                  onClick={() => {
                    if (user) {
                      const itemExists = cart.find(
                        (cartItem) =>
                          cartItem.object_id === courses.id &&
                          cartItem.object_type === 'course'
                      )
                      if (itemExists) {
                        toast.error('此商品已在購物車中，無法再次加入', {
                          style: {
                            border: `1px solid #d71515`,
                            padding: '16px',
                            fontSize: '16px',
                            color: '#0e0e0e',
                          },
                          iconTheme: {
                            primary: `#d71515`,
                            secondary: '#ffffff',
                            fontSize: '16px',
                          },
                        })
                        return
                      }
                      handleAdd(courses, 'course', 1)
                      handleShow()
                    } else {
                      toast.error('請先登入會員')
                      return
                    }
                  }}
                >
                  <div className={styles['BUTTONde1-aa']}>
                    <h5>立即購買</h5>
                  </div>
                </button>
                <button
                  className={styles['BTNde2-aa']}
                  onClick={() => {
                    if (user) {
                      const itemExists = cart.find(
                        (cartItem) =>
                          cartItem.object_id === courses.id &&
                          cartItem.object_type === 'course'
                      )
                      if (itemExists) {
                        toast.error('此商品已在購物車中，無法再次加入', {
                          style: {
                            border: `1px solid #d71515`,
                            padding: '16px',
                            fontSize: '16px',
                            color: '#0e0e0e',
                          },
                          iconTheme: {
                            primary: `#d71515`,
                            secondary: '#ffffff',
                            fontSize: '16px',
                          },
                        })
                        return
                      }

                      toast.success('加入購物車成功', {
                        style: {
                          border: `1px solid #55c57a`,
                          padding: '16px',
                          fontSize: '16px',
                          color: '#0e0e0e',
                        },
                        iconTheme: {
                          primary: `#55c57a`,
                          secondary: '#ffffff',
                          fontSize: '16px',
                        },
                      })
                      handleAdd(courses, 'course', 1)
                    } else {
                      toast.error('請先登入會員')
                      return
                    }
                  }}
                >
                  <div className={styles['BUTTONde2-aa']}>
                    <h5>加入購物車</h5>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['texth2detail2-aa']}>
          <div className={styles['texth2detail21-aa']}>
            <h2>課程內容</h2>
          </div>
        </div>

        <div className={`${styles['classCards-aa']} pb-5`}>
          <Content contentData={courses} />
        </div>
        {/* <div className={styles['texth2detail2-aa']}>
          <div className={styles['texth2detail21-aa']}>
            <h2 style={{ paddingTop: '3rem' }} ref={chapterRef}>
              章節
            </h2>
          </div>
        </div>
        <div className={styles['chap4detail-aa']}>
          <div className={styles['unit-aa']}>
            <div className={styles['text16-aa']}>
              <h6>單元一覽</h6>
            </div>
            <div
              className={styles['text14-aa']}
              style={{ color: 'var(--text-hover, #747474)' }}
            >
              <p>1 章 10 單元｜總時長 60 分鐘</p>
            </div>
          </div>
          <div className={styles['textgruop15-aa']}>
            <div className={styles['text15-aa']}>
              <div className={styles['text15-1-aa']}>
                <h6 style={{ color: 'var(--bg-text-color, #faf7f0)' }}>
                  本課程章節
                </h6>
              </div>
              <button
                className={styles['btn-more15-aa']}
                onClick={toggleCollapse}
                style={{
                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <div
                  className={styles['Ellipse15-aa']}
                  style={{
                    strokeWidth: 2,
                    stroke: 'var(--bg-text-color, #FAF7F0)',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={29}
                    height={30}
                    viewBox="0 0 29 30"
                    fill="none"
                  >
                    <circle
                      cx="14.5"
                      cy="14.9116"
                      r="13.5"
                      transform="rotate(-90 14.5 14.9116)"
                      stroke="#FAF7F0"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div
                  className={styles['Arrow15-aa']}
                  style={{
                    strokeWidth: 2,
                    stroke: 'var(--bg-text-color, #FAF7F0)',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={13}
                    viewBox="0 0 16 13"
                    fill="none"
                  >
                    <path
                      d="M7.00003 11.4034C6.9955 11.9557 7.43952 12.4071 7.99179 12.4116C8.54405 12.4161 8.99543 11.9721 8.99997 11.4198L7.00003 11.4034ZM8.79502 0.710683C8.40771 0.316964 7.77457 0.311764 7.38085 0.699068L0.96484 7.01055C0.571122 7.39785 0.565922 8.031 0.953226 8.42471C1.34053 8.81843 1.97367 8.82363 2.36739 8.43633L8.07051 2.82612L13.6807 8.52925C14.068 8.92296 14.7012 8.92817 15.0949 8.54086C15.4886 8.15356 15.4938 7.52041 15.1065 7.1267L8.79502 0.710683ZM8.99997 11.4198L9.08209 1.42017L7.08216 1.40375L7.00003 11.4034L8.99997 11.4198Z"
                      fill="#FAF7F0"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div
            className={styles['text14-groups-aa']}
            style={{
              display: isCollapsed ? 'none' : 'block',
              transition: 'max-height 0.5s',
              overflow: 'hidden',
            }}
          >
            <div className={styles['text14-group-aa']}>
              <div className={styles['text14-1-aa']}>
                <h6>01</h6>
              </div>
              <div className={styles['text14-2-aa']}>
                <h6>如何排列西洋棋</h6>
              </div>
              <div className={styles['text14-3-aa']}>
                <h6>09:40</h6>
              </div>
            </div>
            <div className={styles['text14-group-aa']}>
              <div className={styles['text14-1-aa']}>
                <h6>02</h6>
              </div>
              <div className={styles['text14-2-aa']}>
                <h6>棋子介紹與基本移動</h6>
              </div>
              <div className={styles['text14-3-aa']}>
                <h6>16:26</h6>
              </div>
            </div>
            <div className={styles['text14-group-aa']}>
              <div className={styles['text14-1-aa']}>
                <h6>03</h6>
              </div>
              <div className={styles['text14-2-aa']}>
                <h6>棋盤控制與中心控制</h6>
              </div>
              <div className={styles['text14-3-aa']}>
                <h6>16:54</h6>
              </div>
            </div>
            <div className={styles['text14-group-aa']}>
              <div className={styles['text14-1-aa']}>
                <h6>04</h6>
              </div>
              <div className={styles['text14-2-aa']}>
                <h6>開局策略與基本開局介紹</h6>
              </div>
              <div className={styles['text14-3-aa']}>
                <h6>14:39</h6>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['desec2-aa']}>
          <div className={styles['texth2sec2-aa']}>
            <h2>推薦課程</h2>
          </div>
          <div className={styles['desec21-aa']}>
            <div className={styles['btn-more-mini-l-aa']}>
              <div className={styles['Ellipse-l-aa']}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <circle
                    cx={25}
                    cy={25}
                    r={24}
                    transform="matrix(-1 0 0 1 50 0)"
                    stroke="#76592A"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className={styles['Arrow-l-aa']}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={17}
                  height={16}
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M15.9918 7.00003C16.5441 6.9955 16.9954 7.43952 17 7.99179C17.0045 8.54405 16.5605 8.99543 16.0082 8.99997L15.9918 7.00003ZM1.26353 8.82816C0.86981 8.44086 0.86461 7.80772 1.25191 7.414L7.56339 0.997984C7.9507 0.604266 8.58384 0.599066 8.97756 0.98637C9.37128 1.37367 9.37648 2.00682 8.98917 2.40054L3.37897 8.10366L9.08209 13.7139C9.47581 14.1012 9.48101 14.7343 9.09371 15.128C8.7064 15.5217 8.07326 15.5269 7.67954 15.1396L1.26353 8.82816ZM16.0082 8.99997L1.97302 9.11524L1.95659 7.11531L15.9918 7.00003L16.0082 8.99997Z"
                    fill="#76592A"
                  />
                </svg>
              </div>
            </div>
            <Recommends contentData={courses} />
            <div className={styles['btn-more-mini-r-aa']}>
              <div className={styles['Ellipse-r-aa']}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={50}
                  height={50}
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <circle
                    cx={25}
                    cy={25}
                    r={24}
                    stroke="#76592A"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className={styles['Arrow-r-aa']}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={17}
                  height={16}
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M1.00821 7.00003C0.455947 6.9955 0.00456955 7.43952 3.37362e-05 7.99179C-0.00450208 8.54405 0.439521 8.99543 0.991787 8.99997L1.00821 7.00003ZM15.7365 8.82816C16.1302 8.44086 16.1354 7.80772 15.7481 7.414L9.43661 0.997984C9.0493 0.604266 8.41616 0.599066 8.02244 0.98637C7.62872 1.37367 7.62352 2.00682 8.01083 2.40054L13.621 8.10366L7.91791 13.7139C7.52419 14.1012 7.51899 14.7343 7.90629 15.128C8.2936 15.5217 8.92674 15.5269 9.32046 15.1396L15.7365 8.82816ZM0.991787 8.99997L15.027 9.11524L15.0434 7.11531L1.00821 7.00003L0.991787 8.99997Z"
                    fill="#76592A"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}
