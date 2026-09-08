import config from '../config/config'

interface ApiRequestOptions extends RequestInit {
  token?: string
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, ...requestOptions } = options

  const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  })

  if (!response.ok) {
    let message = 'Something went wrong while contacting Khoj.'

    try {
      const errorData = await response.json()

      if (errorData?.message) {
        message = errorData.message
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function get<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'GET',
  })
}

export function post<T>(
  endpoint: string,
  body?: unknown,
  options: ApiRequestOptions = {},
) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export function put<T>(
  endpoint: string,
  body?: unknown,
  options: ApiRequestOptions = {},
) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export function del<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'DELETE',
  })
}

export default {
  get,
  post,
  put,
  del,
}