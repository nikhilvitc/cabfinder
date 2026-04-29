export function getApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return import.meta.env.DEV ? 'http://localhost:3001' : 'https://cabfinder.onrender.com'
}
