import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import "./index.css";
import { Main_Route } from "./routes/main_route/Main_Route";
import { store, persistor } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={Main_Route} />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
