import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Home, PlusCircle, Settings } from "lucide-react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";


export default function Dashboard() {
  const [websiteDescription, setWebsiteDescription] = useState("");
  const [chatbotGuidance, setChatbotGuidance] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios
      .post(`http://localhost:8000/chatbot`, {
        user_id: "unique-id",
        website: "https://example.com",
        description: websiteDescription,
      })
      .then((response) => {
        console.log(response.data);
        setGeneratedCode(response.data.script);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex">
      <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-6">Embeddable</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to={"/dashboard"} className="flex items-center">
                <Home className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/create" className="flex items-center">
                <PlusCircle className="mr-2" /> Create Chatbot
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/dashboard/settings" className="flex items-center">
                <Settings className="mr-2" /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <h1 className="text-2xl font-bold text-gray-800">
            Embeddable Dashboard
          </h1>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-semibold mb-6">Create a New Chatbot</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="websiteDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Website Description
              </label>
              <textarea
                id="websiteDescription"
                rows={3}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                value={websiteDescription}
                onChange={(e) => setWebsiteDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="chatbotGuidance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Chatbot Guidance
              </label>
              <textarea
                id="chatbotGuidance"
                rows={3}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                value={chatbotGuidance}
                onChange={(e) => setChatbotGuidance(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Generate Chatbot
            </button>
          </form>
        </motion.div>

        {generatedCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Generated Code</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{generatedCode}</code>
            </pre>
          </motion.div>
        )}
      </main>
    </div>
    </div>
  );
};
