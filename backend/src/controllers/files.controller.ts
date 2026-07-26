import type { Request, Response } from 'express'
import { getFileTree } from '../services/files/fileTreeService'
import { getFileContent } from '../services/files/fileReaderService'

export async function getTree(req: Request, res: Response) {
  const projectId = req.params.projectId as string
  const tree = await getFileTree(projectId)
  res.json({ data: { projectId, tree } })
}

export async function getContent(req: Request, res: Response) {
  const projectId = req.params.projectId as string
  const path = req.query.path as string
  const file = await getFileContent(projectId, path)
  res.json({ data: file })
}