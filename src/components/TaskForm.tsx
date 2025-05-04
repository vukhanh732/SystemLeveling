import { useState, useEffect } from 'react';
// Import useAuthStore to get the userId
import { useThemeStore, useTaskStore, useNotificationStore, useAuthStore } from '../store';
import type { Task } from '../types';
import Button from './Button';
// Import the uuid library - make sure it's installed (npm install uuid @types/uuid)
import { v4 as uuidv4 } from 'uuid';

interface TaskFormProps {
  initialTask?: Task; // Task being edited (optional)
  onClose: () => void; // Function to close the form/modal
  isEditing?: boolean; // Flag indicating if we are editing or adding
}

const TaskForm = ({ initialTask, onClose, isEditing = false }: TaskFormProps) => {
  // --- Hooks ---
  const { theme } = useThemeStore();
  const { addTask, updateTask } = useTaskStore(); // Get functions from your Zustand store
  const { showNotification } = useNotificationStore();
  // Get user information from the auth store
  const { user } = useAuthStore(); // Assuming your auth store provides a 'user' object with an 'id'

  // --- State for Form Fields ---
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask?.priority || 'medium');
  const [xpReward, setXpReward] = useState(initialTask?.xpReward || 20);
  // State for deadline input (string format YYYY-MM-DDTHH:mm)
  const [deadline, setDeadline] = useState('');

  // --- Deadline Calculation and Formatting ---
  // Calculate minimum allowed datetime (e.g., 5 mins from now)
  const minDateTime = new Date();
  minDateTime.setMinutes(minDateTime.getMinutes() + 5);
  // Format for the 'min' attribute of datetime-local input
  const minDateTimeString = minDateTime.toISOString().slice(0, 16);

  // Effect to set the initial deadline value when the component mounts or initialTask changes
  useEffect(() => {
    if (initialTask?.deadline) {
      // If editing and a deadline exists, format it for the input
      try {
        const deadlineDate = new Date(initialTask.deadline);
        // Ensure the date is valid before formatting
        if (!isNaN(deadlineDate.getTime())) {
            // Format as YYYY-MM-DDTHH:mm for datetime-local input
            const formattedDate = deadlineDate.toISOString().slice(0, 16);
            setDeadline(formattedDate);
        } else {
             console.warn("Initial task deadline is invalid:", initialTask.deadline);
             // Set a default future date if initial is invalid
             const defaultDate = new Date();
             defaultDate.setDate(defaultDate.getDate() + 1); // Tomorrow
             defaultDate.setHours(9, 0, 0, 0); // 9 AM
             setDeadline(defaultDate.toISOString().slice(0, 16));
        }
      } catch (error) {
          console.error("Error processing initial task deadline:", error);
          // Fallback to default if parsing fails
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 1);
          defaultDate.setHours(9, 0, 0, 0);
          setDeadline(defaultDate.toISOString().slice(0, 16));
      }
    } else if (!isEditing) {
      // If adding a new task, default to tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setDeadline(tomorrow.toISOString().slice(0, 16));
    }
    // Only run when initialTask changes (or on mount if initialTask is initially provided)
    // Adding isEditing dependency to handle switching between add/edit modes if the form stays mounted
  }, [initialTask, isEditing]);

  // --- Form Submission Logic ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // --- Input Validation ---
    if (!user) { // Check if user is logged in
        showNotification('You must be logged in to add tasks.', 'error');
        return;
    }
    if (!title.trim()) {
      showNotification('Task title cannot be empty.', 'error');
      return;
    }
    if (!deadline) {
      showNotification('Task deadline is required.', 'error');
      return;
    }

    let deadlineDate: Date;
    try {
        // Convert the input string back to a Date object
        deadlineDate = new Date(deadline);
         if (isNaN(deadlineDate.getTime())) {
             throw new Error("Invalid date format");
         }
    } catch (error) {
        showNotification('Invalid deadline format.', 'error');
        return;
    }


    // Check if deadline is in the past
    if (deadlineDate <= new Date()) {
      showNotification('Deadline must be set in the future.', 'error');
      return;
    }

    // --- Prepare Task Data ---
    // Convert deadline back to ISO string format for storage
    const deadlineISO = deadlineDate.toISOString();

    try {
        if (isEditing && initialTask) {
          // --- Update Existing Task ---
          // Construct the updated task object, ensuring all required fields are present
          // userId should already exist on initialTask, so spreading covers it.
          const updatedTaskData: Task = {
            ...initialTask, // Spread existing task data first (includes id, userId, completed, createdAt)
            title: title.trim(), // Use trimmed title
            description,
            priority,
            deadline: deadlineISO, // Use ISO string format
            xpReward,
          };
          updateTask(initialTask.id, updatedTaskData); // Pass ID and the full updated task object
          showNotification('Task updated successfully!', 'success');

        } else {
          // --- Add New Task ---
          // Construct the new task object
          const newTask: Task = { // Use the Task type directly now
            id: uuidv4(), // Generate a unique ID here using uuid
            userId: user.id, // **Add the userId from the auth store**
            title: title.trim(),
            description,
            priority,
            deadline: deadlineISO, // Use ISO string format
            xpReward,
            completed: false, // New tasks are not completed
            createdAt: new Date().toISOString(), // Optional: Add creation timestamp
          };
          addTask(newTask); // Add the new task
          showNotification('Task added successfully!', 'success');
        }

        onClose(); // Close the form/modal on successful submission
    } catch (error) {
         console.error("Error saving task:", error);
         showNotification(`Error saving task: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  // --- Theme Color Logic ---
  const getThemeColor = () => {
    switch (theme) {
      case 'green': return 'cyber-green';
      case 'red': return 'cyber-red';
      case 'purple': return 'cyber-purple';
      default: return 'cyber-blue';
    }
  };
  const themeColor = getThemeColor();

  // --- Priority Button Styling Logic ---
  const getPriorityStyle = (level: 'low' | 'medium' | 'high') => {
    const baseStyle = `flex h-10 w-24 cursor-pointer items-center justify-center border transition-colors duration-200 rounded-sm`; // Added rounded-sm here too
    const selected = priority === level;
    let colorStyle = '';

    if (selected) {
        switch (level) {
            case 'low': colorStyle = `border-cyber-green-glow bg-cyber-green-glow/10 text-cyber-green-light`; break; // Green for Low
            case 'medium': colorStyle = `border-${themeColor}-glow bg-${themeColor}-glow/10 text-${themeColor}-light`; break; // Theme for Medium
            case 'high': colorStyle = `border-cyber-red-glow bg-cyber-red-glow/10 text-cyber-red-light`; break; // Red for High
        }
    } else {
        colorStyle = 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300';
    }
    return `${baseStyle} ${colorStyle}`;
  };


  // --- JSX ---
  return (
    // Modal container
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-black/80 backdrop-blur-sm p-4">
      {/* Form Card */}
      <div className={`w-full max-w-md border border-${themeColor}-glow bg-cyber-black/90 p-6 shadow-${themeColor}-sm rounded-md`}> {/* Added rounded-md */}
        <h2 className={`mb-6 text-xl font-bold text-${themeColor}-glow`}>
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </h2>

        {/* Form element */}
        <form onSubmit={handleSubmit} noValidate> {/* Added noValidate to rely on custom validation */}
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="mb-1 block text-sm text-gray-300">
              Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // Use template literals for dynamic classes to ensure Tailwind picks them up
              className={`w-full border bg-cyber-black/50 p-2 text-white focus:outline-none rounded-sm ${
                theme === 'green' ? 'border-cyber-green-glow/50 focus:border-cyber-green-glow' :
                theme === 'red' ? 'border-cyber-red-glow/50 focus:border-cyber-red-glow' :
                theme === 'purple' ? 'border-cyber-purple-glow/50 focus:border-cyber-purple-glow' :
                'border-cyber-blue-glow/50 focus:border-cyber-blue-glow' // Default blue
              }`}
              placeholder="Enter task title"
              required // Basic HTML5 validation
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-4">
            <label htmlFor="description" className="mb-1 block text-sm text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
               className={`w-full border bg-cyber-black/50 p-2 text-white focus:outline-none rounded-sm ${
                theme === 'green' ? 'border-cyber-green-glow/50 focus:border-cyber-green-glow' :
                theme === 'red' ? 'border-cyber-red-glow/50 focus:border-cyber-red-glow' :
                theme === 'purple' ? 'border-cyber-purple-glow/50 focus:border-cyber-purple-glow' :
                'border-cyber-blue-glow/50 focus:border-cyber-blue-glow' // Default blue
              }`}
              placeholder="Optional: Add more details"
              rows={3}
            />
          </div>

          {/* Deadline Input */}
          <div className="mb-4">
            <label htmlFor="deadline" className="mb-1 block text-sm text-gray-300">
              Deadline*
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              min={minDateTimeString} // Set minimum allowed date/time
              onChange={(e) => setDeadline(e.target.value)}
               className={`w-full border bg-cyber-black/50 p-2 text-white focus:outline-none rounded-sm appearance-none ${ // Added appearance-none
                theme === 'green' ? 'border-cyber-green-glow/50 focus:border-cyber-green-glow' :
                theme === 'red' ? 'border-cyber-red-glow/50 focus:border-cyber-red-glow' :
                theme === 'purple' ? 'border-cyber-purple-glow/50 focus:border-cyber-purple-glow' :
                'border-cyber-blue-glow/50 focus:border-cyber-blue-glow' // Default blue
              }`}
              required
            />
          </div>

          {/* Priority Selection */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-300">Priority</label> {/* Increased margin-bottom */}
            <div className="flex flex-wrap gap-2 sm:space-x-4 sm:flex-nowrap sm:gap-0"> {/* Added flex-wrap and gap for smaller screens */}
              {(['low', 'medium', 'high'] as const).map((level) => (
                 <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={priority === level}
                      onChange={() => setPriority(level)}
                      className="sr-only" // Hide actual radio button, style the div
                    />
                    <div className={getPriorityStyle(level)}> {/* Use function for styles */}
                      {level.charAt(0).toUpperCase() + level.slice(1)} {/* Capitalize */}
                    </div>
                  </label>
              ))}
            </div>
          </div>

          {/* XP Reward Slider */}
          <div className="mb-6">
            <label htmlFor="xpReward" className="mb-1 block text-sm text-gray-300">
              XP Reward: <span className={`font-bold text-${themeColor}-light`}>{xpReward}</span> {/* Highlight value */}
            </label>
            <input
              type="range"
              id="xpReward"
              min={10}
              max={100}
              step={5}
              value={xpReward}
              onChange={(e) => setXpReward(Number.parseInt(e.target.value))}
              // Use theme color for the slider accent
              className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${themeColor}-glow`}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button" // Important: type="button" prevents form submission
              variant="secondary"
              onClick={onClose} // Call the passed-in close handler
            >
              Cancel
            </Button>
            <Button
              type="submit" // This button submits the form
              variant="primary"
            >
              {isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
