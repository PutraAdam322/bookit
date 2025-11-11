const LS_KEY = 'bookit_access_token'
const LS_KEY_EXP = 'bookit_access_token_exp'
let inMemoryToken: string | null = null

export function setAccessToken(token: string | null, persist = true, ttlMs = 15 * 60 * 1000) {
  inMemoryToken = token
  const expiresAt = Date.now() + ttlMs
  try {
    if (persist && token) {localStorage.setItem(LS_KEY, token); localStorage.setItem(LS_KEY_EXP, expiresAt.toString())}
    else localStorage.removeItem(LS_KEY)
  } catch {
    
  }
}

export function getAccessToken(): string {
  const exp = parseInt(localStorage.getItem(LS_KEY_EXP) || "0", 10)
  if (Date.now() > exp) {clearAccessToken(); return ""}
  if (inMemoryToken) return inMemoryToken
  try {
    const t = localStorage.getItem(LS_KEY)
    if (t) {
      inMemoryToken = t
      return t
    }
  } catch {

  }
  return ""
}

export function clearAccessToken() {
  inMemoryToken = null
  try { localStorage.removeItem(LS_KEY) } catch {}
}