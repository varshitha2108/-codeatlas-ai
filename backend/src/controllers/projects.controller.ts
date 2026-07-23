import type { Request, Response } from 'express'
import { createSnippetProject } from '../services/ingestion/snippetIngestor'

export async function createSnippet(req: Request, res: Response) {
  const { projectId } = await createSnippetProject(req.body, req.sessionId)
  res.status(201).json({
    data: { projectId, status: 'ready', sourceType: 'snippet' },
  })
}