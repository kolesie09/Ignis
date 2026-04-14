import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Header({ handleLogout, onMenuClick }) {
  return (
    <header className="bg-white flex justify-between p-4 dark:bg-gray-800">
      <button
        className="p-2 text-xl font-bold lg:hidden dark:text-gray-100"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        ☰
      </button>
      <div
        onClick={handleLogout}
        className="bg-gray-300 w-10 h-8  rounded-full"
      ></div>
    </header>
  );
}
