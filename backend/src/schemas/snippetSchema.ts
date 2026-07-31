import { z } from 'zod'

export const snippetSchema = z.object({
  code: z.string().min(1, 'Code cannot be empty').max(200000, 'Snippet too large'),
  language: z.enum([
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'c',
    'go',
    'ruby',
    'csharp',
    'php',
  ]),
  fileName: z.string().optional(),
})

export type SnippetInput = z.infer<typeof snippetSchema>