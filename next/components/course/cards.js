import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/aa/classList.module.scss'
import ClassCard from '@/components/course/card'

// const ClassGroup = ({ courses }) => {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const router = useRouter()

//   // 每次顯示的資料數量
//   const itemsPerPage = 4

//   // 確保 courses 不為 null 或 undefined
//   const currentCourses = courses
//     ? Object.values(courses)
//         .flat()
//         .slice(currentIndex, currentIndex + itemsPerPage)
//     : []

//   // 處理點擊時更新索引
//   const handleNext = () => {
//     const totalCourses = courses ? Object.values(courses).flat().length : 0
//     setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % totalCourses)
//   }

//   return (
//     <div className={styles['classCards-aa']}>
//       {courses ? (
//         currentCourses.length > 0 ? (
//           currentCourses.map((classItem, index) => (
//             <div key={classItem.id}>
//               <Link href={`/course/classDetail/${classItem.id}`}>
//                 <ClassCard
//                   courseData={classItem}
//                   rank={currentIndex + index + 1}
//                 />
//               </Link>
//             </div>
//           ))
//         ) : (
//           <p>No courses available</p>
//         )
//       ) : (
//         <p>Loading courses...</p>
//       )}
//       {currentCourses.length > 0 && (
//         <button onClick={handleNext}>Show Next 4 Classes</button>
//       )}
//     </div>
//   )
// }

// const ClassGroup = ({ courses }) => {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const itemsPerPage = 4

//   // 確保 courses 不為 null 或 undefined
//   const currentCourses = courses
//     ? Object.values(courses)
//         .flat()
//         .slice(currentIndex, currentIndex + itemsPerPage)
//     : []

//   // 處理點擊時更新索引
//   const handleNext = () => {
//     const totalCourses = courses ? Object.values(courses).flat().length : 0
//     setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage) % totalCourses)
//   }

//   return (
//     <div className={styles['classCards-aa']}>
//       {currentCourses.map((classItem, index, array) => {
//         // 取得下一筆資料的 id，如果是最後一筆則抓第一筆資料的 id
//         const nextId = array[index + 1] ? array[index + 1].id : array[0].id

//         return (
//           <div key={classItem.id}>
//             <Link href={`/course/classDetail/${nextId}`}>
//               <ClassCard
//                 courseData={classItem}
//                 rank={currentIndex + index + 1}
//               />
//             </Link>
//           </div>
//         )
//       })}
//       {currentCourses.length > 0 && (
//         <button onClick={handleNext}>Show Next 4 Classes</button>
//       )}
//     </div>
//   )
// }

// const ClassGroup = ({ courses }) => {
//   // 確保 courses 不為 null 或 undefined，並將其轉換為扁平數組
//   const flattenedCourses = courses ? Object.values(courses).flat() : []

//   return (
//     <div className={styles['classCards-aa']}>
//       {flattenedCourses.map((classItem, index, array) => {
//         return (
//           <div key={classItem.id}>
//             <Link href={`/course/classDetail/${classItem.id}`}>
//               <ClassCard courseData={classItem} rank={index + 1} />
//             </Link>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

const ClassGroup = ({ courses }) => {
  const itemsPerCategory = 5 // 每個 category_id 顯示 1 到 5 筆資料

  // 對 courses 根據 category_id 進行分組並篩選
  const groupedCourses = courses
    ? Object.values(courses)
        .flat()
        .reduce((acc, course) => {
          const categoryId = course.course_category_id
          if (!acc[categoryId]) {
            acc[categoryId] = []
          }
          if (acc[categoryId].length < itemsPerCategory) {
            acc[categoryId].push(course)
          }
          return acc
        }, {})
    : {}

  return (
    <>
      <div className={styles['classCards-aa']}>
        {Object.keys(groupedCourses).map((categoryId) =>
          groupedCourses[categoryId].map((classItem, index) => (
            <div key={classItem.id}>
              <Link href={`/course/classDetail/${classItem.id}`}>
                <ClassCard courseData={classItem} rank={index + 1} />
              </Link>
            </div>
          ))
        )}
      </div>
      <style jsx>{`
        .classCards-aa {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }
      `}</style>
    </>
  )
}

export default ClassGroup
