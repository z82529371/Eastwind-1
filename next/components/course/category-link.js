import React from 'react'
import Link from 'next/link'
import styles from '@/styles/aa/classDetail.module.scss'

const CategoryLink = ({ contentData = {} }) => {
  // const course = Array.isArray(courses)
  //   ? courses.find((c) => c.category_id === category_id)
  //   : courses
  console.log(contentData)
  return (
    <Link
      className={styles['card-link-n']}
      href={`/course/classListCate?category_id=${contentData.category_id}`}
    >
      <span> {contentData.category_name} </span>
      {/* <span> 麻將 </span> */}
    </Link>
  )
}

export default CategoryLink
