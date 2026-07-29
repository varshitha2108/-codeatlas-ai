import { GoogleGenAI } from '@google/genai'
import { env } from '../../config/env'
import type { AIProvider } from './aiProvider.interface'

const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

export const geminiProvider: AIProvider = {
  async streamCompletion(params, onToken) {
    const { systemPrompt, userPrompt, maxOutputTokens, temperature } = params

    const response = await client.models.generateContentStream({
      model: 'gemini-3.1-flash-lite',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens,
        temperature,
      },
    })

    let fullText = ''
    for await (const chunk of response) {
      const chunkText = chunk.text
      if (chunkText) {
        fullText += chunkText
        onToken(chunkText)
      }
    }

    return { text: fullText }
  },
}