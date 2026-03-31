import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Comman/Header";
import SideBar from "./components/Comman/SideBar";
import "./index.css";

// Define types for Redux state
interface DarkModeState {
  isDarkMode: boolean;
}

interface RootState {
  darkMode: DarkModeState;
}

const App = () => {
  const location = useLocation();
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}
    >
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - Fixed */}
        <SideBar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Main Content with Outlet */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full "
              >
                <div className={`h-full  ${
                  isDarkMode 
                    ? 'bg-gray-800/90 backdrop-blur-sm shadow-lg shadow-gray-900/50 border border-gray-700/50' 
                    : 'bg-white shadow-md border border-gray-100'
                } overflow-auto`}>
                  <Outlet />
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default App;