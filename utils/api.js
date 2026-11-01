// Calls the Netlify Functions with the signed-in user's Firebase ID token. Errors carry the server's message.
export async function api(auth, name, { method = 'GET', query, body } = {}) {
  const user = auth.currentUser
  if (!user) throw new Error('Sign in to continue.')
  const token = await user.getIdToken()
  const search = query ? `?${new URLSearchParams(query).toString()}` : ''
  let res
  try {
    res = await fetch(`/.netlify/functions/${name}${search}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        ...(body ? { 'content-type': 'application/json' } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    })
  } catch (err) {
    throw new Error('The server could not be reached. Check your connection and try again.')
  }
  const type = res.headers.get('content-type') || ''
  if (!res.ok) {
    const message = type.includes('json') ? (await res.json()).error : null
    const error = new Error(message || `The request failed (${res.status}).`)
    error.status = res.status
    throw error
  }
  if (type.includes('json')) return res.json()
  return res.blob()
}
