import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import DashboardUser from "./pages/User/DashboardUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/welcome" element={<DashboardUser />} />
      </Routes>
    </Router>
  );
}

export default App;
