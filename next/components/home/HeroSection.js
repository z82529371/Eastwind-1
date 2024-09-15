import React, { useEffect, useState } from 'react'
import styles from '@/styles/boyu/home.module.scss'
import anime from 'animejs/lib/anime.min.js'

export default function HeroSection() {
  // 執行動畫效果
  useEffect(() => {
    setTimeout(() => {
      const textWrapper = document.querySelector(
        `.${styles.ml2} .${styles.letters}`
      )
      if (textWrapper) {
        textWrapper.innerHTML = textWrapper.textContent.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        )

        anime.timeline({ loop: false }).add({
          targets: '.letter',
          scale: [5, 1],
          opacity: [0, 1],
          translateZ: 0,
          easing: 'easeOutExpo',
          duration: 3000,
          delay: (el, i) => 100 * i,
        })
      }
    }, 0)
  }, [])

  return (
    <>
      <section
        className={`${styles['hero-section-bo']} text-center d-flex justify-content-center align-items-center`}
      >
        <div className="d-flex flex-column flex-sm-row">
          <h1 className={`${styles['ml2']} `}>
            <span className={`${styles['letters']} `}>
              萬事俱備，只欠東風。
            </span>
          </h1>
        </div>
      </section>
    </>
  )
}
