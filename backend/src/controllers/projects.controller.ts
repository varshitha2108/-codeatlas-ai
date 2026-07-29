import type { Request, Response } from 'express'
import { createSnippetProject } from '../services/ingestion/snippetIngestor'
import { getProjectStatus } from '../services/projects/projectService'
import { runZipIngestion } from '../services/ingestion/ingestionOrchestrator'
import { parseGithubUrl, fetchRepoMetadata, fetchRepoZip } from '../services/ingestion/githubImporter'
import { pool } from '../config/db'
import { nanoid } from 'nanoid'
import { AppError } from '../errors/AppError'
import { enqueue } from '../jobs/queue'

export async function createSnippet(req: Request, res: Response) {
  const { projectId } = await createSnippetProject(req.body, req.sessionId)
  res.status(201).json({
    data: { projectId, status: 'ready', sourceType: 'snippet' },
  })
}

export async function uploadZip(req: Request, res: Response) {
  if (!req.file) {
    throw new AppError('NO_FILE_PROVIDED', 400, 'No ZIP file was provided')
  }

  const projectId = `proj_${nanoid(10)}`
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

  await pool.query(
    `INSERT INTO projects (id, session_id, source_type, status, stage, created_at, expires_at)
     VALUES ($1, $2, 'zip', 'processing', 'fetching', now(), $3)`,
    [projectId, req.sessionId, expiresAt]
  )

  enqueue(() => runZipIngestion(projectId, req.file!.buffer))

  res.status(202).json({
    data: { projectId, status: 'processing', sourceType: 'zip' },
  })
}

export async function importGithubRepo(req: Request, res: Response) {
  const { repoUrl, branch: requestedBranch } = req.body
  const { owner, repo } = parseGithubUrl(repoUrl)
  const metadata = await fetchRepoMetadata(owner, repo)
  const branch = requestedBranch || metadata.defaultBranch

  const projectId = `proj_${nanoid(10)}`
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

  await pool.query(
    `INSERT INTO projects (id, session_id, source_type, status, stage, repo_url, branch, created_at, expires_at)
     VALUES ($1, $2, 'github', 'processing', 'fetching', $3, $4, now(), $5)`,
    [projectId, req.sessionId, repoUrl, branch, expiresAt]
  )

  enqueue(async () => {
    const zipBuffer = await fetchRepoZip(owner, repo, branch)
    await runZipIngestion(projectId, zipBuffer)
  })

  res.status(202).json({
    data: { projectId, status: 'processing', sourceType: 'github', repoUrl, branch },
  })
}

export async function getStatus(req: Request, res: Response) {
  const projectId = req.params.projectId as string
  const status = await getProjectStatus(projectId)
  res.json({ data: status })
}