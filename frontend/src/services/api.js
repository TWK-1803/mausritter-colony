import config from '@/config'

export async function request (path, { method = 'GET', body } = {}) {
  const response = await fetch(`${config.SERVER_API_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`[api] ${method} ${path} → ${response.status}: ${text}`)
  }
  return response.json()
}
