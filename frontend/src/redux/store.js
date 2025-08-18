import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import plansReducer from './features/plans/plansSlice';
import tasksReducer from './features/tasks/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: plansReducer,
    tasks: tasksReducer,
  },
});