import React from 'react'
import GoogleLogo from '@/components/icons/google-logo'
import LineLogo from '@/components/icons/line-logo'
import GoogleLogoHover from '@/components/icons/google-logo-hover'
import LineLogoHover from '@/components/icons/line-logo-hover'
import styles from '@/styles/boyu/login.module.scss'

export default function FastLogin({
  onGoogleLoginSuccess,
  goLineLogin,
  isHovered,
  setIsHovered,
  isLineHovered,
  setIsLineHovered,
}) {
  return (
    <>
      <div
        className={`${styles['divider']}  d-flex justify-content-center align-items-center h6 `}
      >
        <span className="">快速登入</span>
      </div>

      <ul
        className={`${styles['user-fast-login-bo']} d-flex gap-3  justify-content-center align-items-center h6`}
      >
        <li>
          <button
            type="button"
            className={` btn h6 d-flex  justify-content-center  align-items-center`}
            onClick={onGoogleLoginSuccess}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? <GoogleLogoHover /> : <GoogleLogo />}
          </button>
        </li>
        <li>|</li>
        <li>
          <button
            type="button"
            className={` btn h6 d-flex  justify-content-center  align-items-center`}
            onClick={goLineLogin}
            onMouseEnter={() => setIsLineHovered(true)}
            onMouseLeave={() => setIsLineHovered(false)}
          >
            {isLineHovered ? <LineLogoHover /> : <LineLogo />}
          </button>
        </li>
      </ul>
    </>
  )
}
