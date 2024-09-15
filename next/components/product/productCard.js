import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa6'
import styles from '@/styles/bearlong/productList.module.scss'
// Swiper
import 'swiper/css'
import Link from 'next/link'
import { AuthContext } from '@/context/AuthContext'
import { useInView } from 'react-intersection-observer'

export default function ProductCard({
  product = {},
  handleFavToggle = () => {},
}) {
  const { user } = useContext(AuthContext)

  const { ref, inView, entry } = useInView({
    threshold: 0.3,
  })

  return (
    <>
      <div
        className={`${styles['productCard']} ${
          inView ? styles['boxActive'] : styles['boxHidden']
        }`}
        ref={ref}
      >
        <Link href={`/product/${product.product_id}`}>
          <div className={styles['imgBox']}>
            <Image
              src={`../../images/product/${product.img}`}
              width={280}
              height={280}
              alt=""
            />
          </div>
          <div className={`${styles['imgBox']} ${styles['secondImg']}`}>
            <Image
              src={
                product.img2
                  ? `../../images/product/${product.img2}`
                  : '../../images/boyu/logo.svg'
              }
              width={280}
              height={280}
              alt=""
            />
          </div>
          <div
            className={`${styles['imgBox']} ${styles['soldOut']} ${
              product.stock > 0 ? `d-none` : ''
            }`}
          >
            <div className={`${styles['soldOutInfo']} p`}>Sold Out</div>
          </div>
          <div className={`${styles['heart']} ${user ? '' : 'd-none'}`}>
            {product.fav ? (
              <FaHeart
                width={30}
                className="h4"
                onClick={(e) => {
                  e.preventDefault()
                  handleFavToggle(product.product_id, 'product')
                }}
              />
            ) : (
              <FaRegHeart
                width={30}
                className="h4"
                onClick={(e) => {
                  e.preventDefault()
                  handleFavToggle(product.product_id, 'product')
                }}
              />
            )}
          </div>
          <div className={styles['cardBody']}>
            <div className={styles['productName-bl']}>
              <p>{product.brand_name}</p>
              <p className={styles['productDescription']}>{product.name}</p>
            </div>
            <div
              className={`${styles['star']} d-flex justify-content-center gap-1`}
            >
              <p>
                {product.average_star ? (
                  <>
                    {product.average_star} <FaStar width={16} />
                  </>
                ) : (
                  '尚無評星'
                )}
              </p>
            </div>
            <p>{product.stock > 0 ? `NT. ${product.price}` : '暫無庫存'}</p>
          </div>
        </Link>
      </div>
    </>
  )
}
