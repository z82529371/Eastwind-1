import React, { useEffect, useState, useRef } from 'react'
import styles from '@/styles/aa/classDetail.module.scss'

const CourseInfo = ({ courses ={} }) => {
  const chapterRef = useRef(null)

  const scrollToChapter = () => {
    chapterRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles['detextright1-aa']}>
      <div className={styles['detextright2-aa']}>
        <div className={styles['detextright1-aa']}>
          {/* <h4>麻將入門特訓 - 基礎實作到證照攻略</h4> */}
          <h4>{courses.course_name}</h4>
        </div>
      </div>
      <div className={styles['detextright3-aa']}>
        <div className={styles['textrighth51-aa']}>
          <h5>徐乃麟</h5>
        </div>
        <div className={styles['textrighth52-aa']}>
          <h5>類別：麻將</h5>
          {/* <h5>類別：{courses.ch_name}</h5> */}
        </div>
      </div>
      <div className={styles['detextright4-aa']}>
        <h5>
          麻將證照攻略課程，教你麻將的程式語法與麻將證照攻略，循序漸進學習麻將開發環境的建置..
        </h5>
        {/* <h5>{courses.content}</h5> */}
      </div>
      <div className={styles['detextright5-aa']}>
        <h4>NT$ 2,480</h4>
        {/* <h4>NT$ {courses.price}</h4> */}
        <div className={styles['chh6-aa']}>
          <div className={styles['chh61-aa']}>
            <button className={styles['chh62-aa']} onClick={scrollToChapter}>
              <h6>查看章節</h6>
            </button>
          </div>
          <h6 style={{ color: 'var(--text-hover, #747474)' }}>
            總時長 60 分鐘
          </h6>
        </div>
      </div>
      <div className={styles['detextright6-aa']}>
        <div className={styles['BTNde1-aa']}>
          <div className={styles['BUTTONde1-aa']}>
            <h5>立即購買</h5>
          </div>
        </div>
        <div className={styles['BTNde2-aa']}>
          <div className={styles['BUTTONde2-aa']}>
            <h5>加入購物車</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseInfo
