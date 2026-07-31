import { Router } from 'express'
import { redirectToGithub, githubCallback } from '../controllers/auth.controller'

export const authRouter = Router()

authRouter.get('/github', redirectToGithub)
authRouter.get('/github/callback', githubCallback)