import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Admin } from "./pages/admin";
import { MainPage } from "./pages/MainPage";
import { Chat } from "./pages/Chat";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chat/:sessionId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
