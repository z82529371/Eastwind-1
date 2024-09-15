import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/aa/classListCate.module.scss'
import ClassCard from '@/components/course/card'
import { useLocation } from 'react-router-dom'

export default function ClassListCate() {
  const router = useRouter()
  const [id, setId] = useState(null)
  const { category_id } = router.query
  const [courses, setCourses] = useState({ list: [] })
  const [pages, setPages] = useState()
  const [filter, setFilter] = useState()

  // 向伺服器連線的程式碼；向伺服器fetch獲取資料
  const getCourses = async () => {
    const apiURL = `http://localhost:3005/api/course`
    try {
      const res = await fetch(apiURL)
      const data = await res.json()

      // 設定到狀態中 ==> 觸發re-render(進入update階段)
      if (Array.isArray(data.data.courses)) {
        setCourses(data.data.courses)
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

  const handleLoadMore = () => {
    if (pages * 8 < courses.total) {
      setPages((page) => page + 1)
    }
  }
  return (
    <>
      <div className="container">
        <div className={styles['desktopList2-aa']}>
          <div className={styles['sec1-aa']}>
            <div className={styles['text12-aa']}>
              {courses &&
                Object.values(courses)
                  .flat()
                  .filter(
                    (course) => course.category_id === Number(category_id)
                  )
                  .slice(0, 1)
                  .map((course, index) => {
                    console.log(course)
                    return <h2 key={course.id}>{course.ch_name}課程 排行</h2>
                  })}
            </div>
            <div className={styles['classCards-aa']}>
              {courses &&
                Object.values(courses)
                  .flat()
                  .filter(
                    (course) => course.category_id === Number(category_id)
                  )
                  .slice(0, 4)
                  .map((course, index) => (
                    <ClassCard
                      key={course.id}
                      courseData={course}
                      rank={index + 1}
                    />
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
          </div>
          <div className={styles['texth22-aa']}>
            {courses &&
              Object.values(courses)
                .flat()
                .filter((course) => course.category_id === Number(category_id))
                .slice(0, 1)
                .map((course, index) => {
                  console.log(course)
                  return <h2 key={course.id}>{course.ch_name}課程 列表</h2>
                })}
          </div>
          <div className={styles['sec2']}>
            <div className={styles['text2-aa']}>
              <div className={styles['navBarContent-aa']}>
                {/* <h5>36 課程</h5> */}
                {/* <h5>{courses.total} 課程</h5> */}
                {/* <div className={styles['iconGroup-aa']}>
                  <div className={styles['button22']}>
                    <div className={styles['button23-aa']}>
                      <div className={styles['vector3-aa']}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={14}
                          height={15}
                          viewBox="0 0 14 15"
                          fill="none"
                        >
                          <path
                            d="M11.3756 6.18667C11.3756 7.44156 10.9681 8.60077 10.2818 9.54125L13.7436 13.0052C14.0855 13.3469 14.0855 13.9019 13.7436 14.2437C13.4018 14.5854 12.8467 14.5854 12.5049 14.2437L9.04302 10.7797C8.10235 11.4687 6.94292 11.8733 5.68778 11.8733C2.54583 11.8733 0 9.328 0 6.18667C0 3.04533 2.54583 0.5 5.68778 0.5C8.82973 0.5 11.3756 3.04533 11.3756 6.18667ZM5.68778 10.1236C6.20488 10.1236 6.71692 10.0218 7.19467 9.82391C7.67241 9.62606 8.1065 9.33607 8.47215 8.97049C8.83779 8.60491 9.12784 8.17091 9.32573 7.69326C9.52362 7.21561 9.62547 6.70367 9.62547 6.18667C9.62547 5.66966 9.52362 5.15772 9.32573 4.68007C9.12784 4.20242 8.83779 3.76842 8.47215 3.40284C8.1065 3.03726 7.67241 2.74727 7.19467 2.54942C6.71692 2.35158 6.20488 2.24974 5.68778 2.24974C5.17067 2.24974 4.65863 2.35158 4.18089 2.54942C3.70315 2.74727 3.26906 3.03726 2.90341 3.40284C2.53776 3.76842 2.24771 4.20242 2.04982 4.68007C1.85194 5.15772 1.75009 5.66966 1.75009 6.18667C1.75009 6.70367 1.85194 7.21561 2.04982 7.69326C2.24771 8.17091 2.53776 8.60491 2.90341 8.97049C3.26906 9.33607 3.70315 9.62606 4.18089 9.82391C4.65863 10.0218 5.17067 10.1236 5.68778 10.1236Z"
                            fill="#FAF7F0"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className={styles['vector']}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={26}
                      height={23}
                      viewBox="0 0 26 23"
                      fill="none"
                    >
                      <path
                        d="M0.197805 1.62459C0.533 0.937067 1.24402 0.5 2.03122 0.5H23.9713C24.7585 0.5 25.4695 0.937067 25.8047 1.62459C26.1399 2.31211 26.0383 3.1224 25.5406 3.7117L16.2516 14.6875V20.9292C16.2516 21.5234 15.9063 22.0685 15.3527 22.3337C14.7991 22.5989 14.144 22.5449 13.6513 22.1864L10.401 19.8292C9.98958 19.5345 9.75088 19.068 9.75088 18.572V14.6875L0.456819 3.70679C-0.0358165 3.1224 -0.14247 2.3072 0.197805 1.62459Z"
                        fill="#B79347"
                      />
                    </svg>
                  </div>
                  <div className={styles['vector']}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={19}
                      height={29}
                      viewBox="0 0 19 29"
                      fill="none"
                    >
                      <path
                        d="M8.15803 1.08587C8.89991 0.304709 10.1047 0.304709 10.8466 1.08587L18.4434 9.08498C18.9894 9.65991 19.1497 10.5161 18.8529 11.266C18.5562 12.0159 17.8677 12.5033 17.0962 12.5033H1.90251C1.13689 12.5033 0.442496 12.0159 0.145745 11.266C-0.151007 10.5161 0.0151741 9.65991 0.555261 9.08498L8.15209 1.08587H8.15803ZM8.15803 27.9141L0.561196 19.915C0.0151741 19.3401 -0.145072 18.4839 0.15168 17.734C0.448431 16.9841 1.13689 16.4967 1.90845 16.4967H17.0962C17.8618 16.4967 18.5562 16.9841 18.8529 17.734C19.1497 18.4839 18.9835 19.3401 18.4434 19.915L10.8466 27.9141C10.1047 28.6953 8.89991 28.6953 8.15803 27.9141Z"
                        fill="#B79347"
                      />
                    </svg>
                  </div>
                </div> */}
              </div>
            </div>
            <div className={styles['cardgroup22-aa']}>
              <div className={styles['classCards-aa']}>
                {courses &&
                  Object.values(courses)
                    .flat()
                    .filter(
                      (course) => course.category_id === Number(category_id)
                    )
                    .map((course, index) => (
                      <ClassCard key={course.id} courseData={course} />
                    ))}
              </div>
            </div>
          </div>
          <div className={styles['sec23-aa']}>
            {/* <button className={styles['loadMore-aa']} onClick={handleLoadMore}>
              <div className={styles['text23-aa']}>
                <h6>16/36</h6>
              </div>
              <div className={styles['progressBar-aa']}>
                <div className={styles['Line-9']}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={256}
                    height={6}
                    viewBox="0 0 256 6"
                    fill="none"
                  >
                    <path
                      d="M3 3H253"
                      stroke="#CECECE"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className={styles['Line-8']}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={38}
                    height={6}
                    viewBox="0 0 38 6"
                    fill="none"
                  >
                    <path
                      d="M3 0.5C1.61929 0.5 0.5 1.61929 0.5 3C0.5 4.38071 1.61929 5.5 3 5.5V0.5ZM35 5.5H37.5V0.5H35V5.5ZM3 5.5H35V0.5H3V5.5Z"
                      fill="#B79347"
                    />
                  </svg>
                </div>
              </div>
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
            </button> */}
          </div>
        </div>
      </div>
    </>
  )
}
