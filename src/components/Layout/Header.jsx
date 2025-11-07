import { Menu, Bell, User, Search, LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useRef, useEffect, useContext } from 'react'
import ThemeContext from '../../contexts/ThemeContext';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      await logout()
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Search bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggler */}
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {theme === 'light' ? (
            <Moon className="w-6 h-6 text-gray-600" />
          ) : (
            <Sun className="w-6 h-6 text-yellow-400" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile with dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.su_name || user?.username || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || 'Quản trị viên'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {user?.su_name || user?.username || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {user?.email || 'admin@hospital.com'}
                </p>
              </div>

              <div className="py-2">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    // Navigate to profile page
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-800 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

