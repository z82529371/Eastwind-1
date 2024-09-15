import React, { useState } from 'react'
import styles from '@/styles/gw/_companyCard.module.scss'
import Link from 'next/link'

export default function CompanyCard({ company }) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }
  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.flexContainer}>
          <div className={styles.logoAndName}>
            <div className={styles.logoContainer}>
              {!imageError ? (
                <img
                  src={company.logo || '/images/default-company-logo.png'}
                  alt={company.name}
                  className={styles.logo}
                  onError={handleImageError}
                />
              ) : (
                <div className={styles.logoFallback}>
                  {company.name ? company.name[0] : ''}
                </div>
              )}
            </div>
            <div className={styles.companyName}>{company.name}</div>
          </div>
          <div className={styles.badge}>
       
            <div className={styles.rating}>
              <span className={styles.ratingNumber}>{company.rating}</span>
              <span className={styles.ratingIcon}>★</span>
            </div>
          </div>
        </div>
        <div>   {company.district} {company.city}</div>
        <p className={styles.info}>地址：{company.address}</p>

        <div className={styles.flexContainer}>

        <div>
            <p className={styles.info}>電話：{company.tele}</p>
          <p className={styles.info}>營業時間：{company.open_time}</p>
        </div>
          <div className={styles.buttonContainer}>
          <Link href={`/lobby/Company/${company.id}`}>
            <button className={styles.btn}>查看詳情</button>
          </Link>
        </div>
        </div>
      
      </div>
    </div>
  )
}
