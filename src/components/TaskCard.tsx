import { FaEdit, FaTrash, FaCheck, FaClock } from 'react-icons/fa';
import type { Task } from '../types';
import { useTaskStore, useThemeStore, useNotificationStore } from '../store';
import Button from './Button';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

// Format date as hours and minutes (e.g., "14:30")
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date as a human-readable string (e.g., "Today", "Tomorrow", "May 5")
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  } else if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Returns time remaining in a friendly format
const getTimeRemaining = (deadlineString: string) => {
  const now = new Date();
  const deadline = new Date(deadlineString);
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Expired';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'}`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'}`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }
};

// Returns a status badge based on task status and deadline
const getStatusBadge = (task: Task, theme: string) => {
  const themeColor = (() => {
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
  })();

  if (task.completed) {
    return <span className="bg-cyber-green-glow/20 text-cyber-green-light text-xs py-1 px-2 rounded-sm">Completed</span>;
  }

  const now = new Date();
  const deadline = new Date(task.deadline);
  const isPastDue = deadline < now;

  if (isPastDue) {
    return <span className="bg-cyber-red-glow/20 text-cyber-red-light text-xs py-1 px-2 rounded-sm animate-pulse">Expired</span>;
  }

  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 2) {
    return <span className="bg-cyber-red-glow/20 text-cyber-red-light text-xs py-1 px-2 rounded-sm">Urgent</span>;
  } else if (diffHours < 24) {
    return <span className="bg-cyber-purple-glow/20 text-cyber-purple-light text-xs py-1 px-2 rounded-sm">Due Today</span>;
  } else {
    return <span className={`bg-${themeColor}-glow/20 text-${themeColor}-light text-xs py-1 px-2 rounded-sm`}>Upcoming</span>;
  }
};

const getTaskClass = (priority: string, theme: string) => {
  const themeColor = (() => {
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
  })();

  const baseClass = `relative border backdrop-blur-sm transition-all duration-300 p-4 mb-4 hover:translate-x-1 bg-cyber-black/50 shadow-sm`;

  switch (priority) {
    case 'high':
      return `${baseClass} border-cyber-red-glow/70 shadow-neon-red-sm`;
    case 'medium':
      return `${baseClass} border-cyber-purple-glow/70 shadow-neon-purple-sm`;
    case 'low':
    default:
      return `${baseClass} border-${themeColor}-glow/50 hover:border-${themeColor}-glow/70`;
  }
};

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { deleteTask, completeTask } = useTaskStore();
  const { theme } = useThemeStore();
  const { showNotification } = useNotificationStore();

  const handleComplete = () => {
    if (!task.completed) {
      completeTask(task.id);
      showNotification(`Task completed! You earned ${task.xpReward} XP`, 'success');
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    showNotification('Task deleted', 'info');
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <div className={getTaskClass(task.priority, theme)}>
      {/* Priority indicator with dot */}
      <div className="absolute left-0 top-0 bottom-0 w-1">
        {task.priority === 'high' && <div className="absolute inset-0 bg-cyber-red-glow/70" />}
        {task.priority === 'medium' && <div className="absolute inset-0 bg-cyber-purple-glow/70" />}
        {task.priority === 'low' && <div className="absolute inset-0 bg-cyber-blue-glow/50" />}
      </div>

      {/* Task content */}
      <div className="pl-2">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
              {task.title}
            </h3>
            <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
              {task.description}
            </p>
          </div>
          <div className="flex flex-col items-end">
            {getStatusBadge(task, theme)}
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <FaClock className="mr-1" />
              {formatDate(task.deadline)}, {formatTime(task.deadline)}
            </p>
          </div>
        </div>

        {/* Task footer with deadline and actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="flex items-center text-xs text-cyber-blue-light">
              XP: <span className="font-bold ml-1">{task.xpReward}</span>
            </span>
            {!task.completed && (
              <span className="ml-4 text-xs text-gray-400">
                Time left: {getTimeRemaining(task.deadline)}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            {!task.completed && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleComplete}
                  title="Mark as completed"
                >
                  <FaCheck />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEdit}
                  title="Edit task"
                >
                  <FaEdit />
                </Button>
              </>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              title="Delete task"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
