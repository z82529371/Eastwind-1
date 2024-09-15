import React, { useEffect, useRef } from 'react'
import styles from '@/styles/boyu/home.module.scss'
import anime from 'animejs/lib/anime.min.js'

export default function IntroSection() {
  const introSectionRef = useRef(null) // 引用 intro 區域

  // Mahjong Icons 數組定義
  const mahjongIconsIntro = [
    {
      src: '/images/boyu/mahjong/Man1.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Man2.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Man3.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Pin1.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Pin2.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Pin3.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Sou1.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Sou2.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Sou3.svg',
      hidden: 'd-none d-md-block',
    },
    {
      src: '/images/boyu/mahjong/Ton.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Nan.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Shaa.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Pei.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Chun.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Hatsu.svg',
      hidden: '',
    },
    {
      src: '/images/boyu/mahjong/Haku.svg',
      hidden: '',
    },
  ]

  // intro 區域的動畫效果
  useEffect(() => {
    const introSection = document.querySelector(
      `.${styles['intro-section-bo']}`
    )
    const textElements = introSection.querySelectorAll('h6')

    textElements.forEach((element) => {
      const textContent = element.textContent
      element.innerHTML = textContent.replace(
        /\S/g,
        "<span class='letter'>$&</span>"
      )

      anime.timeline({ loop: false }).add({
        targets: element.querySelectorAll('.letter'),
        scale: [5, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: 'easeOutExpo',
        duration: 500,
        delay: (el, i) => 2 * i,
      })
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: `.${styles['icon-mahjong-bo-intro']}`,
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

    if (introSectionRef.current) {
      observer.observe(introSectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={introSectionRef} // 設置引用
      className={`${styles['intro-section-bo']} text-center d-flex flex-column justify-content-center align-items-center`}
    >
      <div
        className={`${styles['intro-mahjong-box-bo']} container d-flex justify-content-center gap-2`}
      >
        {mahjongIconsIntro.map((icon, index) => (
          <img
            key={index}
            className={`${styles['icon-mahjong-bo-intro']} ${icon.hidden}`}
            src={icon.src}
            alt={`Mahjong Icon ${index + 1}`}
          />
        ))}
      </div>
      <div
        className={`${styles['intro-text-box-bo']} d-flex gap-5 flex-column justify-content-center align-items-center`}
      >
        <h2 className={styles['intro-title-bo']}>麻將</h2>
        <div className={`${styles['intro-text-body-bo']} d-flex flex-column`}>
          <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
            <div className="d-flex flex-column flex-sm-row">
              <h6>不僅是一種遊戲，更是一種生活的藝術，</h6>
            </div>
            <h6>每一張牌都蘊含著智慧與運氣的微妙平衡。</h6>
            <div className="d-flex flex-column flex-sm-row">
              <h6>當你坐在牌桌旁，握著一手好牌，</h6>
              <h6>分享歡笑與策略，</h6>
            </div>
          </div>

          <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
            <h6>那份默契與競技的快感讓人陶醉。</h6>
            <h6>不論你是初學者還是經驗豐富的老手，</h6>
            <h6>麻將都能帶給你無限的樂趣與挑戰。</h6>
          </div>
        </div>
      </div>
      <div
        className={`${styles['intro-mahjong-box-bo']} container d-flex justify-content-center gap-2`}
      >
        {mahjongIconsIntro.map((icon, index) => (
          <img
            key={index}
            className={`${styles['icon-mahjong-bo-intro']} ${icon.hidden}`}
            src={icon.src}
            alt={`Mahjong Icon ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
