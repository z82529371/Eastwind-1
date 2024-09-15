import React from 'react'

export default function About() {
  return (
    <main>
      <div
        className="btn btn-primary"
        data-bs-toggle="offcanvas"
        data-bs-target="#cart-box-bo"
        aria-controls="offcanvasRight"
      >
        <i className="fa-solid fa-filter icon-bl" />
      </div>
      <div
        className="cart-box-bo offcanvas offcanvas-end"
        tabIndex={-1}
        id="cart-box-bo"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="recommend-section-bo">
          <div className="recommend-title-bo">
            <h5>推薦商品</h5>
          </div>
          <div className="topList-bl d-flex justify-content-center align-items-center flex-column">
            <div className="productCard mb-5">
              <div className="swiperImg">
                <div className="imgBox">
                  <div className="top top1">1</div>
                  <img src="./images/product/015.jpg" alt="" />
                </div>
                <div className="imgBox secondImg">
                  <img src="./images/product/019.jpg" alt="" />
                </div>
              </div>
              <div className="cardBody">
                <div className="productName-bl">
                  <p>馬丘machill</p>
                  <p className="productDescription">
                    馬丘麻將【電動麻將桌用版】
                  </p>
                </div>
                <p>NT. 2,500</p>
              </div>
            </div>
            <div className="productCard mb-5">
              <div className="swiperImg">
                <div className="imgBox">
                  <div className="top top2">2</div>
                  <img src="./images/product/015.jpg" alt="" />
                </div>
                <div className="imgBox secondImg">
                  <img src="./images/product/019.jpg" alt="" />
                </div>
              </div>
              <div className="cardBody">
                <div className="productName-bl">
                  <p>馬丘machill</p>
                  <p className="productDescription">
                    馬丘麻將【電動麻將桌用版】
                  </p>
                </div>
                <p>NT. 2,500</p>
              </div>
            </div>
            <div className="productCard mb-5">
              <div className="swiperImg">
                <div className="imgBox">
                  <div className="top top3">3</div>
                  <img src="./images/product/015.jpg" alt="" />
                </div>
                <div className="imgBox secondImg">
                  <img src="./images/product/019.jpg" alt="" />
                </div>
              </div>
              <div className="cardBody">
                <div className="productName-bl">
                  <p>馬丘machill</p>
                  <p className="productDescription">
                    馬丘麻將【電動麻將桌用版】【電動麻將桌用版】【電動麻將桌用版】
                  </p>
                </div>
                <p>NT. 2,500</p>
              </div>
            </div>
            <div className="productCard mb-5">
              <div className="swiperImg">
                <div className="imgBox">
                  <div className="top top4">4</div>
                  <img src="./images/product/015.jpg" alt="" />
                </div>
                <div className="imgBox secondImg">
                  <img src="./images/product/019.jpg" alt="" />
                </div>
              </div>
              <div className="cardBody">
                <div className="productName-bl">
                  <p>馬丘machill</p>
                  <p className="productDescription">
                    馬丘麻將【電動麻將桌用版】
                  </p>
                </div>
                <p>NT. 2,500</p>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-section-bo">
          <div className="offcanvas-header">
            <h5
              className="offcanvas-title cart-title-bo"
              id="offcanvasRightLabel"
            >
              購物車（2 件）
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="offcanvas-body filterBox">
            <div className="cart-bo d-flex flex-column justify-content-between">
              <div className="cart-body-bo">
                <div className="cart-product-bo d-flex mb-5">
                  <div className="cart-product-img-bo me-4">
                    <img src="./images/product/015.jpg" alt="" />
                  </div>
                  <div className="cart-product-text-box-bo flex-grow-1 d-flex flex-column justify-content-between">
                    <div className="cart-product-text-bo d-flex justify-content-between">
                      <div className="cart-product-title-bo">
                        <h6>634精選系列-34mm</h6>
                        <p>東方不敗</p>
                      </div>
                      <i className="fa-solid fa-trash-can h6" />
                    </div>
                    <div className="cart-product-text-bo d-flex justify-content-between">
                      <div className="cart-product-number-bo d-flex justify-content-between align-items-center">
                        <i className="fa-solid fa-minus me-5" />
                        <h6 className="amount">1</h6>
                        <i className="fa-solid fa-plus ms-5" />
                      </div>
                      <div className="product-price-bo">
                        <h6>NT$ 2,380</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cart-text-box-bo">
                <div className="remark-box-bo mb-3">
                  <h6>新增訂單備註</h6>
                  <textarea
                    className="form-control mt-3"
                    rows={3}
                    id=""
                    defaultValue={''}
                  />
                </div>
                <div className="total-price-box-bo d-flex justify-content-between align-items-center mb-3">
                  <h6>總計</h6>
                  <h6>NT$ 2,380</h6>
                </div>
                <button className="pay-button-bo d-flex justify-content-center align-items-center h5">
                  現在付款
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
