import { useCallback, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useAsync<T>(asyncFunction: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({
      data: null,
      loading: true,
      error: null,
    })

    try {
      const data = await asyncFunction()

      setState({
        data,
        loading: false,
        error: null,
      })

      return data
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'

      setState({
        data: null,
        loading: false,
        error: message,
      })

      return null
    }
  }, [asyncFunction])

  return {
    ...state,
    execute,
  }
}

export default useAsync