const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function getToken() {
  return localStorage.getItem('tri_token')
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || 'Erro ao comunicar com o servidor')
  }
  return data
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getSymptoms: () => request('/triage/symptoms'),
  runTriage: (payload) => request('/triage', { method: 'POST', body: payload, auth: true }),
  getHistory: () => request('/history', { auth: true }),
  changePassword: (payload) => request('/user/password', { method: 'PUT', body: payload, auth: true }),
}

export function saveSession(token, user) {
  localStorage.setItem('tri_token', token)
  localStorage.setItem('tri_user', JSON.stringify(user))
  window.dispatchEvent(new Event('tri-session-changed'))
}

export function getSession() {
  const token = getToken()
  const userRaw = localStorage.getItem('tri_user')
  if (!token || !userRaw) return null
  return { token, user: JSON.parse(userRaw) }
}

export function clearSession() {
  localStorage.removeItem('tri_token')
  localStorage.removeItem('tri_user')
  window.dispatchEvent(new Event('tri-session-changed'))
}
