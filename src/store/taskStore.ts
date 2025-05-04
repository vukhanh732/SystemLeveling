import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskState } from '../types';
import useAuthStore from './authStore';

// Helper functions
const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isPastDue = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (taskData) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          userId,
          createdAt: new Date().toISOString(),
          completed: false,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }));
      },

      completeTask: (id) => {
        const { tasks } = get();
        const task = tasks.find((t) => t.id === id);

        if (task && !task.completed) {
          // Mark task as completed
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, completed: true } : t
            )
          }));

          // Award XP to the user
          const { levelUp } = useAuthStore.getState();
          levelUp(task.xpReward);
        }
      },

      getTodaysTasks: () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return [];

        return get().tasks.filter(
          (task) => task.userId === userId && isToday(task.deadline)
        );
      },

      getCompletedTasks: () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return [];

        return get().tasks.filter(
          (task) => task.userId === userId && task.completed
        );
      },

      getPendingTasks: () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return [];

        return get().tasks.filter(
          (task) => task.userId === userId && !task.completed && !isPastDue(task.deadline)
        );
      },

      getExpiredTasks: () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return [];

        return get().tasks.filter(
          (task) => task.userId === userId && !task.completed && isPastDue(task.deadline)
        );
      },
    }),
    {
      name: 'tasks-storage',
    }
  )
);

export default useTaskStore;
