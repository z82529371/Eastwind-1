import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/aa/classList.module.scss'

const ClassCard = ({ courseData, rank }) => (
  <div className={styles['classCard-aa']}>
    <Link
      className={styles['card-link']}
      href={`/course/detail/?id=${courseData.id}`}
    >
      <div className={styles['imgBox-aa']}>
        {rank && <div className={styles[`rank${rank}`]}>{rank}</div>}
        <Image
          src={
            `/images/aa/${courseData.images}` ||
            'https://hahow-production.imgix.net/5fb4fc22563bc0262f9fb105?w=1000&sat=0&auto=format&s=f7cb3bd23dc48b1089edb34423906993'
          }
          alt={courseData.course_name || ''}
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>
      <div className={styles['cardBody-aa']}>
        <div className={styles['className-aa']}>
          <p className={styles['courseName']}>{courseData.course_name}</p>
          <p className={styles['classDescription-aa']}>{courseData.ch_name}</p>
        </div>
        <p>NT. {courseData.price}</p>
      </div>
    </Link>
  </div>
)

export default ClassCard
