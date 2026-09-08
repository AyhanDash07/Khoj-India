import { useCallback, useState } from 'react'

import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '../utils/storage'

function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    return getStorageItem<T>(key, initialValue) ?? initialValue
  })

  const updateValue = useCallback(
    (newValue: T) => {
      setValue(newValue)
      setStorageItem(key, newValue)
    },
    [key],
  )

  const removeValue = useCallback(() => {
    setValue(initialValue)
    removeStorageItem(key)
  }, [initialValue, key])

  return {
    value,
    setValue: updateValue,
    removeValue,
  }
}

export default useStorage