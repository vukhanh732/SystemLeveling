import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
// Make sure User type includes level and id
import type { Task, User } from '../types';
import useAuthStore from './authStore'; // Use the default export if that's how authStore is set up

// --- Daily Quest Definitions ---

// Define the types of daily exercises
type DailyExerciseType = 'pushups' | 'plank' | 'run';

// Define the structure for a daily quest task
// **ACTION NEEDED**: Ensure your base 'Task' type in '../types' can accommodate these optional fields,
// or create a union type Task | DailyQuestTask.
interface DailyQuestTask extends Task {
  isDailyQuest: true;
  exerciseType: DailyExerciseType;
  requiredCount: number; // e.g., number of pushups, seconds for plank, km for run
}

// Define the base requirements and scaling factors
const dailyQuestConfig: Record<DailyExerciseType, { base: number; scalePerLevel: number; unit: string }> = {
  pushups: { base: 50, scalePerLevel: 10, unit: 'reps' },
  plank: { base: 60, scalePerLevel: 15, unit: 'seconds' }, // e.g., 60s base + 15s per level
  run: { base: 2, scalePerLevel: 0.5, unit: 'km' }, // e.g., 2km base + 0.5km per level
};

// Define potential surprise tasks
interface SurpriseTaskConfig {
    title: string;
    description: string;
    xpReward: number;
    rewardType?: 'badge' | 'item'; // Optional: Example reward types
    rewardValue?: string; // Optional: e.g., 'Early Bird Badge', 'Cyber Glow Theme'
}
const surpriseTasks: SurpriseTaskConfig[] = [
    { title: "Unexpected Challenge: Speed Read", description: "Read 3 articles on a new topic.", xpReward: 150, rewardType: 'badge', rewardValue: 'Speed Reader Badge' },
    { title: "Sudden Mission: Mindful Moment", description: "Meditate for 15 minutes without interruption.", xpReward: 120, rewardType: 'item', rewardValue: 'Calm Focus Aura' },
    { title: "System Glitch: Debug Your Space", description: "Spend 20 minutes decluttering your workspace.", xpReward: 100, rewardType: 'badge', rewardValue: 'Debugger Badge' },
];
const SURPRISE_TASK_CHANCE = 0.1; // 10% chance each day

// --- Updated TaskState Interface ---
// **ACTION NEEDED**: Ensure this matches or is merged with your definition in '../types'
interface TaskState {
  tasks: Task[];
  lastDailyQuestAssignedDate: string | null; // Store date as 'YYYY-MM-DD'

  // Actions
  addTask: (taskData: Omit<Task, 'id' | 'userId' | 'completed' | 'createdAt'>) => void; // Removed userId from input type as it's fetched internally
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => void; // Prevent userId update
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  assignDailyQuestIfNeeded: (user: User) => void; // Function to trigger daily assignment

  // Selectors - Now require userId
  getTasksByUserId: (userId: string) => Task[];
  getPendingTasks: (userId: string) => Task[];
  getCompletedTasks: (userId: string) => Task[];
  getExpiredTasks: (userId: string) => Task[];
  getTodaysTasks: (userId: string) => Task[];
  getActiveDailyQuests: (userId: string) => DailyQuestTask[]; // Renamed to get plural, returns array
}

// --- Utility Functions ---
const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

const getMidnightDeadline = (): string => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to upcoming midnight
    return midnight.toISOString();
};

// Helper to check if a date string is today
const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (e) {
    console.error("Error parsing date in isToday:", dateString, e);
    return false;
  }
};

// Helper to check if a date string is past due
const isPastDue = (dateString: string): boolean => {
   if (!dateString) return true; // Treat missing deadline as past due? Or handle differently?
   try {
        const date = new Date(dateString);
        const now = new Date();
        return date < now;
   } catch (e) {
       console.error("Error parsing date in isPastDue:", dateString, e);
       return true; // Treat parse error as past due
   }
};

