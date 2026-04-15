import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import coursesReducer from '../features/courses/coursesSlice';
import modulesReducer from '../features/courses/modulesSlice';
import lessonsReducer from '../features/courses/lessonsSlice';
import enrollmentsReducer from '../features/enrollments/enrollmentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    modules: modulesReducer,
    lessons: lessonsReducer,
    enrollments: enrollmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
