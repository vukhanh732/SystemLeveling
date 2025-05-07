import { useState, useEffect } from 'react';
// Import useAuthStore
import { useTaskStore, useThemeStore, useAuthStore } from '../store';
import { FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types';

// Group tasks by date (assuming this function is correct)
const groupTasksByDate = (tasks: Task[]) => {
  const grouped: Record<string, Task[]> = {};

  tasks.forEach(task => {
    // Handle potential invalid dates gracefully
    try {
        const date = new Date(task.deadline).toLocaleDateString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(task);
    } catch (e) {
        console.error("Error parsing date for grouping:", task.deadline, e);
    }
  });

  // Sort dates in reverse order (newest first)
  return Object.entries(grouped)
    .sort((a, b) => {
      const dateA = new Date(a[0]).getTime();
      const dateB = new Date(b[0]).getTime();
      // Handle potential NaN from invalid dates during sort
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return dateB - dateA;
    })
    .map(([date, tasks]) => ({ date, tasks }));
};

const HistoryPage = () => {
  // Get user from auth store
  const { user } = useAuthStore();
  const { getCompletedTasks } = useTaskStore();
  const { theme } = useThemeStore();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<{ date: string; tasks: Task[] }[]>([]);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  useEffect(() => {
    // Only fetch tasks if the user object and user.id exist
    if (user?.id) {
      console.log("HistoryPage: Fetching completed tasks for user:", user.id);
      // --- FIX: Pass user.id to the selector ---
      const tasks = getCompletedTasks(user.id);
      setCompletedTasks(tasks);

      // Group tasks by date
      setGroupedTasks(groupTasksByDate(tasks));

      // Calculate total XP earned
      setTotalXpEarned(tasks.reduce((sum, task) => sum + task.xpReward, 0));
    } else {
        // Clear tasks if user logs out
        setCompletedTasks([]);
        setGroupedTasks([]);
        setTotalXpEarned(0);
        console.log("HistoryPage: No user logged in, clearing tasks.");
    }
    // Add user?.id to dependency array to refetch when user changes
  }, [user?.id, getCompletedTasks]);

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
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Task History</h1>
            <p className="text-gray-400">Your completed tasks</p>
          </div>

          <div className={`mt-4 flex items-center space-x-2 rounded-sm border border-${themeColor}-glow bg-${themeColor}-glow/10 px-4 py-2 md:mt-0`}>
            <FaTrophy className={`text-${themeColor}-glow`} />
            <span className={`ml-2 text-${themeColor}-light`}>
              Total XP Earned: <span className="font-bold">{totalXpEarned}</span>
            </span>
          </div>
        </div>

        {/* Completed tasks by date */}
        {completedTasks.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center border border-dashed border-gray-700 p-6 text-center">
            <p className="text-gray-400">No completed tasks yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Complete tasks to see them in your history
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedTasks.map(({ date, tasks }) => (
              <div key={date}>
                <div className="mb-4 flex items-center">
                  <FaCalendarAlt className={`mr-2 text-${themeColor}-glow`} />
                  <h2 className="text-lg font-semibold text-white">{date}</h2>
                  <div className={`ml-4 rounded-full bg-${themeColor}-glow/10 px-2 py-1 text-xs text-${themeColor}-light`}>
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="space-y-4">
                  {tasks.map(task => (
                    // Pass onEdit={undefined} or remove if TaskCard handles it being optional
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
