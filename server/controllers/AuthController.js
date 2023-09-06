import getPrismaInstance from '../utils/PrismaClient.js'
import { generateToken04 } from '../utils/TokenGenerator.js'
import dotenv from 'dotenv'
dotenv.config()

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.json({ msg: 'Email is required', status: false })
    }

    const prisma = getPrismaInstance()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.json({ msg: 'User not found', status: false })
    } else {
      return res.json({ msg: 'User found', status: true, data: user })
    }
  } catch (error) {
    next(error)
  }
}

export const onBoardUser = async (req, res, next) => {
  try {
    const { email, name, about, image: profilePicture } = req.body
    if (!email || !name || !profilePicture) {
      return res.send('Email, Name and Image are required')
    }
    const prisma = getPrismaInstance()
    const data = await prisma.user.create({
      data: { email, name, about, profilePicture },
    })
    return res.json({ msg: 'Success', status: true, data })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance()
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    })

    const usersGroupByInitialLetter = {}

    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase()
      if (!usersGroupByInitialLetter[initialLetter]) {
        usersGroupByInitialLetter[initialLetter] = []
      }
      usersGroupByInitialLetter[initialLetter].push(user)
    })
    return res.status(200).send({ users: usersGroupByInitialLetter })
  } catch (error) {
    next(error)
  }
}

export const generateToken = async (req, res, next) => {
  try {
    const appId = Number(process.env.ZEGO_APP_ID)
    const serverSecret = process.env.ZEGO_SERVER_SECRET
    const userId = req.params.userId
    const effectiveTime = 3600
    const payload = ''
    if (appId && serverSecret && userId) {
      const token = generateToken04(
        appId,
        userId,
        serverSecret,
        effectiveTime,
        payload
      )
      res.status(200).json({ token })
    } else {
      res.status(400).send('user id, app id, server secret is required!')
    }
  } catch (error) {
    next(error)
  }
}
