import React, { useEffect, useState, useContext } from 'react'
import styles from '@/styles/bearlong/checkout.module.scss'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'
import validator from 'validator'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useShip711StoreOpener } from '@/hooks/use-ship-711-store'
import { FadeLoader } from 'react-spinners'
import Loading from '@/components/loader/loading'

const override = {
  display: 'block',
  margin: '50vh auto 80vh',
  borderColor: 'red',
}

export default function Checkout() {
  const { user, loading } = useContext(AuthContext)

  let totalPrice
  const [couponTemplate, setCouponTemplate] = useState(null)
  const initSendForm = {
    country: '',
    firstname: '',
    lastname: '',
    postCode: '',
    city: '',
    address: '',
  }
  const {
    cart = [],
    remark = '',
    setRemark = () => {},
    handleRemoveAll = () => {},
    cartTotal,
  } = useCart()
  const router = useRouter()
  const [delivery, setDelivery] = useState('宅配')
  const [deliveryPrice, setDeliveryPrice] = useState(60)
  const [sendForm, setSendForm] = useState(initSendForm)
  const [payMethod, setPayMethod] = useState('credit')
  const [hasConfirmed, setHasConfirmed] = useState(false)
  const [payInfo, setPayInfo] = useState({
    creditNum1: '',
    creditNum2: '',
    creditNum3: '',
    creditNum4: '',
    expDate: '',
    csc: '',
    cardholder: '',
    country: '',
    postCode: '',
    city: '',
    address: '',
    useDeliveryAddress: true,
  })
  const [coupons, setCoupon] = useState([
    {
      id: '',
      discount: 0,
      name: '',
    },
  ])
  const [formError, setFormError] = useState({
    ...initSendForm,
    couponSelect: '',
    creditCard: '',
    expDate: '',
    csc: '',
    cardholder: '',
    billingAddressCountry: '',
    billingAddressPostCode: '',
    billingAddressCity: '',
    billingAddressAddress: '',
  })
  const citySelect = [
    '台北市',
    '新北市',
    '桃園市',
    '台中市',
    '台南市',
    '高雄市',
    '新竹縣',
    '苗栗縣',
    '彰化縣',
    '南投縣',
    '雲林縣',
    '嘉義縣',
    '屏東縣',
    '宜蘭縣',
    '花蓮縣',
    '台東縣',
    '澎湖縣',
    '金門縣',
    '連江縣',
    '基隆市',
    '新竹市',
    '嘉義市',
  ]
  const [cardSelect, setCardSelect] = useState('')
  const [card, setCard] = useState([])
  const [couponSelect, setCouponSelect] = useState('')
  const [total, setTotal] = useState(0)
  const [payLoading, setPayLoading] = useState(false)
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    'http://localhost:3005/api/shipment/711',
    { enableLocalStorage: false }
  )

  const handleToTop = () => {
    window.scrollTo(0, 0)
  }
  const notifyAndRemove = (numerical_order) => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      customClass: {
        popup: `h6`,
        title: `h4`,
        content: `h1`,
      },
      title: `訂單已完成</br> 訂單編號為: ${numerical_order} </br> 立即跳轉訂單列表`,
      showConfirmButton: false,
      timer: 3000,
    })
  }

  const goLinePay = (orderId) => {
    if (window.confirm('確認要導向至LINE Pay進行付款?')) {
      // 先連到node伺服器後，導向至LINE Pay付款頁面
      window.location.href = `http://localhost:3005/api/checkout/LinepayReserve?orderId=${orderId}`
    }
  }

  const goECPay = (orderId) => {
    if (window.confirm('確認要導向至ECPay進行付款?')) {
      // 先連到node伺服器後，導向至LINE Pay付款頁面
      window.location.href = `http://localhost:3005/api/checkout/ecpaypayment?orderId=${orderId}`
    }
  }

  const validateFields = (errors, fieldname = '') => {
    // 先建立空白的錯誤訊息，代表每次檢查均需重置所有錯誤訊息開始檢查起
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    // 以下使用`||=`語法是同時間只有一個錯誤訊息，而且會寫在愈上面檢查的為主
    if (delivery === '宅配') {
      if (validator.isEmpty(sendForm.country, { ignore_whitespace: true })) {
        newErrors.country ||= '請選擇國家'
      }
      if (validator.isEmpty(sendForm.firstname, { ignore_whitespace: true })) {
        newErrors.firstname ||= '請輸入姓氏'
      }
      if (validator.isEmpty(sendForm.lastname, { ignore_whitespace: true })) {
        newErrors.lastname ||= '請輸入名字'
      }
      if (validator.isEmpty(sendForm.postCode, { ignore_whitespace: true })) {
        newErrors.postCode ||= '請輸入郵遞區號'
      }
      if (validator.isEmpty(sendForm.city, { ignore_whitespace: true })) {
        newErrors.city ||= '請選擇縣市'
      }
      if (validator.isEmpty(sendForm.address, { ignore_whitespace: true })) {
        newErrors.address ||= '請輸入地址'
      }
    } else if (delivery === '7-11店到店') {
      if (validator.isEmpty(store711.storename, { ignore_whitespace: true })) {
        newErrors.address ||= '請選擇門市'
      }
    }

    if (payMethod === 'credit') {
      if (
        validator.isEmpty(payInfo.creditNum1, { ignore_whitespace: true }) ||
        validator.isEmpty(payInfo.creditNum2, { ignore_whitespace: true }) ||
        validator.isEmpty(payInfo.creditNum3, { ignore_whitespace: true }) ||
        validator.isEmpty(payInfo.creditNum4, { ignore_whitespace: true })
      ) {
        newErrors.creditCard ||= '請輸入信用卡號碼'
      }

      if (
        validator.isEmpty(payInfo.expDate, { ignore_whitespace: true }) ||
        !validator.matches(payInfo.expDate, /^(0[1-9]|1[0-2])\/\d{2}$/)
      ) {
        newErrors.expDate ||= '請輸入正確的有效期格式 (mm/yy)'
      }

      if (
        validator.isEmpty(payInfo.csc, { ignore_whitespace: true }) ||
        !validator.matches(payInfo.csc, /^\d{3}$/)
      ) {
        newErrors.csc ||= '請輸入正確的安全碼格式(數字三碼)'
      }
      if (validator.isEmpty(payInfo.cardholder, { ignore_whitespace: true })) {
        newErrors.cardholder ||= '請輸入持卡人姓名'
      }
      if (
        !payInfo.useDeliveryAddress ||
        (payMethod === 'credit' && delivery === '7-11店到店') ||
        (payMethod === 'credit' && delivery === '自取')
      ) {
        if (validator.isEmpty(payInfo.country, { ignore_whitespace: true })) {
          newErrors.billingAddressCountry ||= '請選擇帳單國家'
        }
        if (validator.isEmpty(payInfo.postCode, { ignore_whitespace: true })) {
          newErrors.billingAddressPostCode ||= '請輸入帳單郵遞區號'
        }
        if (validator.isEmpty(payInfo.city, { ignore_whitespace: true })) {
          newErrors.billingAddressCity ||= '請選擇帳單縣市'
        }
        if (validator.isEmpty(payInfo.address, { ignore_whitespace: true })) {
          newErrors.billingAddressAddress ||= '請輸入帳單地址'
        }
      }
    }
    if (validator.isEmpty(couponSelect, { ignore_whitespace: true })) {
      newErrors.couponSelect ||= '請選擇優惠券'
    }
    return fieldname
      ? { ...formError, [fieldname]: newErrors[fieldname] }
      : newErrors
  }
  const handleBlur = (e) => {
    const { name } = e.target
    let newErrors
    if (
      ['creditNum1', 'creditNum2', 'creditNum3', 'creditNum4'].includes(name)
    ) {
      newErrors = validateFields(formError, 'creditCard')
    } else {
      newErrors = validateFields(formError, name)
    }
    setFormError(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 驗證是否有錯誤
    const errors = validateFields(formError)
    const hasErrors = Object.values(errors).some((error) => error !== '')

    if (hasErrors) {
      setFormError(errors)
      Object.entries(errors).forEach(([field, message]) => {
        if (message) {
          toast.error(`${message}`, {
            style: {
              border: '1px solid #d71515',
              padding: '16px',
              fontSize: '16px',
              color: '#d71515',
            },
            iconTheme: {
              primary: '#d71515',
              secondary: '#ffffff',
              fontSize: '16px',
            },
          })
        }
      })
      return
    }
    setPayLoading(true)

    const formData = new FormData()
    let { firstname, lastname, ...newSendData } = sendForm
    let name = firstname + lastname
    if (delivery === '自取') {
      name = user.username
      newSendData = {}
    } else if (delivery === '7-11店到店') {
      name = user.username
      newSendData = { city: store711.storename, address: store711.storeaddress }
    }
    formData.append('delivery', delivery)
    formData.append('delivery_address', JSON.stringify(newSendData))
    formData.append('recipient', name)
    formData.append('payMethod', payMethod)
    if (payInfo.useDeliveryAddress) {
      const newPayInfo = {
        ...newSendData,
        creditNum1: payInfo.creditNum1,
        creditNum2: payInfo.creditNum2,
        creditNum3: payInfo.creditNum3,
        creditNum4: payInfo.creditNum4,
        expDate: payInfo.expDate,
        csc: payInfo.csc,
        cardholder: payInfo.cardholder,
      }
      formData.append('payInfo', JSON.stringify(newPayInfo))
    } else {
      const newPayInfo = payInfo
      formData.append('payInfo', JSON.stringify(newPayInfo))
    }
    formData.append('total', total)
    formData.append('coupon_id', couponSelect)
    if (couponSelect > 0) {
      const coupon = coupons.find(
        (c) => Number(c.coupon_id) === Number(couponSelect)
      )
      formData.append('discount_info', coupon.discount_value)
    } else {
      formData.append('discount_info', '')
    }

    formData.append('remark', remark)
    formData.append('cart', JSON.stringify(cart))
    formData.append('email', user.email)

    const url = `http://localhost:3005/api/checkout/${user.id}`
    const method = 'POST'
    console.log(formData)
    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      })
      const result = await response.json()
      if (result.status === 'success') {
        if (payMethod === 'credit') {
          handleCreditPay(result.data.orderId, result.data.numerical_order)
        } else if (payMethod === 'Linepay') {
          goLinePay(result.data.orderId)
        } else if (payMethod === 'ECPay') {
          goECPay(result.data.orderId)
        }
      } else {
        result.data.message.forEach((message) => {
          toast.error(`${message}`, {
            style: {
              border: '1px solid #d71515',
              padding: '16px',
              fontSize: '16px',
              color: '#d71515',
            },
            iconTheme: {
              primary: '#d71515',
              secondary: '#ffffff',
              fontSize: '16px',
            },
          })
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleConfirm = async (transactionId) => {
    const url = `http://localhost:3005/api/checkout/confirm?transactionId=${transactionId}`
    try {
      const response = await fetch(url)
      const result = await response.json()
      if (result.status === 'success') {
        setPayLoading(false)
        notifyAndRemove(result.data.numerical_order)
        setTimeout(() => {
          handleRemoveAll()
          router.push('/user/user-center/order?status_now=付款完成')
        }, 3000)
      } else {
        toast.error('付款失敗', {
          style: {
            border: `1px solid #d71515`,
            padding: '16px',
            fontSize: '16px',
            color: '#0e0e0e',
          },
          iconTheme: {
            primary: `#d71515`,
            secondary: '#ffffff',
            fontSize: '16px',
          },
        })
      }
      if (result.data) {
        console.log(result.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreditPay = async (id, numerical_order) => {
    const url = `http://localhost:3005/api/checkout/${user.id}`
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // 設定內容類型為 JSON
        },
        body: JSON.stringify({ id: id, numerical_order: numerical_order }),
      })
      const result = await response.json()
      if (result.status === 'success') {
        setPayLoading(false)
        notifyAndRemove(result.data.numerical_order)
        setTimeout(() => {
          handleRemoveAll()
          router.push('/user/user-center/order?status_now=付款完成')
        }, 3000)
      } else {
        toast.error('付款失敗', {
          style: {
            border: `1px solid #d71515`,
            padding: '16px',
            fontSize: '16px',
            color: '#0e0e0e',
          },
          iconTheme: {
            primary: `#d71515`,
            secondary: '#ffffff',
            fontSize: '16px',
          },
        })
      }
      if (result.data) {
        console.log(result.data)
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
    const fetchUserInfo = async () => {
      try {
        if (user) {
          const url = `http://localhost:3005/api/checkout/${user.id}`
          const response = await fetch(url)
          const result = await response.json()
          if (result.status === 'success') {
            const { userInfo, coupons, card } = result.data
            setSendForm({
              ...sendForm,
              firstname: userInfo[0].username.substring(0, 1),
              lastname: userInfo[0].username.substring(1),
              city: userInfo[0].city,
              address: userInfo[0].address,
            })
            setCoupon(coupons)
            setCard(card)
          } else {
            console.log(result.data.message)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (router.isReady && !loading) {
      const { transactionId, orderId, RtnMsg, CustomField1 } = router.query
      if (user) {
        console.log(user)
        fetchUserInfo()
      } else if (!user && loading === false) {
        alert('請先登入會員')
        router.push('/login')
      }

      if (RtnMsg === 'Succeeded') {
        setPayLoading(false)
        notifyAndRemove(CustomField1)
        setTimeout(() => {
          handleRemoveAll()
          router.push('/user/user-center/order?status_now=付款完成')
        }, 3000)
      }

      if (!transactionId || !orderId || hasConfirmed) {
        return
      }
      setHasConfirmed(true)
      handleConfirm(transactionId)
    }
  }, [router.isReady, user])

  useEffect(() => {
    if (cart.length > 0) {
      const coupon = coupons.find(
        (c) => Number(c.coupon_id) === Number(couponSelect)
      )
      if (coupon) {
        const discount = coupon.discount_value
        if (discount >= 100) {
          totalPrice = cartTotal - discount + deliveryPrice
        } else {
          totalPrice =
            Math.round(cartTotal * ((100 - discount) / 100)) + deliveryPrice
        }
        setTotal(totalPrice)
      } else {
        setTotal(cartTotal + deliveryPrice)
      }
    }
  }, [couponSelect, deliveryPrice])

  useEffect(() => {
    if (delivery === '自取' || delivery === '7-11店到店') {
      setSendForm(initSendForm)
      const newformError = { ...formError, ...initSendForm }
      setFormError(newformError)
      setDeliveryPrice(0)
      return
    }
    setDeliveryPrice(60)
  }, [delivery])

  useEffect(() => {
    if (payMethod !== 'credit') {
      setPayInfo({
        creditNum1: '',
        creditNum2: '',
        creditNum3: '',
        creditNum4: '',
        expDate: '',
        csc: '',
        cardholder: '',
        country: '',
        postCode: '',
        city: '',
        address: '',
        useDeliveryAddress: false,
      })
      const newformError = {
        ...formError,
        creditCard: '',
        expDate: '',
        csc: '',
        cardholder: '',
        billingAddressCountry: '',
        billingAddressPostCode: '',
        billingAddressCity: '',
        billingAddressAddress: '',
      }
      setFormError(newformError)
      return
    }
  }, [payMethod])

  useEffect(() => {
    if (cardSelect) {
      const part1 = card[cardSelect].card_number.substring(0, 4)
      const part2 = card[cardSelect].card_number.substring(4, 8)
      const part3 = card[cardSelect].card_number.substring(8, 12)
      const part4 = card[cardSelect].card_number.substring(12, 16)
      const expDate = card[cardSelect].exp_date
      setPayInfo({
        ...payInfo,
        creditNum1: part1,
        creditNum2: part2,
        creditNum3: part3,
        creditNum4: part4,
        expDate: expDate,
      })
    }
  }, [cardSelect])

  useEffect(() => {
    const newCoupons = coupons.filter((v) => v.limit_value <= cartTotal)
    const template = newCoupons.map((v, i) => {
      return (
        <option key={i} value={v.coupon_id}>
          {v.name} -{' '}
          {v.discount_value >= 100
            ? `折價 ${v.discount_value}`
            : `${v.discount_value} %OFF`}
        </option>
      )
    })
    setCouponTemplate(template)
  }, [cartTotal, coupons])

  if (loading) {
    return (
      <>
        <div className={styles.loading}>
          <Loading />
        </div>
      </>
    )
  }

  return (
    <>
      {payLoading ? (
        loader
      ) : (
        <div className={`${styles['payment-bl']} row`}>
          <div className={`${styles['payment-section-bo']} col-12 col-md-6`}>
            <div className={`${styles['paypayment-title-bo']} h5 my-4`}>
              配送方式
            </div>
            <div className={`${styles['payment-delivery-box-bo']}  mb-3`}>
              <input
                type="radio"
                id="homeDelivery"
                defaultValue={'宅配'}
                name="delivery"
                checked={delivery === '宅配'}
                onChange={() => {
                  setDelivery('宅配')
                }}
              />
              <label
                htmlFor="homeDelivery"
                className={`${styles['payment-delivery-radio-bo']} ${styles['payment-radio-bo']} ${styles['topBorder']}  p`}
              >
                <div className={`${styles.circle} me-2`} />
                宅配
              </label>
              <input
                type="radio"
                id="711"
                defaultValue={'7-11店到店'}
                className={`${styles.seven}`}
                name="delivery"
                checked={delivery === '7-11店到店'}
                onChange={(e) => {
                  setDelivery('7-11店到店')
                }}
              />
              <label
                htmlFor="711"
                className={`${styles['payment-delivery-radio-bo']} ${styles['payment-radio-bo']}  p`}
              >
                <div className={`${styles.circle} me-2`} />
                7-11店到店
              </label>
              <div className={`p ${styles['sevenBox-bl']}`}>
                <button
                  className={`btn btn-primary text-light my-3 p`}
                  onClick={() => {
                    localStorage.setItem('noReload', '1')
                    openWindow()
                  }}
                >
                  選擇門市
                </button>
                <br />
                門市名稱:{' '}
                <input
                  type="text"
                  className="form-control p"
                  value={store711.storename}
                  disabled
                />
                <br />
                門市地址:{' '}
                <input
                  type="text"
                  className="form-control p mb-3"
                  value={store711.storeaddress}
                  disabled
                />
              </div>
              <input
                type="radio"
                id="pickup"
                defaultValue={'自取'}
                name="delivery"
                checked={delivery === '自取'}
                onChange={(e) => {
                  setDelivery('自取')
                }}
              />
              <label
                htmlFor="pickup"
                className={`${styles['payment-delivery-radio-bo']} ${styles['payment-radio-bo']} ${styles['bottomBorder']}  p`}
              >
                <div className={`${styles.circle} me-2`} />
                自取
              </label>
            </div>
            <div className={`${styles['payment-send-form-bo']} mb-3`}>
              <div className={`${styles['payment-title-bo']} h5 mb-4`}>
                寄送
              </div>
              <div
                className={`${styles['input-select-bo']} ${styles['form-floating-bl']}  form-floating  mb-3`}
              >
                <select
                  className={`${styles['form-select-bl']} form-select`}
                  id="country"
                  aria-label="Floating label select example"
                  name="country"
                  value={sendForm.country}
                  onChange={(e) => {
                    setSendForm({ ...sendForm, country: e.target.value })
                  }}
                  onBlur={(e) => {
                    handleBlur(e)
                  }}
                  disabled={delivery === '自取' || delivery === '7-11店到店'}
                >
                  <option value="">請選擇</option>
                  <option value={'台灣'}>台灣</option>
                </select>
                <label htmlFor="countrySelect">國家 / 地區</label>
                <div className={`${styles['errorBox']}`}>
                  {formError.country}
                </div>
              </div>
              <div className="row">
                <div
                  className={`${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating mb-3 col-6 pe-3`}
                >
                  <input
                    type="text"
                    className={`${styles['form-control-bl']} form-control`}
                    id="firstname"
                    placeholder="firstname"
                    name="firstname"
                    value={sendForm.firstname}
                    onChange={(e) => {
                      setSendForm({ ...sendForm, firstname: e.target.value })
                    }}
                    onBlur={(e) => {
                      handleBlur(e)
                    }}
                    disabled={delivery === '自取' || delivery === '7-11店到店'}
                  />
                  <label htmlFor="Firstname">姓</label>
                  <div className={`${styles['errorBox']}`}>
                    {formError.firstname}
                  </div>
                </div>
                <div
                  className={`${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating mb-3 col-6`}
                >
                  <input
                    type="text"
                    className={`${styles['form-control-bl']} form-control`}
                    id="lastname"
                    placeholder="Lastname"
                    name="lastname"
                    value={sendForm.lastname}
                    onChange={(e) => {
                      setSendForm({ ...sendForm, lastname: e.target.value })
                    }}
                    onBlur={(e) => {
                      handleBlur(e)
                    }}
                    disabled={delivery === '自取' || delivery === '7-11店到店'}
                  />
                  <label htmlFor="lastname">名</label>
                  <div className={`${styles['errorBox']}`}>
                    {formError.lastname}
                  </div>
                </div>
                <div
                  className={`${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating mb-3 pe-3 col-6`}
                >
                  <input
                    type="text"
                    className={`${styles['form-control-bl']} form-control`}
                    id="postCode"
                    placeholder="post code"
                    name="postCode"
                    value={sendForm.postCode}
                    onChange={(e) => {
                      setSendForm({
                        ...sendForm,
                        postCode: e.target.value,
                      })
                    }}
                    onBlur={(e) => {
                      handleBlur(e)
                    }}
                    disabled={delivery === '自取' || delivery === '7-11店到店'}
                  />
                  <label htmlFor="postCode">郵遞區號</label>
                  <div className={`${styles['errorBox']}`}>
                    {formError.postCode}
                  </div>
                </div>
                <div
                  className={`${styles['city-select-bo']} ${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating  mb-3 col-6`}
                >
                  <select
                    className={`${styles['form-select-bl']} form-select`}
                    id="city"
                    aria-label="Floating label select example"
                    name="city"
                    value={sendForm.city}
                    onChange={(e) => {
                      setSendForm({ ...sendForm, city: e.target.value })
                    }}
                    onBlur={(e) => {
                      handleBlur(e)
                    }}
                    disabled={delivery === '自取' || delivery === '7-11店到店'}
                  >
                    <option value="">請選擇</option>
                    {citySelect.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      )
                    })}
                  </select>
                  <label htmlFor="citySelect">縣市</label>
                  <div className={`${styles['errorBox']}`}>
                    {formError.city}
                  </div>
                </div>
              </div>
              <div
                className={`${styles['form-floating-bl']} form-floating mb-3`}
              >
                <input
                  type="text"
                  className={`${styles['form-control-bl']} form-control`}
                  id="address"
                  placeholder="Address"
                  name="address"
                  value={sendForm.address}
                  onChange={(e) => {
                    setSendForm({ ...sendForm, address: e.target.value })
                  }}
                  onBlur={(e) => {
                    handleBlur(e)
                  }}
                  disabled={delivery === '自取' || delivery === '7-11店到店'}
                />
                <label htmlFor="address">地址</label>
                <div className={`${styles['errorBox']}`}>
                  {formError.address}
                </div>
              </div>
            </div>
            <div className={`${styles['payment-pay-box-bo']} mb-3`}>
              <div className={`${styles['payment-title-bo']} h5 mb-4`}>
                交易方式
                <p>所有交易都是安全且加密的。</p>
              </div>
              <div className={`${styles['payment-pay-form-bo']}`}>
                <input
                  type="radio"
                  id="credit"
                  value={'credit'}
                  name="pay-method"
                  checked={payMethod === 'credit'}
                  className={`${styles['credit']}`}
                  onChange={(e) => {
                    setPayMethod(e.target.value)
                  }}
                />
                <label
                  htmlFor="credit"
                  className={` ${styles['payment-pay-radio-bo']} ${styles['payment-radio-bo']} ${styles['topBorder']} p`}
                >
                  <div className={`${styles.circle} me-2`} />
                  信用卡
                </label>
                <div className={`${styles['payment-card-form-bo']} px-3`}>
                  <div className="row my-3">
                    <p className="mb-3">卡號</p>
                    <div className="col-3 col-sm-2">
                      <input
                        type="text"
                        className={`${styles['cdNum']} ${styles['form-control-bl']} form-control`}
                        name="creditNum1"
                        maxLength={4}
                        value={payInfo.creditNum1}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            creditNum1: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      />
                    </div>
                    <div className="col-3 col-sm-2">
                      <input
                        type="text"
                        className={`${styles['cdNum']} ${styles['form-control-bl']} form-control`}
                        name="creditNum2"
                        maxLength={4}
                        value={payInfo.creditNum2}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            creditNum2: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      />
                    </div>
                    <div className="col-3 col-sm-2">
                      <input
                        type="text"
                        className={`${styles['cdNum']} ${styles['form-control-bl']} form-control`}
                        name="creditNum3"
                        maxLength={4}
                        value={payInfo.creditNum3}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            creditNum3: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      />
                    </div>
                    <div className="col-3 col-sm-2">
                      <input
                        type="text"
                        className={`${styles['cdNum']} ${styles['form-control-bl']} form-control`}
                        name="creditNum4"
                        maxLength={4}
                        value={payInfo.creditNum4}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            creditNum4: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      />
                    </div>
                    <div
                      className={`${styles['city-select-bo']}  mb-3 mt-5 mt-sm-0 col-4`}
                    >
                      <select
                        className={`${styles['form-select-bl']} form-select`}
                        id="cardSelect"
                        name="cardSelect"
                        value={cardSelect}
                        onChange={(e) => {
                          setCardSelect(e.target.value)
                        }}
                      >
                        <option value="">快速選卡</option>
                        {card.map((v, i) => {
                          return (
                            <option key={i} value={i}>
                              {v.card_name} {v.card_number.substring(12, 16)}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className={`${styles['errorBox']}`}>
                      {formError.creditCard}
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className={`${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating mb-3 col-6 pe-3`}
                    >
                      <input
                        type="text"
                        className={`${styles['form-control-bl']} form-control`}
                        id="expDate"
                        placeholder="expDate"
                        name="expDate"
                        maxLength={5}
                        value={payInfo.expDate}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            expDate: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      />
                      <label htmlFor="expDate">有效期(mm/yy)</label>
                      <div className={`${styles['errorBox']}`}>
                        {formError.expDate}
                      </div>
                    </div>
                    <div
                      className={`${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating mb-3 col-6`}
                    >
                      <input
                        type="text"
                        className={`${styles['form-control-bl']} form-control`}
                        id="csc"
                        placeholder="csc"
                        name="csc"
                        maxLength={3}
                        value={payInfo.csc}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            csc: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      />
                      <label htmlFor="csc">安全碼</label>
                      <div className={`${styles['errorBox']}`}>
                        {formError.csc}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles['form-floating-bl']} form-floating mb-3`}
                  >
                    <input
                      type="text"
                      className={`${styles['form-control-bl']} form-control`}
                      id="cardholder"
                      placeholder="cardholder"
                      name="cardholder"
                      value={payInfo.cardholder}
                      onChange={(e) => {
                        setPayInfo({
                          ...payInfo,
                          cardholder: e.target.value,
                        })
                      }}
                      onBlur={(e) => {
                        handleBlur(e)
                      }}
                    />
                    <label htmlFor="cardholder">持卡人</label>
                    <div className={`${styles['errorBox']}`}>
                      {formError.cardholder}
                    </div>
                  </div>
                  <input
                    className={`${styles['checkBillingAddress']} `}
                    type="checkbox"
                    id="checkBillingAddress"
                    name="Billing Address"
                    checked={payInfo.useDeliveryAddress}
                    onChange={() => {
                      setPayInfo({
                        ...payInfo,
                        useDeliveryAddress: !payInfo.useDeliveryAddress,
                      })
                      console.log(payInfo.useDeliveryAddress)
                    }}
                  />
                  <label
                    className="form-check-label p"
                    htmlFor="checkBillingAddress"
                  >
                    <div className={`${styles.circle} me-2`} />
                    使用送貨地址作為帳單地址
                  </label>
                  <div className={`${styles['billing-address-form-bo']} mb-3`}>
                    <div className={`${styles['payment-title-bo']} p mb-3`}>
                      寄送
                    </div>
                    <div
                      className={`${styles['form-floating-bl']} ${styles['input-select-bo']} form-floating  mb-3`}
                    >
                      <select
                        className={`${styles['form-select-bl']} form-select`}
                        id="billingAddressCountry"
                        aria-label="Floating label select example"
                        name="billingAddressCountry"
                        value={payInfo.country}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            country: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      >
                        <option value="">請選擇</option>
                        <option value={'台灣'}>台灣</option>
                      </select>
                      <label htmlFor="billingAddressCountry">國家 / 地區</label>
                      <div className={`${styles['errorBox']}`}>
                        {formError.billingAddressCountry}
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className={`${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating mb-3 col-6 pe-3`}
                      >
                        <input
                          type="text"
                          className={`${styles['form-control-bl']} form-control`}
                          id="billingAddressPostCode"
                          placeholder="post code"
                          name="billingAddressPostCode"
                          value={payInfo.postCode}
                          onChange={(e) => {
                            setPayInfo({
                              ...payInfo,
                              postCode: e.target.value,
                            })
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <label htmlFor="billingAddressPostCode">郵遞區號</label>
                        <div className={`${styles['errorBox']}`}>
                          {formError.billingAddressPostCode}
                        </div>
                      </div>
                      <div
                        className={`${styles['city-select-bo']} ${styles['form-floating-bl']} ${styles['col-6-bl']} form-floating  mb-3 col-6`}
                      >
                        <select
                          className={`${styles['form-select-bl']} form-select`}
                          id="billingAddressCity"
                          aria-label="Floating label select example"
                          name="billingAddressCity"
                          value={payInfo.city}
                          onChange={(e) => {
                            setPayInfo({
                              ...payInfo,
                              city: e.target.value,
                            })
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        >
                          <option value="">請選擇</option>
                          {citySelect.map((v, i) => {
                            return (
                              <option key={i} value={v}>
                                {v}
                              </option>
                            )
                          })}
                        </select>
                        <label htmlFor="billingAddressCity">縣市</label>
                        <div className={`${styles['errorBox']}`}>
                          {formError.billingAddressCity}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles['form-floating-bl']} form-floating mb-3`}
                    >
                      <input
                        type="text"
                        className={`${styles['form-control-bl']} form-control`}
                        id="billingAddressAddress"
                        placeholder="Address"
                        name="billingAddressAddress"
                        value={payInfo.address}
                        onChange={(e) => {
                          setPayInfo({
                            ...payInfo,
                            address: e.target.value,
                          })
                        }}
                        onBlur={(e) => {
                          handleBlur(e)
                        }}
                      />
                      <label htmlFor="billingAddressAddress">地址</label>
                      <div className={`${styles['errorBox']}`}>
                        {formError.billingAddressAddress}
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  id="ECPay"
                  value={'ECPay'}
                  name="pay-method"
                  checked={payMethod === 'ECPay'}
                  onChange={(e) => {
                    setPayMethod(e.target.value)
                  }}
                />
                <label
                  htmlFor="ECPay"
                  className={`${styles['payment-pay-radio-bo']} ${styles['payment-radio-bo']} p`}
                >
                  <div className={`${styles.circle} me-2`} />
                  <div className={`${styles.logoBox}`}>
                    <Image
                      src={`../../ECPay/logo300x180.png`}
                      width={200}
                      height={200}
                      alt=""
                      className={`${styles.img}`}
                    />
                  </div>
                </label>
                <input
                  type="radio"
                  id="line"
                  value={'Linepay'}
                  name="pay-method"
                  checked={payMethod === 'Linepay'}
                  onChange={(e) => {
                    setPayMethod(e.target.value)
                  }}
                />
                <label
                  htmlFor="line"
                  className={`${styles['payment-pay-radio-bo']} ${styles['bottomBorder']} ${styles['payment-radio-bo']} mb-3 p`}
                >
                  <div className={`${styles.circle} me-2`} />
                  <div className={`${styles.logoBox}`}>
                    <Image
                      src={`../../line-pay/LINE-Pay(h)_W238_n.png`}
                      width={200}
                      height={200}
                      alt=""
                      className={`${styles.img}`}
                    />
                  </div>
                </label>
              </div>
            </div>
            <div className={`${styles['payment-coupon-box-bo']} mb-3`}>
              <div className={`${styles['payment-title-bo']} h5 mb-4`}>
                優惠券
              </div>
              <div
                className={`${styles['input-select-bo']} ${styles['form-floating-bl']} form-floating  mb-3`}
              >
                <select
                  className={`${styles['form-select-bl']} form-select`}
                  id="couponSelect"
                  aria-label="Floating label select example"
                  name="couponSelect"
                  value={couponSelect}
                  onChange={(e) => {
                    setCouponSelect(e.target.value)
                  }}
                  onBlur={(e) => {
                    handleBlur(e)
                  }}
                >
                  <option value={''}>請選擇</option>
                  <option value={0}>不使用優惠券</option>
                  {couponTemplate}
                </select>
                <label htmlFor="couponSelect">選擇優惠券</label>
                <div className={`${styles['errorBox']}`}>
                  {formError.couponSelect}
                </div>
              </div>
            </div>
            <div className={`${styles['remark-box-bl']} mb-4`}>
              <h6>訂單備註</h6>
              <textarea
                className={`${styles['no-resize']} form-control mt-3`}
                rows={3}
                id=""
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value)
                }}
              />
            </div>
            <div className={`${styles['cart-text-box-bo']} d-block d-md-none`}>
              <div
                className={`${styles['subtotal-price-box-bo']} d-flex justify-content-between align-items-center my-3`}
              >
                <p>小計</p>
                <p>NT$ {cartTotal}</p>
              </div>
              <div
                className={`${styles['delivery-price-box-bo']} d-flex justify-content-between align-items-center mb-3`}
              >
                <p>運費</p>
                <p>NT$ {deliveryPrice}</p>
              </div>
              <div
                className={`${styles['total-price-box-bo']} d-flex justify-content-between align-items-center mb-3`}
              >
                <h6>總計</h6>
                <h6>NT$ {cartTotal + deliveryPrice}</h6>
              </div>
              <div
                className={`${styles['discount-price-box-bo']}  d-flex justify-content-between align-items-center mb-3`}
              >
                <h6>折價後</h6>
                <h6>NT$ {total}</h6>
              </div>
            </div>
            <button
              className={`${styles['payment-button-bo']}  h5 d-flex justify-content-center align-items-center mb-5`}
              onClick={(e) => {
                handleToTop()
                handleSubmit(e)
              }}
            >
              現在付款
            </button>
            <Toaster position="bottom-center" reverseOrder={false} />
          </div>
          <div className={`${styles['cart-section-bo']}  col-12 col-md-6`}>
            <h5 className={`${styles['cart-title-bo']}  my-4`}>
              訂單商品（{cart.length} 件）
            </h5>
            <div
              className={`${styles['cart-bo']}  d-flex flex-column justify-content-between`}
            >
              <input
                type="checkbox"
                name="checkCart"
                id="checkCart"
                className="d-none"
              />
              <label
                htmlFor="checkCart"
                className={`${styles['cart-hidden-bo']}  d-inline d-md-none p `}
              >
                顯示商品
                <i className="fa-solid fa-chevron-down p" />
              </label>
              <div className={`${styles['cart-body-bo']} mb-5`}>
                {cart.map((v) => {
                  return (
                    <div
                      key={v.id}
                      className={`${styles['cart-product-bo']} d-flex mb-5`}
                    >
                      <div className={`${styles['cart-product-img-bo']} me-4`}>
                        <Image
                          src={`../../images/${v.object_type}/${v.img}`}
                          width={200}
                          height={200}
                          alt=""
                        />
                      </div>
                      <div
                        className={`${styles['cart-product-text-box-bo']} flex-grow-1 d-flex flex-column justify-content-between`}
                      >
                        <div className={`${styles['cart-product-text-bo']}`}>
                          <div
                            className={`${styles['cart-product-title-bo']} `}
                          >
                            <h6>{v.item_name}</h6>
                          </div>
                        </div>
                        <div
                          className={`${styles['cart-product-text-bo']} d-flex justify-content-between`}
                        >
                          <div
                            className={`${styles['cart-product-number-bo']} d-flex justify-content-between align-items-center`}
                          >
                            <h6 className={`${styles['quantity']}`}>
                              x <span>{v.quantity}</span>
                            </h6>
                          </div>
                          <div className={`${styles['product-price-bo']}`}>
                            <h6>NT$ {v.price}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className={`${styles['cart-text-box-bo']}`}>
                <div
                  className={`${styles['subtotal-price-box-bo']} d-flex justify-content-between align-items-center mb-3`}
                >
                  <p>小計</p>
                  <p>NT$ {cartTotal}</p>
                </div>
                <div
                  className={`${styles['delivery-price-box-bo']} d-flex justify-content-between align-items-center mb-3`}
                >
                  <p>運費</p>
                  <p>NT$ {deliveryPrice}</p>
                </div>
                <div
                  className={`${styles['total-price-box-bo']} d-flex justify-content-between align-items-center mb-3`}
                >
                  <h6>總計</h6>
                  <h6>NT$ {cartTotal + deliveryPrice}</h6>
                </div>
                <div
                  className={`${
                    styles['discount-price-box-bo']
                  } d-flex justify-content-between align-items-center mb-3 ${
                    couponSelect > 0 ? '' : 'd-none'
                  }`}
                >
                  <h6>折價後</h6>
                  <h6>NT$ {total}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
