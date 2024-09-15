import React, { useEffect, useState, useContext } from 'react'
import Image from 'next/image'
import {
  FaFilter,
  FaSort,
  FaMagnifyingGlass,
  FaXmark,
  FaCheck,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaPlus,
  FaMinus,
} from 'react-icons/fa6'
import styles from '@/styles/bearlong/productList.module.scss'
// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ProductNav from '@/components/product/product-nav'
import { AuthContext } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
// import { FadeLoader } from 'react-spinners'
import ProductCard from '@/components/product/productCard'
import ToTheTop from '@/components/icons/to-the-top'
import { Autoplay } from 'swiper/modules'
import Carousel from '@/components/product/carousel'
import Loading from '@/components/loader/loading'

const override = {
  display: 'block',
  margin: '50vh auto',
  borderColor: 'red',
}

export default function ProductList() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [products, setProducts] = useState({ top: [], list: [] })
  const [pages, setPages] = useState(1)
  const [brandOptions, setBrandOption] = useState([])
  const [cateOptions, setCateOption] = useState([])
  const { brand_id, category_id, size, style, search, max, min, orderBy } =
    router.query
  let initialFilters = {
    brand_id: router.query.brand_id || '',
    category_id: router.query.category_id || '',
    size: router.query.size || '',
    style: router.query.style || '',
    search: router.query.search || '',
    max: router.query.max || '',
    min: router.query.min || '',
    orderBy: router.query.orderBy || '',
    isFilter: false,
  }
  const [filters, setFilters] = useState(initialFilters)
  const [sizeOptions, setSizeOption] = useState([
    {
      id: 1,
      label: '33mm',
      checked: filters.size ? filters.size.split(',').includes('33mm') : false,
    },
    {
      id: 2,
      label: '34mm',
      checked: filters.size ? filters.size.split(',').includes('34mm') : false,
    },
    {
      id: 3,
      label: '36mm',
      checked: filters.size ? filters.size.split(',').includes('36mm') : false,
    },
  ])
  const [styleOptions, setStyleOption] = useState([])
  const [minOptions, setMinOption] = useState(0)
  const [maxOptions, setMaxOption] = useState(200000)
  const [searchValue, setSearchValue] = useState('')
  const [favorite, setFavorite] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const getProducts = async (filtersArr) => {
    let newProducts, error
    const url = `http://localhost:3005/api/products?page=${pages}&${Object.entries(
      filtersArr
    )
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`
    newProducts = await fetch(url)
      .then((res) => res.json())
      .then((results) => {
        return results
      })
      .catch((err) => {
        error = err
        return undefined
      })
    if (error) {
      return
    }

    if (newProducts) {
      const newList = newProducts.list.map((v) => {
        if (
          favorite.some(
            (fav) =>
              fav.object_id === v.product_id && fav.object_type === 'product'
          )
        ) {
          return { ...v, fav: true }
        } else {
          return { ...v, fav: false }
        }
      })
      newProducts = { ...newProducts, list: newList }
      setProducts(newProducts)
      const initBrandOptions = newProducts.brand.map((v) => {
        return {
          id: v.id,
          label: v.name,
          checked: filters.brand_id
            ? filters.brand_id.split(',').includes(String(String(v.id)))
            : false,
        }
      })
      const initCateOptions = newProducts.category.map((v) => {
        return {
          id: v.id,
          label: v.name,
          checked: filters.category_id
            ? filters.category_id.split(',').includes(String(String(v.id)))
            : false,
        }
      })
      const initStyleOptions = newProducts.style
        .filter((v) => v.style !== null)
        .map((v, i) => {
          return {
            id: i,
            label: v.style,
            checked: filters.style
              ? filters.style.split(',').includes(String(v.style))
              : false,
          }
        })
      setBrandOption(initBrandOptions)
      setCateOption(initCateOptions)
      setStyleOption(initStyleOptions)
    }
  }

  const getFavorite = async () => {
    try {
      if (user) {
        const url = `http://localhost:3005/api/favorites?id=${user.id}`
        const response = await fetch(url)
        const result = await response.json()
        if (result.status === 'success') {
          setFavorite(result.data.fav)
        } else {
          console.log(result.data.message)
        }
      } else {
        setFavorite([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleLoadMore = () => {
    if (pages * 12 < products.total) {
      setPages((page) => page + 1)
    }
  }
  const handleBrandChecked = (id) => {
    const nextBrandOptions = brandOptions.map((v) => {
      if (v.id === id) {
        return { ...v, checked: !v.checked }
      }
      return v
    })
    setBrandOption(nextBrandOptions)
  }
  const handleCateChecked = (id) => {
    const nextCateOptions = cateOptions.map((v) => {
      if (v.id === id) {
        return { ...v, checked: !v.checked }
      }
      return v
    })
    setCateOption(nextCateOptions)
  }
  const handleSizeChecked = (id) => {
    const nextSizeOptions = sizeOptions.map((v) => {
      if (v.id === id) {
        return { ...v, checked: !v.checked }
      }
      return v
    })
    setSizeOption(nextSizeOptions)
  }
  const handleStyleChecked = (id) => {
    const nextStyleOptions = styleOptions.map((v) => {
      if (v.id === id) {
        return { ...v, checked: !v.checked }
      }

      return v
    })
    setStyleOption(nextStyleOptions)
  }

  const brandCheckedCount = Object.values(brandOptions).filter(
    (v) => v.checked
  ).length
  const cateCheckedCount = Object.values(cateOptions).filter(
    (v) => v.checked
  ).length
  const styleCheckedCount = Object.values(styleOptions).filter(
    (v) => v.checked
  ).length
  const sizeCheckedCount = Object.values(sizeOptions).filter(
    (v) => v.checked
  ).length

  const handleFilterSubmit = () => {
    const filter = {
      brand_id: brandOptions
        .filter((option) => option.checked)
        .map((option) => option.id)
        .join(','),
      category_id: cateOptions
        .filter((option) => option.checked)
        .map((option) => option.id)
        .join(','),
      size: sizeOptions
        .filter((option) => option.checked)
        .map((option) => option.label)
        .join(','),
      style: styleOptions
        .filter((option) => option.checked)
        .map((option) => option.label)
        .join(','),
      search: '',
      max: maxOptions,
      min: minOptions,
      orderBy: '',
      isFilter: true,
    }
    setFilters(filter)
    setPages(1)
  }

  const handleSearchSubmit = (v) => {
    const filter = {
      ...filters,
      search: v,
    }
    setFilters(filter)
    setPages(1)
  }

  const handleSort = (v) => {
    const filter = {
      ...filters,
      orderBy: v,
    }
    setFilters(filter)
    setPages(1)
  }

  const handleCheckboxGroupAll = () => {
    const nextBrandOptions = brandOptions.map((v) => {
      return { ...v, checked: false }
    })
    const nextCateOptions = cateOptions.map((v) => {
      return { ...v, checked: false }
    })
    const nextSizeOptions = sizeOptions.map((v) => {
      return { ...v, checked: false }
    })
    const nextStyleOptions = styleOptions.map((v) => {
      return { ...v, checked: false }
    })
    setBrandOption(nextBrandOptions)
    setCateOption(nextCateOptions)
    setSizeOption(nextSizeOptions)
    setStyleOption(nextStyleOptions)
    setMaxOption(200000)
    setMinOption(0)
  }

  const handleFavToggle = async (object_id, type) => {
    const foundIndex = products.list.findIndex(
      (v) => v.product_id === object_id
    )
    const fav = products.list[foundIndex].fav

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
        const nextList = products.list.map((v) => {
          if (v.product_id === object_id) {
            return { ...v, fav: !v.fav }
          }
          return v
        })
        setProducts({ ...products, list: nextList })
      } else {
        console.log(result.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getProducts(filters)
  }, [filters, pages, favorite])

  useEffect(() => {
    setIsLoading(true) // 開始加載數據

    if (router.isReady) {
      const filter = {
        brand_id: brand_id || '',
        category_id: category_id || '',
        size: size || '',
        style: style || '',
        search: search || '',
        max: max || '',
        min: min || '',
        orderBy: orderBy || '',
        isFilter: false,
      }
      setFilters(filter)
      getFavorite()
      setPages(1)
      setSearchValue('')

      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    if (user) {
      getFavorite()
    }
  }, [user])

  const [autoplay, setAutoplay] = useState({
    delay: 2500,
    disableOnInteraction: false,
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setAutoplay({
          delay: 2500,
          disableOnInteraction: false,
        })
      } else {
        setAutoplay(false)
      }
    }

    // 初始檢查
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <ProductNav />

      {isLoading ? (
        <div className={styles.loading}>
          <Loading />
        </div>
      ) : (
        <main className={styles.main}>
          <div className={styles['topSection-bl']}>
            <h4 className={`${styles['topTitle']} mb-5`}>人氣商品</h4>
            <div className={`${styles['topList-bl']}`}>
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                autoplay={autoplay}
                direction="horizontal"
                autoHeight={true}
                loop={false}
                breakpoints={{
                  576: { slidesPerView: 2, spaceBetween: 30 },
                  992: { slidesPerView: 3, spaceBetween: 30 },
                  1200: { slidesPerView: 4, spaceBetween: 40 },
                }}
                modules={[Autoplay]}
              >
                {products.top.map((product, i) => {
                  return (
                    <SwiperSlide key={product.id}>
                      <Link
                        href={`/product/${product.id}`}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div
                          className={`${styles['productCard']} ${styles['swiper-slide']} `}
                        >
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
          <div className={styles['line']} />
          <div className={` mb-5`}>
            <div
              className={`${styles['productNavBar-bl']} d-flex justify-content-between mb-5`}
            >
              <p>{products.total} 件商品</p>
              <div
                className={` d-flex gap-5 justify-content-between align-items-center`}
              >
                <div className={`${styles['search']} input-group input-group`}>
                  <input
                    type="text"
                    className="form-control text-dark"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value)
                    }}
                  />
                  <button
                    className="input-group-text"
                    id="inputGroup-sizing"
                    onClick={() => {
                      handleSearchSubmit(searchValue)
                    }}
                  >
                    <FaMagnifyingGlass width={40} color="#ffffff" />
                  </button>
                </div>
                <div
                  className={`${styles['icon-bl']} d-flex  justify-content-between align-items-center`}
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasFliter-bl"
                  aria-controls="offcanvasRight"
                >
                  <FaFilter size={20} color="#b79347" />
                </div>
                <div
                  className={`${styles['icon-bl']}  d-flex  justify-content-between align-items-cente`}
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasOrder-bl"
                  aria-controls="offcanvasRight"
                >
                  <FaSort size={20} color="#b79347" />
                </div>
              </div>
            </div>
            <div className={styles['products-bl']}>
              {products.list.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    handleFavToggle={handleFavToggle}
                  />
                )
              })}
            </div>
            <div className={styles['loadMore-bl']}>
              <p>
                {pages * 12 > products.total ? products.total : pages * 12} /{' '}
                {products.total}
              </p>
              <div
                className={` ${styles.progress} progress`}
                role="progressbar"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${((pages * 12) / products.total) * 100}%` }}
                />
              </div>

              <button
                className={`${styles['btn-more']} d-flex`}
                onClick={handleLoadMore}
              >
                <p>查看更多</p>
                <i className={styles['edit-icon']} />
              </button>
            </div>
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
          <div
            className={`${styles['offcanvas-pb']}  offcanvas offcanvas-end`}
            tabIndex={-1}
            id="offcanvasOrder-bl"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header">
              <div
                className={`h5 offcanvas-title`}
                id="offcanvasRightLabel"
              ></div>
              <button
                type="button"
                className={`${styles['btn-close']} btn-close d-flex justify-content-between align-items-center`}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <FaXmark width={25} />
              </button>
            </div>
            <div className={`${styles['offcanvas-body']} offcanvas-body`}>
              <div className={`${styles['orderBox-bl']}`}>
                <input
                  type="radio"
                  id={'0'}
                  name="test"
                  defaultValue={0}
                  onChange={() => {
                    handleSort(0)
                  }}
                />
                <label
                  className="d-flex justify-content-between align-items-center mb-5"
                  htmlFor={'0'}
                  defaultChecked
                >
                  <h6>推薦</h6>
                  <div
                    className={`${styles['check']} h6 justify-content-between align-items-center`}
                  >
                    <FaCheck width={20} />
                  </div>
                </label>
                <input
                  type="radio"
                  id={1}
                  name="test"
                  defaultValue={1}
                  onChange={() => {
                    handleSort(1)
                  }}
                />
                <label
                  className="d-flex justify-content-between align-items-center mb-5"
                  htmlFor={1}
                >
                  <h6>上架日期</h6>

                  <div
                    className={`${styles['check']} h6 justify-content-between align-items-center`}
                  >
                    <FaCheck width={20} />
                  </div>
                </label>
                <input
                  type="radio"
                  id={2}
                  name="test"
                  defaultValue={2}
                  onChange={() => {
                    handleSort(2)
                  }}
                />
                <label
                  className="d-flex justify-content-between align-items-center mb-5"
                  htmlFor={2}
                >
                  <h6>評價由高到低</h6>
                  <div
                    className={`${styles['check']} h6 justify-content-between align-items-center`}
                  >
                    <FaCheck width={20} />
                  </div>
                </label>
                <input
                  type="radio"
                  id={3}
                  name="test"
                  defaultValue={3}
                  onChange={() => {
                    handleSort(3)
                  }}
                />
                <label
                  className="d-flex justify-content-between align-items-center mb-5"
                  htmlFor={3}
                >
                  <h6>價格由高到低</h6>
                  <div
                    className={`${styles['check']} h6 justify-content-between align-items-center`}
                  >
                    <FaCheck width={20} />
                  </div>
                </label>
                <input
                  type="radio"
                  id={4}
                  name="test"
                  defaultValue={4}
                  onChange={() => {
                    handleSort(4)
                  }}
                />
                <label
                  className="d-flex justify-content-between align-items-center mb-5"
                  htmlFor={4}
                >
                  <h6>價格由低到高</h6>
                  <div
                    className={`${styles['check']} h6 justify-content-between align-items-center`}
                  >
                    <FaCheck width={20} />
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div
            className={`${styles['offcanvas-pb']}  offcanvas offcanvas-end`}
            tabIndex={-1}
            id="offcanvasFliter-bl"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header">
              <div className={`h5 offcanvas-title`} id="offcanvasRightLabel" />
              <button
                type="button"
                className={`${styles['btn-close']} btn-close d-flex justify-content-between align-items-center`}
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <FaXmark width={20} />
              </button>
            </div>
            <div
              className={`${styles['offcanvas-body']} offcanvas-body d-flex flex-column justify-content-between`}
            >
              <div className={`${styles['filterBarMain-bl']}`}>
                <div className={`${styles['filterBar-bl']}`}>
                  <input
                    type="checkbox"
                    id="brandCheck"
                    className={`${styles['brandCheck']}`}
                  />
                  <label
                    className="d-flex justify-content-between mb-3 pe-2"
                    htmlFor="brandCheck"
                  >
                    <div className={`${styles['filterTitle']} d-flex`}>
                      <h6>品牌</h6>
                      <div
                        className={`${styles['chose']} ms-3 ${
                          brandCheckedCount > 0 ? '' : 'd-none'
                        }`}
                      >
                        {brandCheckedCount}
                      </div>
                    </div>

                    <h6 className={`${styles['plus']}`}>
                      <FaPlus />
                    </h6>
                    <h6 className={`${styles['minus']}`}>
                      <FaMinus />
                    </h6>
                  </label>
                  <div className={`${styles['filterBarSub-bl']} mb-3`}>
                    <ul className={`${styles['grid2']} d-grid`}>
                      {brandOptions.map((v) => {
                        return (
                          <li key={v.id}>
                            <label
                              htmlFor={v.label}
                              className={`${
                                v.checked ? styles['beCheck'] : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="d-none"
                                checked={v.checked}
                                onChange={() => {
                                  handleBrandChecked(v.id)
                                }}
                                id={v.label}
                              />
                              {v.label}
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className={`${styles['filterBar-bl']}`}>
                  <input
                    type="checkbox"
                    id="cateCheck"
                    className={`${styles['cateCheck']}`}
                  />
                  <label
                    className="d-flex justify-content-between mb-3 pe-2"
                    htmlFor="cateCheck"
                  >
                    <div className={`${styles['filterTitle']} d-flex`}>
                      <h6>類別</h6>
                      <div
                        className={`${styles['chose']} ms-3 ${
                          cateCheckedCount > 0 ? '' : 'd-none'
                        }`}
                      >
                        {cateCheckedCount}
                      </div>
                    </div>
                    <span>
                      <h6 className={`${styles['plus']}`}>
                        <FaPlus />
                      </h6>
                      <h6 className={`${styles['minus']}`}>
                        <FaMinus />
                      </h6>
                    </span>
                  </label>
                  <div className={`${styles['filterBarSub-bl']} mb-3`}>
                    <ul>
                      {cateOptions.map((v) => {
                        return (
                          <li key={v.id}>
                            <label
                              htmlFor={`${v.label}_Cate`}
                              className={`${
                                v.checked ? styles['beCheck'] : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="d-none"
                                checked={v.checked}
                                onChange={() => {
                                  handleCateChecked(v.id)
                                }}
                                id={`${v.label}_Cate`}
                              />
                              {v.label}
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className={`${styles['filterBar-bl']}`}>
                  <input
                    type="checkbox"
                    id="styleCheck"
                    className={`${styles['styleCheck']}`}
                  />
                  <label
                    className="d-flex justify-content-between mb-3 pe-2"
                    htmlFor="styleCheck"
                  >
                    <div className={`${styles['filterTitle']} d-flex`}>
                      <h6>款式</h6>
                      <div
                        className={`${styles['chose']} ms-3 ${
                          styleCheckedCount > 0 ? '' : 'd-none'
                        }`}
                      >
                        {styleCheckedCount}
                      </div>
                    </div>
                    <span>
                      <h6 className={`${styles['plus']}`}>
                        <FaPlus />
                      </h6>
                      <h6 className={`${styles['minus']}`}>
                        <FaMinus />
                      </h6>
                    </span>
                  </label>
                  <div className={`${styles['filterBarSub-bl']} mb-3`}>
                    <ul className={`${styles['grid3']} d-grid`}>
                      {styleOptions.map((v) => {
                        return (
                          <li key={v.id}>
                            <label
                              htmlFor={v.label}
                              className={`${
                                v.checked ? styles['beCheck'] : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="d-none"
                                checked={v.checked}
                                onChange={() => {
                                  handleStyleChecked(v.id)
                                }}
                                id={v.label}
                              />
                              {v.label}
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className={`${styles['filterBar-bl']}`}>
                  <input
                    type="checkbox"
                    id="sizeCheck"
                    className={`${styles['sizeCheck']}`}
                  />
                  <label
                    className="d-flex justify-content-between mb-3 pe-2"
                    htmlFor="sizeCheck"
                  >
                    <div className={`${styles['filterTitle']} d-flex`}>
                      <h6>尺寸</h6>
                      <div
                        className={`${styles['chose']} ms-3 ${
                          sizeCheckedCount > 0 ? '' : 'd-none'
                        }`}
                      >
                        {sizeCheckedCount}
                      </div>
                    </div>
                    <span>
                      <h6 className={`${styles['plus']}`}>
                        <FaPlus />
                      </h6>
                      <h6 className={`${styles['minus']}`}>
                        <FaMinus />
                      </h6>
                    </span>
                  </label>
                  <div className={`${styles['filterBarSub-bl']} mb-3`}>
                    <ul>
                      {sizeOptions.map((v) => {
                        return (
                          <li key={v.id}>
                            <label
                              htmlFor={v.label}
                              className={`${
                                v.checked ? styles['beCheck'] : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="d-none"
                                checked={v.checked}
                                onChange={() => {
                                  handleSizeChecked(v.id)
                                }}
                                id={v.label}
                              />
                              {v.label}
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <div className={styles['rangeBox-bl']}>
                    <input
                      type="range"
                      className="form-range max"
                      max={200000}
                      min={0}
                      defaultValue={200000}
                      onChange={(v) => {
                        setMaxOption(v.target.value)
                      }}
                    />
                    <p>
                      max: <span>{maxOptions}</span>
                    </p>
                  </div>
                  <div className={styles['rangeBox-bl']}>
                    <input
                      type="range"
                      className="form-range min"
                      max={200000}
                      min={0}
                      defaultValue={minOptions}
                      onChange={(v) => {
                        setMinOption(v.target.value)
                      }}
                    />
                    <p>
                      min: <span>{minOptions}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={`${styles['filterSearch-bl']}`}>
                <button
                  className={`${styles['btn-primary']} btn btn-primary mb-3`}
                  onClick={() => {
                    setSearchValue('')

                    handleFilterSubmit()
                  }}
                >
                  查看結果
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    setSearchValue('')
                    handleCheckboxGroupAll()
                  }}
                >
                  重置
                </button>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  )
}
