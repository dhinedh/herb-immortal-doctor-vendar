import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Globe, Calendar, CreditCard } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

type SettingsTab = 'account' | 'notifications' | 'privacy' | 'preferences';

export const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    paymentAlerts: true,
    chatAlerts: true,
  });

  const tabs = [
    { key: 'account' as SettingsTab, label: 'Account', icon: User },
    { key: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { key: 'privacy' as SettingsTab, label: 'Privacy & Security', icon: Lock },
    { key: 'preferences' as SettingsTab, label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-64 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.key
                      ? 'bg-[#E7F8EF] text-[#2E7D32]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        <div className="flex-1">
          {activeTab === 'account' && (
            <Card>
              <h2 className="text-2xl font-semibold text-[#2E7D32] mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Email & Phone</h3>
                  <div className="space-y-4">
                    <Input label="Email" type="email" value={user?.email || ''} disabled />
                    <Input label="Phone" type="tel" placeholder="Enter phone number" />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-2xl font-semibold text-[#2E7D32] mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-[#1F2933]">Email alerts for new bookings</span>
                      <input
                        type="checkbox"
                        checked={settings.bookingAlerts}
                        onChange={(e) => setSettings({ ...settings, bookingAlerts: e.target.checked })}
                        className="w-5 h-5 accent-[#6CCF93]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-[#1F2933]">Payment notifications</span>
                      <input
                        type="checkbox"
                        checked={settings.paymentAlerts}
                        onChange={(e) => setSettings({ ...settings, paymentAlerts: e.target.checked })}
                        className="w-5 h-5 accent-[#6CCF93]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-[#1F2933]">Chat message alerts</span>
                      <input
                        type="checkbox"
                        checked={settings.chatAlerts}
                        onChange={(e) => setSettings({ ...settings, chatAlerts: e.target.checked })}
                        className="w-5 h-5 accent-[#6CCF93]"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">SMS Notifications</h3>
                  <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-[#1F2933]">Receive SMS alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                      className="w-5 h-5 accent-[#6CCF93]"
                    />
                  </label>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'privacy' && (
            <Card>
              <h2 className="text-2xl font-semibold text-[#2E7D32] mb-6">Privacy & Security</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Active Sessions</h3>
                  <p className="text-gray-600 mb-4">
                    Manage your active sessions across different devices
                  </p>
                  <Button variant="outline" onClick={signOut}>
                    Log out from all devices
                  </Button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Data Export</h3>
                  <p className="text-gray-600 mb-4">
                    Download a copy of your data including profile, bookings, and transactions
                  </p>
                  <Button variant="outline">Request Data Export</Button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1F2933] mb-4">Delete Account</h3>
                  <p className="text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Request Account Deletion
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <h2 className="text-2xl font-semibold text-[#2E7D32] mb-6">Platform Preferences</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-2">Timezone</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]">
                    <option>(GMT+05:30) India Standard Time</option>
                    <option>(GMT+00:00) UTC</option>
                    <option>(GMT-05:00) Eastern Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-2">Language</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-2">Date Format</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CCF93]">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
