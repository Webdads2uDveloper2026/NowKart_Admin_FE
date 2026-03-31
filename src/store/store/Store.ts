// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import darkModeReducer from '../slice/DarkMode';
import categoryReducer from '../slice/categorySlice';
export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    category: categoryReducer,
    // Add other reducers here
  },
});

export default store;