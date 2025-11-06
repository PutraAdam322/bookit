import { getAccessToken, clearAccessToken } from '@/auth'
import { queryClient } from '@/queryClient' 

//const API_BASE = import.meta.env.VITE_API_URL

async function handleResponse(res: Response) {
  const text = await res.text().catch(() => '')
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err: any = new Error(data?.message ?? `HTTP ${res.status}`)
    err.status = res.status
    err.body = data
    throw err
  }
  return data
}

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const token = getAccessToken()
  const headers = new Headers(init?.headers ?? {})
  headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const url = String(input).startsWith('http') ? input : `https://bookit-backend-d4l7.onrender.com${String(input)}`
  const res = await fetch(url, { ...init, headers })

  if (res.status === 401) {
    clearAccessToken()
    try { queryClient?.clear() } catch {}
    const txt = await res.text().catch(() => '')
    throw new Error(txt || 'Unauthorized')
  }

  return handleResponse(res)
}

export async function loginApi(email: string, password: string) {
  const res = await fetch(`https://bookit-backend-d4l7.onrender.com/api/v1/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'email': email, 'password': password }),
  })
  if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      if (res.status === 400) throw new Error ("Error 400")
      throw new Error(err.message || 'Failed to log in')
  }


  return handleResponse(res)
}

export async function logoutLocal() {
  clearAccessToken()
  try { queryClient?.clear() } catch {}
}