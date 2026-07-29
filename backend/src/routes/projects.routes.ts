import { Router } from 'express'
import { createSnippet, uploadZip, getStatus, importGithubRepo } from '../controllers/projects.controller'
import { validateRequest } from '../middleware/validateRequest'
import { snippetSchema } from '../schemas/snippetSchema'
import { githubImportSchema } from '../schemas/githubImportSchema'
import { multipartUpload } from '../middleware/multipartUpload'

export const projectsRouter = Router()

projectsRouter.post('/snippet', validateRequest(snippetSchema), createSnippet)
projectsRouter.post('/upload', multipartUpload.single('file'), uploadZip)
projectsRouter.post('/github-import', validateRequest(githubImportSchema), importGithubRepo)
projectsRouter.get('/:projectId/status', getStatus)