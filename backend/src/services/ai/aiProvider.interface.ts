export interface AIProvider {
  streamCompletion(
    params: {
      systemPrompt: string
      userPrompt: string
      maxOutputTokens: number
      temperature: number
    },
    onToken: (token: string) => void
  ): Promise<{ text: string }>
}