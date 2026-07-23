import { Router } from 'express'
import { createSnippet } from '../controllers/projects.controller'
import { validateRequest } from '../middleware/validateRequest'
import { snippetSchema } from '../schemas/snippetSchema'

export const projectsRouter = Router()

projectsRouter.post('/snippet', validateRequest(snippetSchema), createSnippet)