import React, { useRef, useEffect } from 'react'
import styles from '@/styles/boyu/home.module.scss'
import Link from 'next/link'
import anime from 'animejs/lib/anime.min.js'

export default function RoomSection() {
  const roomSectionRef = useRef(null) // 引用 room 區域

  const mahjongIconsRoom = [
    {
      src: '/images/boyu/mahjong/Man1.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Man2.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Man3.svg',
      hidden: 'd-none d-sm-block',
    },
  ]

  const roomImages = Array.from(
    { length: 24 },
    (_, index) => `/images/boyu/rooms/room${index + 1}.jpg`
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: `.${styles['icon-mahjong-bo-room']}`,
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

    if (roomSectionRef.current) {
      observer.observe(roomSectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={roomSectionRef} // 設置引用
      className={`${styles['room-section-bo']} gap-3 ${styles['bg-front-photo-bo']} d-flex flex-column flex-md-row justify-content-between align-items-center`}
    >
      <div
        className={`${styles['room-image-box-bo']} ${styles['room-image-box-down-bo']} d-flex flex-column justify-content-center align-items-center`}
      >
        {' '}
        {roomImages.slice(0, 12).map((image, index) => (
          <img
            key={index}
            className={`${styles['room-image-bo']} ${styles['image-down-bo']}`}
            src={image}
            alt={`Room Image ${index + 1}`}
          />
        ))}
      </div>
      <div
        className={`${styles['room-text-box-bo']} d-flex flex-column justify-content-center align-items-center`}
      >
        <div
          className={`${styles['room-text-title-bo']} container d-flex justify-content-center align-items-center`}
        >
          <div className="d-flex gap-2">
            {mahjongIconsRoom.map((icon, index) => (
              <img
                key={index}
                className={`${styles['icon-mahjong-bo-room']} ${icon.hidden}`}
                src={icon.src}
                alt={`Mahjong Icon ${index + 1}`}
              />
            ))}
          </div>
          <h2 className={styles['room-title-bo']}>棋牌室</h2>
          <div className="d-flex gap-2">
            {mahjongIconsRoom.map((icon, index) => (
              <img
                key={index}
                className={`${styles['icon-mahjong-bo-room']} ${icon.hidden}`}
                src={icon.src}
                alt={`Mahjong Icon ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div
          className={`${styles['room-text-body-bo']} d-flex flex-column justify-content-center align-items-center gap-5 text-center`}
        >
          <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
            <h6>加入麻將揪團，享受每場精彩對局。</h6>
            <h6>每次對局都是全新的挑戰，盡情享受麻將的樂趣。</h6>
            <h6>立即糾團，尋找不同風格的對手！</h6>
          </div>
          <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
            <h6>輕鬆找到各地優質麻將棋牌室，隨時預訂。</h6>
            <h6>提供舒適環境與專業設備，提升對局體驗。</h6>
            <h6>方便快捷的預訂流程，讓您無憂享受麻將樂趣。</h6>
          </div>
        </div>
        <Link
          href="/lobby/Entrance"
          className={`${styles['btn-more']} d-flex align-items-center`}
        >
          <p>立即查看</p>
          <i className={`${styles['edit-icon']}`}></i>
        </Link>
      </div>
      <div
        className={`${styles['room-image-box-bo']} ${styles['room-image-box-up-bo']} d-flex flex-row flex-md-column justify-content-center align-items-center`}
      >
        {roomImages.slice(12).map((image, index) => (
          <img
            key={index}
            className={`${styles['room-image-bo']} ${styles['image-up-bo']}`}
            src={image}
            alt={`Room Image ${index + 13}`}
          />
        ))}
      </div>
    </section>
  )
}
