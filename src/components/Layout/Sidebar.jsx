import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Activity,
  Settings,
  FlaskConical
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/overview', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/patients', icon: Users, label: 'Bệnh nhân' },
    { path: '/departments', icon: Building2, label: 'Khoa phòng' },
    { path: '/reports', icon: FileText, label: 'Báo cáo' },
    { path: '/test-api', icon: FlaskConical, label: '🧪 Test API', badge: 'NEW' },
    { path: '/settings', icon: Settings, label: 'Cài đặt' },
  ]

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
          isOpen ? 'translate-x-0 md:translate-x-0 w-64 md:w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-0'
        } overflow-hidden`}
      >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 bg-primary-600">
          <Activity className="w-8 h-8 text-white mr-2" />
          <h1 className="text-xl font-bold text-white">EMR Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </aside>
    </>
  )
}

export default Sidebar

