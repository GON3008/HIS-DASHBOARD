const ChartCard = ({ title, children, action }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {action && (
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {action}
          </button>
        )}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}

export default ChartCard

