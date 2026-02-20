import { useState } from "react";
import { useTheme } from "../context/AlterTheme";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Home = () => {
  const [imagemAmpliada, setImagemAmpliada] = useState(null);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white selection:bg-yellow-500/30 transition-colors duration-300">
      {/* Navbar Minimalista */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10  rounded-lg flex items-center justify-center">
            <img src="./logo.png" alt="logo" />
          </div>
          <span className="text-xl font-black tracking-tighter">
            DELIVERY<span className="text-yellow-500">SAAS</span>
          </span>
        </div>
        <div className="flex justify-center items-center gap-6">
          <Link
            to="/login"
            className="text-sm font-bold hover:text-yellow-500 transition-colors"
          >
            Área do Lojista
          </Link>
          <button
            className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hover:cursor-pointer"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Seu delivery, sua marca, <br />
          <span className="text-yellow-500">sem comissões abusivas.</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Crie seu cardápio digital personalizado em minutos. Gerencie pedidos,
          estoque e faturamento em uma única plataforma feita para o seu negócio
          crescer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register-user"
            className="px-10 py-4 bg-yellow-500 text-[#0f172a] font-black rounded-xl text-lg hover:scale-105 transition-all shadow-xl shadow-yellow-500/20"
          >
            CRIAR MINHA LOJA AGORA
          </Link>
          <Link
            to="/lebvil-burger"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 cursor-pointer inline-block text-center"
          >
            Ver Demonstração
          </Link>
        </div>
        <div>
          {theme === "dark" ? (
            <div className="mt-20 relative flex flex-col md:flex-row gap-10 justify-center">
              <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full"></div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/Pedidos-black.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/Pedidos-black.png")}
                />
              </div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/Produtos-black.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/Produtos-black.png")}
                />
              </div>
            </div>
          ) : (
            <div className="mt-20 relative flex flex-col md:flex-row gap-10 justify-center">
              <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full"></div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/Pedidos-white.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/Pedidos-white.png")}
                />
              </div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/Produtos-white.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/Produtos-white.png")}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          {theme === "dark" ? (
            <div className="mt-20 relative flex flex-col md:flex-row gap-10 justify-center">
              <div className="absolute inset-0  bg-yellow-500/10 blur-[120px] rounded-full"></div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/Config-black.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/Config-black.png")}
                />
              </div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/Home-black.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/Home-black.png")}
                />
              </div>
            </div>
          ) : (
            <div className="mt-20 relative flex flex-col md:flex-row gap-10 justify-center">
              <div className="absolute inset-0  bg-yellow-500/10 blur-[120px] rounded-full"></div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/config-white.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/config-white.png")}
                />
              </div>
              <div className="relative border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="/Home-white.png"
                  alt="Dashboard do Sistema"
                  className="w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  onClick={() => setImagemAmpliada("/Home-white.png")}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Features Rápidas */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200 dark:border-gray-800">
        <div>
          <div className="text-yellow-500 text-3xl mb-4 font-black">01.</div>
          <h3 className="text-xl font-bold mb-2">Totalmente White Label</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Personalize cores e logotipos. Seu cliente verá a sua marca, não a
            nossa.
          </p>
        </div>
        <div>
          <div className="text-yellow-500 text-3xl mb-4 font-black">02.</div>
          <h3 className="text-xl font-bold mb-2">Pedidos em Tempo Real</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Notificações sonoras e painel de gestão para você não perder nenhuma
            venda.
          </p>
        </div>
        <div>
          <div className="text-yellow-500 text-3xl mb-4 font-black">03.</div>
          <h3 className="text-xl font-bold mb-2">Gestão de Estoque</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Controle a disponibilidade dos produtos de forma simples e rápida.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 dark:text-gray-400 text-xs border-t border-gray-200 dark:border-gray-800">
        &copy; 2026 DeliverySaaS - Desenvolvido por David Souza.
      </footer>

      {/* Modal / Lightbox */}
      {imagemAmpliada && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
          onClick={() => setImagemAmpliada(null)}
        >
          <div className="relative max-w-7xl max-h-screen w-full flex flex-col items-center justify-center">
            {/* Botão Fechar */}
            <button
              onClick={() => setImagemAmpliada(null)}
              className="absolute top-0 right-0 md:-top-8 md:-right-8 text-white/70 hover:text-yellow-500 transition-colors bg-black/50 md:bg-transparent p-2 rounded-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Imagem Ampliada */}
            <img
              src={imagemAmpliada}
              alt="Visualização ampliada"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
