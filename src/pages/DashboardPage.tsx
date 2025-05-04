import { useState, useEffect } from 'react';
import { FaPlus, FaTrophy, FaBolt, FaClock, FaCalendarCheck } from 'react-icons/fa';
import { useTaskStore, useAuthStore, useThemeStore, getXpForNextLevel } from '../store';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import type { Task } from '../types';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { getTodaysTasks, getExpiredTasks } = useTaskStore();
  const { theme } = useThemeStore();

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [expiredTasks, setExpiredTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch tasks
    setTodaysTasks(getTodaysTasks());
    setExpiredTasks(getExpiredTasks());

    // Refresh tasks periodically
    const intervalId = setInterval(() => {
      setTodaysTasks(getTodaysTasks());
      setExpiredTasks(getExpiredTasks());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [getTodaysTasks, getExpiredTasks]);

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

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTask(true);
  };

  const handleCloseForm = () => {
    setShowAddTask(false);
    setEditingTask(null);

    // Refresh tasks after edit/add
    setTodaysTasks(getTodaysTasks());
    setExpiredTasks(getExpiredTasks());
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.username}</p>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            className={`mt-4 flex items-center justify-center rounded-sm border border-${themeColor}-glow bg-${themeColor}-glow/10 px-4 py-2 text-${themeColor}-light transition-all duration-300 hover:bg-${themeColor}-glow/20 md:mt-0`}
          >
            <FaPlus className="mr-2" />
            New Task
          </button>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Level card */}
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-4 backdrop-blur-sm`}>
            <div className="mb-3 flex justify-between">
              <h3 className="font-medium text-gray-400">Level</h3>
              <FaTrophy className={`text-${themeColor}-glow`} />
            </div>
            <div className="flex items-end">
              <p className={`text-3xl font-bold text-${themeColor}-glow`}>{currentLevel}</p>
              <div className="ml-auto">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className={`h-full bg-${themeColor}-glow transition-all duration-500`}
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-gray-400">
                  {currentXp}/{nextLevelXp} XP
                </p>
              </div>
            </div>
          </div>

          {/* Tasks today card */}
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-4 backdrop-blur-sm`}>
            <div className="mb-3 flex justify-between">
              <h3 className="font-medium text-gray-400">Today's Tasks</h3>
              <FaCalendarCheck className={`text-${themeColor}-glow`} />
            </div>
            <p className={`text-3xl font-bold text-${themeColor}-glow`}>
              {todaysTasks.length}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {todaysTasks.filter(task => task.completed).length} completed
            </p>
          </div>

          {/* XP to earn card */}
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-4 backdrop-blur-sm`}>
            <div className="mb-3 flex justify-between">
              <h3 className="font-medium text-gray-400">XP to Earn</h3>
              <FaBolt className={`text-${themeColor}-glow`} />
            </div>
            <p className={`text-3xl font-bold text-${themeColor}-glow`}>
              {todaysTasks.filter(task => !task.completed).reduce((sum, task) => sum + task.xpReward, 0)}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              From {todaysTasks.filter(task => !task.completed).length} tasks
            </p>
          </div>

          {/* Expired tasks card */}
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-4 backdrop-blur-sm`}>
            <div className="mb-3 flex justify-between">
              <h3 className="font-medium text-gray-400">Expired</h3>
              <FaClock className={`text-${themeColor}-glow`} />
            </div>
            <p className={`text-3xl font-bold text-${themeColor}-glow`}>
              {expiredTasks.length}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              XP lost: {expiredTasks.reduce((sum, task) => sum + task.xpReward, 0)}
            </p>
          </div>
        </div>

        {/* Today's tasks */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-white">Today's Tasks</h2>

          {todaysTasks.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center border border-dashed border-gray-700 p-6 text-center">
              <p className="text-gray-400">No tasks scheduled for today</p>
              <button
                onClick={() => setShowAddTask(true)}
                className={`mt-2 text-sm text-${themeColor}-light hover:text-${themeColor}-glow hover:underline`}
              >
                Add a new task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysTasks.map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          )}
        </div>

        {/* Expired tasks */}
        {expiredTasks.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">Expired Tasks</h2>
            <div className="space-y-4">
              {expiredTasks.map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
        )}

        {/* Task form modal */}
        {showAddTask && (
          <TaskForm
            initialTask={editingTask || undefined}
            onClose={handleCloseForm}
            isEditing={!!editingTask}
          />
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
