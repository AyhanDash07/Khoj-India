const STORAGE_PREFIX = 'khoj_'

function getKey(key: string) {
  return `${STORAGE_PREFIX}${key}`
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(getKey(key), JSON.stringify(value))
  } catch {
    // Ignore storage failures.
  }
}

export function getStorageItem<T>(
  key: string,
  fallback: T | null = null,
): T | null {
  try {
    const value = localStorage.getItem(getKey(key))

    if (value === null) {
      return fallback
    }

    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(getKey(key))
  } catch {
    // Ignore storage failures.
  }
}

export function clearKhojStorage(): void {
  try {
    const keysToRemove: string[] = []

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)

      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch {
    // Ignore storage failures.
  }
}