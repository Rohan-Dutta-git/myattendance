import React from 'react';
import BellIcon from './icons/BellIcon';

interface NotificationPermissionBannerProps {
  onGrant: () => void;
}

const NotificationPermissionBanner: React.FC<NotificationPermissionBannerProps> = ({ onGrant }) => {
  return (
    <div className="bg-sky-900/70 border border-sky-700 rounded-lg p-4 flex items-center justify-between gap-4 mb-4" role="alert">
      <div className="flex items-center gap-3">
        <BellIcon className="w-6 h-6 text-sky-400" />
        <div>
          <h4 className="font-semibold text-sky-300">Get Class Reminders</h4>
          <p className="text-sm text-slate-300">Enable notifications to get an alert when your class ends.</p>
        </div>
      </div>
      <button
        onClick={onGrant}
        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap"
      >
        Enable
      </button>
    </div>
  );
};

export default NotificationPermissionBanner;
