import { useState, useEffect } from 'react'
import { useSettings } from '../contexts/SettingsContext'
import { Clock, Save } from 'lucide-react'

const presets = [
  { label: 'Tắt auto-refresh', value: 0 },
  { label: '3 giây', value: 3000 },
  { label: '5 giây', value: 5000 },
  { label: '10 giây', value: 10000 },
  { label: '30 giây', value: 30000 },
  { label: '60 giây', value: 60000 },
]

const Settings = () => {
  const { realtimeInterval, setRealtimeInterval } = useSettings()
  const [tempInterval, setTempInterval] = useState(realtimeInterval)

  useEffect(() => {
    setTempInterval(realtimeInterval)
  }, [realtimeInterval])

  const handleSave = () => {
    setRealtimeInterval(tempInterval)
  }

  const handlePreset = (value) => {
    setTempInterval(value)
    setRealtimeInterval(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Tùy chỉnh cập nhật dữ liệu theo thời gian thực</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Thời gian auto-refresh</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-400 min-w-[180px]">Khoảng thời gian (mili giây):</label>
            <input
              type="number"
              min={0}
              step={500}
              value={tempInterval}
              onChange={(e) => setTempInterval(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hoặc chọn nhanh:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    realtimeInterval === p.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Giá trị 0 sẽ tắt auto-refresh. Bạn vẫn có thể nhấn nút "Làm mới" ở từng trang để cập nhật dữ liệu.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
