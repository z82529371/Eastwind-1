/**
 * Module dependencies.
 */

import app from '../app.js'
import debugLib from 'debug'
import http from 'http'
const debug = debugLib('node-express-es6:server')
import { exit } from 'node:process'
import WebSocket, { WebSocketServer } from 'ws'
import moment from 'moment'

// 導入dotenv 使用 .env 檔案中的設定值 process.env
import 'dotenv/config.js'

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '6005')
app.set('port', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

const wss = new WebSocketServer({
  server,
})

const clients = {}
const userData = []

wss.on('connection', (connection) => {
  console.log('新的使用者連線')

  connection.on('message', (message) => {
    const parsedMsg = JSON.parse(message)

    // WebSocket.OPEN
    if (parsedMsg.type === 'register') {
      const { userID, username, user_img } = parsedMsg
      clients[userID] = connection // 儲存 WebSocket 連接對象
      connection.userID = userID
      if (userID) {
        const isUserIDExists = userData.some((user) => user.userID === userID)

        // 如果 userID 不存在，才進行 push 操作
        if (!isUserIDExists) {
          userData.push({ userID, username, user_img }) // 儲存用戶資料
        }
      }

      const isUserIDIncluded = userData.some((user) => user.userID === 62)
      console.log(isUserIDIncluded)
      if (userID === 62) {
        // 客服人員上線通知
        if (clients[62] && clients[62].readyState === WebSocket.OPEN) {
          clients[62].send(
            JSON.stringify({ type: 'registered', message: '客服人員已上線' })
          )
        }
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client !== connection) {
            client.send(
              JSON.stringify({ type: 'registered', message: '客服人員已上線' })
            )
          }
        })
      } else {
        // 通知當前客戶是否客服上線
        if (
          userID !== 62 &&
          clients[userID] &&
          clients[userID].readyState === WebSocket.OPEN
        ) {
          clients[userID].send(
            JSON.stringify({
              type: 'registered',
              message: isUserIDIncluded
                ? '客服人員目前已在線上'
                : '客服人員未上線',
            })
          )
        }
      }
    }

    if (parsedMsg.type === 'message') {
      const { userID, message } = parsedMsg
      const time = moment().format('HH:mm')
      const newMessage = message + '|' + time
      if (userID !== 62) {
        if (
          clients[62] &&
          clients[userID] &&
          clients[userID].readyState === WebSocket.OPEN &&
          clients[62].readyState === WebSocket.OPEN
        ) {
          const userInfo = userData.find((user) => user.userID === userID)
          clients[62].send(
            JSON.stringify({
              type: 'message',
              fromID: userID,
              userInfo,
              message: newMessage,
            })
          )
          clients[userID].send(
            JSON.stringify({
              type: 'message',
              fromID: userID,
              message: newMessage,
            })
          )
        } else {
          clients[userID].send(
            JSON.stringify({
              type: 'message',
              fromID: 62,
              message: '客服人員目前不在線上',
            })
          )
        }
      } else {
        const { targetUserID } = parsedMsg
        if (
          clients[62] &&
          clients[62].readyState === WebSocket.OPEN &&
          clients[targetUserID] &&
          clients[targetUserID].readyState === WebSocket.OPEN
        ) {
          const userInfo = userData.find((user) => user.userID === userID)
          clients[targetUserID].send(
            JSON.stringify({
              type: 'message',
              fromID: 62,
              targetUserID,
              message: newMessage,
            })
          )
          clients[62].send(
            JSON.stringify({
              type: 'message',
              fromID: 62,
              targetUserID,
              userInfo,
              message: newMessage,
            })
          )
        }
      }
    }
  })

  connection.on('close', () => {
    console.log('使用者已經斷線')
    let dsID = connection.userID
    console.log(dsID)
    if (dsID) {
      delete clients[dsID]
      userData.splice(
        0,
        userData.length,
        ...userData.filter((user) => user.userID !== dsID)
      )
      if (clients[62] && clients[62].readyState === WebSocket.OPEN) {
        clients[62].send(
          JSON.stringify({ type: 'disconnected', userInfo: userData, dsID })
        )
      }
      if (dsID === 62) {
        wss.clients.forEach((client) => {
          if (client !== clients[62] && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'disconnected',
                message: '客服人員目前不在線上',
              })
            )
          }
        })
      }

      dsID = null
    }
  })
})

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
