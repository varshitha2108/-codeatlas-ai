import { Router } from 'express'
import { createSnippet, uploadZip, getStatus } from '../controllers/projects.controller'
import { validateRequest } from '../middleware/validateRequest'
import { snippetSchema } from '../schemas/snippetSchema'
import { multipartUpload } from '../middleware/multipartUpload'

export const projectsRouter = Router()

projectsRouter.post('/snippet', validateRequest(snippetSchema), createSnippet)
projectsRouter.post('/upload', multipartUpload.single('file'), uploadZip)
projectsRouter.get('/:projectId/status', getStatus)