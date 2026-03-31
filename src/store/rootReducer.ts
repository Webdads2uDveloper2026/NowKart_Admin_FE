import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
import darkModeReducer from "./slice/darkModeSlice";
import categoryReducer from "./slice/categorySlice";
import subCategoryReducer from "./slice/subcategorySlice";

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
  category: categoryReducer,
  auth: authReducer,
  subcategory: subCategoryReducer,
});

export default rootReducer;
