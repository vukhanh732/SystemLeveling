export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  level: number;
  xp: number;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  deadline: string; // ISO string
  completed: boolean;
  createdAt: string;
  xpReward: number;
  priority: 'low' | 'medium' | 'high';
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  levelUp: (xpGained: number) => void;
}

export interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTodaysTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getPendingTasks: () => Task[];
  getExpiredTasks: () => Task[];
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideNotification: () => void;
}

export interface ThemeState {
  theme: 'blue' | 'green' | 'red' | 'purple';
  setTheme: (theme: 'blue' | 'green' | 'red' | 'purple') => void;
}
