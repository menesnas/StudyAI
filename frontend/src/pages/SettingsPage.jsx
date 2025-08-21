import React from 'react';
import GeneralSettings from '../components/GeneralSettings';
import AccountSettings from '../components/AccountSettings';

function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Ayarlar</h1>
      <div className="space-y-6">
        <GeneralSettings />
        <AccountSettings />
      </div>
    </div>
  );
}

export default SettingsPage;
