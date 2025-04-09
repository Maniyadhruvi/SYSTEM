import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  userId: string;
  title: string;
  type: 'habit' | 'daily' | 'todo';
  notes?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  completed?: boolean;
  isEditing?: boolean;
  showMenu?: boolean;
  startDate?: string;
  repeats?: string;
  repeatEvery?: number;
  repeatOn?: string[];
  tags?: string[];
  dueDate?: string;
  checklist?: string[];
  habitType?: 'positive' | 'negative';
}

export interface TasksState {
  tasks: Task[];
  activeTab: 'habits' | 'dailies' | 'todos';
  searchQuery: string;
}

const initialState: TasksState = {
  tasks: [],
  activeTab: 'habits',
  searchQuery: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTaskMenu: (state, action: PayloadAction<{ taskId: string; show: boolean }>) => {
      const task = state.tasks.find(task => task.id === action.payload.taskId);
      if (task) {
        task.showMenu = action.payload.show;
      }
    },
    setActiveTab: (state, action: PayloadAction<'habits' | 'dailies' | 'todos'>) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskMenu,
  setActiveTab,
  setSearchQuery,
} = tasksSlice.actions;

export default tasksSlice.reducer; 