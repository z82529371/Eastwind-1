import React, { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaHeart, FaStar, FaRegStar, FaPlus, FaMinus } from 'react-icons/fa6'
import styles from '@/styles/bearlong/productDetail.module.scss'
import { useCart } from '@/hooks/use-cart'
import { AuthContext } from '@/context/AuthContext'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules'

export default function ProductDetail({
  data = {},
  handleFavToggle = () => {},
}) {
  const { user } = useContext(AuthContext)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  const [quantity, setQuantity] = useState(1)
  const { handleAdd = () => {}, handleShow = () => {} } = useCart()

  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const notifyAndRemove = () => {
    Swal.fire({
      icon: 'error',
      title: '尚未登入',
      text: '請先登入才能購買!',
      customClass: {
        popup: `h6`,
        title: `h4`,
        content: `h1`,
        confirmButton: `p ${styles.confirmButton}`,
        footer: `p ${styles.confirmFooter}`,
      },
      footer: '<a href="/login">前往登入</a>',
    })
  }

  useEffect(() => {
    setQuantity(1)
  }, [data.product.id])

  return (
    <>
      <div className={styles['productDetailSection1-bl']}>
        <p className={`${styles['breadCrumb-bl']} my-3`}>
          <Link href={'./productList'}>首頁</Link>/
          <Link href={'./productList?brand_id=' + data.product.brand_id}>
            {data.product.brand_name}
          </Link>
          /
          <Link href={'./productList?category_id=' + data.product.category_id}>
            {data.product.category_name}
          </Link>
          /
          <Link
            href={'./productList?brand=' + data.product.id}
            className={styles.here}
          >
            {data.product.name}
          </Link>
        </p>
        <div className="d-flex flex-md-row flex-column justify-content-between">
          <div
            className={`d-flex flex-column-reverse flex-lg-row me-0 me-lg-3`}
          >
            <div
              className={`mx-lg-5 d-flex flex-lg-column mt-3 mt-lg-0 justify-content-between justify-content-lg-start`}
            >
              <Swiper
                onSwiper={setThumbsSwiper}
                direction="horizontal"
                spaceBetween={20}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                breakpoints={{
                  992: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                    direction: 'vertical',
                  },
                }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper justify-content-between justify-content-lg-start"
              >
                {data.img2.map((v) => {
                  return (
                    <SwiperSlide
                      key={v.id}
                      className={`${styles['imgSmallBox-bl']}`}
                    >
                      <Image
                        src={`../../images/product/${v.img}`}
                        width={280}
                        height={280}
                        alt=""
                      />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
            <div
              className={`${styles['imgMain-bl']} align-self-center align-self-md-stretch`}
            >
              <Swiper
                style={{
                  '--swiper-navigation-color': '#fff',
                  '--swiper-pagination-color': '#fff',
                }}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Autoplay, FreeMode, Navigation, Thumbs]}
                className={`${styles['imgMain-bl']}`}
              >
                {data.img2.map((v) => {
                  return (
                    <SwiperSlide key={v.id}>
                      <Image
                        src={`../../images/product/${v.img}`}
                        width={280}
                        height={280}
                        alt=""
                      />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
          <div
            className={`${styles['productDetailContent-bl']} d-flex justify-content-between flex-column`}
          >
            <div>
              <p>{data.product.brand_name}</p>
              <div className={`${styles['productName-bl']} m-0`}>
                <h5>{data.product.name}</h5>
              </div>
              <div className={`d-flex justify-content-between mb-2`}>
                <div className={`d-flex align-items-center`}>
                  <p className="me-2">
                    {data.product.average_star
                      ? data.product.average_star
                      : '尚無評價'}
                  </p>
                  <div className={styles['starBox-bl']}>
                    <FaRegStar fontSize={16} style={{ color: '#b79347' }} />
                    <FaRegStar fontSize={16} style={{ color: '#b79347' }} />
                    <FaRegStar fontSize={16} style={{ color: '#b79347' }} />
                    <FaRegStar fontSize={16} style={{ color: '#b79347' }} />
                    <FaRegStar fontSize={16} style={{ color: '#b79347' }} />
                    <div
                      className={`${styles['starRating-bl']} ${
                        data.product.average_star ? '' : 'd-none'
                      }`}
                      style={{
                        width: `${(data.product.average_star / 5) * 100}%`,
                      }}
                    >
                      <FaStar fontSize={16} style={{ color: '#b79347' }} />
                      <FaStar fontSize={16} style={{ color: '#b79347' }} />
                      <FaStar fontSize={16} style={{ color: '#b79347' }} />
                      <FaStar fontSize={16} style={{ color: '#b79347' }} />
                      <FaStar fontSize={16} style={{ color: '#b79347' }} />
                    </div>
                  </div>
                  <p className="ms-2">({data.product.comment_count})</p>
                </div>
                <button
                  className={`d-flex align-items-center btn btn-outline-primary ${
                    styles.like
                  }  ${user ? '' : 'd-none'}`}
                  onClick={() => {
                    handleFavToggle(data.product.id, 'product')
                  }}
                >
                  {data.product.fav ? (
                    <FaHeart fontSize={16} />
                  ) : (
                    <FaPlus fontSize={16} />
                  )}
                  <p className="ms-2 ">
                    {data.product.fav ? '已收藏' : '未收藏'}
                  </p>
                </button>
              </div>
              <h5>
                NT$ <span>{data.product.price}</span>
              </h5>
            </div>
            <div>
              {data.specifications.color && (
                <p className="mb-2">
                  顏色: <span>{data.specifications.color}</span>
                </p>
              )}
              {data.specifications.size && (
                <p className="mb-2">
                  尺寸: <span>{data.specifications.size}</span>
                </p>
              )}
              {data.specifications.material && (
                <p className="mb-2">
                  材質: <span>{data.specifications.material}</span>
                </p>
              )}
              {data.specifications.style && (
                <p className="mb-2">
                  樣式: <span>{data.specifications.style}</span>
                </p>
              )}
              {data.specifications.weight && (
                <p className="mb-2">
                  重量: <span>{data.specifications.weight}</span>
                </p>
              )}
              {data.specifications.voltage && (
                <p className="mb-2">
                  電壓: <span>{data.specifications.voltage}</span>
                </p>
              )}
              {data.specifications.power_consumption && (
                <p className="mb-2">
                  耗電量: <span>{data.specifications.power_consumption}</span>
                </p>
              )}
            </div>
            <div className="my-3 my-md-0">
              <p className="mb-2">
                庫存數量:{' '}
                <span>{data.product.stock <= 0 ? 0 : data.product.stock}</span>{' '}
                <span className="text-danger">
                  {data.product.stock > 0
                    ? ''
                    : '暫無庫存，加入收藏關注到貨狀況'}
                </span>
              </p>
              <div className={`d-flex justify-content-between`}>
                <h5>數量</h5>
                <div
                  className={`${styles['plusMinus']} d-flex align-items-center`}
                >
                  <FaMinus
                    style={{ marginInlineEnd: '50px' }}
                    fontSize={16}
                    onClick={handleDecrease}
                  />
                  <h5 className={styles['quantity']}>{quantity}</h5>
                  <FaPlus
                    style={{ marginInlineStart: '50px' }}
                    fontSize={16}
                    onClick={() => {
                      if (quantity < data.product.stock) {
                        handleIncrease()
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`${styles['buttonGroup-bl']} d-flex justify-content-between flex-column`}
            >
              <button
                type="button"
                className={`${styles['btnRectangle']} ${styles['buy']}  mb-3`}
                onClick={() => {
                  if (!user) {
                    notifyAndRemove()
                  } else {
                    handleAdd(data.product, 'product', quantity)
                    handleShow()
                  }
                }}
                disabled={data.product.stock <= 0}
              >
                {data.product.stock <= 0 ? '暫無庫存' : '立即購買'}
              </button>
              <button
                type="button"
                className={`${styles['btnRectangle']}`}
                onClick={() => {
                  if (!user) {
                    notifyAndRemove()
                  } else {
                    handleAdd(data.product, 'product', quantity)
                    toast.success(`商品已加入購物車!`, {
                      style: {
                        border: `1px solid #55c57a`,
                        padding: '16px',
                        fontSize: '16px',
                        color: '#0e0e0e',
                      },
                      iconTheme: {
                        primary: `#55c57a`,
                        secondary: '#ffffff',
                        fontSize: '16px',
                      },
                    })
                  }
                }}
                disabled={data.product.stock <= 0}
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
