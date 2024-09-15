import React, { useState, useEffect, useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '@/context/AuthContext'
import AdminCenterLayout from '@/components/layout/admin-layout'
import styles from '@/styles/bearlong/chat.module.scss'
import Image from 'next/image'
import { FaCircle } from 'react-icons/fa6'

export default function Chat() {
  const chatBoxRef = useRef(null)
  const [ws, setWs] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [userInfo, setUserInfo] = useState([])
  const [focus, setFocus] = useState(0)
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  const handleNewMessage = (fromID, userInfo, newMessage) => {
    setMessages((prevMessages) => {
      const existingUser = prevMessages.find((user) => user.userID === fromID)

      if (existingUser) {
        // 如果已有此 userID 的訊息，更新該 user's 訊息
        return prevMessages.map((user) =>
          user.userID === fromID
            ? {
                ...user,
                messages: [...user.messages, newMessage],
                isNewMessage: true,
              }
            : user
        )
      } else {
        // 如果沒有此 userID 的訊息，新增一個新的 entry
        return [
          ...prevMessages,
          {
            userID: fromID,
            userInfo,
            messages: [newMessage],
            isNewMessage: true,
          },
        ]
      }
    })
  }
  const handleResponse = (targetUserID, newMessage) => {
    const adminMessage = `admin ${newMessage}`
    setMessages((prevMessages) => {
      const existingUser = prevMessages.find(
        (user) => user.userID === targetUserID
      )

      if (existingUser) {
        // 如果已有此 userID 的訊息，更新該 user's 訊息
        return prevMessages.map((user) =>
          user.userID === targetUserID
            ? {
                ...user,
                messages: [...user.messages, adminMessage],
              }
            : user
        )
      }
    })
  }

  const handleRemoveMessages = (dsID) => {
    setMessages((prevMessages) => {
      return prevMessages.filter((user) => user.userID !== dsID)
    })
  }

  useEffect(() => {
    if (router.isReady && !loading) {
      if (user) {
        if (user && user.id === 62) {
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
              if (result.userInfo) {
                setUserInfo(result.userInfo)
              }
            }
            if (result.type === 'message') {
              if (result.userInfo) {
                setUserInfo([...userInfo, result.userInfo])
              }

              if (result.fromID === 62) {
                handleResponse(result.targetUserID, result.message)
                return
              }
              handleNewMessage(result.fromID, result.userInfo, result.message)
              console.log(result.userInfo)
            }

            if (result.type === 'disconnected') {
              if (result.userInfo) {
                setUserInfo(result.userInfo)
              }
              handleRemoveMessages(result.dsID)
            }
          }

          socket.onclose = () => {
            console.log('WebSocket 連線已關閉')
          }

          return () => {
            socket.close()
          }
        } else {
          alert('請由正常管道進入')
          router.push('/home')
        }
      } else {
        router.push('/home')
      }
    }
  }, [router.isReady, user])
  //   useEffect(() => {
  //     // 建立 WebSocket 连接
  //   }, [])

  const sendMessage = () => {
    let params = {
      type: 'message',
      message: message,
      userID: user.id,
      targetUserID: focus,
    }
    if (ws) {
      ws.send(JSON.stringify(params))
      setMessage('')
    }
  }

  return (
    <>
      <div className={styles['main']}>
        <div className={styles['menber-info-box-bo']}>
          <div className={`${styles['chatArea-bl']} p`}>
            <div ref={chatBoxRef} className={`${styles['chatBox']} mb-3`}>
              {messages
                .filter((user) => user.userID === focus)
                .map((user) => (
                  <div key={user.userID}>
                    {user.messages.map((message, index) => {
                      const [text, time] = message.split('|')
                      const isAdmin = text.startsWith('admin')
                      const displayMessage = isAdmin
                        ? text.replace('admin ', '')
                        : text
                      return isAdmin ? (
                        <div
                          key={index}
                          className={`${styles['messageBox-bl']} d-flex align-items-center justify-content-end mb-3`}
                        >
                          <div
                            className={`align-self-end ${styles['time']} me-2`}
                          >
                            {time}
                          </div>
                          <div className={`${styles['admin-bl']} px-4 py-2`}>
                            <p>{displayMessage}</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className={`${styles['messageBox-bl']} d-flex align-items-center mb-3`}
                        >
                          <div className={`${styles['userImg']}  me-2`}>
                            <Image
                              src={`/images/boyu/users/${
                                user.userInfo.user_img
                                  ? user.userInfo.user_img
                                  : ''
                              }.jpg`}
                              alt="user"
                              width={40}
                              height={40}
                              className="rounded-circle"
                            />
                          </div>

                          <div
                            className={`${styles['client-bl']} px-4 py-2 me-2`}
                          >
                            <p>{displayMessage}</p>
                          </div>
                          <div className={`align-self-end ${styles['time']}`}>
                            {time}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
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
          </div>
          <div className={`${styles['memberInfo-bl']}`}>
            <h5 className="text-center mb-3">客服列表</h5>
            <div className={styles['infoBox-bl']}>
              {messages.map((v, i) => {
                return (
                  <button
                    key={v.userID}
                    className={`${styles['infoCard-bl']} ${
                      focus === v.userID ? styles['active'] : ''
                    } mb-3`}
                    onClick={() => {
                      setFocus(v.userID)
                      setMessages(
                        messages.map((user) =>
                          user.userID === v.userID
                            ? { ...user, isNewMessage: false }
                            : user
                        )
                      )
                    }}
                  >
                    <div className="d-flex align-items-center me-3">
                      <div className={`${styles['userImg']}  me-3`}>
                        <Image
                          src={`/images/boyu/users/${
                            v.userInfo.user_img ? v.userInfo.user_img : ''
                          }.jpg`}
                          alt="user"
                          width={40}
                          height={40}
                          className="rounded-circle "
                        />
                      </div>

                      <h6>{v.userInfo.username}</h6>
                    </div>
                    <p className={`${styles['message']} text-start p`}>
                      {v.messages[v.messages.length - 1]
                        .split('|')[0]
                        .replace('admin ', '')}
                    </p>
                    <FaCircle
                      className={`${styles['newMessage-bl']} ${
                        v.isNewMessage ? '' : 'd-none'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Chat.getLayout = function (page) {
  return <AdminCenterLayout>{page}</AdminCenterLayout>
}
