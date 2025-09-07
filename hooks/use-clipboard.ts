'use client'

import {useCallback, useState} from 'react'

export function useClipboard() {
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    setError(null)
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        setError('Clipboard API not available. Please use a modern browser or ensure the page is served over HTTPS.')
        return false
      }
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy to clipboard')
      return false
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {copyToClipboard, error, clearError}
}
