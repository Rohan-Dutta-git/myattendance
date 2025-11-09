
import React from 'react';
import { View } from '../types';
import DashboardIcon from './icons/DashboardIcon';
import AddIcon from './icons/AddIcon';
import CalendarIcon from './icons/CalendarIcon';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-sky-500 dark:text-sky-400';
  const inactiveClasses = 'text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex justify-around shadow-lg">
      <NavItem
        label="Dashboard"
        icon={<DashboardIcon className="w-6 h-6" />}
        isActive={activeView === View.Dashboard}
        onClick={() => setActiveView(View.Dashboard)}
      />
      <NavItem
        label="Add Subject"
        icon={<AddIcon className="w-6 h-6" />}
        isActive={activeView === View.AddSubject}
        onClick={() => setActiveView(View.AddSubject)}
      />
      <NavItem
        label="Calendar"
        icon={<CalendarIcon className="w-6 h-6" />}
        isActive={activeView === View.Calendar}
        onClick={() => setActiveView(View.Calendar)}
      />
    </nav>
  );
};

export default BottomNav;