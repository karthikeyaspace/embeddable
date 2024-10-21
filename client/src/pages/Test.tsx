import React from "react";
import { useUser } from "../context/UserContext";

const Test: React.FC = () => {
  const { chatbotConfig } = useUser();
  return (
    <div className="w-full h-full bg-gray-200">
      <iframe
        src={`http://localhost:5173/chat/${chatbotConfig?.chatbot_id}`}
        className="w-[400px] h-full mx-auto"
      ></iframe>
    </div>
  );
};

export default Test;
