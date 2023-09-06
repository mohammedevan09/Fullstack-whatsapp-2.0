import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import cors from 'cors'

import AuthRoutes from './routes/AuthRoutes.js'
import MessageRoutes from './routes/MessageRoutes.js'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
  '/uploads/images',
  express.static(path.join(__dirname, 'uploads', 'images'))
)
// console.log(path.join(__dirname, 'uploads', 'images'))

app.use('/api/auth', AuthRoutes)
app.use('/api/messages', MessageRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN, // Adjust the origin to match your URL
    methods: ['GET', 'POST'],
  },
  port: PORT,
})

global.onlineUsers = new Map()
// console.log(onlineUsers)

io.on('connection', (socket) => {
  // console.log(`User Connected: ${socket.id}`)

  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
    // console.log(`User with ID: ${socket.id} joined room: ${userId}`)
    socket.broadcast.emit('online-users', {
      onlineUsers: Array.from(onlineUsers.keys()),
    })
  })

  socket.on('signout', (id) => {
    onlineUsers.delete(id)
    socket.broadcast.emit('online-users', {
      onlineUsers: Array.from(onlineUsers.keys()),
    })
  })

  socket.on('send-msg', (data) => {
    let sendUserSocket = onlineUsers.get(data.to)

    // console.log('data:', data)
    // console.log('onlineUsers:', onlineUsers)
    // console.log('sendUserSocket:', sendUserSocket)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', {
        // Corrected event name to 'msg-receive'
        to: data.to,
        from: data.from,
        message: data.message,
      })
    }
  })

  socket.on('outgoing-voice-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('incoming-voice-call', {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      })
    }
  })

  socket.on('outgoing-video-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('incoming-video-call', {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      })
    }
  })

  socket.on('reject-voice-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.from)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('voice-call-rejected')
    }
  })

  socket.on('reject-video-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.from)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('video-call-rejected')
    }
  })

  socket.on('accept-incoming-call', ({ id }) => {
    const sendUserSocket = onlineUsers.get(id)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('accept-call')
    }
  })

  socket.on('disconnect', () => {
    const userId = onlineUsers.get(socket.id)
    if (userId) {
      onlineUsers.delete(userId)
      console.log(`User with ID ${userId} disconnected`)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`)
})
