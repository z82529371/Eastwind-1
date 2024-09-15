import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'
import styles from '@/styles/bearlong/customerService.module.scss'
import { BsChatDots } from 'react-icons/bs'
import { FaXmark } from 'react-icons/fa6'
import Image from 'next/image'
import { FaCommentDots } from 'react-icons/fa6'
export default function Chat() {
  const chatBoxRef = useRef(null)
  const [ws, setWs] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState([])
  const [checkChat, setCheckChat] = useState(false)
  const { user, loading } = useContext(AuthContext)
  const [showDiv, setShowDiv] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const viewHeight = window.innerHeight
      if (scrollPosition > 1.5 * viewHeight) {
        setShowDiv(true)
      } else {
        setShowDiv(false)
      }
    }

    const handleRouteChange = (url) => {
      if (url === '/home') {
        setShowDiv(false)
        window.addEventListener('scroll', handleScroll)
      } else {
        setShowDiv(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // 初始化時檢查路徑
    if (router.pathname === '/home') {
      setShowDiv(false)

      window.addEventListener('scroll', handleScroll)
    }

    // 監聽路由變化
    router.events.on('routeChangeComplete', handleRouteChange)

    // 清理事件監聽器
    return () => {
      window.removeEventListener('scroll', handleScroll)
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.pathname])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (router.isReady && !loading) {
      if (user && user.id !== 62) {
        const socket = new WebSocket('ws://localhost:3005')
        setWs(socket)
        socket.onopen = (event) => {
          console.log('WebSocket 連線已建立')
          let params = {
            type: 'register',
            userID: user.id,
            username: user.username,
            user_img: user.user_img,
          }
          socket.send(JSON.stringify(params))
        }

        socket.onmessage = async (event) => {
          let result = JSON.parse(event.data)
          if (result.type === 'registered') {
            setStatus((prevMessages) => [...prevMessages, result.message])
          }
          if (result.type === 'message') {
            if (result.fromID === 62) {
              const newMessage = 'admin ' + result.message
              setMessages((prevMessages) => [...prevMessages, newMessage])
              return
            }
            setMessages((prevMessages) => [...prevMessages, result.message])
          }
          if (result.type === 'disconnected') {
            setStatus((prevMessages) => [...prevMessages, result.message])
          }
        }

        socket.onclose = () => {
          console.log('WebSocket 連線已關閉')
        }

        return () => {
          socket.close()
        }
      }
    }
  }, [router.isReady, user])

  const sendMessage = () => {
    let params = {
      type: 'message',
      userID: user.id,
      message: message,
    }
    if (ws) {
      ws.send(JSON.stringify(params))
      setMessage('')
    }
  }

  return user && user.id !== 62 ? (
    <>
      <input
        type="checkbox"
        name="checkChat"
        id="checkChat"
        className={styles.checkCaht}
        onChange={() => {
          setCheckChat(!checkChat)
        }}
        checked={checkChat}
      />
      <label
        htmlFor="checkChat"
        className={`${styles['checkChatLabel-bl']} ${
          checkChat ? 'd-none' : ''
        } ${showDiv ? '' : 'd-none'}`}
      >
        <FaCommentDots size={30} className={styles.msgIcon} />
      </label>
      <div className={`${styles['chatArea-bl']} p`}>
        {status[status.length - 1]}
        <div ref={chatBoxRef} className={`${styles['chatBox-bl']} mb-3`}>
          {messages.map((msg, index) => {
            const [text, time] = msg.split('|')
            const isAdmin = text.startsWith('admin')
            const displayMessage = isAdmin ? text.replace('admin ', '') : text
            return isAdmin ? (
              <div
                key={index}
                className={`${styles['messageBox-bl']} d-flex align-items-center mb-3`}
              >
                <Image
                  src={`/images/web/messageLogo.png`}
                  alt="user"
                  width={40}
                  height={40}
                  className="rounded-circle me-2 object-fit-cover"
                />
                <div className={`${styles['admin-bl']} px-4 py-2 me-2`}>
                  <p>{displayMessage}</p>
                </div>
                <div className={`align-self-end ${styles['time']}`}>{time}</div>
              </div>
            ) : (
              <div
                key={index}
                className={`${styles['messageBox-bl']} d-flex align-items-center justify-content-end mb-3`}
              >
                <div className={`align-self-end ${styles['time']} me-2`}>
                  {time}
                </div>
                <div className={`${styles['client-bl']} px-4 py-2`}>
                  <p>{displayMessage}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className={`${styles['chatInput-bl']} d-flex`}>
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>送出</button>
        </div>
        <FaXmark
          className={`${styles.xmark} h5`}
          onClick={() => {
            setCheckChat(!checkChat)
          }}
        />
      </div>
    </>
  ) : (
    <></>
  )
}
