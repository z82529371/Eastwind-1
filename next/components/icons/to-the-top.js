import { useEffect, useState } from 'react'
import { FaAngleUp } from 'react-icons/fa6'
export default function ToTheTop() {
  const [showDiv, setShowDiv] = useState(false)

  const handleToTop = () => {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const viewHeight = window.innerHeight
      if (scrollPosition > 1.5 * viewHeight) {
        setShowDiv(true)
      } else {
        setShowDiv(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    // 清除滾動事件監聽器
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <>
      <button
        onClick={handleToTop}
        className={`${showDiv ? '' : 'd-none'} toTop`}
      >
        <FaAngleUp size={20} />
      </button>
    </>
  )
}
