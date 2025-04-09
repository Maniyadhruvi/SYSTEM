import { Middleware } from '@reduxjs/toolkit';

export const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);
  
  // Only run on client side
  if (typeof window === 'undefined') {
    return result;
  }
  
  // Get current user email
  const currentUserEmail = localStorage.getItem('currentUserEmail');
  
  if (currentUserEmail) {
    // Save tasks with user-specific key
    const state = store.getState();
    const userTasks = state.tasks.tasks.filter(task => task.userId === currentUserEmail);
    localStorage.setItem(`tasks_${currentUserEmail}`, JSON.stringify(userTasks));
  }
  
  return result;
}; 