import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { AuthState, User } from '../types';

// XP required to level up (exponential growth)
export const getXpForNextLevel = (currentLevel: number): number => {
  return Math.floor(100 * (1.5 ** currentLevel));
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      signup: (username: string, password: string) => {
        // Check if username already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        const userExists = existingUsers.some(user => user.username === username);

        if (userExists) {
          return false;
        }

        const newUser: User = {
          id: uuidv4(),
          username,
          password, // In a real app, this would be hashed
          level: 0,
          xp: 0,
          createdAt: new Date().toISOString(),
        };

        // Save user to "database" (localStorage)
        localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));

        // Log user in
        set({ user: newUser, isLoggedIn: true });
        return true;
      },

      login: (username: string, password: string) => {
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        const user = existingUsers.find(user => user.username === username && user.password === password);

        if (user) {
          set({ user, isLoggedIn: true });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      levelUp: (xpGained: number) => {
        const { user } = get();
        if (!user) return;

        const newXp = user.xp + xpGained;
        let newLevel = user.level;
        let remainingXp = newXp;

        // Check if user levels up
        while (remainingXp >= getXpForNextLevel(newLevel)) {
          remainingXp -= getXpForNextLevel(newLevel);
          newLevel++;
        }

        const updatedUser = {
          ...user,
          level: newLevel,
          xp: remainingXp,
        };

        // Update user in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        const updatedUsers = existingUsers.map(u =>
          u.id === user.id ? updatedUser : u
        );

        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Update state
        set({ user: updatedUser });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
