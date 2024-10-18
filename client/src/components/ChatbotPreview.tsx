import React, { useEffect, useRef, useState } from "react";
import { ChatbotConfig } from "../utils/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ChevronRightSquare,
  Home,
  TextIcon,
} from "lucide-react";

const ChatbotPreview: React.FC<{ config: ChatbotConfig }> = ({ config }) => {
  const [messages, setMessages] = useState<
    { content: string; isUser: boolean }[]
  >([]);
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
                      {config.logo_url ? (
                        <img
                          src={config.logo_url}
                          alt="Logo"
                          className="w-10 h-10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white"></div>
                      )}
                      {config.image_url ? (
                        <img
                          src={config.image_url}
                          alt="User"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white rounded-full"></div>
                      )}
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
                            onClick={() =>
                              setMessages((prev) => [
                                ...prev,
                                {
                                  content: config.error_response,
                                  isUser: false,
                                },
                              ])
                            }
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
                <form className="p-4 bg-white flex">
                  <input
                    type="text"
                    className="flex-grow px-3 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Type a message..."
                    disabled
                  />
                  <button
                    disabled
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

export default ChatbotPreview;
