import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ChevronRightSquare,
  Home,
  TextIcon,
} from "lucide-react";
import { ChatbotConfig } from "../utils/types";

const Chatbot: React.FC = () => {
  const { id: chatbotId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<
    { content: string; isUser: boolean }[]
  >([]);
  const [input, setInput] = useState("");
  const [config, setConfig] = useState<ChatbotConfig>({
    image_url:
      "https://avatars.githubusercontent.com/u/112397111?s=400&u=45930fe8e389287b7ce146eec80a826bcada8ff3&v=4",
    logo_url: "https://itskv.me/logo-white.svg",
    user_name: "Karthikeya",
    website_url: "kv3.vercel.app",
    chatbot_type: "personal",

    contact_link: "https://linkedin.com/in/karthikeyaveruturi",
    home_message: "Hi There 👋, \nI'm Karthikeya.",
    description:
      "I am a Student and a aspiring Full-stack developer and a Software engineer. Passionate about building web applications and solving real-world problems.",

    greeting_message: "Hello, how can I help you today?",
    default_questions: [
      "How can I contact you?",
      "Can you help me with my project?",
      "What are your skills?",
      "What are you currently working on?",
    ],
    error_response:
      "Could you please contact me at linkedin@karthikeyaveruturi",
  });
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   fetchChatbotConfig();
  // }, [chatbotId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchChatbotConfig = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getwebsitedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatbot_id: chatbotId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setConfig(data.website);
      setMessages([{ content: data.website.greeting_message, isUser: false }]);
    } catch (error) {
      console.error("Error fetching chatbot config:", error);
    }
  };

  const sendChatMessage = async (message: string) => {
    try {
      setMessages((prev) => [...prev, { content: message, isUser: true }]);
      setInput("");

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatbot_id: chatbotId,
          message: message,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const botResponse = data.success ? data.response : config.error_response;
      setMessages((prev) => [...prev, { content: botResponse, isUser: false }]);
    } catch (error) {
      console.error("Error sending chat message:", error);
      setMessages((prev) => [
        ...prev,
        { content: config.error_response, isUser: false },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendChatMessage(input.trim());
    }
  };

  return (
    <div className="bg-gray-200">
      <div className="w-full sm:w-[400px] h-screen mx-auto bg-white flex flex-col">
        <div className="flex-grow overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col min-h-[calc(100vh-2rem)] justify-between"
              >
                <div>
                  <div className="w-full p-8 bg-[#0057ff]">
                    <div className="flex justify-between items-center">
                      <img
                        src={config.logo_url}
                        alt="Logo"
                        className="w-10 h-10"
                      />
                      <img
                        src={config.image_url}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-grow mt-10 space-y-5">
                      <h2 className="text-3xl font-bold mb-4">
                        {config.home_message}
                      </h2>
                      <p className="text-white">{config?.description}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-b from-[#0057ff] to-white p-4 space-y-6  cursor-pointer">
                    <span
                      className="w-full p-4 border border-gray-400 rounded-lg shadow-lg bg-white flex justify-between"
                      onClick={() => setActiveTab("chat")}
                    >
                      <span>
                        <p className="font-bold leading-none">Chat with me</p>
                        <p className="text-sm">talk to AI version of me</p>
                      </span>
                      <ChevronRightSquare size={24} color="#0057ff" />
                    </span>
                    <span
                      className="w-full p-4 border border-gray-400 rounded-lg shadow-lg bg-white flex justify-between"
                      onClick={() => window.open(config.contact_link, "_blank")}
                    >
                      <span>
                        <p className="font-bold leading-none">Contact me</p>
                        <p className="text-sm">connect with me on my social</p>
                      </span>
                      <ChevronRightSquare size={24} color="#0057ff" />
                    </span>
                  </div>
                </div>

                <div className="flex w-full h-20 shadow-[0px_-5px_15px_-5px_rgba(0,0,0,0.1)]">
                  <button
                    className={`flex-1 py-3 font-medium transition-colors flex flex-col justify-center items-center`}
                    onClick={() => setActiveTab("home")}
                  >
                    <p className="font-bold text-[#0057ff]">
                      <Home size={24} color="#0057ff" className="mx-auto" />{" "}
                      Home
                    </p>
                  </button>
                  <button
                    className={`flex-1 py-3 font-medium transition-colors flex flex-col justify-center items-center`}
                    onClick={() => setActiveTab("chat")}
                  >
                    <p className="hover:text-[#0057ff]">
                      <TextIcon size={24} className="mx-auto" />
                      Chat
                    </p>
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <div className="w-full h-16 p-4 bg-[#0057ff] flex justify-between items-center">
                  <ArrowLeftIcon
                    color="white"
                    onClick={() => setActiveTab("home")}
                    className="cursor-pointer"
                  />
                  <p className="font-bold text-white text-lg">
                    {config.user_name}
                  </p>
                  <span></span>
                </div>
                <div className="flex-grow overflow-y-auto p-4 small-scrollbar">
                  <img
                    src={config.image_url}
                    className="w-24 h-24 mx-auto rounded-full my-6"
                    alt=""
                  />
                  <p className="my-4 inline-block p-2 rounded-lg max-w-[80%] bg-blue-100 text-gray-800">
                    {config.greeting_message}
                  </p>
                  {messages.length === 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-3">
                        {config.default_questions?.map((question, index) => (
                          <button
                            key={index}
                            className="cursor-pointer bg-blue-50 text-blue-600 p-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium shadow-sm border border-blue-100 flex items-center justify-center text-center h-full"
                            onClick={() => sendChatMessage(question)}
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${
                          msg.isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span
                          className={`inline-block p-2 rounded-lg max-w-[80%] ${
                            msg.isUser
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-gray-800"
                          }`}
                        >
                          {msg.content}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 bg-white flex">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-full hover:bg-blue-700 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 text-sm text-gray-500 flex justify-center items-center bg-gray-50">
          powered by embeddable
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
