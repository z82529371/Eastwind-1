import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/aa/classDetail.module.scss'

const generateRandomId = () => {
  return Math.floor(Math.random() * 80) + 1
}

// 單個卡片組件
const CourseCard = ({ contentData = {} }) => {
  contentData.id = generateRandomId()

  return (
    <Link
      // href={`/course/classDetail?id=1`}
      href={`/course/detail/?id=${contentData.id}`}
      className={styles['card-link']}
      key={contentData.id}
    >
      <div className={styles['sec2classtCard-aa']}>
        {/* <img
          src="https://hahow-production.imgix.net/5fb4fc22563bc0262f9fb105?w=1000&sat=0&auto=format&s=f7cb3bd23dc48b1089edb34423906993"
          alt="課程圖片"
          className={styles['sec2CardImg-aa']}
        /> */}

        <Image
          src={`/images/aa/${contentData.images}` || ''}
          alt={contentData.course_name || ''}
          className={styles['sec2CardImg-aa']}
          width={280}
          height={175}
        />

        <div className={styles['sec2cardBody-aa']}>
          <div className={styles['declassName-aa']}>
            {/* <p>西洋棋國手教你下西洋棋</p>
            <p>劉業揚＆楊元翰</p> */}
            <p>{contentData.course_name}</p>
            <p>{contentData.ch_name}</p>
          </div>
          <p
            style={{
              color: 'var(--text-color, #0e0e0e)',
              textAlign: 'center',
              alignSelf: 'stretch',
            }}
          >
            {/* NT$450 */}
            {contentData.price}
          </p>
        </div>
      </div>
    </Link>
  )
}

// 主組件
const Recommends = () => {
  const cards = Array.from({ length: 4 }, () => generateRandomId())

  // const cards = .map(() => ({
  //   ...card,
  //   id: generateRandomId(),
  // }))

  // const Recommends = ({ coursesData = [] }) => {
  //   const cards =
  //     coursesData.length > 0
  //       ? coursesData
  //       : Array.from({ length: 4 }, () => ({ id: generateRandomId() }))

  return (
    <div className={styles['sec2cardgroup-aa']}>
      {cards.map((contentData) => (
        <CourseCard key={contentData.id} />
      ))}
    </div>
  )
}

export default Recommends
