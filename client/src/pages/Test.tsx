import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Test: React.FC = () => {
  const [chatbotId, setChatbotId] = useState<string>("");

  useEffect(() => {
    const ls = localStorage.getItem("embeddable.config");
    if (ls) {
      const config = JSON.parse(ls);
      setChatbotId(config.chatbot_id);
    }
  }, []);

  return (
    <div className="w-full h-full bg-white">
      {chatbotId ? (
        <iframe
          src={`http://localhost:5173/chat/${chatbotId}`}
          className="w-[400px] h-full mx-auto"
        ></iframe>
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <h2 className="text-lg text-gray-600 ">You have no chatbots</h2>
          <Link to={"/dashboard/create"}>
            <p className="text-blue-800 text-sm underline italic">
              create a chatbot
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Test;
