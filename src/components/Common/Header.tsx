import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  initializeTheme,
  toggleDarkMode,
} from "../../store/slice/darkModeSlice";
import { getProfile } from "../../store/slice/authSlice";
import type { RootState, AppDispatch } from "../../store/store";

interface Notification {
  id: number;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

interface ProfileMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  onClick?: () => void;
  danger?: boolean;
}

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const notifications: Notification[] = [
    {
      id: 1,
      message: "New order received",
      time: "5 min ago",
      type: "order",
      read: false,
    },
    {
      id: 2,
      message: "Product enquiry from John",
      time: "15 min ago",
      type: "enquiry",
      read: false,
    },
    {
      id: 3,
      message: "New vendor registered",
      time: "1 hour ago",
      type: "vendor",
      read: true,
    },
    {
      id: 4,
      message: "Payment received",
      time: "2 hours ago",
      type: "payment",
      read: true,
    },
  ];

  const profileMenuItems: ProfileMenuItem[] = [
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      onClick: () => navigate("/profile"),
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      onClick: () => navigate("/settings"),
    },
    {
      icon: Shield,
      label: "Security",
      path: "/security",
      onClick: () => navigate("/security"),
    },
    {
      icon: HelpCircle,
      label: "Help",
      path: "/help",
      onClick: () => navigate("/help"),
    },
    {
      icon: LogOut,
      label: "Logout",
      path: "/logout",
      danger: true,
      onClick: () => navigate("/login"),
    },
  ];

  const unreadCount: number = notifications.filter((n) => !n.read).length;

  const headerClasses = `sticky top-0 z-50 transition-all duration-300 ${
    isScrolled
      ? isDarkMode
        ? "bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-gray-800"
        : "bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200"
      : isDarkMode
        ? "bg-gray-900 border-b border-gray-800"
        : "bg-white border-b border-gray-200"
  }`;

  const searchClasses = `pl-10 pr-12 py-2 rounded-lg border transition-all w-72 ${
    searchFocused
      ? isDarkMode
        ? "border-orange-500 ring-2 ring-orange-500/20 bg-gray-800"
        : "border-orange-500 ring-2 ring-orange-200 bg-white"
      : isDarkMode
        ? "border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500"
        : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
  } focus:outline-none`;

  const iconButtonClasses = `p-2 rounded-lg transition-colors relative ${
    isDarkMode
      ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
      : "hover:bg-gray-100 text-gray-600"
  }`;

  const dropdownClasses = `absolute right-0 mt-2 rounded-xl shadow-xl overflow-hidden z-50 border min-w-[280px] ${
    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
  }`;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const searchInput = document.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;
      searchInput?.focus();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown as any);
    return () => document.removeEventListener("keydown", handleKeyDown as any);
  }, []);

  return (
    <header className={headerClasses}>
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Welcome back, Admin
            </h1>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>

          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    searchFocused
                      ? "text-orange-500"
                      : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={searchClasses}
                />
                <div
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs px-1.5 py-0.5 rounded ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  ⌘K
                </div>
              </motion.div>
            </form>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleDarkMode())}
              className={iconButtonClasses}
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-gray-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={iconButtonClasses}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={dropdownClasses}
                  >
                    <div
                      className={`p-4 border-b ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-orange-600 text-white rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b cursor-pointer transition-colors hover:bg-opacity-80 ${
                            !notif.read
                              ? isDarkMode
                                ? "bg-gray-700/50 border-gray-700 hover:bg-gray-700"
                                : "bg-orange-50/50 border-gray-200 hover:bg-orange-50"
                              : isDarkMode
                                ? "border-gray-700 hover:bg-gray-700"
                                : "border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => setShowNotifications(false)}
                        >
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {notif.message}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {notif.time}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`p-3 text-center border-t cursor-pointer ${
                        isDarkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setShowNotifications(false)}
                    >
                      <span className="text-sm text-orange-600">
                        View All Notifications
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {user?.firstName || "Admin"} {user?.lastName || ""}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user?.email || "admin@email.com"}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showProfile ? "rotate-180" : ""
                  } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                />
              </motion.button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={dropdownClasses}
                  >
                    <div
                      className={`p-4 border-b ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Signed in as
                      </p>
                      <p
                        className={`text-xs truncate ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        admin@nowkart.com
                      </p>
                    </div>

                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            item.danger
                              ? isDarkMode
                                ? "text-red-400 hover:bg-red-500/10"
                                : "text-red-600 hover:bg-red-50"
                              : isDarkMode
                                ? "text-gray-300 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            item.onClick?.();
                            setShowProfile(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
