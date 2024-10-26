import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Settings, Copy, Trash2 } from "lucide-react";

import { useUser } from "../context/UserContext";
import env from "../utils/env";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { chatbotConfig, fetchChatbot, status } = useUser();

  useEffect(() => {
    const asyncFetch = async () => {
      if (status === "authenticated") await fetchChatbot();
      setLoading(false);
    };
    asyncFetch();
  }, []);

  const handleCreateChatbot = () => {
    navigate("/dashboard/create");
  };

  const handleEditChatbot = () => {
    navigate("/dashboard/create", { state: { chatbotConfig } });
  };

  const handleDeleteChatbot = async () => {
    if (window.confirm("Are you sure you want to delete this chatbot?")) {
      console.log("Deleting chatbot...");
    }
  };

  const copyEmbedCode = () => {
    const embedCode = `<script src="${env.BASE_URL}/chatbot.js" data-id="${chatbotConfig?.chatbot_id}"></script>`;
    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied to clipboard!");
  };

  return (
    <div className="bg-white p-6 overflow-auto small-scrollbar">
      <p className="pb-4 text-lg">Your chatbot</p>
      {loading ? (
        <div className="items-center">
          <p>Loading...</p>
        </div>
      ) : chatbotConfig ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 rounded-lg p-6 shadow-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-black">
              {chatbotConfig.user_name}'s Chatbot
            </h2>
            <div className="space-x-2">
              <button
                onClick={handleEditChatbot}
                className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={copyEmbedCode}
                className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <Copy size={20} />
              </button>
              <button
                onClick={handleDeleteChatbot}
                className="p-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Chatbot Type</h3>
              <p className="capitalize">{chatbotConfig.chatbot_type}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Website URL</h3>
              <p className="truncate">{chatbotConfig.website_url}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Default Questions</h3>
              <p>{chatbotConfig.default_questions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">AI Configurations</h3>
              <p>{chatbotConfig.ai_configuration?.length || 0}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xl mb-4">You haven't created a chatbot yet.</p>
          <button
            onClick={handleCreateChatbot}
            className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create Chatbot</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
