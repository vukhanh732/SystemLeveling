import { useState } from 'react';
import { useThemeStore, useAuthStore, useNotificationStore } from '../store';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { getXpForNextLevel } from '../store/authStore';

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { showNotification } = useNotificationStore();

  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleThemeChange = (newTheme: 'blue' | 'green' | 'red' | 'purple') => {
    setTheme(newTheme);
    showNotification(`Theme changed to ${newTheme}`, 'success');
  };

  const handleLogout = () => {
    logout();
    showNotification('You have been logged out', 'info');
  };

  const getThemeColor = () => {
    switch (theme) {
      case 'green':
        return 'cyber-green';
      case 'red':
        return 'cyber-red';
      case 'purple':
        return 'cyber-purple';
      default:
        return 'cyber-blue';
    }
  };

  const themeColor = getThemeColor();

  // Calculate next level XP requirements
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 0;
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const xpProgress = Math.min((currentXp / nextLevelXp) * 100, 100);

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-8 text-2xl font-bold text-white">Settings</h1>

        {/* User Profile Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-white">Profile</h2>
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-6 backdrop-blur-sm`}>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="text-lg text-white">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Account Created</p>
                <p className="text-lg text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm text-gray-400">Level Progress</p>
              <div className="flex items-center">
                <span className={`mr-2 text-xl font-bold text-${themeColor}-glow`}>Lv.{currentLevel}</span>
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-gray-700">
                    <div
                      className={`h-full rounded-full bg-${themeColor}-glow transition-all duration-500`}
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-400">
                    <span>{currentXp} XP</span>
                    <span>{nextLevelXp} XP</span>
                  </div>
                </div>
                {currentLevel < 100 && (
                  <span className="ml-2 text-sm text-gray-400">
                    Next: Lv.{currentLevel + 1}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {!confirmLogout ? (
                <Button
                  variant="secondary"
                  onClick={() => setConfirmLogout(true)}
                >
                  Logout
                </Button>
              ) : (
                <div className="flex items-center justify-end space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => setConfirmLogout(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                  >
                    Confirm Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme Settings Section */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">Theme</h2>
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-6 backdrop-blur-sm`}>
            <p className="mb-4 text-gray-400">Choose your interface theme color</p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <ThemeOption
                themeName="blue"
                currentTheme={theme}
                onClick={() => handleThemeChange('blue')}
              />
              <ThemeOption
                themeName="green"
                currentTheme={theme}
                onClick={() => handleThemeChange('green')}
              />
              <ThemeOption
                themeName="red"
                currentTheme={theme}
                onClick={() => handleThemeChange('red')}
              />
              <ThemeOption
                themeName="purple"
                currentTheme={theme}
                onClick={() => handleThemeChange('purple')}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ThemeOptionProps {
  themeName: 'blue' | 'green' | 'red' | 'purple';
  currentTheme: string;
  onClick: () => void;
}

const ThemeOption = ({ themeName, currentTheme, onClick }: ThemeOptionProps) => {
  const isActive = themeName === currentTheme;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center space-y-2 rounded-sm border p-4 transition-all duration-300 ${
        isActive
          ? `border-cyber-${themeName}-glow bg-cyber-${themeName}-glow/20 text-cyber-${themeName}-light`
          : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
      }`}
    >
      <div className={`h-6 w-6 rounded-full bg-cyber-${themeName}-glow shadow-neon-${themeName}-sm`} />
      <span className="text-sm capitalize">{themeName}</span>
      {isActive && <span className="text-xs">Active</span>}
    </button>
  );
};

export default SettingsPage;
