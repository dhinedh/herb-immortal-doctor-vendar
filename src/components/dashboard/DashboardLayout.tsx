import React, { useState } from 'react';
import {
  Home,
  Calendar,
  MessageSquare,
  ShoppingBag,
  Package,
  TrendingUp,
  Wallet,
  User,
  Settings,
  Bell,
  Menu,
  X,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const menuItems = [
  { icon: Home, label: 'Home', path: 'home' },
  { icon: Calendar, label: 'Bookings', path: 'bookings' },
  { icon: MessageSquare, label: 'Chats', path: 'chats' },
  { icon: Calendar, label: 'Calendar', path: 'calendar' },
  { icon: ShoppingBag, label: 'Products', path: 'products' },
  { icon: Package, label: 'Orders', path: 'orders' },
  { icon: TrendingUp, label: 'Insights', path: 'insights' },
  { icon: Wallet, label: 'Wallet', path: 'wallet' },
  { icon: User, label: 'Profile', path: 'profile' },
  { icon: Settings, label: 'Settings', path: 'settings' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPage = 'home',
}) => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 lg:static`}
        >
          <div className="flex items-center gap-2 p-6 border-b border-gray-200">
            <div className="bg-[#6CCF93] p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#2E7D32]">Herb Immortal</span>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.path
                    ? 'bg-[#E7F8EF] text-[#2E7D32]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>

              <div className="flex-1 lg:flex-none" />

              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#E53935] rounded-full" />
                </button>

                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-gray-700" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-10 h-10 rounded-full bg-[#6CCF93] flex items-center justify-center text-white font-semibold"
                  >
                    {user?.email?.[0].toUpperCase()}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700">
                        Profile
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700">
                        Settings
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={signOut}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
