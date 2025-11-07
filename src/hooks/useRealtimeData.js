import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for real-time data polling
 * @param {Function} fetchFunction - Hàm fetch data từ API
 * @param {number} interval - Thời gian interval (ms), mặc định 5000ms (5 giây)
 * @param {Array} dependencies - Dependencies để trigger re-fetch
 * @returns {Object} - { data, loading, isRefreshing, lastUpdated, refresh, error }
 */
const useRealtimeData = (fetchFunction, interval = 5000, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  // Fetch data function
  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setIsRefreshing(true)
    setError(null)
    
    try {
      const result = await fetchFunction()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error fetching real-time data:', err)
      setError(err)
    } finally {
      if (showLoading) setLoading(false)
      setIsRefreshing(false)
    }
  }, [fetchFunction, ...dependencies])

  // Setup polling
  useEffect(() => {
    // Initial fetch
    fetchData(true)
    
    // Setup interval for auto-refresh
    if (interval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData(false) // Don't show loading spinner for auto-refresh
      }, interval)
    }
    
    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, interval])

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData(false)
  }, [fetchData])

  // Pause/Resume functions
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resume = useCallback(() => {
    if (!intervalRef.current && interval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData(false)
      }, interval)
    }
  }, [fetchData, interval])

  return {
    data,
    loading,
    isRefreshing,
    lastUpdated,
    error,
    refresh,
    pause,
    resume
  }
}

export default useRealtimeData
