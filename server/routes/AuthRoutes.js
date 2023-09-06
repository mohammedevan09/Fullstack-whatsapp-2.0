import { Router } from 'express'
import {
  checkUser,
  generateToken,
  getAllUsers,
  onBoardUser,
} from '../controllers/AuthController.js'

const router = Router()

router.post('/check-user', checkUser)
router.post('/onboard-user', onBoardUser)
router.get('/getAllUsers', getAllUsers)
router.get('/generate-token/:userId', generateToken)

export default router
