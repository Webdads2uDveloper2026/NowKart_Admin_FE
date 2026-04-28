import { AnimatePresence, motion } from "framer-motion";
import {
  Component,
  DollarSign,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  Phone,
  ShoppingCart,
  Store,
  Ticket,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import nowkartLogo from "../../assets/nowcartlogo.png";

interface DarkModeState {
  isDarkMode: boolean;
}

interface RootState {
  darkMode: DarkModeState;
}

interface SideBarItem {
  name: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: SideBarItem[];
}

const SideBar: React.FC = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const sideBarData: SideBarItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    {
      name: "Category",
      icon: Component,
      children: [
        { name: "Categories", path: "/category", icon: Component },
        { name: "Sub Category", path: "/subcategory", icon: Component },
      ],
    },
    { name: "Products", path: "/products", icon: Package },
    { name: "Orders", path: "/orders", icon: ShoppingCart, badge: "12" },
    { name: "HoleSale", path: "/hole-sale", icon: Truck },
    {
      name: "Product Enquirys",
      path: "/product-enquiry",
      icon: MessageCircle,
      badge: "3",
    },
    { name: "Contact", path: "/contact", icon: Phone },
    { name: "Users", path: "/users", icon: Users },
    { name: "Currency Convert", path: "/currency-convert", icon: DollarSign },
    { name: "Coupon", path: "/coupon", icon: Ticket },
    { name: "Vendors", path: "/vendors", icon: Store },
  ];

  const toggleItem = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const handleLogout = (): void => {
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ width: "5rem" }}
      animate={{ width: isHovered ? "16rem" : "5rem" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative h-screen shadow-xl overflow-hidden ${
        isDarkMode
          ? "bg-gray-900 border-r border-gray-800"
          : "bg-white border-r border-gray-200"
      }`}
    >
      <div
        className={`flex items-center ${isHovered ? "justify-start px-6" : "justify-center"} h-19 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        {isHovered ? (
          <img src={nowkartLogo} alt="Nowkart Logo" className="h-15 w-auto" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
            N
          </div>
        )}
      </div>

      <div className="h-[calc(100%-8rem)] overflow-y-auto py-4 px-3 scrollbar-thin">
        {sideBarData?.map((item) => {
          const Icon = item.icon;
          const isOpen = expandedItem === item.name;

          return (
            <div key={item.name} className="mb-1">
              {!item.children ? (
                <NavLink to={item.path || "#"}>
                  <div
                    className={`flex items-center ${
                      !isHovered ? "justify-center" : "justify-start"
                    } p-3 rounded-lg cursor-pointer ${
                      isDarkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {isHovered && (
                      <span className="ml-3 text-sm font-medium">
                        {item.name}
                      </span>
                    )}
                  </div>
                </NavLink>
              ) : (
                <>
                  <div
                    onClick={() => toggleItem(item.name)}
                    className={`flex items-center ${
                      !isHovered ? "justify-center" : "justify-start"
                    } p-3 rounded-lg cursor-pointer ${
                      isDarkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />

                    {isHovered && (
                      <>
                        <span className="ml-3 text-sm font-medium">
                          {item.name}
                        </span>
                        <span className="ml-auto text-xs">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </>
                    )}
                  </div>

                  {isOpen && isHovered && (
                    <div className="ml-8">
                      {item.children.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path || "#"}
                          className="block p-2 text-sm hover:text-orange-500"
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          isDarkMode
            ? "border-gray-800 bg-gray-900"
            : "border-gray-200 bg-white"
        }`}
      >
        <button
          onClick={handleLogout}
          onMouseEnter={() => setExpandedItem("logout")}
          onMouseLeave={() => setExpandedItem(null)}
          className={`flex items-center ${!isHovered ? "justify-center" : "justify-start"} w-full p-3 rounded-lg transition-colors ${
            isDarkMode
              ? "text-red-400 hover:bg-red-500/10"
              : "text-red-600 hover:bg-red-50"
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />

          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 text-sm font-medium"
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>

          {!isHovered && expandedItem === "logout" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`absolute left-full ml-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50 ${
                isDarkMode
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-white text-gray-800 shadow-lg border border-gray-200"
              }`}
            >
              Log Out
            </motion.div>
          )}
        </button>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "#4B5563" : "#D1D5DB"};
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "#6B7280" : "#9CA3AF"};
        }
      `}</style>
    </motion.div>
  );
};

export default SideBar;
