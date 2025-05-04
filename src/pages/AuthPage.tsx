import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useNotificationStore, useThemeStore } from '../store';
import Button from '../components/Button';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const navigate = useNavigate();

  const { login, signup } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const { theme } = useThemeStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    const success = login(username, password);

    if (success) {
      showNotification(`Welcome back, ${username}!`, 'success');
      navigate('/dashboard');
    } else {
      showNotification('Invalid credentials', 'error');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !confirmedPassword.trim()) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmedPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    const success = signup(username, password);

    if (success) {
      showNotification('Account created successfully!', 'success');
      navigate('/dashboard');
    } else {
      showNotification('Username already exists', 'error');
    }
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyber-black p-4">
      {/* Background circuit-like grid */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-cyber-blue-glow" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-cyber-blue-glow" />
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-cyber-blue-glow" />
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-cyber-blue-glow" />

        {/* Grid lines */}
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className={`w-full max-w-md overflow-hidden border border-${themeColor}-glow bg-cyber-black/80 backdrop-blur-sm`}>
        {/* Header tabs */}
        <div className="flex">
          <button
            className={`flex-1 py-4 text-center transition-all duration-300 ${
              isLogin
                ? `bg-${themeColor}-glow/10 text-${themeColor}-glow`
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button
            className={`flex-1 py-4 text-center transition-all duration-300 ${
              !isLogin
                ? `bg-${themeColor}-glow/10 text-${themeColor}-glow`
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setIsLogin(false)}
          >
            SIGN UP
          </button>
        </div>

        {/* Form content */}
        <div className="p-6">
          <div className="mb-10 text-center">
            <h1 className={`text-3xl font-bold text-${themeColor}-glow`}>CYBERTASK</h1>
            <p className="mt-1 text-gray-400">Level up your productivity</p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            <div className="mb-4">
              <label htmlFor="username" className="mb-1 block text-sm text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full border border-${themeColor}-glow/50 bg-cyber-black/50 p-3 text-white focus:border-${themeColor}-glow focus:outline-none`}
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="mb-1 block text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border border-${themeColor}-glow/50 bg-cyber-black/50 p-3 text-white focus:border-${themeColor}-glow focus:outline-none`}
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmedPassword" className="mb-1 block text-sm text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmedPassword"
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                  className={`w-full border border-${themeColor}-glow/50 bg-cyber-black/50 p-3 text-white focus:border-${themeColor}-glow focus:outline-none`}
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <div className="mt-8">
              <Button
                type="submit"
                variant="primary"
                fullWidth
              >
                {isLogin ? 'LOGIN' : 'SIGN UP'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-${themeColor}-light hover:text-${themeColor}-glow hover:underline`}
            >
              {isLogin ? 'Sign up now' : 'Login instead'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
