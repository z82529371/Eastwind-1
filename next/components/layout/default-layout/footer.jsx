import React from 'react'
import styles from '@/styles/boyu/footer.module.scss'
import { FaFacebookSquare, FaInstagram, FaLine } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className={`${styles['footer-bo']} container-fluid py-5`}>
      <div
        className={`${styles['footer-box-bo']} container-xl d-flex flex-column flex-sm-row justify-content-center align-items-center`}
      >
        <div
          className={`${styles['icon-box-bo']} d-flex flex-row flex-sm-column`}
        >
          <div className={styles['logo-box-bo']}>
            <a href="">
              <img
                src="/images/boyu/logo.svg"
                alt=""
                className={styles['logo-bo']}
              />
            </a>
          </div>
          <div className={styles['social-media-box-bo']}>
            <ul
              className={`${styles['icon-list-bo']} d-flex justify-content-start align-items-center`}
            >
              <li>
                <a href="">
                  <FaFacebookSquare className={`${styles['icon-bo']}`} />
                </a>
              </li>
              <li>
                <a href="">
                  <FaInstagram className={`${styles['icon-bo']}`} />
                </a>
              </li>
              <li>
                <a href="">
                  <FaLine className={`${styles['icon-bo']} `} />
                </a>
              </li>
              <li>
                <a href="">
                  <FaXTwitter className={`${styles['icon-bo']} `} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`${styles['footer-text-box-bo']} d-flex flex-column flex-sm-row justify-content-end`}
        >
          <div className={styles['about-us-box-bo']}>
            <ul>
              <li className="mb-2">
                <p className={`h6 ${styles['footer-title-bo']}`}>關於我們</p>
              </li>
              <li className="mb-1">
                <a href="" className={`p ${styles['footer-text-bo']}`}>
                  條款及細則
                </a>
              </li>
              <li className="mb-1">
                <a href="" className={`p ${styles['footer-text-bo']}`}>
                  企業主加盟合作
                </a>
              </li>
              <li className="mb-1">
                <a href="" className={`p ${styles['footer-text-bo']}`}>
                  退換貨政策
                </a>
              </li>
              <li className="mb-1">
                <a href="" className={`p ${styles['footer-text-bo']}`}>
                  用戶購買/租借須知
                </a>
              </li>
            </ul>
          </div>
          <div className={styles['about-us-box']}>
            <ul>
              <li className="mb-2">
                <p className={`h6 ${styles['footer-title-bo']}`}>聯絡我們</p>
              </li>
              <li className="mb-1">
                <a href="" className={`p ${styles['footer-text-bo']}`}>
                  電話: 02-2243433
                </a>
              </li>
              <li className="mb-1">
                <p className={`p ${styles['footer-text-bo']}`}>
                  Email: eastwind23@gmail.com
                </p>
              </li>
              <li className="mb-1">
                <p className={`p ${styles['footer-text-bo']}`}>
                  地址: 桃園市中壢區新生路二段421號
                </p>
              </li>
              <li className="mb-1">
                <p className={`p ${styles['footer-text-bo']}`}>
                  只欠東風股份有限公司
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
