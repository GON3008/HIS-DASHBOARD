import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, Bell, Plus } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Bell, path: '/notifications', label: 'Notifications' },
    { icon: Plus, path: '/create', label: 'Create', isPrimary: true },
    { icon: User, path: '/profile', label: 'Profile' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-full ${
                item.isPrimary 
                  ? 'bg-blue-600 text-white -mt-6 p-3 rounded-full shadow-lg' 
                  : ''
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
