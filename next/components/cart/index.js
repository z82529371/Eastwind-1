import React, { useEffect, useState, useContext } from 'react'
import styles from '@/styles/bearlong/cart.module.scss'
import { FaShoppingCart } from 'react-icons/fa'
import { FaXmark, FaTrashCan, FaPlus, FaMinus } from 'react-icons/fa6'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useCart } from '@/hooks/use-cart'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { AuthContext } from '@/context/AuthContext'

export default function Cart({
  show,
  handleClose = () => {},
  handleShow = () => {},
  cart = [],
  top = [],
  handleIncrease = () => {},
  handleDecrease = () => {},
  handleRemove = () => {},
  remark = '',
  setRemark = () => {},
}) {
  const { user } = useContext(AuthContext)
  let total = 0
  const [showRecommend, setShowRecommend] = useState(false)

  const handleCartShow = () => {
    setTimeout(() => {
      setShowRecommend(true)
    }, 800)
  }

  const MySwal = withReactContent(Swal)

  const notifyAndRemove = (object) => {
    MySwal.fire({
      title: '你確定嗎',
      text: '這個操作無法復原',
      icon: 'warning',
      customClass: {
        popup: `h5 ${styles.transitionSlow}`,
        title: `h5 ${styles.transitionSlow}`,
        content: `p ${styles.transitionSlow}`,
        confirmButton: `p me-3 ${styles.transitionSlow}`,
        cancelButton: `p ${styles.transitionSlow}`,
      },
      showCancelButton: true,
      confirmButtonColor: '#d71515',
      cancelButtonColor: '#747474',
      cancelButtonText: '取消',
      confirmButtonText: '確定刪除它',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '已刪除!',
          text: object.item_name + ' 已成功刪除',
          customClass: {
            popup: `h5 ${styles.transitionSlow}`,
            title: `h5 ${styles.transitionSlow}`,
            content: `p ${styles.transitionSlow}`,
            confirmButton: `p me-3 ${styles.transitionSlow}`,
            cancelButton: `p ${styles.transitionSlow}`,
          },
          icon: 'success',
        })
        handleRemove(object)
      }
    })
  }
  const handleCartHide = () => setShowRecommend(false)
  useEffect(() => {
    // 根據 isCartVisible 狀態來處理 recommendSectionBo 的類名
    const recommendSectionBo = document.querySelector('.recommend-section-bo')
    if (recommendSectionBo) {
      if (showRecommend) {
        recommendSectionBo.classList.add(`active`)
      } else {
        recommendSectionBo.classList.remove(`active`)
      }
    }
  }, [showRecommend])

  return (
    <>
      <Offcanvas
        className={` ${styles['cart-box-bo']} `}
        show={show}
        onShow={() => {
          handleCartShow()
        }}
        onExiting={() => {
          handleCartHide()
        }}
        onHide={() => {
          handleClose()
        }}
        placement={'end'}
      >
        <div
          className={`recommend-section-bo ${styles['recommend-section-bo']}`}
        >
          <div className={styles['recommend-title-bo']}>
            <h5>推薦商品</h5>
          </div>
          <div
            className={` ${styles['topList-bl']}  d-flex justify-content-center align-items-center flex-column mt-3`}
          >
            <Swiper
              spaceBetween={10}
              slidesPerView={2}
              direction="vertical"
              autoHeight={true}
              loop={false}
              className={styles.swiper}
            >
              {top.map((product, i) => {
                return (
                  <SwiperSlide key={product.id} className={styles.column1}>
                    <Link href={`/product/${product.id}`}>
                      <div className={`${styles['productCard']} swiper-slide`}>
                        <div className={styles['swiperImg']}>
                          <div className={styles['imgBox']}>
                            <div
                              className={`${styles['top']} ${
                                styles[`top${i + 1}`]
                              }`}
                            >
                              {i + 1}
                            </div>
                            <Image
                              src={`/images/product/${product.img}`}
                              width={280}
                              height={280}
                              alt=""
                            />
                          </div>
                          <div
                            className={`${styles['imgBox']} ${styles['secondImg']}`}
                          >
                            <Image
                              src={
                                product.img2
                                  ? `/images/product/${product.img2}`
                                  : '/images/boyu/logo.svg'
                              }
                              width={280}
                              height={280}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className={styles['cardBody']}>
                          <div className={styles['productName-bl']}>
                            <p>{product.brand_name}</p>
                            <p className={` ${styles['productDescription']}`}>
                              {product.name}
                            </p>
                          </div>
                          <p>NT. {product.price}</p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </div>
        <div className={styles['cart-section-bo']}>
          <Offcanvas.Header>
            <Offcanvas.Title>
              <h5 className={`${styles['cart-title-bo']}  offcanvas-title`}>
                購物車（{cart.length} 件）
              </h5>
            </Offcanvas.Title>
            <button
              type="button"
              className={`${styles['btn-close-bl']}  btn-close d-flex justify-content-between align-items-center`}
              onClick={() => {
                handleCartHide()
                handleClose()
              }}
            >
              <FaXmark width={25} />
            </button>
          </Offcanvas.Header>
          <div className="offcanvas-header"></div>
          <div className={`${styles['filterBox']}  offcanvas-body`}>
            <div
              className={`${styles['cart-bo']}  d-flex flex-column justify-content-between`}
            >
              <div className={styles['cart-body-bo']}>
                {cart.length === 0 ? (
                  <div className="text-center">
                    <h5>購物車內無商品!</h5>
                  </div>
                ) : (
                  cart.map((v) => {
                    total += parseInt(v.quantity, 10) * parseInt(v.price, 10)
                    return (
                      <div
                        className={`${styles['cart-product-bo']} d-flex mb-5`}
                        key={v.id}
                      >
                        <div
                          className={`${styles['cart-product-img-bo']} me-4`}
                        >
                          <Image
                            src={`/images/${v.object_type}/${v.img}`}
                            width={200}
                            height={200}
                            alt=""
                          />
                        </div>
                        <div
                          className={`${styles['cart-product-text-box-bo']} flex-grow-1 d-flex flex-column justify-content-between`}
                        >
                          <div
                            className={`${styles['cart-product-text-bo']} d-flex justify-content-between`}
                          >
                            <div className={styles['cart-product-title-bo']}>
                              <h6>{v.item_name}</h6>
                              <p>{v.brand_name}</p>
                            </div>
                            <FaTrashCan
                              className="h6"
                              onClick={() => {
                                notifyAndRemove(v)
                              }}
                            />
                          </div>
                          <div
                            className={`${styles['cart-product-text-bo']}  d-flex justify-content-between`}
                          >
                            <div
                              className={`${styles['cart-product-number-bo']}  d-flex justify-content-between align-items-center`}
                            >
                              {v.object_type !== 'course' ? (
                                <FaMinus
                                  className="me-5 p"
                                  onClick={() => {
                                    if (v.quantity <= 1) {
                                      notifyAndRemove(v)
                                    } else {
                                      handleDecrease(v)
                                    }
                                  }}
                                />
                              ) : (
                                ''
                              )}

                              <h6 className={styles['quantity']}>
                                {v.object_type !== 'course' ? v.quantity : ''}
                              </h6>
                              {v.object_type !== 'course' ? (
                                <FaPlus
                                  className="ms-5 p"
                                  onClick={() => {
                                    handleIncrease(v)
                                  }}
                                />
                              ) : (
                                ''
                              )}
                            </div>
                            <div className={styles['product-price-bo']}>
                              <h6>NT$ {v.price}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <div className={styles['cart-text-box-bo']}>
                <div className={`${styles['remark-box-bo ']} mb-3`}>
                  <h6>新增訂單備註</h6>
                  <textarea
                    className={`${styles['no-resize']} form-control mt-3`}
                    rows={3}
                    id=""
                    defaultValue={remark}
                    onChange={(e) => {
                      setRemark(e.target.value)
                    }}
                  />
                </div>
                <div
                  className={`${styles['total-price-box-bo']} d-flex justify-content-between align-items-center mb-3`}
                >
                  <h6>總計</h6>
                  <h6>NT$ {total}</h6>
                </div>
                <Link
                  className={`${
                    styles['pay-button-bo']
                  } d-flex justify-content-center align-items-center ${
                    user && cart.length > 0 ? '' : 'd-none'
                  }`}
                  href={'/checkout'}
                  onClick={() => {
                    handleClose()
                  }}
                >
                  <h5>現在付款</h5>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas>
      <style jsx>
        {`
          .active {
            animation-name: rightActive;
            animation-duration: 0.5s;
            animation-iteration-count: 1;
            animation-direction: normal;
            animation-fill-mode: forwards;
          }

          @keyframes rightActive {
            0% {
              left: -50%;
            }
            100% {
              left: -100%;
            }
          }
        `}
      </style>
    </>
  )
}
