import React from "react";

const Navbar = ({
  tenant,
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Parte Superior: Logo e Busca */}
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo e Nome */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src={tenant?.logoUrl || "https://via.placeholder.com/40"}
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
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
            className="w-full bg-gray-100 border-none rounded-full py-2.5 px-11 focus:ring-2 focus:ring-opacity-50 transition-all outline-none text-sm"
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
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
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
        </div>
      </div>

      {/* Parte Inferior: Filtro de Categorias */}
      <div className="bg-white border-t border-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-1.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all border hover:cursor-pointer ${
                selectedCategory === cat
                  ? "text-white border-transparent shadow-md scale-105"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
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
    </nav>
  );
};

export default Navbar;
