
import React from 'react';

interface IconProps {
  className?: string;
}

const CalendarIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zM5.25 6.75c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125V7.875c0-.621-.504-1.125-1.125-1.125H5.25z"
      clipRule="evenodd"
    />
    <path d="M10.06 12.19a.75.75 0 10-1.06 1.06l1.72 1.72a.75.75 0 101.06-1.06l-1.72-1.72z" />
    <path
      fillRule="evenodd"
      d="M10.5 10.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z"
      clipRule="evenodd"
    />
    <path d="M13.94 13.25a.75.75 0 10-1.06-1.06l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72z" />
    <path
      fillRule="evenodd"
      d="M14.25 10.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

export default CalendarIcon;
