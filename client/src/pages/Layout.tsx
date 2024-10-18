import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, PlusCircle, BarChart, Settings } from "lucide-react";
import { motion } from "framer-motion";

const Layout: React.FC = () => {
  const location = useLocation();
  const sidebarItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/create", icon: PlusCircle, label: "Create Chatbot" },
    { path: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-white">
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white w-64 p-6 flex-shrink-0"
      >
        <h2 className="text-2xl font-bold mb-8 tracking-wide">embeddable</h2>
        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-white text-black"
                      : "text-gray-300 hover:bg-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl text-black font-semibold">
            {sidebarItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
          </h1>
        </header>
        <main className="flex-grow overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;