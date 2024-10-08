import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/chat/:id" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}
