const LS_KEY = 'bookit_access_token'
let inMemoryToken: string | null = null

export function setAccessToken(token: string | null, persist = true) {
  inMemoryToken = token
  try {
    if (persist && token) localStorage.setItem(LS_KEY, token)
    else localStorage.removeItem(LS_KEY)
  } catch {
    
  }
}

export function getAccessToken(): string {
  if (inMemoryToken) return inMemoryToken
  try {
    const t = localStorage.getItem(LS_KEY)
    if (t) {
      inMemoryToken = t
      return t
    }
  } catch {

  }
  return "null"
}

export function clearAccessToken() {
  inMemoryToken = null
  try { localStorage.removeItem(LS_KEY) } catch {}
}