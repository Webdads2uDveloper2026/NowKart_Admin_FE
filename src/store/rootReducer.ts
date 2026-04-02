import { combineReducers } from "redux";
import authReducer from "./slice/authSlice";
import darkModeReducer from "./slice/darkModeSlice";
import categoryReducer from "./slice/categorySlice";
import subCategoryReducer from "./slice/subcategorySlice";
import productReducer from "./slice/productSlice";
import inquiryReducer from "./slice/inquirySlice";

const rootReducer = combineReducers({
  darkMode: darkModeReducer,
  category: categoryReducer,
  auth: authReducer,
  subcategory: subCategoryReducer,
  product: productReducer,
  inquiry: inquiryReducer,
});

export default rootReducer;
