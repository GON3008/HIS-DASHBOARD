import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children }) => {
  // Default sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth >= 768
  })

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Chỉ tự động đóng khi ở mobile; không ép mở khi desktop
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout


