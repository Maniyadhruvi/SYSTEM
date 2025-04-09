import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';
import { TasksState } from './slices/tasksSlice';

// Define the initial state type
interface RootState {
  tasks: TasksState;
}

// Load initial state from localStorage
const getInitialState = (): RootState => {
  if (typeof window === 'undefined') {
    return {
      tasks: {
        tasks: [],
        activeTab: 'habits' as const,
        searchQuery: ''
      }
    };
  }

  const currentUserEmail = localStorage.getItem('currentUserEmail');
  if (!currentUserEmail) {
    return {
      tasks: {
        tasks: [],
        activeTab: 'habits' as const,
        searchQuery: ''
      }
    };
  }

  try {
    const savedTasks = localStorage.getItem(`tasks_${currentUserEmail}`);
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      if (Array.isArray(parsedTasks)) {
        return {
          tasks: {
            tasks: parsedTasks,
            activeTab: 'habits' as const,
            searchQuery: ''
          }
        };
      }
    }
  } catch (e) {
    console.error('Error parsing saved tasks:', e);
  }

  return {
    tasks: {
      tasks: [],
      activeTab: 'habits' as const,
      searchQuery: ''
    }
  };
};

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: getInitialState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 