import { Router } from 'express'
import { getTree, getContent } from '../controllers/files.controller'

export const filesRouter = Router({ mergeParams: true })

filesRouter.get('/', getTree)
filesRouter.get('/content', getContent)