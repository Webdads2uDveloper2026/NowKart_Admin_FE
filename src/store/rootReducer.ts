import { combineReducers } from "redux";
import darkModeReducer from "./slice/darkModeSlice";
import categoryReducer from "./slice/categorySlice";
import authReducer from "./slice/authSlice";

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
  category: categoryReducer,
  auth: authReducer,
});

export default rootReducer;
