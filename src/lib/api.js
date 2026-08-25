export async function api(path, options = {}) {
  const token = localStorage.getItem('jobekaa_token')
  const headers = { ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const response = await fetch(`/api${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Something went wrong. Please try again.')
  return payload
}
