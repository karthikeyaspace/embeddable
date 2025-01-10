import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, PlusCircle, TestTube2, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

const Layout: React.FC = () => {
  const location = useLocation();
  const { logout } = useUser();
  const sidebarItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/create", icon: PlusCircle, label: "Create Chatbot" },
    { path: "/dashboard/test", icon: TestTube2, label: "Test your bot" }
  ];

  return (
    <div className="flex h-screen bg-white">
      <motion.div className="bg-black text-white w-64 p-6 flex-shrink-0 flex flex-col justify-between">
        <nav>
          <h2 className="text-2xl font-bold mb-8 tracking-wide">embeddable</h2>
          <ul className="space-y-2">
            {sidebarItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === path
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-gray-900"
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="flex items-center p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-900"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </motion.div>
      <div className="flex-grow flex flex-col overflow-hidden">
        {location.pathname !== "/dashboard/test" && (
          <header className="bg-white border-b border-gray-200 p-4">
            <h1 className="text-xl text-black font-semibold">
              {sidebarItems.find(({ path }) => path === location.pathname)?.label || "Dashboard"}
            </h1>
          </header>
        )}
        <main className="flex-grow overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
