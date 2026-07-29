import { z } from 'zod'

export const githubImportSchema = z.object({
  repoUrl: z.string().url('Must be a valid URL'),
  branch: z.string().optional(),
})