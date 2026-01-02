import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Button } from "../components/Button.jsx";

export default function Header({ handleLogout, onMenuClick }) {
  return (
    <header className="bg-white flex justify-between p-4 dark:bg-gray-900">
      <button
        className="p-2 text-xl font-bold lg:hidden dark:text-gray-100"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        ☰
      </button>
      <h1 className="text-2xl font-bold dark:text-gray-100">IGNIS</h1>
      <div
        onClick={handleLogout}
        className="bg-gray-300 w-10 h-10 rounded-full"
      ></div>
    </header>
  );
}
