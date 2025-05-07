import { useState, useEffect } from 'react';
import { FaPlus, FaFilter, FaCheck, FaHourglass, FaClock } from 'react-icons/fa';
// Import useAuthStore
import { useTaskStore, useThemeStore, useAuthStore } from '../store';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import type { Task } from '../types';

type TaskFilter = 'all' | 'pending' | 'completed' | 'expired';

const TasksPage = () => {
  // Get user from auth store
  const { user } = useAuthStore();
  // Destructure selectors and the base tasks array (though we'll prefer selectors)
  const { tasks, getPendingTasks, getCompletedTasks, getExpiredTasks, getTasksByUserId } = useTaskStore();
  const { theme } = useThemeStore();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Only filter tasks if user.id exists
    if (!user?.id) {
        setFilteredTasks([]); // Clear tasks if no user
        return;
    }

    console.log(`TasksPage: Filtering tasks with filter '${filter}' for user:`, user.id);
    // Apply filters using user.id
    let tasksToDisplay: Task[] = [];
    switch (filter) {
      case 'pending':
        // --- FIX: Pass user.id ---
        tasksToDisplay = getPendingTasks(user.id);
        break;
      case 'completed':
        // --- FIX: Pass user.id ---
        tasksToDisplay = getCompletedTasks(user.id);
        break;
      case 'expired':
        // --- FIX: Pass user.id ---
        tasksToDisplay = getExpiredTasks(user.id);
        break;
      case 'all':
      default:
        // --- FIX: Use selector with user.id for 'all' filter ---
        tasksToDisplay = getTasksByUserId(user.id); // Get all tasks specifically for this user
        break;
    }
    setFilteredTasks(tasksToDisplay);

    // Add user?.id to dependency array
  }, [filter, user?.id, tasks, getPendingTasks, getCompletedTasks, getExpiredTasks, getTasksByUserId]); // Added tasks here too, so it refilters if the base task list changes

  const getThemeColor = () => {
    switch (theme) {
      case 'green': return 'cyber-green';
      case 'red': return 'cyber-red';
      case 'purple': return 'cyber-purple';
      default: return 'cyber-blue';
    }
  };
  const themeColor = getThemeColor();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddTask(true);
  };

  const handleCloseForm = () => {
    setShowAddTask(false);
    setEditingTask(null);
    // No need to manually refresh here, the useEffect will refilter when `tasks` state changes in the store
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Header section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">All Tasks</h1>
            <p className="text-gray-400">
              {filter === 'all' && 'Showing all tasks'}
              {filter === 'pending' && 'Showing pending tasks'}
              {filter === 'completed' && 'Showing completed tasks'}
              {filter === 'expired' && 'Showing expired tasks'}
            </p>
          </div>

          <button
            onClick={() => setShowAddTask(true)}
            className={`mt-4 flex items-center justify-center rounded-sm border border-${themeColor}-glow bg-${themeColor}-glow/10 px-4 py-2 text-${themeColor}-light transition-all duration-300 hover:bg-${themeColor}-glow/20 md:mt-0`}
          >
            <FaPlus className="mr-2" />
            New Task
          </button>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center rounded-sm border px-4 py-2 transition-all duration-300 ${
              filter === 'all'
                ? `border-${themeColor}-glow bg-${themeColor}-glow/10 text-${themeColor}-light`
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
            }`}
          >
            <FaFilter className="mr-2" />
            All
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`flex items-center rounded-sm border px-4 py-2 transition-all duration-300 ${
              filter === 'pending'
                ? `border-${themeColor}-glow bg-${themeColor}-glow/10 text-${themeColor}-light`
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
            }`}
          >
            <FaHourglass className="mr-2" />
            Pending
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`flex items-center rounded-sm border px-4 py-2 transition-all duration-300 ${
              filter === 'completed'
                ? 'border-cyber-green-glow bg-cyber-green-glow/10 text-cyber-green-light'
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
            }`}
          >
            <FaCheck className="mr-2" />
            Completed
          </button>

          <button
            onClick={() => setFilter('expired')}
            className={`flex items-center rounded-sm border px-4 py-2 transition-all duration-300 ${
              filter === 'expired'
                ? 'border-cyber-red-glow bg-cyber-red-glow/10 text-cyber-red-light'
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
            }`}
          >
            <FaClock className="mr-2" />
            Expired
          </button>
        </div>

        {/* Tasks list */}
        {filteredTasks.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center border border-dashed border-gray-700 p-6 text-center">
            <p className="text-gray-400">No tasks found for this filter</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className={`mt-2 text-sm text-${themeColor}-light hover:text-${themeColor}-glow hover:underline`}
              >
                Show all tasks
              </button>
            )}
            <button
              onClick={() => setShowAddTask(true)}
              className={`mt-2 text-sm text-${themeColor}-light hover:text-${themeColor}-glow hover:underline`}
            >
              Add a new task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
            ))}
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

export default TasksPage;
