import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Header({ handleLogout, onMenuClick }) {
  return (
    <header className="bg-white flex justify-between p-4 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <Menu
          className="h-6 w-6 text-gray-800 cursor-pointer lg:hidden dark:text-gray-100"
          onClick={onMenuClick}
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          OSP Barlinek
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>

      <div
        onClick={handleLogout}
        className="bg-gray-100 w-10 h-8 rounded-full"
      ></div>
    </header>
  );
}
