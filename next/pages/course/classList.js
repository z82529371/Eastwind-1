import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/aa/classList.module.scss'
import ClassCard from '@/components/course/card'
import ClassGroup from '@/components/course/cards'

export default function ClassList() {
  // 注意1: 初始值至少要空陣列，初次render是用初始值
  // 注意2: 應用執行過程中，一定要保持狀態資料類型都是陣列
  const [courses, setCourses] = useState([])
  const router = useRouter()
  const courseName = useState('')
  const [pages, setPages] = useState(1)
  const { category_id } = router.query

  // 向伺服器連線的程式碼；向伺服器fetch獲取資料
  const getCourses = async () => {
    const apiURL = `http://localhost:3005/api/course`
    try {
      const res = await fetch(apiURL)
      const data = await res.json()

      console.log(data.data.courses)

      // 設定到狀態中 ==> 觸發re-render(進入update階段)
      if (Array.isArray(data.data.courses)) {
        setCourses(data.data.courses)
        console.log(data.data.courses)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 樣式2: didMount
  // 首次render之後(after)執行一次，之後不會再執行
  useEffect(() => {
    getCourses()
  }, [])

  // const handleCardClick = (course_id) => {
  //   router.push(`/course/detail/${course_id}`)
  // }

  const handleLoadMore = () => {
    if (pages * 10 < courses.total) {
      setPages((page) => page + 1)
    }
  }

  return (
    <>
      <div className="container">
        <div className={styles['desktop-list-aa']}>
          <div className={styles['sec1-aa']}>
            <div className={styles['text2-aa']}>
              <h2>課程排行</h2>
            </div>
            <div className={styles['classCards-aa']}>
              {Object.values(courses)
                .flat()
                .slice(0, 4)
                .map((courseData, index) => (
                  <Link
                    href={`/course/detail/`}
                    key={courseData.id}
                    className={styles['card-link']}
                  >
                    <ClassCard courseData={courseData} rank={index + 1} />
                  </Link>
                ))}
            </div>

            <div className={styles['line-aa']}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={1298}
                height={4}
                viewBox="0 0 1298 4"
                fill="none"
              >
                <path
                  d="M2 0H0V4H2V0ZM1296 4C1297.1 4 1298 3.10457 1298 2C1298 0.895431 1297.1 0 1296 0V4ZM2 4H1296V0H2V4Z"
                  fill="url(#paint0_linear_2284_1232)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2284_1232"
                    x1={649}
                    y1={2}
                    x2={649}
                    y2={3}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#DAA520" />
                    <stop offset={1} stopColor="#745811" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={styles['texth2-aa']}>
              <h2>所有課程 列表</h2>
            </div>
            <div className={styles['text2-aa']}>
              <h2>西洋棋</h2>
            </div>
            <div className={styles['classCards-aa']}>
              {Object.values(courses)
                .flat()
                .filter((course) => course.category_id === 4)
                .slice(0, 4)
                .map((classItem, index) => (
                  <ClassCard key={classItem.id} courseData={classItem} />
                ))}
            </div>
            <Link href={`/course/classListCate?category_id=4`}>
              <div className={`${styles['btn-more']} d-flex`}>
                <p>查看更多</p>
                <svg
                  className={styles['btn-more1']}
                  xmlns="http://www.w3.org/2000/svg"
                  width={109}
                  height={14}
                  viewBox="0 0 109 14"
                  fill="none"
                >
                  <path
                    d="M43 11H83"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d="M82.8994 10.8995L72.9999 0.99998"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Link>
            <div className={styles['text2-aa']}>
              <h2>麻將</h2>
            </div>
            <div className={styles['classCards-aa']}>
              {Object.values(courses)
                .flat()
                .filter((course) => course.category_id === 2)
                .slice(0, 4)
                .map((classItem, index) => (
                  <ClassCard key={classItem.id} courseData={classItem} />
                ))}
            </div>
            <Link href={`/course/classListCate?category_id=2`}>
              <div className={`${styles['btn-more']} d-flex`}>
                <p>查看更多</p>
                <svg
                  className={styles['btn-more1']}
                  xmlns="http://www.w3.org/2000/svg"
                  width={109}
                  height={14}
                  viewBox="0 0 109 14"
                  fill="none"
                >
                  <path
                    d="M43 11H83"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d="M82.8994 10.8995L72.9999 0.99998"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Link>
            <div className={styles['text2-aa']}>
              <h2>圍棋</h2>
            </div>
            <div className={styles['classCards-aa']}>
              {Object.values(courses)
                .flat()
                .filter((course) => course.category_id === 3)
                .slice(0, 4)
                .map((classItem, index) => (
                  <ClassCard key={classItem.id} courseData={classItem} />
                ))}
            </div>
            <Link href={`/course/classListCate?category_id=3`}>
              <div className={`${styles['btn-more']} d-flex`}>
                <p>查看更多</p>
                <svg
                  className={styles['btn-more1']}
                  xmlns="http://www.w3.org/2000/svg"
                  width={109}
                  height={14}
                  viewBox="0 0 109 14"
                  fill="none"
                >
                  <path
                    d="M43 11H83"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d="M82.8994 10.8995L72.9999 0.99998"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Link>
            <div className={styles['text2-aa']}>
              <h2>撲克</h2>
            </div>
            <div className={styles['classCards-aa']}>
              {Object.values(courses)
                .flat()
                .filter((course) => course.category_id === 1)
                .slice(0, 4)
                .map((classItem, index) => (
                  <ClassCard key={classItem.id} courseData={classItem} />
                ))}
            </div>
            <Link href={`/course/classListCate?category_id=1`}>
              <div className={`${styles['btn-more']} d-flex`}>
                <p>查看更多</p>
                <svg
                  className={styles['btn-more1']}
                  xmlns="http://www.w3.org/2000/svg"
                  width={109}
                  height={14}
                  viewBox="0 0 109 14"
                  fill="none"
                >
                  <path
                    d="M43 11H83"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d="M82.8994 10.8995L72.9999 0.99998"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Link>
            <div className={styles['text2-aa']}>
              <h2>象棋</h2>
            </div>
            <div className={styles['classCards-aa']}>
              {Object.values(courses)
                .flat()
                .filter((course) => course.category_id === 5)
                .slice(0, 4)
                .map((classItem, index) => (
                  <ClassCard key={classItem.id} courseData={classItem} />
                ))}
            </div>
            <Link href={`/course/classListCate?category_id=5`}>
              <div className={`${styles['btn-more']} d-flex`}>
                <p>查看更多</p>
                <svg
                  className={styles['btn-more1']}
                  xmlns="http://www.w3.org/2000/svg"
                  width={109}
                  height={14}
                  viewBox="0 0 109 14"
                  fill="none"
                >
                  <path
                    d="M43 11H83"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <path
                    d="M82.8994 10.8995L72.9999 0.99998"
                    stroke="#B79347"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
