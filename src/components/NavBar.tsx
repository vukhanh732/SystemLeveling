import { useState } from "react";
import {
  FaCog,
  FaHome,
  FaListAlt,
  FaPalette,
  FaSignOutAlt,
  FaTasks,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore, useNotificationStore, useThemeStore } from "../store";

const NavBar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { showNotification } = useNotificationStore();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = () => {
    logout();
    showNotification("You have been logged out", "info");
  };

  const handleThemeChange = (newTheme: "blue" | "green" | "red" | "purple") => {
    setTheme(newTheme);
    setShowThemeMenu(false);
    showNotification(`Theme changed to ${newTheme}`, "info");
  };

  if (!user) return null;

  const getThemeColor = (userTheme: string) => {
    switch (userTheme) {
      case "green":
        return "cyber-green";
      case "red":
        return "cyber-red";
      case "purple":
        return "cyber-purple";
      default:
        return "cyber-blue";
    }
  };

  const navLinkClass = (path: string) => {
    const baseClass = `flex items-center px-4 py-2 my-1 text-${getThemeColor(theme)}-light transition-all duration-300`;
    const activeClass = `border-l-2 border-${getThemeColor(theme)}-glow bg-${getThemeColor(theme)}-glow/10 shadow-${getThemeColor(theme)}-sm`;

    return pathname === path
      ? `${baseClass} ${activeClass}`
      : `${baseClass} hover:bg-${getThemeColor(theme)}-glow/5`;
  };

  return (
    <nav className="w-full bg-cyber-black/50 border-b border-cyber-blue-glow/20 py-2 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo/Title */}
        <div className="flex items-center">
          <Link
            to="/dashboard"
            className={`text-${getThemeColor(theme)}-glow text-xl font-bold tracking-wider`}
          >
            CYBER<span className="text-white">TASK</span>
          </Link>
        </div>

        {/* User info and XP */}
        <div className="flex items-center space-x-6">
          {/* Level and XP info */}
          <div className="mr-4 hidden md:block">
            <div className="flex items-center space-x-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-${getThemeColor(theme)}-glow/10 border border-${getThemeColor(theme)}-glow text-${getThemeColor(theme)}-light`}
              >
                {user.level}
              </div>
              <div>
                <p className={`text-${getThemeColor(theme)}-light text-xs`}>
                  PLAYER
                </p>
                <p className="text-white text-sm font-semibold">
                  {user.username}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation menu */}
          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard"
              className={`rounded-sm p-2 transition-colors ${pathname === "/dashboard" ? `text-${getThemeColor(theme)}-glow bg-${getThemeColor(theme)}-glow/10` : "text-gray-400 hover:text-white"}`}
            >
              <FaHome className="text-lg" />
            </Link>
            <Link
              to="/tasks"
              className={`rounded-sm p-2 transition-colors ${pathname === "/tasks" ? `text-${getThemeColor(theme)}-glow bg-${getThemeColor(theme)}-glow/10` : "text-gray-400 hover:text-white"}`}
            >
              <FaTasks className="text-lg" />
            </Link>
            <Link
              to="/history"
              className={`rounded-sm p-2 transition-colors ${pathname === "/history" ? `text-${getThemeColor(theme)}-glow bg-${getThemeColor(theme)}-glow/10` : "text-gray-400 hover:text-white"}`}
            >
              <FaListAlt className="text-lg" />
            </Link>

            {/* Theme selector */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`rounded-sm p-2 transition-colors ${showThemeMenu ? `text-${getThemeColor(theme)}-glow bg-${getThemeColor(theme)}-glow/10` : "text-gray-400 hover:text-white"}`}
              >
                <FaPalette className="text-lg" />
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-sm border border-gray-700 bg-cyber-black/90 py-1 shadow-lg backdrop-blur-sm z-50">
                  <button
                    onClick={() => handleThemeChange("blue")}
                    className="flex w-full items-center px-4 py-2 text-left text-gray-200 hover:bg-cyber-blue-glow/20"
                  >
                    <span className="h-3 w-3 rounded-full bg-cyber-blue-glow mr-2" />
                    Blue
                  </button>
                  <button
                    onClick={() => handleThemeChange("green")}
                    className="flex w-full items-center px-4 py-2 text-left text-gray-200 hover:bg-cyber-green-glow/20"
                  >
                    <span className="h-3 w-3 rounded-full bg-cyber-green-glow mr-2" />
                    Green
                  </button>
                  <button
                    onClick={() => handleThemeChange("red")}
                    className="flex w-full items-center px-4 py-2 text-left text-gray-200 hover:bg-cyber-red-glow/20"
                  >
                    <span className="h-3 w-3 rounded-full bg-cyber-red-glow mr-2" />
                    Red
                  </button>
                  <button
                    onClick={() => handleThemeChange("purple")}
                    className="flex w-full items-center px-4 py-2 text-left text-gray-200 hover:bg-cyber-purple-glow/20"
                  >
                    <span className="h-3 w-3 rounded-full bg-cyber-purple-glow mr-2" />
                    Purple
                  </button>
                </div>
              )}
            </div>

            {/* Settings and Logout */}
            <Link
              to="/settings"
              className={`rounded-sm p-2 transition-colors ${pathname === "/settings" ? `text-${getThemeColor(theme)}-glow bg-${getThemeColor(theme)}-glow/10` : "text-gray-400 hover:text-white"}`}
            >
              <FaCog className="text-lg" />
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-sm p-2 text-gray-400 transition-colors hover:text-cyber-red-light"
            >
              <FaSignOutAlt className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
