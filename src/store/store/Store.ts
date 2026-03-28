// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from '../slice/DarkMode';

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    // Add other reducers here
  },
});

export default store;