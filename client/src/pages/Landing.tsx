import { motion } from "framer-motion";
import { MessageCircle, Code, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const features = [
  {
    icon: MessageCircle,
    title: "Intelligent Conversations",
    description: "Our AI-powered chatbots understand context and provide relevant responses.",
  },
  {
    icon: Code,
    title: "Easy Integration",
    description: "Embed your chatbot with a simple script or iframe on any website.",
  },
  {
    icon: Globe,
    title: "Customizable",
    description: "Tailor your chatbot to match your brand and meet your specific needs.",
  },
];

const Landing = () => {
  const { status } = useUser();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(status === "authenticated" ? "/dashboard" : "/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <nav className="container mx-auto p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Embeddable</h1>
        <button
          onClick={handleClick}
          className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-opacity-90 transition"
        >
          Dashboard
        </button>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold mb-6">
            Create Powerful Chatbots for Your Website
          </h2>
          <p className="text-xl mb-8">
            Engage your visitors with intelligent conversations, powered by AI
          </p>
          <button
            onClick={handleClick}
            className="bg-white text-blue-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition"
          >
            Get Started
          </button>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="flex items-center flex-col text-center"
            >
              <feature.icon className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
