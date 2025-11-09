import React from 'react';

interface IconProps {
  className?: string;
}

const BellIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}>
    <path 
      fillRule="evenodd" 
      d="M12 2.25c-2.429 0-4.62.933-6.284 2.45-1.72 1.565-2.6 3.69-2.6 5.89V17.25a3 3 0 00.22 1.182l.935 1.87a1.5 1.5 0 001.405.948h12.88a1.5 1.5 0 001.406-.948l.934-1.87a3 3 0 00.22-1.182V10.59c0-2.2-.88-4.325-2.6-5.89A9.686 9.686 0 0012 2.25zM13.5 18a1.5 1.5 0 01-3 0h3z" 
      clipRule="evenodd" />
  </svg>
);

export default BellIcon;