// --- Zustand Store Implementation ---
const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      lastDailyQuestAssignedDate: null, // Initialize state

      // --- Actions ---
      addTask: (taskData) => {
        // Get userId from authStore *inside* the action
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          console.error("Cannot add task: User not logged in.");
          // Optionally show notification via notificationStore
          return;
        }

        const newTask: Task = {
          id: uuidv4(),
          userId, // Add the fetched userId
          completed: false,
          createdAt: new Date().toISOString(),
          ...taskData, // Spread the rest of the data (title, description, etc.)
        };

        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
        console.log("Manual Task added:", newTask);
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            // Ensure userId isn't accidentally overwritten
            task.id === id ? { ...task, ...updates, userId: task.userId } : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }));
      },

      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);

        if (task && !task.completed) {
          // Mark task as completed
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, completed: true } : t
            )
          }));
          console.log("Task marked complete:", task);

          // Award XP using the function from authStore
          const { levelUp } = useAuthStore.getState(); // Get levelUp function
           if (levelUp) {
               levelUp(task.xpReward); // Call the levelUp function
               console.log(`Awarded ${task.xpReward} XP for completing task ${task.id}`);
           } else {
               console.warn("levelUp function not found in authStore state.");
           }
        }
      },

      assignDailyQuestIfNeeded: (user) => {
        // Ensure user object is valid and has needed properties
        if (!user || !user.id || typeof user.level !== 'number') {
            console.error("Cannot assign daily quest: Invalid user object provided.", user);
            return;
        }

        const today = getTodayDateString();
        const lastDate = get().lastDailyQuestAssignedDate;
        const userLevel = user.level >= 1 ? user.level : 1; // Ensure level is at least 1

        console.log(`Checking daily quest assignment: Today is ${today}, Last assigned: ${lastDate}, User Level: ${userLevel}`);

        if (today !== lastDate) {
          console.log(`Assigning new daily quests for level ${userLevel}...`);
          const midnightDeadline = getMidnightDeadline();
          const newQuests: Task[] = []; // Array to hold all new quests for the day

          // --- Create Standard Daily Quests ---
          (Object.keys(dailyQuestConfig) as DailyExerciseType[]).forEach(type => {
             const config = dailyQuestConfig[type];
             // Calculate required count based on level, ensuring it's at least the base or 1
             const requiredCount = Math.max(1, Math.floor(config.base + (userLevel - 1) * config.scalePerLevel));
             const dailyTask: DailyQuestTask = { // Use interface for clarity
                id: uuidv4(),
                userId: user.id,
                title: `Daily: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
                description: `Complete ${requiredCount} ${config.unit}.`,
                priority: 'high',
                deadline: midnightDeadline,
                xpReward: 50 + (userLevel * 5), // Example XP scaling
                completed: false,
                createdAt: new Date().toISOString(),
                // --- Daily Quest Specific Fields ---
                isDailyQuest: true,
                exerciseType: type,
                requiredCount: requiredCount,
             };
             newQuests.push(dailyTask as Task); // Add as base Task type to the array
          });

          // --- Check for Surprise Task ---
          if (Math.random() < SURPRISE_TASK_CHANCE) {
                console.log("Assigning surprise task!");
                const surpriseConfig = surpriseTasks[Math.floor(Math.random() * surpriseTasks.length)];
                const surpriseTask: Task = { // Use base Task type
                    id: uuidv4(),
                    userId: user.id,
                    title: `Surprise: ${surpriseConfig.title}`,
                    description: surpriseConfig.description,
                    priority: 'medium',
                    deadline: midnightDeadline, // Give same deadline for simplicity
                    xpReward: surpriseConfig.xpReward,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    // Add custom fields for special rewards if needed by extending Task type or using a generic 'metadata' field
                    // metadata: { rewardType: surpriseConfig.rewardType, rewardValue: surpriseConfig.rewardValue }
                };
                newQuests.push(surpriseTask);
          }

          // --- Update State ---
          set((state) => {
             // Filter out old, *uncompleted* daily quests before adding new ones
             const existingTasks = state.tasks.filter(task => {
                const isDaily = (task as DailyQuestTask).isDailyQuest === true;
                // Keep if it's NOT a daily quest OR if it IS a daily quest AND it's completed
                return !isDaily || task.completed;
             });

             return {
                 tasks: [...existingTasks, ...newQuests], // Combine filtered existing tasks with new quests
                 lastDailyQuestAssignedDate: today, // Update the assignment date
             };
          });
          console.log("Daily/Surprise quests assigned:", newQuests);

        } else {
            console.log("Daily quest check: Already assigned for today or no user.");
        }
      },

      // --- Selectors (Now require userId) ---
      getTasksByUserId: (userId) => {
         if (!userId) return [];
         return get().tasks.filter(task => task.userId === userId);
      },

      getPendingTasks: (userId) => {
         if (!userId) return [];
         return get().tasks.filter(
           (task) => task.userId === userId && !task.completed && !isPastDue(task.deadline)
         );
      },

      getCompletedTasks: (userId) => {
         if (!userId) return [];
         return get().tasks.filter(
           (task) => task.userId === userId && task.completed
         );
      },

      getExpiredTasks: (userId) => {
         if (!userId) return [];
         return get().tasks.filter(
           (task) => task.userId === userId && !task.completed && isPastDue(task.deadline)
         );
      },

       getTodaysTasks: (userId) => {
            if (!userId) return [];
            // Keep your existing logic using isToday helper
            return get().tasks.filter(
                (task) => task.userId === userId && isToday(task.deadline)
            );
       },

       // Renamed to get *plural* as there can be multiple daily quests now
       getActiveDailyQuests: (userId): DailyQuestTask[] => {
            if (!userId) return [];
            // Find all tasks marked as daily quests for the user that aren't completed and haven't expired
            return get().tasks.filter(
                (task) => task.userId === userId &&
                         (task as DailyQuestTask).isDailyQuest === true &&
                         !task.completed &&
                         !isPastDue(task.deadline)
            ) as DailyQuestTask[]; // Cast the result to the specific type
       },

    }),
    {
      name: 'tasks-storage', // Ensure this matches your previous name if needed
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // Optional: Add migration logic if your Task structure changed significantly
    }
  )
);

// Example XP formula (can be placed here, in authStore, or utils)
export const getXpForNextLevel = (level: number): number => {
    // Example: Simple exponential growth
    return Math.floor(100 * Math.pow(1.5, level - 1));
};


export default useTaskStore;

// --- ACTION NEEDED ---
// In ../types/index.ts (or wherever your Task type is defined):
// Ensure the Task interface includes optional fields for daily quests:
/*
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string; // ISO String format
  xpReward: number;
  completed: boolean;
  createdAt: string; // ISO String format

  // Add these optional fields:
  isDailyQuest?: boolean;
  exerciseType?: 'pushups' | 'plank' | 'run'; // Or your defined types
  requiredCount?: number;
  // You might also add metadata for surprise task rewards
  // metadata?: { rewardType?: string; rewardValue?: string };
}

export interface User { // Make sure User type has level and id
    id: string;
    username: string;
    level: number;
    xp: number;
    // ... other user fields
}

// Update TaskState interface if needed
export interface TaskState {
    tasks: Task[];
    lastDailyQuestAssignedDate: string | null;
    // ... actions and selectors matching the store implementation ...
     addTask: (taskData: Omit<Task, 'id' | 'userId' | 'completed' | 'createdAt'>) => void;
     updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => void;
     deleteTask: (id: string) => void;
     completeTask: (id: string) => void;
     assignDailyQuestIfNeeded: (user: User) => void;
     getTasksByUserId: (userId: string) => Task[];
     getPendingTasks: (userId: string) => Task[];
     getCompletedTasks: (userId: string) => Task[];
     getExpiredTasks: (userId: string) => Task[];
     getTodaysTasks: (userId: string) => Task[];
     getActiveDailyQuests: (userId: string) => DailyQuestTask[]; // Changed Task to DailyQuestTask[] if needed
}

*/

