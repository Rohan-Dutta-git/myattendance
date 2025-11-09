
import React from 'react';

interface IconProps {
  className?: string;
}

const DashboardIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zm5.25 4.5a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H9.75zM8.25 12a.75.75 0 01.75-.75h6.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5H15a.75.75 0 000-1.5h-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

export default DashboardIcon;
