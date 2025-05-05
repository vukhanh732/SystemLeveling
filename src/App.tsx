import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// Import useTaskStore
import { useAuthStore, useNotificationStore, useTaskStore } from './store';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import Notification from './components/Notification';
import type { User } from './types'; // Import User type

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user, isLoggedIn } = useAuthStore();
  const { showNotification } = useNotificationStore();
  // Get the assign function from taskStore
  const { assignDailyQuestIfNeeded } = useTaskStore();

  // Effect to show welcome message (runs once on mount)
  useEffect(() => {
    // Check if user is logged in when app loads
    if (isLoggedIn && user) {
      showNotification(`Welcome back, ${user.username}!`, 'success');
    }
    // This effect only runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to assign daily quest when user is loaded/logged in
  useEffect(() => {
    // Check if user object exists and has the necessary properties
    if (user && user.id && typeof user.level === 'number') {
      console.log("App.tsx: User logged in, checking for daily quest assignment.");
      // Pass the valid User object to the function
      assignDailyQuestIfNeeded(user as User); // Cast if necessary, ensure User type matches store requirement
    }
    // Dependency array ensures this runs when user object changes (e.g., on login/logout or load from persistence)
  }, [user, assignDailyQuestIfNeeded]);

  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <AuthPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
        </Routes>

        {/* Floating notification that appears outside of the routes */}
        <Notification />
      </div>
    </Router>
  );
}

export default App;
