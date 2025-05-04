import { useState, useEffect } from 'react';
import { useTaskStore, useThemeStore } from '../store';
import { FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types';

// Group tasks by date
const groupTasksByDate = (tasks: Task[]) => {
  const grouped: Record<string, Task[]> = {};

  tasks.forEach(task => {
    const date = new Date(task.deadline).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(task);
  });

  // Sort dates in reverse order (newest first)
  return Object.entries(grouped)
    .sort((a, b) => {
      const dateA = new Date(a[0]).getTime();
      const dateB = new Date(b[0]).getTime();
      return dateB - dateA;
    })
    .map(([date, tasks]) => ({ date, tasks }));
};

const HistoryPage = () => {
  const { getCompletedTasks } = useTaskStore();
  const { theme } = useThemeStore();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<{ date: string; tasks: Task[] }[]>([]);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  useEffect(() => {
    const tasks = getCompletedTasks();
    setCompletedTasks(tasks);

    // Group tasks by date
    setGroupedTasks(groupTasksByDate(tasks));

    // Calculate total XP earned
    setTotalXpEarned(tasks.reduce((sum, task) => sum + task.xpReward, 0));
  }, [getCompletedTasks]);

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
