import { getAccessToken, clearAccessToken } from '@/utils/utils'
import { queryClient } from '@/queryClient'
import { useNavigate } from '@tanstack/react-router' 


const urli = import.meta.env.VITE_API_URL

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

  const url = String(input).startsWith('http') ? input : `${urli}${String(input)}`
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
  const res = await fetch(`${urli}/api/v1/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({'email': email, 'password': password }),
  })
  if (!res.ok) {
      const err = await res.json()
      throw new Error(err.data || 'Failed to log in')
  }


  return handleResponse(res)
}

export async function logoutLocal() {
  clearAccessToken()
  try { queryClient?.clear()} catch {}
}