import React from "react"
import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import "./index.css"
import ResultPage from "./pages/ResultPage";
import PropertyPage from "./pages/PropertyPage";
import ProfilePage from "./pages/ProfilePage";
import CreateProperty from "./pages/CreateProperty";
import NotificationPage from "./pages/NotificationPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/property/create" element={<CreateProperty/>} />
        <Route path="/notification" element={<NotificationPage/>} />
      </Routes>
    </div>
  );
}

export default App;
