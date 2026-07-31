import { Router } from 'express'
import { runAction, sendFollowup } from '../controllers/ai.controller'

export const aiRouter = Router()

aiRouter.post('/actions', runAction)
aiRouter.post('/actions/:cardId/followup', sendFollowup)