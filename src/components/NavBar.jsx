import { useState } from "react";
import { useTheme } from "../context/AlterTheme";
import { Sun, Moon } from "lucide-react";
import PerfilClient from "./PerfilClient";

const Navbar = ({
  tenant,
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [openModalPerfil, setOpenModalPerfil] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      {/* Parte Superior: Logo e Busca */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo e Nome */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src={tenant?.logoUrl || "https://via.placeholder.com/40"}
            className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            alt="Logo"
          />
          {/* <span className="font-black text-lg hidden md:block text-gray-800 tracking-tighter">
            {tenant?.name}
          </span> */}
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="O que você deseja pedir?"
            className="w-full bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-none rounded-full py-2.5 px-11 focus:ring-2 focus:ring-opacity-50 transition-all outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400"
            style={{ "--tw-ring-color": tenant?.primaryColor }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="w-5 h-5 absolute left-4 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Ícone de Perfil/Login */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
            onClick={() => setOpenModalPerfil(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          <button
            className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:cursor-pointer"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-1.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all border hover:cursor-pointer ${
                selectedCategory === cat
                  ? "text-white border-transparent shadow-md scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              style={
                selectedCategory === cat
                  ? { backgroundColor: tenant?.primaryColor }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {openModalPerfil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpenModalPerfil(false)}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <PerfilClient
              onClose={() => setOpenModalPerfil(false)}
              tenant={tenant}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
