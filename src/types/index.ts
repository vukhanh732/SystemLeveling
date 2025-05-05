// Define the types of daily exercises used in taskStore
export type DailyExerciseType = 'pushups' | 'plank' | 'run';

// User type - Ensure it includes level and xp
export interface User {
  id: string;
  username: string;
  password?: string; // Keep optional if not always needed, but authStore uses it
  level: number;
  xp: number;
  createdAt: string;
}

// Task type - Add optional fields for daily/surprise quests
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string; // Made optional as per original TaskForm usage
  deadline: string; // ISO string
  completed: boolean;
  createdAt: string;
  xpReward: number;
  priority: 'low' | 'medium' | 'high';

  // --- Fields for Daily Quests (Optional) ---
  isDailyQuest?: boolean;
  exerciseType?: DailyExerciseType;
  requiredCount?: number;

  // --- Optional field for Surprise Quest metadata ---
  // metadata?: { rewardType?: string; rewardValue?: string };
}

// AuthState - Matches your provided definition
export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  levelUp: (xpGained: number) => void;
}

// TaskState - Updated with daily quest state and actions/selectors
export interface TaskState {
  tasks: Task[];
  lastDailyQuestAssignedDate: string | null; // Added state

  // Actions
  // Note: Input type for addTask matches your original definition now
  addTask: (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => void; // Prevent userId update
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  assignDailyQuestIfNeeded: (user: User) => void; // Added action

  // Selectors - Updated to require userId
  getTasksByUserId: (userId: string) => Task[]; // Added selector
  getTodaysTasks: (userId: string) => Task[]; // Added userId parameter
  getCompletedTasks: (userId: string) => Task[]; // Added userId parameter
  getPendingTasks: (userId: string) => Task[]; // Added userId parameter
  getExpiredTasks: (userId: string) => Task[]; // Added userId parameter
  getActiveDailyQuests: (userId: string) => Task[]; // Added selector (returns Task[], filter/cast in component)
}

// NotificationState - Matches your provided definition
export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideNotification: () => void;
}

// ThemeState - Matches your provided definition
export interface ThemeState {
  theme: 'blue' | 'green' | 'red' | 'purple';
  setTheme: (theme: 'blue' | 'green' | 'red' | 'purple') => void;
}

// Optional: Define the specific DailyQuestTask interface if needed for casting,
// but adding optional fields to Task is often sufficient.
// export interface DailyQuestTask extends Task {
//   isDailyQuest: true;
//   exerciseType: DailyExerciseType;
//   requiredCount: number;
// }
