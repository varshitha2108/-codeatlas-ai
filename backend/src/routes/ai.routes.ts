import { Router } from 'express'
import { runAction } from '../controllers/ai.controller'

export const aiRouter = Router()

aiRouter.post('/actions', runAction)