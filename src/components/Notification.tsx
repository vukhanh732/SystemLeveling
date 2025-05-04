import { useEffect } from 'react';
import { useNotificationStore, useThemeStore } from '../store';

const getNotificationStyles = (type: string, theme: string) => {
  const baseStyles = 'fixed z-50 bottom-4 right-4 p-4 border backdrop-blur-sm rounded-sm max-w-md';

  // Determine the theme color
  let themeColor: string;
  switch (theme) {
    case 'green':
      themeColor = 'cyber-green';
      break;
    case 'red':
      themeColor = 'cyber-red';
      break;
    case 'purple':
      themeColor = 'cyber-purple';
      break;
    default:
      themeColor = 'cyber-blue';
  }

  // Determine notification type styles
  switch (type) {
    case 'success':
      return `${baseStyles} border-cyber-green-glow bg-cyber-black/80 text-cyber-green-light shadow-neon-green-sm`;
    case 'error':
      return `${baseStyles} border-cyber-red-glow bg-cyber-black/80 text-cyber-red-light shadow-neon-red-sm`;
    case 'warning':
      return `${baseStyles} border-cyber-purple-glow bg-cyber-black/80 text-cyber-purple-light shadow-neon-purple-sm`;
    default:
      return `${baseStyles} border-${themeColor}-glow bg-cyber-black/80 text-${themeColor}-light shadow-neon-${themeColor}-sm`;
  }
};

const Notification = () => {
  const { message, type, isVisible, hideNotification } = useNotificationStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, hideNotification]);

  if (!isVisible) return null;

  return (
    <div
      className={`${getNotificationStyles(type, theme)} transform transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {type === 'success' && (
            <div className="mr-3 h-5 w-5 text-cyber-green-glow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {type === 'error' && (
            <div className="mr-3 h-5 w-5 text-cyber-red-glow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {type === 'warning' && (
            <div className="mr-3 h-5 w-5 text-cyber-purple-glow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {type === 'info' && (
            <div className="mr-3 h-5 w-5 text-cyber-blue-glow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <p>{message}</p>
        </div>
        <button
          onClick={hideNotification}
          className="ml-4 h-5 w-5 text-current opacity-70 hover:opacity-100"
          aria-label="Close notification"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
