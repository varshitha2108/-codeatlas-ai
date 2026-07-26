const BASE_URL = 'http://localhost:3001/v1'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error?.message || 'Something went wrong')
  }

  return json.data
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error?.message || 'Something went wrong')
  }

  return json.data
}

export async function apiPostFormData<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.error?.message || 'Something went wrong')
  }

  return json.data
}