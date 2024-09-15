import React, { useEffect, useState, useRef } from 'react'
import styles from '@/styles/bearlong/mouseMove.module.scss'

export default function MouseMove() {
  const contentRef = useRef(null)
  const requestRef = useRef(null)
  const intervalRef = useRef(null)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isFront, setIsFront] = useState(true)
  const [deg, setDeg] = useState(0)
  const [imgSrc, setImgSrc] = useState('/Ton.svg')
  const [isAnimating, setIsAnimating] = useState(false)

  const mahjongArr = [
    'Ton.svg',
    'Shaa.svg',
    'Pei.svg',
    'Nan.svg',
    'Chun.svg',
    'Hatsu.svg',
    'Man1.svg',
    'Man2.svg',
    'Man3.svg',
    'Man4.svg',
    'Man5.svg',
    'Man6.svg',
    'Man7.svg',
    'Man8.svg',
    'Man9.svg',
    'Pin1.svg',
    'Pin2.svg',
    'Pin3.svg',
    'Pin4.svg',
    'Pin5.svg',
    'Pin6.svg',
    'Pin7.svg',
    'Pin8.svg',
    'Pin9.svg',
    'Sou1.svg',
    'Sou2.svg',
    'Sou3.svg',
    'Sou4.svg',
    'Sou5.svg',
    'Sou6.svg',
    'Sou7.svg',
    'Sou8.svg',
    'Sou9.svg',
  ]

  //   const [deg, setDeg] = useState(0)
  //   const [isFront, setIsFront] = useState(true)
  //   const [imgSrc, setImgSrc] = useState('/Pei.svg')

  //   const mahjongArr = ['Ton.svg', 'Shaa.svg', 'Pei.svg', 'Nan.svg']
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isAnimating) return
      const content = contentRef.current
      if (content) {
        const updatePosition = () => {
          const targetX = e.clientX - content.offsetWidth / 2 + window.scrollX
          const targetY =
            e.clientY - content.offsetHeight / 2 + window.scrollY - 66.54
          setTranslate({ x: targetX, y: targetY })

          content.style.transform = `translate(${targetX}px, ${targetY}px)`
        }

        // 使用 requestAnimationFrame 來減少過度更新
        requestRef.current = requestAnimationFrame(updatePosition)
      }
    }

    const handleWheel = (e) => {
      if (isAnimating) return
      // 根據滾輪滾動量來更新位置
      setTranslate((prevTranslate) => ({
        x: prevTranslate.x + e.deltaX * 0.1, // 調整滾輪的縮放比例
        y: prevTranslate.y + e.deltaY * 0.1,
      }))
    }
    // const intervalId = setInterval(() => {
    //   handleClick()
    // }, 1500)
    const startRotation = () => {
      setIsAnimating(true)
      intervalRef.current = setInterval(() => {
        setIsFront((prevIsFront) => {
          if (!prevIsFront) {
            const randomIndex = Math.floor(Math.random() * mahjongArr.length)
            setImgSrc(`/${mahjongArr[randomIndex]}`)
          }
          return !prevIsFront
        })
        setDeg((prevDeg) => prevDeg + 180)
      }, 1500) // 每秒旋轉一次
    }

    const stopRotation = () => {
      clearInterval(intervalRef.current)
      setIsAnimating(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('wheel', handleWheel)

    startRotation()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('wheel', handleWheel)
      cancelAnimationFrame(requestRef.current)
      stopRotation()
    }
  }, [])

  useEffect(() => {
    const content = contentRef.current
    if (content) {
      content.style.transform = `translate(${translate.x}px, ${translate.y}px) rotateY(${deg}deg)`
    }
  }, [deg, translate])

  return (
    <>
      <div
        className={`content ${styles.content}`}
        ref={contentRef}
        style={{ transform: `rotateY(${deg}deg)` }}
      >
        <div className={`front ${styles.front}`}>
          <div className="page">
            <img
              className={`${styles.mouseMove} mouseMove`}
              src={`/images/boyu/mahjong${imgSrc}`}
              alt=""
            />
          </div>
        </div>
        <div className={`back ${styles.back}`}></div>
      </div>
    </>
  )
}
