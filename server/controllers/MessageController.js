import getPrismaInstance from '../utils/PrismaClient.js'
import { renameSync } from 'fs'

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance()
    const { message, from, to } = req.body
    const getUser = onlineUsers.get(to)
    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message,
          sender: { connect: { id: from } },
          reciever: { connect: { id: to } },
          messageStatus: getUser ? 'delivered' : 'sent',
        },
        include: { sender: true, reciever: true },
      })
      return res.status(201).send({ message: newMessage })
    }
    return res.status(400).send('From, to and message is required.')
  } catch (error) {
    next(error)
  }
}

export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance()
    const { from, to } = req.params

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: from,
            recieverId: to,
          },
          {
            senderId: to,
            recieverId: from,
          },
        ],
      },
      orderBy: {
        id: 'asc',
      },
    })

    const unreadMessages = []

    messages.forEach((message, index) => {
      if (message.messageStatus !== 'read' && message.senderId === to) {
        messages[index].messageStatus = 'read'
        unreadMessages.push(message.id)
      }
    })

    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: 'read',
      },
    })

    res.status(200).json({ messages })
  } catch (error) {
    next(error)
  }
}

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now()
      let filename = 'uploads/images/' + date + req.file.originalname
      renameSync(req.file.path, filename)
      // console.log(req.file, filename)
      const prisma = getPrismaInstance()
      const { from, to } = req.query
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: filename,
            type: 'image',
            sender: { connect: { id: from } },
            reciever: { connect: { id: to } },
          },
        })
        return res.status(201).json({ message })
      }
      return res.status(400).send('From,to is required.')
    }
    return res.status(400).send('Image is required.')
  } catch (error) {
    next(error)
  }
}

export const getInitialContactswithMessages = async (req, res, next) => {
  try {
    const userId = req.params.from
    const prisma = getPrismaInstance()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: {
            reciever: true,
            sender: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        recieveMessages: {
          include: {
            reciever: true,
            sender: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    let messages = [...user.sentMessages, ...user.recieveMessages]
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const users = new Map()
    const messageStatusChange = []

    // console.log('msg', messages, 'msg')
    // console.log('users', users, 'users')
    // console.log('msgStatus', messageStatusChange, 'msgStatus')

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId
      const calculatedId = isSender ? msg.recieverId : msg.senderId

      if (msg.messageStatus === 'sent') {
        messageStatusChange.push(msg.id)
      }

      if (!users.get(calculatedId)) {
        const {
          id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        } = msg

        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        }

        if (isSender) {
          user = {
            ...user,
            ...msg.reciever,
            totalUnreadMessages: 0,
          }
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== 'read' ? 1 : 0,
          }
        }
        users.set(calculatedId, { ...user })
      } else if (msg.messageStatus !== 'read' && !isSender) {
        const user = users.get(calculatedId)
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        })
      }
    })

    if (messageStatusChange?.length) {
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: {
          messageStatus: 'delivered',
        },
      })
    }
    // console.log('AfterMsg', messages, 'AfterMsg')

    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    })
  } catch (error) {
    next(error)
  }
}
