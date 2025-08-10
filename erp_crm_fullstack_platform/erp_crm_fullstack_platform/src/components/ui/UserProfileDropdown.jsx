import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const UserProfileDropdown = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useState({
    name: 'John Administrator',
    email: 'admin@erpcrm.com',
    role: 'System Administrator',
    avatar: null
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: 'User',
      action: () => {
        console.log('Opening profile settings...');
        setIsOpen(false);
      }
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      action: () => {
        console.log('Opening preferences...');
        setIsOpen(false);
      }
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      action: () => {
        console.log('Opening notifications...');
        setIsOpen(false);
      }
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: 'HelpCircle',
      action: () => {
        console.log('Opening help...');
        setIsOpen(false);
      }
    },
    {
      id: 'divider',
      type: 'divider'
    },
    {
      id: 'logout',
      label: 'Sign Out',
      icon: 'LogOut',
      variant: 'destructive',
      action: () => {
        handleLogout();
      }
    }
  ];

  const handleLogout = async () => {
    try {
      // Clear user session
      localStorage.removeItem('authToken');
      localStorage.removeItem('userSession');
      
      // Clear any other stored data
      sessionStorage.clear();
      
      console.log('User logged out successfully');
      
      // Navigate to login page
      navigate('/login', { replace: true });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getInitials = (name) => {
    return name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
          {user?.avatar ? (
            <img 
              src={user?.avatar} 
              alt={user?.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(user?.name)
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-foreground">{user?.name?.split(' ')?.[0]}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`hidden md:block transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-md shadow-lg z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                {user?.avatar ? (
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item) => {
              if (item?.type === 'divider') {
                return <div key={item?.id} className="my-2 border-t border-border" />;
              }

              return (
                <button
                  key={item?.id}
                  onClick={item?.action}
                  className={`w-full px-4 py-2 text-left hover:bg-muted transition-colors duration-150 flex items-center space-x-3 ${
                    item?.variant === 'destructive' ? 'text-error hover:bg-error/10' : 'text-foreground'
                  }`}
                >
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    className={item?.variant === 'destructive' ? 'text-error' : 'text-muted-foreground'} 
                  />
                  <span className="text-sm">{item?.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;