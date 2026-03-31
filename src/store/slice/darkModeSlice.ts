// store/slices/darkModeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  systemPreference: false,
};

const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // Apply to document
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Store preference
    //   localStorage.setItem('darkMode', state.isDarkMode);
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      if (action.payload) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', action.payload);
    },
    setSystemPreference: (state, action) => {
      state.systemPreference = action.payload;
    },
    initializeTheme: (state) => {
      const savedPreference = localStorage.getItem('darkMode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      state.systemPreference = systemPrefersDark;
      
      if (savedPreference !== null) {
        state.isDarkMode = savedPreference === 'true';
      } else {
        state.isDarkMode = systemPrefersDark;
      }
      
      // Apply theme
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { 
  toggleDarkMode, 
  setDarkMode, 
  setSystemPreference, 
  initializeTheme 
} = darkModeSlice.actions;

export default darkModeSlice.reducer;