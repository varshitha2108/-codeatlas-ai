import { Router } from 'express'
import { redirectToGithub, githubCallback, redirectToGoogle, googleCallback } from '../controllers/auth.controller'

export const authRouter = Router()

authRouter.get('/github', redirectToGithub)
authRouter.get('/github/callback', githubCallback)
authRouter.get('/google', redirectToGoogle)
authRouter.get('/google/callback', googleCallback)