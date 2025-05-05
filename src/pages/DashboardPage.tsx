import { useState, useEffect } from 'react';
import { FaPlus, FaTrophy, FaBolt, FaClock, FaCalendarCheck, FaBullseye } from 'react-icons/fa'; // Added FaBullseye
// Import getActiveDailyQuests selector
import { useTaskStore, useAuthStore, useThemeStore, getXpForNextLevel } from '../store';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import DailyQuestTimer from '../components/DailyQuestTimer'; // Import the new timer component
// Only import the base Task type
import type { Task } from '../types';

const DashboardPage = () => {
  const { user } = useAuthStore();
  // Use the specific selector for daily quests
  // Note: getActiveDailyQuests returns Task[] now, we filter/check the flag in the component
  const { getTodaysTasks, getExpiredTasks, getActiveDailyQuests } = useTaskStore();
  const { theme } = useThemeStore();

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [expiredTasks, setExpiredTasks] = useState<Task[]>([]);
  // State for active daily quests
  const [activeDailyQuests, setActiveDailyQuests] = useState<Task[]>([]); // Store as Task[]

  // Fetch tasks periodically, including daily quests
  useEffect(() => {
    if (!user?.id) return; // Don't fetch if no user

    const fetchTasks = () => {
        console.log("Dashboard: Fetching tasks for user:", user.id);
        // Pass userId to selectors
        setTodaysTasks(getTodaysTasks(user.id));
        setExpiredTasks(getExpiredTasks(user.id));
        setActiveDailyQuests(getActiveDailyQuests(user.id));
    };

    fetchTasks(); // Initial fetch

    // Refresh tasks periodically
    const intervalId = setInterval(fetchTasks, 60000); // Refresh every minute

    return () => clearInterval(intervalId); // Cleanup interval on unmount
    // Add user.id to dependencies to refetch if user changes
  }, [user?.id, getTodaysTasks, getExpiredTasks, getActiveDailyQuests]);

  const getThemeColor = () => {
    switch (theme) {
      case 'green': return 'cyber-green';
      case 'red': return 'cyber-red';
      case 'purple': return 'cyber-purple';
      default: return 'cyber-blue';
    }
  };
  const themeColor = getThemeColor();

  // Calculate next level XP requirements
  const currentXp = user?.xp || 0;
  const currentLevel = user?.level || 0;
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const xpProgress = nextLevelXp > 0 ? Math.min((currentXp / nextLevelXp) * 100, 100) : 100; // Avoid division by zero

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTask(true);
  };

  const handleCloseForm = () => {
    setShowAddTask(false);
    setEditingTask(null);
    // Refresh tasks immediately after closing form
    if (user?.id) {
        setTodaysTasks(getTodaysTasks(user.id));
        setExpiredTasks(getExpiredTasks(user.id));
        setActiveDailyQuests(getActiveDailyQuests(user.id));
    }
  };

  // Get the deadline for the timer (assuming all daily quests have the same deadline)
  const dailyQuestDeadline = activeDailyQuests.length > 0 ? activeDailyQuests[0].deadline : null;

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Header section */}
        <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.username}</p>
          </div>
          {/* Daily Quest Timer */}
          {dailyQuestDeadline && (
             <DailyQuestTimer deadline={dailyQuestDeadline} />
          )}
          <button
            onClick={() => setShowAddTask(true)}
            className={`flex items-center justify-center rounded-sm border border-${themeColor}-glow bg-${themeColor}-glow/10 px-4 py-2 text-${themeColor}-light transition-all duration-300 hover:bg-${themeColor}-glow/20`}
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
                <div className="h-2 w-full max-w-[8rem] overflow-hidden rounded-full bg-gray-700"> {/* Adjusted width */}
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

          {/* Active Daily Quests card */}
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-4 backdrop-blur-sm`}>
             <div className="mb-3 flex justify-between">
               <h3 className="font-medium text-gray-400">Daily Quests</h3>
               <FaBullseye className={`text-${themeColor}-glow`} />
             </div>
             <p className={`text-3xl font-bold text-${themeColor}-glow`}>
               {activeDailyQuests.length}
             </p>
             <p className="mt-1 text-xs text-gray-400">
               {activeDailyQuests.filter(task => task.completed).length} completed today
             </p>
           </div>

          {/* XP to earn card (consider including daily quests) */}
          <div className={`border border-${themeColor}-glow/50 bg-cyber-black/50 p-4 backdrop-blur-sm`}>
            <div className="mb-3 flex justify-between">
              <h3 className="font-medium text-gray-400">XP Available Today</h3>
              <FaBolt className={`text-${themeColor}-glow`} />
            </div>
             {/* Calculate XP from pending daily AND regular tasks for today */}
             <p className={`text-3xl font-bold text-${themeColor}-glow`}>
               {[...activeDailyQuests, ...todaysTasks] // Combine lists
                 .filter(task => !task.completed && !expiredTasks.some(et => et.id === task.id)) // Filter unique pending tasks
                 .reduce((sum, task) => sum + task.xpReward, 0)}
             </p>
            <p className="mt-1 text-xs text-gray-400">
               From {activeDailyQuests.filter(t => !t.completed).length + todaysTasks.filter(t => !t.completed).length} tasks
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

        {/* Daily Quests Section */}
        <div className="mb-8">
           <h2 className="mb-4 text-xl font-bold text-white">Daily Quests</h2>
           {activeDailyQuests.length === 0 ? (
             <div className="flex h-32 flex-col items-center justify-center border border-dashed border-gray-700 p-6 text-center">
               <p className="text-gray-400">No active daily quests. Check back tomorrow!</p>
             </div>
           ) : (
             <div className="space-y-4">
               {activeDailyQuests.map(task => (
                 // Pass task directly, TaskCard uses Task type
                 <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
               ))}
             </div>
           )}
         </div>

        {/* Today's Manually Added tasks */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-white">Other Tasks Due Today</h2>
          {/* Filter out daily quests from the 'todaysTasks' list */}
          {/* --- FIX: Access t.isDailyQuest directly --- */}
          {todaysTasks.filter(t => !t.isDailyQuest).length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center border border-dashed border-gray-700 p-6 text-center">
              <p className="text-gray-400">No other tasks scheduled for today</p>
              <button
                onClick={() => setShowAddTask(true)}
                className={`mt-2 text-sm text-${themeColor}-light hover:text-${themeColor}-glow hover:underline`}
              >
                Add a new task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysTasks
                // --- FIX: Access t.isDailyQuest directly ---
                .filter(t => !t.isDailyQuest) // Exclude daily quests here
                .map(task => (
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
