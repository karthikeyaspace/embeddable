import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, PlusCircle, BarChart, Settings, TestTube2 } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

const Layout: React.FC = () => {
  const location = useLocation();
  const { logout } = useUser();
  const sidebarItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/create", icon: PlusCircle, label: "Create Chatbot" },
    { path: "/dashboard/test", icon: TestTube2, label: "Test your bot" },
    { path: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-white">
      <motion.div className="bg-black text-white w-64 p-6 flex-shrink-0 flex flex-col justify-between">
        <nav>
          <h2 className="text-2xl font-bold mb-8 tracking-wide">embeddable</h2>
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
        <button
          className="w-1/2 py-2 border border-white/50 rounded-md hover:bg-white hover:text-black transition-colors"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </motion.div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl text-black font-semibold">
            {sidebarItems.find((item) => item.path === location.pathname)
              ?.label || "Dashboard"}
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
