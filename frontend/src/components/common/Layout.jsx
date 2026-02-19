import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaBox, FaCashRegister, FaUsers, FaChartLine, FaStar, FaSignOutAlt, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FaHome, roles: ['user', 'owner'] },
    { name: 'POS / Sales', to: '/pos', icon: FaCashRegister, roles: ['user', 'owner'] },
    { name: 'Inventory', to: '/inventory', icon: FaBox, roles: ['user', 'owner'] },
    { name: 'Customers', to: '/customers', icon: FaUsers, roles: ['user', 'owner'] },
    { name: 'New Arrivals', to: '/new-arrivals', icon: FaStar, roles: ['owner'] },
    { name: 'Reports', to: '/reports', icon: FaChartLine, roles: ['owner'] },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen flex">
      <aside className={`\${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FaShoppingBag className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Shoe POS</h1>
                  <p className="text-xs text-gray-500">{user?.role === 'owner' ? 'Owner' : 'Staff'}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><FaTimes /></button>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `sidebar-link \${isActive ? 'sidebar-link-active' : ''}`}>
                <item.icon className="text-lg" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full btn-secondary flex items-center justify-center gap-2 py-2">
              <FaSignOutAlt /><span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><FaBars className="text-2xl text-gray-600" /></button>
            <h2 className="text-xl font-semibold text-gray-900">Welcome, {user?.name}!</h2>
            <div className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8"><Outlet /></main>
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;
