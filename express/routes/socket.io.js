import express from 'express'
const router = express.Router()
import { Server } from 'socket.io'
// socket.js

export default function setupSocket(server) {
  const io = new Server(server)
  io.on('connection', (socket) => {
    console.log('success connect!')
    socket.on('getMessage', (message) => {
      socket.emit('getMessage', message)
    })
  })
}
