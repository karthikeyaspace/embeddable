import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Settings, Copy, Trash2 } from "lucide-react";
import api from "../utils/axios";
import { ChatbotConfig } from "../utils/types";

const Dashboard: React.FC = () => {
  const [chatbot, setChatbot] = useState<ChatbotConfig | null>({
    logo_url: "",
    image_url: "",
    user_name: "",
    website_url: "",
    chatbot_type: "personal",
    home_message: "",
    description: "",
    contact_link: "",
    default_questions: [""],
    greeting_message: "",
    error_response: "",
    ai_configuration: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const res = await api.post("/chatbots", { user_id: "asdfasdf" });
        if (res.data.success && res.data.chatbots.length > 0) {
          setChatbot(res.data.chatbots[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    // fetchChatbot();
  }, []);

  const handleCreateChatbot = () => {
    navigate("/dashboard/create");
  };

  const handleEditChatbot = () => {
    navigate("/dashboard/create", { state: { chatbot } });
  };

  const handleDeleteChatbot = async () => {
    if (window.confirm("Are you sure you want to delete this chatbot?")) {
      console.log("Deleting chatbot...");
    }
  };

  const copyEmbedCode = () => {
    const embedCode = `<script src="https://embeddable.com/chatbot.js" data-id="${"adfadsf"}"></script>`;
    navigator.clipboard.writeText(embedCode);
    alert("Embed code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-black">Dashboard</h1>
      {chatbot ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 rounded-lg p-6 shadow-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-black">
              {chatbot.user_name}'s Chatbot
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
              <p className="capitalize">{chatbot.chatbot_type}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Website URL</h3>
              <p className="truncate">{chatbot.website_url}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Default Questions</h3>
              <p>{chatbot.default_questions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">AI Configurations</h3>
              <p>{chatbot.ai_configuration?.length || 0}</p>
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
