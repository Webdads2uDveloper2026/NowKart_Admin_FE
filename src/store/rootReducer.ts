import { combineReducers } from "redux";
import darkModeReducer from "./slice/darkModeSlice";
import categoryReducer from "./slice/categorySlice";

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
  category: categoryReducer,
});

export default rootReducer;
