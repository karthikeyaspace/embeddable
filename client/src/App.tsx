import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import CreateChatbot from './pages/CreateChatbot';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="create" element={<CreateChatbot />} />
          <Route path="analytics" element={<h1>Coming Soon</h1>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/chat/:id" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;