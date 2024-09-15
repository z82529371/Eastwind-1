import React, { useState, useEffect, useContext } from 'react'
import ProductNav from '@/components/product/product-nav'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar, FaRegStar, FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import styles from '@/styles/bearlong/productDetail.module.scss'
import { useRouter } from 'next/router'
import StarRating from '@/components/product/starRating'
import { Swiper, SwiperSlide } from 'swiper/react'
import { AuthContext } from '@/context/AuthContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { FadeLoader } from 'react-spinners'
import ProductDetail from '@/components/product/productDetail'
import Loading from '@/components/loader/loading'

const override = {
  display: 'block',
  margin: '50vh auto',
  borderColor: 'red',
}

export default function Detail() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const { pid } = router.query
  const [data, setData] = useState({
    product: {
      id: 0,
      name: '',
      content: [],
      brand_id: 0,
      category_id: 0,
      stock: 0,
      price: 0,
      on_time: '0000-00-00',
      off_time: null,
      create_at: '0000-00-00',
      update_at: null,
      img: '',
      category_name: '',
      brand_name: '',
      average_star: null,
    },
    specifications: {},
    img2: [],
    like: [],
  })
  const [comment, setComment] = useState({ star: 0, content: [] })
  const [starCount, setStarCount] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const MySwal = withReactContent(Swal)

  const getProduct = async (id) => {
    let newData, error
    console.log(id)
    const url =
      'http://localhost:3005/api/products/' +
      id +
      `${user ? `?uid=${user.id}` : ''}`
    newData = await fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 'success') {
          return result.data
        }
      })
      .catch((err) => {
        error = err
        return undefined
      })

    if (error) {
      return
    }
    if (newData) {
      const product = newData.product[0]
      const specifications = newData.specifications[0]
      newData.product = product
      newData.specifications = specifications
      const paragraphs = newData.product.content.split('\r\n')
      newData.product.content = paragraphs
      const mainImage = {
        id: 'main',
        product_id: newData.product.id, // 這裡假設只有一個 product
        img: newData.product.img,
      }
      newData.img2.unshift(mainImage)
      console.log(newData.img2)
      setData(newData)
      setComment(newData.comment)

      const updatedStarCount = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      }
      console.log(newData.starCount)

      newData.starCount.forEach(({ star, count }) => {
        if (updatedStarCount[star] !== undefined) {
          updatedStarCount[star] = count
        }
      })

      setStarCount(updatedStarCount)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  const sortedStarCount = Object.entries(starCount).sort(
    ([starA], [starB]) => [starB] - [starA]
  )

  const handleStarChange = (star) => {
    const nextContent = data.comment.content.filter(
      (item) => item.star === Math.round(star)
    )
    setComment({ content: nextContent, star })
  }

  const handleFavToggle = async (object_id, type) => {
    const fav = data.product.fav
    const url = `http://localhost:3005/api/favorites/${object_id}`
    const method = fav ? 'DELETE' : 'POST'
    const body = JSON.stringify({
      uid: user.id,
      type: type,
    })
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })
      const result = await response.json()
      if (result.status === 'success') {
        toast.success(
          `${method === 'POST' ? '商品已加入收藏!' : '商品已移除收藏!'}`,
          {
            style: {
              border: `1px solid ${method === 'POST' ? '#55c57a' : '#d71515'}`,
              padding: '16px',
              fontSize: '16px',
              color: '#0e0e0e',
            },
            iconTheme: {
              primary: `${method === 'POST' ? '#55c57a' : '#d71515'}`,
              secondary: '#ffffff',
              fontSize: '16px',
            },
          }
        )
        const nextProduct = { ...data.product, fav: !data.product.fav }
        setData({ ...data, product: nextProduct })
      } else {
        console.log(result.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const loader = (
    <div className={styles.loading}>
      <Loading />
    </div>
  )

  useEffect(() => {
    if (router.isReady) {
      getProduct(pid)
    }
  }, [router.isReady, router.query])
  return (
    <>
      <ProductNav />

      {isLoading ? (
        loader
      ) : (
        <main className={styles['main']}>
          <ProductDetail data={data} handleFavToggle={handleFavToggle} />

          <Toaster position="bottom-right" reverseOrder={false} />
          <div className={`${styles['productDetailSection2-bl']}  row`}>
            <div className={` col-12 col-md-8`}>
              <div className={`  mb-5`}>
                <div className={styles['underLine-bl']}>
                  <h6>產品敘述:</h6>
                </div>
                {data.product.content.map(
                  (v, i) => v.trim() !== '' && <p key={i}>{v}</p>
                )}
              </div>
              <div className={` mb-5`}>
                <div className={styles['underLine-bl']}>
                  <h6>商品評論:</h6>
                </div>
                <div
                  className={`${styles['star-bl']}   d-flex justify-content-between align-items-center flex-column flex-md-row`}
                >
                  <div className={`${styles['starBox-bl']}   mb-3 mb-md-0`}>
                    <h5>
                      {data.product.average_star
                        ? `${data.product.average_star} / 5`
                        : '尚無評價'}
                    </h5>
                    <div className={styles['starBox-bl']}>
                      <FaRegStar fontSize={24} style={{ color: '#b79347' }} />
                      <FaRegStar fontSize={24} style={{ color: '#b79347' }} />
                      <FaRegStar fontSize={24} style={{ color: '#b79347' }} />
                      <FaRegStar fontSize={24} style={{ color: '#b79347' }} />
                      <FaRegStar fontSize={24} style={{ color: '#b79347' }} />
                      <div
                        className={`${styles['starRating-bl']} ${
                          data.product.average_star ? '' : 'd-none'
                        }`}
                        style={{
                          width: `${(data.product.average_star / 5) * 100}%`,
                        }}
                      >
                        <FaStar fontSize={24} style={{ color: '#b79347' }} />
                        <FaStar fontSize={24} style={{ color: '#b79347' }} />
                        <FaStar fontSize={24} style={{ color: '#b79347' }} />
                        <FaStar fontSize={24} style={{ color: '#b79347' }} />
                        <FaStar fontSize={24} style={{ color: '#b79347' }} />
                      </div>
                    </div>
                  </div>
                  <div className={styles['btnBox-bl']}>
                    <button
                      onClick={() => {
                        setComment(data.comment)
                      }}
                      className={`${styles['btnComment']} ${
                        comment.star === 0 ? `${styles['active']}` : ''
                      }`}
                    >
                      全部
                    </button>
                    {sortedStarCount.map(([star, count]) => (
                      <button
                        key={[star]}
                        onClick={() => {
                          handleStarChange(star)
                        }}
                        className={`${styles['btnComment']} ${
                          comment.star === star ? `${styles['active']}` : ''
                        }`}
                        disabled={count === 0}
                      >
                        {star}星({count})
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  id="collapse"
                  className={`${styles['collapse']} d-none`}
                  type="checkbox"
                  hidden=""
                  defaultChecked=""
                />
                <label htmlFor="collapse" className={styles['collapseButton']}>
                  <FaChevronDown fontSize={24} className={styles['down']} />
                  <FaChevronUp fontSize={24} className={styles['up']} />
                </label>
                <div className={styles['fold']}>
                  <div className={styles['commentBox-bl']}>
                    {comment.content.map((value) => {
                      return (
                        <div
                          key={value.id}
                          className={`${styles['commentCard-bl']} ${styles['underLine-bl']} d-flex`}
                        >
                          <div className={`${styles['pic-bl']} me-3`}>
                            <Image
                              src={`/images/boyu/users/${value.user_img}.jpg`}
                              width={280}
                              height={280}
                              alt=""
                            />
                          </div>
                          <div className="cardBody-bl">
                            <div className={`${styles['userInfo-bl']} mb-4`}>
                              <p>{value.username}</p>
                              <StarRating initRating={value.star} />
                              <p>{value.date}</p>
                            </div>
                            <div>
                              <p>{value.content}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles['section2Right-bl']} col-12 col-md-4 `}>
              <div className={styles['underLine-bl']}>
                <h6>你可能也會喜歡:</h6>
              </div>
              <div className={`mb-5`}>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={2}
                  direction="horizontal"
                  autoHeight={true}
                  loop={false}
                  breakpoints={{
                    576: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                      direction: 'horizontal',
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                      direction: 'vertical',
                    },
                  }}
                  className={styles.swiper}
                >
                  {data.like.map((product) => {
                    return (
                      <SwiperSlide key={product.id} className={styles.column1}>
                        <Link href={`/product/${product.id}`}>
                          <div
                            className={`${styles['productCard']} swiper-slide`}
                          >
                            <div className={styles['swiperImg']}>
                              <div className={styles['imgBox']}>
                                <Image
                                  src={`../../images/product/${product.img}`}
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
                                      ? `../../images/product/${product.img2}`
                                      : '../../images/boyu/logo.svg'
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
                                <p
                                  className={` ${styles['productDescription']}`}
                                >
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
          </div>
        </main>
      )}
    </>
  )
}
