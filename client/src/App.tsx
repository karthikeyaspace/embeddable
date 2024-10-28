import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Chatbot from "./components/Chatbot";
import CreateChatbot from "./pages/CreateChatbot";
import Providers from "./context/Providers";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Verify from "./pages/Verify";

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateChatbot />} />
            <Route path="analytics" element={<h1>Coming Soon</h1>} />
            <Route path="test" element={<Test />} />
            <Route path="settings" element={<h1>Settings</h1>} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Route>
          <Route path="/verify" element={<Verify />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/chat/:id" element={<Chatbot />} />
        </Routes>
      </Router>
      <Toaster />
    </Providers>
  );
};

export default App;
