import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Chatbot: React.FC = () => {
  const { id: chatbotId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<
    { content: string; isUser: boolean }[]
  >([]);
  const [input, setInput] = useState("");
  const [config, setConfig] = useState<{
    website: string;
    description: string;
    default_questions: string[];
    greeting_message: string;
  }>({
    website: "",
    description: "",
    default_questions: [],
    greeting_message: "",
  });
  const [activeTab, setActiveTab] = useState("chat");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatbotConfig();
  }, [chatbotId]);

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
      const botResponse = data.success
        ? data.response
        : "Sorry, there was an error processing your message.";
      setMessages((prev) => [...prev, { content: botResponse, isUser: false }]);
    } catch (error) {
      console.error("Error sending chat message:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, there was an error processing your message.",
          isUser: false,
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendChatMessage(input.trim());
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div className="w-96 h-[32rem] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
            <span>{config?.website}</span>
            <button onClick={toggleChatbot} className="text-white">
              &times;
            </button>
          </div>

          <div className="flex bg-gray-100">
            <button
              className={`flex-1 py-2 ${
                activeTab === "chat"
                  ? "bg-white border-b-2 border-blue-500"
                  : ""
              }`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
            <button
              className={`flex-1 py-2 ${
                activeTab === "info"
                  ? "bg-white border-b-2 border-blue-500"
                  : ""
              }`}
              onClick={() => setActiveTab("info")}
            >
              Website Info
            </button>
          </div>
          <div className="flex-grow overflow-auto p-4">
            {activeTab === "chat" && (
              <div>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.isUser ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        msg.isUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
            {activeTab === "info" && config && (
              <div>
                <h3 className="font-bold mb-2">Website Name</h3>
                <p className="mb-4">{config.website}</p>
                <h3 className="font-bold mb-2">Default Questions</h3>
                <ul className="list-disc pl-5">
                  {config.default_questions?.map((question, index) => (
                    <li
                      key={index}
                      className="cursor-pointer text-blue-500 hover:underline"
                      onClick={() => {
                        setActiveTab("chat");
                        sendChatMessage(question);
                      }}
                    >
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-gray-100 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow px-3 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-full hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
