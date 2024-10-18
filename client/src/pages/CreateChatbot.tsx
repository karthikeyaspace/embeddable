import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatbotConfig } from "../utils/types";
import ChatbotPreview from "../components/ChatbotPreview";
import api from "../utils/axios";

const CreateChatbot: React.FC = () => {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<ChatbotConfig>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/create-chatbot", { config });
      if (res.data.success) {
        console.log(res.data.script);
      } else {
        console.log("Failed to create chatbot");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const steps = [
    {
      title: "Basic Info",
      fields: ["logo_url", "image_url", "user_name", "website_url", "chatbot_type"],
    },
    {
      title: "Home Screen",
      fields: ["home_message", "description", "contact_link"],
    },
    {
      title: "Chat Interactions",
      fields: ["greeting_message", "error_response", "default_questions"],
    },
    {
      title: "AI Interactions",
      fields: ["ai_configuration"],
    },
  ];

  const renderField = (field: keyof ChatbotConfig) => {
    if (field === "chatbot_type") {
      return (
        <div key={field} className="mb-4">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Chatbot Type
          </p>
          <div className="flex space-x-4">
            {["personal", "business"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    chatbot_type: type as "personal" | "business",
                  }))
                }
                className={`px-4 py-2 rounded-lg ${
                  config.chatbot_type === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      );
    }
  }
  return (
    <div className="flex h-full">
      <div className="w-2/3 pr-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= index ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200">
                    <div
                      className="h-full bg-black transition-all duration-300 ease-in-out"
                      style={{ width: step > index ? "100%" : "0%" }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {steps.map((s, index) => (
              <span key={index} className="text-center">
                {s.title}
              </span>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step].fields.map((field) => renderField(field as keyof ChatbotConfig))}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-4 py-2 bg-white text-black border border-black rounded-lg hover:bg-gray-100 transition"
              >
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition ml-auto"
              >
                Create Chatbot
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="w-1/3 border-l border-gray-200 pl-6">
        <ChatbotPreview config={config} />
      </div>
    </div>
  );
};

export default CreateChatbot;