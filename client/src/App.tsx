import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Chatbot from "./components/Chatbot";
import CreateChatbot from "./pages/CreateChatbot";
import Providers from "./context/Providers";
import Dashboard from "./pages/Dashboard";

import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateChatbot />} />
            <Route path="analytics" element={<h1>Coming Soon</h1>} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Route>
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/chat/:id" element={<Chatbot />} />
        </Routes>
      </Router>
      <Toaster />
    </Providers>
  );
};

export default App;
