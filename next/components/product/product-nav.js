import React from 'react'
import Link from 'next/link'
import styles from '@/styles/bearlong/productList.module.scss'

export default function ProductNav() {
  return (
    <>
      <div className={styles['product-header-bl']}>
        <ul className={` d-flex ${styles['subBar-bl']} `}>
          <li>
            <Link className={styles['subNav']} href="productList">
              <h6>總覽</h6>
            </Link>
          </li>
          <li>
            <Link className={styles['subNav']} href="productList?category_id=1">
              <h6>麻將</h6>
            </Link>
            <div className={styles['subBarBody-bl']}>
              <div className="d-flex">
                <div>
                  <h6 className={styles['title']}>精選推薦</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=1&orderBy=1">
                        最新上架
                      </Link>
                    </li>
                    <li>活動促銷</li>
                    <li>
                      <Link href="productList?category_id=1&orderBy=2">
                        評價最高
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>品牌</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=1&brand_id=1">
                        東方不敗
                      </Link>
                    </li>
                    <li>
                      {' '}
                      <Link href="productList?category_id=1&brand_id=9">
                        商密特SUMMIT
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=1&brand_id=11">
                        麻將大俠
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=1&brand_id=16">
                        馬丘machill
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>尺寸</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=1&size=33mm">
                        33mm
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=1&size=34mm">
                        34mm
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=1&size=36mm">
                        36mm
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>類別</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=1&style=電麻款">
                        電動麻將桌專用
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li>
            <Link className={styles['subNav']} href="productList?category_id=2">
              <h6>牌尺</h6>
            </Link>
            <div className={styles['subBarBody-bl']}>
              <div className="d-flex">
                <div>
                  <h6 className={styles['title']}>精選推薦</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=2&orderBy=1">
                        最新上架
                      </Link>
                    </li>
                    <li>活動促銷</li>
                    <li>
                      <Link href="productList?category_id=2&orderBy=2">
                        評價最高
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>品牌</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=2&brand_id=1">
                        東方不敗
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=2&brand_id=2">
                        雀王
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=2&brand_id=9">
                        商密特SUMMIT
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=2&brand_id=10">
                        長勝
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=2&brand_id=11">
                        麻將大俠
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=2&brand_id=16">
                        馬丘machill
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li>
            <Link className={styles['subNav']} href="productList?category_id=3">
              <h6>麻將桌</h6>
            </Link>
            <div className={styles['subBarBody-bl']}>
              <div className="d-flex">
                <div>
                  <h6 className={styles['title']}>精選推薦</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=3&orderBy=1">
                        最新上架
                      </Link>
                    </li>
                    <li>活動促銷</li>
                    <li>
                      <Link href="productList?category_id=3&orderBy=2">
                        評價最高
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>品牌</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=3&brand_id=1">
                        東方不敗
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=3&brand_id=2">
                        雀王
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=3&brand_id=9">
                        商密特SUMMIT
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=3&brand_id=10">
                        長勝
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=3&brand_id=11">
                        麻將大俠
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=3&brand_id=12">
                        雀友
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=3&brand_id=14">
                        輝葉良品
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>類別</h6>
                  <ul>
                    <li>
                      <Link href="productList?style=餐桌款">餐桌款</Link>
                    </li>
                    <li>
                      <Link href="productList?style=折疊款">折疊款</Link>
                    </li>
                    <li>
                      <Link href="productList?style=套裝款">套裝款</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li>
            <Link className={styles['subNav']} href="productList?category_id=4">
              <h6>周邊</h6>
            </Link>
            <div
              className={`${styles['subBarBody-bl']} ${styles['rightBar-bl']}`}
            >
              <div className="d-flex">
                <div>
                  <h6 className={styles['title']}>精選推薦</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=4&orderBy=1">
                        最新上架
                      </Link>
                    </li>
                    <li>活動促銷</li>
                    <li>
                      <Link href="productList?category_id=4&orderBy=2">
                        評價最高
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>類別</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=4&style=籌碼">
                        籌碼
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=4&style=骰子">
                        骰子
                      </Link>
                    </li>
                    <li>
                      <Link href="productList?category_id=4&style=麻將周邊">
                        麻將周邊
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li>
            <Link className={styles['subNav']} href="productList?category_id=5">
              <h6>桌遊</h6>
            </Link>
            <div className={`${styles['subBarBody-bl']} ${styles['last-bl']}`}>
              <div className="d-flex">
                <div>
                  <h6 className={styles['title']}>精選推薦</h6>
                  <ul>
                    <li>
                      <Link href="productList?category_id=5&orderBy=1">
                        最新上架
                      </Link>
                    </li>
                    <li>活動促銷</li>
                    <li>
                      <Link href="productList?category_id=5&orderBy=2">
                        評價最高
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className={styles['title']}>類別</h6>
                  <ul>
                    <li>
                      <Link href="productList?style=台灣元素">台灣元素</Link>
                    </li>
                    <li>
                      <Link href="productList?style=策略">策略</Link>
                    </li>
                    <li>
                      <Link href="productList?style=派對">派對</Link>
                    </li>
                    <li>
                      <Link href="productList?style=RPG">RPG</Link>
                    </li>
                    <li>
                      <Link href="productList?style=家庭">家庭</Link>
                    </li>
                    <li>
                      <Link href="productList?style=親子">親子</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}
