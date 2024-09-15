import React, { useState, useEffect, useRef } from 'react'
import styles from '@/styles/boyu/home.module.scss'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import anime from 'animejs/lib/anime.min.js'

export default function CourseSection() {
  const courseSectionRef = useRef(null)
  const courseRefs = useRef([])
  const [backgroundVideo, setBackgroundVideo] = useState('')
  const [courseVisible, setCourseVisible] = useState(false)
  const [swiperReady, setSwiperReady] = useState(false)
  const [courseSwiperState, setCourseSwiperState] = useState({
    isLastSlide: false,
    isFirstSlide: true,
  })
  const [hoveredIndex, setHoveredIndex] = useState(null) // 用於管理滑鼠懸停的索引

  const mahjongIconsCourse = [
    {
      src: '/images/boyu/mahjong/Sou1.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Sou2.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Sou3.svg',
      hidden: 'd-none d-sm-block',
    },
  ]

  const courses = [
    {
      title: '麻將',
      description: '智慧與運氣的完美結合。',
      hoverTitle: '麻將',
      hoverDescription:
        '四人對戰的智慧與運氣比拼。十六張牌，千變萬化的組合。運籌帷幄，笑聲與勝利齊飛。東南西北，牌桌上的江湖。抓牌、出牌，牌局隨時翻轉。在麻將中找到策略的樂趣。',
      link: '/course/classListCate?category_id=2', // 更改這裡
    },
    {
      title: '西洋棋',
      description: '策略與智力的精彩對決。',
      hoverTitle: '西洋棋',
      hoverDescription:
        '策略與智力的終極對決。六種棋子，各有千秋。從開局到殘局，步步為營。黑白棋盤，世界的縮影。一招致勝，或步步為營。掌握棋局，掌握勝利的關鍵。',
      link: '/course/classListCate?category_id=4', // 更改這裡
    },
    {
      title: '撲克牌',
      description: '簡單易學，挑戰無限。',
      hoverTitle: '撲克牌',
      hoverDescription:
        '隨時隨地的娛樂選擇。五十二張牌，無限可能。比大小，玩策略，樂趣無窮。從德州撲克到大老二。每一場遊戲都有驚喜。與朋友共享的最佳選擇。',
      link: '/course/classListCate?category_id=1', // 更改這裡
    },
    {
      title: '圍棋',
      description: '黑白交錯，古老智慧。',
      hoverTitle: '圍棋',
      hoverDescription:
        '黑白棋子，簡單又深奧。天地之間，無窮的變化。每一手棋，都是智力的較量。角、邊、中央，圍棋的三要素。掌控全局，或局部突破。讓自己沉浸在古老智慧中。',
      link: '/course/classListCate?category_id=3', // 更改這裡
    },
    {
      title: '象棋',
      description: '車馬交鋒，運籌帷幄。',
      hoverTitle: '象棋',
      hoverDescription:
        '東方智慧的象徵。九宮格內，百變的戰術。將帥一動，乾坤大挪移。車馬炮卒，各司其職。一步錯，全盤皆輸。簡單易學，樂趣無窮。',
      link: '/course/classListCate?category_id=5', // 更改這裡
    },
  ]

  const addToRefs = (el) => {
    if (el && !courseRefs.current.includes(el)) {
      courseRefs.current.push(el)
    }
  }

  useEffect(() => {
    setSwiperReady(true)
  }, [])

  // 使用 IntersectionObserver 觀察課程區域
  useEffect(() => {
    if (courseSectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log('Setting courseVisible to true')
              setCourseVisible(true)
              // 確保每個卡片的動畫 class 正確應用
              courseRefs.current.forEach((ref, index) => {
                setTimeout(() => {
                  if (ref) {
                    ref.classList.add(styles.visible)
                    console.log(`Course card ${index + 1} is visible`)
                  }
                }, index * 500)
              })
              observer.unobserve(entry.target) // 停止觀察，避免重複觸發
            }
          })
        },
        { threshold: 0.5 }
      )

      observer.observe(courseSectionRef.current)

      return () => {
        if (courseSectionRef.current) {
          observer.unobserve(courseSectionRef.current)
        }
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: `.${styles['icon-mahjong-bo-course']}`,
              opacity: [0, 1],
              translateY: [-20, 0],
              easing: 'easeOutExpo',
              delay: anime.stagger(200),
              duration: 800,
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (courseSectionRef.current) {
      observer.observe(courseSectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={courseSectionRef}
      className={`${styles['course-section-bo']} ${styles['bg-front-photo-bo']} d-flex flex-column justify-content-center align-items-center`}
    >
      {swiperReady && backgroundVideo && (
        <>
          <video
            src={backgroundVideo}
            autoPlay
            muted
            loop
            className={styles['course-bg-video-bo']}
          ></video>
          <div className={styles['course-video-overlay-bo']}></div>
        </>
      )}
      <div
        className={`${styles['course-title-box-bo']} d-flex justify-content-center align-items-center text-center`}
      >
        <div className="d-flex gap-2">
          {mahjongIconsCourse.map((icon, index) => (
            <img
              key={index}
              className={`${styles['icon-mahjong-bo-course']} ${icon.hidden}`}
              src={icon.src}
              alt={`Mahjong Icon ${index + 1}`}
            />
          ))}
        </div>
        <div className={`${styles['course-title-bo']} d-flex`}>
          <h2>線上</h2>
          <h2>課程</h2>
        </div>
        <div className="d-flex gap-2">
          {mahjongIconsCourse.map((icon, index) => (
            <img
              key={index}
              className={`${styles['icon-mahjong-bo-course']} ${icon.hidden}`}
              src={icon.src}
              alt={`Mahjong Icon ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div
        className={`${styles['guide-box-bo']} ${styles['course-box-bo']} container-fluid d-flex flex-column justify-content-center`}
      >
        <div
          className={`${styles['course-text-body-bo']} d-flex justify-content-between`}
        >
          <div className="d-flex justify-content-center align-items-center gap-5">
            <div
              className={`${styles['course-text-guide-bo']} d-flex flex-column gap-1`}
            >
              <p className="h6">加入線上課程，隨時學習新技能。</p>
              <p className="h6">專業講師指導，助你快速提升！</p>
            </div>
          </div>

          <Link
            href="/course/classList"
            className={`${styles['text-more-bo']} d-flex justify-content-center align-items-center`}
          >
            <p className="h6 d-none d-sm-block">查看更多線上課程</p>
            <p className="h6 d-block d-sm-none text-nowrap">查看更多</p>

            <div
              className={`${styles['btn-more-mini']} d-flex justify-content-center align-items-center`}
            >
              <FaArrowRight className={styles['more-mini-icon']} />
            </div>
          </Link>
        </div>
        <div
          className={`${
            styles['course-card-box-bo']
          } d-flex justify-content-center align-items-center  ${
            courseVisible ? styles['course-visible'] : ''
          }  `}
        >
          {swiperReady && (
            <Swiper
              slidesPerView={'auto'}
              navigation={{
                prevEl: '#swiper-prev-course',
                nextEl: '#swiper-next-course',
              }}
              autoHeight={true}
              modules={[Navigation]}
              loop={false}
              freeMode={false}
              spaceBetween={15}
              touchReleaseOnEdges={true}
              onSlideChange={(swiper) => {
                setCourseSwiperState({
                  isFirstSlide: swiper.isBeginning,
                  isLastSlide: swiper.isEnd,
                })
              }}
              className={`${styles['swiper-container']}`}
            >
              {courses.map((course, index) => (
                <SwiperSlide
                  key={index}
                  className={`${styles['swiper-slide']} ${
                    styles[`course-slide-${index + 1}`]
                  }`}
                >
                  <Link
                    ref={addToRefs}
                    href={course.link}
                    className={`${styles['course-card-bo']} justify-content-center align-items-center`}
                    onMouseEnter={() => {
                      setBackgroundVideo(`/video/course-type-${index + 1}.mp4`)
                      setHoveredIndex(index)
                    }}
                    onMouseLeave={() => {
                      setBackgroundVideo('')
                      setHoveredIndex(null)
                    }}
                  >
                    <div
                      className={`${styles['course-card-front-bo']} d-flex flex-column justify-content-end`}
                    >
                      <div
                        className={`${styles['course-card-body-bo']} d-flex flex-column gap-3`}
                      >
                        <h5>
                          {hoveredIndex === index
                            ? course.hoverTitle
                            : course.title}
                        </h5>
                        {hoveredIndex === index ? (
                          course.hoverDescription
                            .split('。')
                            .map(
                              (line, i) =>
                                line.trim() && <p key={i}>{line}。</p>
                            )
                        ) : (
                          <p>{course.description}</p>
                        )}
                        <div
                          className={`${styles['course-more']} d-flex justify-content-end align-items-center`}
                        >
                          <i className={`${styles['edit-icon']}`}></i>
                        </div>
                      </div>
                    </div>
                    <div className={styles['course-card-back-bo']}></div>
                  </Link>
                </SwiperSlide>
              ))}

              <SwiperSlide className={`${styles['swiper-slide']}`}>
                <div className={`${styles['course-empty-slide']}`}></div>
              </SwiperSlide>
            </Swiper>
          )}
        </div>
      </div>
      <div className=" d-flex gap-5">
        <div
          id="swiper-prev-course"
          className={`${styles['move-course-btn-box-left-bo']} ${
            styles['move-course-btn-box-bo']
          } d-flex justify-content-center align-items-center ${
            courseSwiperState.isFirstSlide
              ? styles['course-disabled-button']
              : ''
          }`}
        >
          <FaArrowLeft className={styles['btn-course-move-left-bo']} />
        </div>
        <div
          id="swiper-next-course"
          className={`${styles['move-course-btn-box-right-bo']} ${
            styles['move-course-btn-box-bo']
          } d-flex justify-content-center align-items-center  ${
            courseSwiperState.isLastSlide
              ? styles['course-disabled-button']
              : ''
          }`}
        >
          <FaArrowRight className={styles['btn-course-move-right-bo']} />
        </div>
      </div>
    </section>
  )
}
