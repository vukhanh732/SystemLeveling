import { create } from 'zustand';
import type { NotificationState } from '../types';

const useNotificationStore = create<NotificationState>((set) => ({
  message: '',
  type: 'info',
  isVisible: false,

  showNotification: (message, type) => {
    set({ message, type, isVisible: true });

    // Hide notification after 5 seconds
    setTimeout(() => {
      set({ isVisible: false });
    }, 5000);
  },

  hideNotification: () => set({ isVisible: false }),
}));

export default useNotificationStore;
