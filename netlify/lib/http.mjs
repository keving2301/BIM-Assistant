// Small helpers shared by the functions: JSON responses, errors with an HTTP status, and a wrapper that turns any
// thrown error into a JSON reply the app can show.

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  })
}

// Wraps a handler: checks the method, then answers errors as { error } with their status.
export function route(handlers) {
  return async (req, context) => {
    const handler = handlers[req.method]
    if (!handler) {
      return json(405, { error: `Method ${req.method} is not allowed.` }, { allow: Object.keys(handlers).join(', ') })
    }
    try {
      return await handler(req, context)
    } catch (err) {
      if (err instanceof HttpError) {
        return json(err.status, { error: err.message })
      }
      console.error(err)
      return json(500, { error: 'Something went wrong on the server. Try again in a moment.' })
    }
  }
}

export async function readJson(req) {
  try {
    return await req.json()
  } catch {
    throw new HttpError(400, 'The request body must be JSON.')
  }
}
