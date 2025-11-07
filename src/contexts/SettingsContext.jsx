import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SettingsContext = createContext(null)

const DEFAULTS = {
  realtimeInterval: 5000,
}

const STORAGE_KEY = 'his_dashboard_settings'

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        return { ...DEFAULTS, ...parsed }
      }
    } catch {}
    return DEFAULTS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {}
  }, [settings])

  const setRealtimeInterval = (ms) => {
    const value = Number(ms)
    if (!Number.isFinite(value) || value < 0) return
    setSettings((prev) => ({ ...prev, realtimeInterval: value }))
  }

  const value = useMemo(() => ({
    ...settings,
    setRealtimeInterval,
  }), [settings])

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
