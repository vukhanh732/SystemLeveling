import { useState, useEffect } from 'react';
import { FaHourglassHalf } from 'react-icons/fa';
import { useThemeStore } from '../store'; // To match theme color

interface DailyQuestTimerProps {
  deadline: string; // ISO string for midnight deadline
}

const DailyQuestTimer = ({ deadline }: DailyQuestTimerProps) => {
  const { theme } = useThemeStore();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(deadline); // Use the passed deadline
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(timerId); // Stop timer when deadline passes
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    // Calculate immediately on mount
    calculateTimeLeft();

    // Update every second
    const timerId = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, [deadline]); // Rerun effect if the deadline prop changes

  const getThemeColor = () => {
    switch (theme) {
      case 'green': return 'cyber-green';
      case 'red': return 'cyber-red';
      case 'purple': return 'cyber-purple';
      default: return 'cyber-blue';
    }
  };
  const themeColor = getThemeColor();

  return (
    <div className={`flex items-center space-x-2 border border-${themeColor}-glow/50 bg-cyber-black/50 px-3 py-1 rounded-sm text-${themeColor}-light`}>
      <FaHourglassHalf className={`text-${themeColor}-glow`} />
      <span className="font-mono text-sm font-semibold tracking-wider">{timeLeft}</span>
      <span className="text-xs text-gray-400">until reset</span>
    </div>
  );
};

export default DailyQuestTimer;
