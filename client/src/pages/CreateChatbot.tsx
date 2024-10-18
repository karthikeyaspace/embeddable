import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatbotConfig } from "../utils/types";
import ChatbotPreview from "../components/ChatbotPreview";
import api from "../utils/axios";
import Button from "../components/Button";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(config);
    // try {
    //   const res = await api.post("/create-chatbot", { config });
    //   if (res.data.success) {
    //     console.log(res.data.script);
    //   } else {
    //     console.log("Failed to create chatbot");
    //   }
    // } catch (err) {
    //   console.log(err);
    // }

    // localStorage.setItem("embeddable.config", JSON.stringify(config))
  };

  const steps = [
    {
      title: "Basic Info",
      fields: [
        "logo_url",
        "image_url",
        "user_name",
        "website_url",
        "chatbot_type",
      ],
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
                    ? "bg-black text-white"
                    : "bg-white border text-gray-700"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (field === "default_questions") {
      return (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Questions
          </label>
          <AnimatePresence mode="popLayout">
            {config.default_questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.1 }}
                className="flex mb-2 overflow-hidden"
              >
                <input
                  type="text"
                  value={question}
                  name="default_questions"
                  onChange={(e) => {
                    const newQuestions = [...config.default_questions];
                    newQuestions[index] = e.target.value;
                    setConfig((prev) => ({
                      ...prev,
                      default_questions: newQuestions,
                    }));
                  }}
                  required
                  className="flex-grow px-3 py-2 text-gray-700 border rounded-lg"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const newQuestions = config.default_questions.filter(
                      (_, i) => i !== index
                    );
                    setConfig((prev) => ({
                      ...prev,
                      default_questions: newQuestions,
                    }));
                  }}
                  class="ml-2"
                  text="Remove"
                  logo="Trash2"
                  disabled={config.default_questions.length <= 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            type="button"
            text="Add Question"
            onClick={() =>
              setConfig((prev) => ({
                ...prev,
                default_questions: [...prev.default_questions, ""],
              }))
            }
            logo="PlusCircle"
            disabled={config.default_questions.length >= 4}
            class="mt-2"
          />
        </div>
      );
    }
    if (field === "ai_configuration") {
      return (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Interaction Configuration
          </label>
          <AnimatePresence mode="popLayout">
            {config.ai_configuration?.map((interaction, index) => (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                key={index}
                className="mb-4 p-4 border border-gray-200 rounded-lg "
              >
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Question
                  </label>
                  <input
                    type="text"
                    value={interaction.user_question}
                    name="user_question"
                    placeholder="What can the user ask?"
                    onChange={(e) => {
                      const newConfig = [...config.ai_configuration!];
                      newConfig[index].user_question = e.target.value;
                      setConfig((prev) => ({
                        ...prev,
                        ai_configuration: newConfig,
                      }));
                    }}
                    required
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    AI Response
                  </label>
                  <textarea
                    value={interaction.ai_response}
                    placeholder="What should the AI respond with?"
                    name="ai_response"
                    onChange={(e) => {
                      const newConfig = [...config.ai_configuration!];
                      newConfig[index].ai_response = e.target.value;
                      setConfig((prev) => ({
                        ...prev,
                        ai_configuration: newConfig,
                      }));
                    }}
                    required
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                    rows={3}
                  />
                </div>
                <Button
                  type="button"
                  text="Remove Interaction"
                  logo="Trash2"
                  onClick={() => {
                    const newConfig = config.ai_configuration!.filter(
                      (_, i) => i !== index
                    );
                    setConfig((prev) => ({
                      ...prev,
                      ai_configuration: newConfig,
                    }));
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            type="button"
            onClick={() =>
              setConfig((prev) => ({
                ...prev,
                ai_configuration: [
                  ...(prev.ai_configuration || []),
                  { user_question: "", ai_response: "" },
                ],
              }))
            }
            logo="PlusCircle"
            text="Add interaction"
          />
        </div>
      );
    } else {
      return (
        <div key={field} className="mb-4">
          <label
            htmlFor={field}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {field
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </label>
          <input
            type="text"
            value={config[field]}
            name={field}
            placeholder={
              field === "logo_url"
                ? "url of your business logo"
                : field === "image_url"
                ? "url of your image for customer trust"
                : field === "contact_link"
                ? "Link to your contact page"
                : field === "description"
                ? "Describe your business"
                : field === "greeting_message"
                ? "Message to greet the user"
                : field === "error_response"
                ? "Message to show on error"
                : field === "user_name"
                ? "Your name"
                : field === "website_url"
                ? "Your website url"
                : field === "home_message"
                ? "Message on home screen"
                : "Die"
            }
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg"
            required
          />
        </div>
      );
    }
  };

  return (
    <div className="flex w-full relative h-full">
      <div className="w-2/3 overflow-auto small-scrollbar p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= index
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
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
              {steps[step].fields.map((field) =>
                renderField(field as keyof ChatbotConfig)
              )}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <Button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                text="Back"
                logo=""
              />
            )}
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                text="Next"
                logo=""
                class="ml-auto transition"
              />
            ) : (
              <Button
                type="submit"
                text="Create Chatbot"
                logo=""
                class="ml-auto transition"
              />
            )}
          </div>
        </form>
      </div>
      <div className="fixed right-0 top-0 bottom-0 overflow-auto small-scrollbar border-l border-gray-500">
        <ChatbotPreview config={config} />
      </div>
    </div>
  );
};

export default CreateChatbot;
