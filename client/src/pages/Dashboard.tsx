import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, PlusCircle, BarChart } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const location = useLocation();

  const sidebarItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/create", icon: PlusCircle, label: "Create Chatbot" },
    { path: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md w-72 p-6 flex-shrink-0 border-r border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-600">embeddable</h2>
        <nav>
          <ul className="space-y-4">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
      <div className="flex-grow overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;