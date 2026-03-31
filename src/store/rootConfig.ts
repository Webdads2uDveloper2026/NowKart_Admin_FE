import createWebStorage from "redux-persist/es/storage/createWebStorage";
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : {
        getItem: () => Promise.resolve(null),
        setItem: (_key: string, value: any) => Promise.resolve(value),
        removeItem: () => Promise.resolve(),
      };

export const persistConfig = {
  key: "root",
  storage,
  whitelist: ["darkMode"],
};
