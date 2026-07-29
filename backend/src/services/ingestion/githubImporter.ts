import { AppError } from '../../errors/AppError'

interface RepoMetadata {
  defaultBranch: string
}

export function parseGithubUrl(repoUrl: string): { owner: string; repo: string } {
  const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(\.git)?\/?$/)
  if (!match) {
    throw new AppError('INVALID_GITHUB_URL', 400, 'URL must be a valid GitHub repository URL')
  }
  return { owner: match[1], repo: match[2] }
}

export async function fetchRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)

  if (response.status === 404) {
    throw new AppError('REPO_NOT_FOUND', 404, 'Repository not found or is private')
  }
  if (!response.ok) {
    throw new AppError('GITHUB_UNAVAILABLE', 502, 'GitHub API is currently unavailable')
  }

  const data = await response.json()
  return { defaultBranch: data.default_branch }
}

export async function fetchRepoZip(owner: string, repo: string, branch: string): Promise<Buffer> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`)

  if (!response.ok) {
    throw new AppError('GITHUB_UNAVAILABLE', 502, 'Failed to download repository archive')
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}