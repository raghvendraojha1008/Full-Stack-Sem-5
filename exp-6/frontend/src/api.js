// One place for every call to the backend. Each call is also reported to the request tape.

const listeners = new Set()
let sequence = 0

export function onRequest(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function report(entry) {
  listeners.forEach((listener) => listener(entry))
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

/**
 * Sends a request and measures the full round trip (including reading the JSON body).
 * Returns { data, ms, cache } where cache is "HIT", "MISS", "BYPASS" or null.
 * Pass silent: true to keep a request off the tape (used by the benchmark).
 */
export async function request(path, { method = 'GET', body, silent = false } = {}) {
  const started = performance.now()
  let status = 0
  let cache = null
  try {
    const response = await fetch(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    status = response.status
    cache = response.headers.get('X-Cache')
    const text = await response.text()
    const ms = performance.now() - started
    if (!silent) report({ id: ++sequence, method, path, status, ms, cache })

    if (!response.ok) {
      let message = `The server answered ${response.status}`
      try {
        const json = JSON.parse(text)
        message = json.message || json.detail || message
      } catch {
        // body was not JSON, keep the default message
      }
      throw new ApiError(message, response.status)
    }
    return { data: text ? JSON.parse(text) : null, ms, cache }
  } catch (error) {
    if (status === 0 && !silent) {
      report({ id: ++sequence, method, path, status: 0, ms: performance.now() - started, cache: null })
    }
    if (error instanceof ApiError) throw error
    throw new ApiError('Cannot reach the backend. Is it running on port 8080?', 0)
  }
}

export function query(params) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

export const api = {
  posts: ({ page, size, sort, authorId, cached = true, silent = false }) =>
    request(`/api/posts${cached ? '' : '/uncached'}${query({ page, size, sort, authorId })}`, { silent }),
  post: (id) => request(`/api/posts/${id}`),
  topPosts: (limit = 5) => request(`/api/posts/top?limit=${limit}`),
  createPost: (body) => request('/api/posts', { method: 'POST', body }),
  authors: () => request('/api/authors'),
  analytics: ({ cached = true, silent = false } = {}) =>
    request(cached ? '/api/analytics' : '/api/analytics/uncached', { silent }),
  cacheStats: () => request('/api/cache/stats'),
  clearCache: (options) => request('/api/cache', { method: 'DELETE', ...options }),
  lazyDemo: () => request('/api/demo/n-plus-one/lazy'),
  joinFetchDemo: () => request('/api/demo/n-plus-one/join-fetch'),
}
