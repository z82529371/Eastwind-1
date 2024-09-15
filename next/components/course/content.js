import React from 'react'
import Image from 'next/image'
import styles from '@/styles/aa/classDetail.module.scss'

const Content = ({ contentData = {} }) => {
  return (
    <>
      <div className={styles['detailpic-aa']}>
        <div className={styles['detailpic1-aa']}>
          <div className={styles['depic1-aa']}>
            <Image
              src={`/images/aa/${contentData.images}` || ''}
              alt={contentData.course_name || ''}
              width={640}
              height={360}
            />
          </div>
        </div>
      </div>
      <div className={styles['detextgroup-aa']}>
        <div className={styles['texth2detail3-aa']}>
          <div className={styles['texth2detail31-aa']}>
            <h4>{contentData.course_name}</h4>
          </div>
        </div>
        <div className={styles['texth2detail4-aa']}>
          <h6>{contentData.content}</h6>
        </div>
      </div>
    </>
  )
}

export default Content
