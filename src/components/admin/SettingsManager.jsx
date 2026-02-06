import { useState } from "react";
import api from "../../services/api";

const SettingsManager = ({ slug, tenant }) => {
  const [name, setName] = useState(tenant?.name || "");
  const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl || "");
  const [color, setColor] = useState(tenant?.primaryColor || "#000000");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch(`http://localhost:8080/api/tenants/${tenant.id}`, {
        name,
        logoUrl,
        primaryColor: color,
      });
      alert("Configurações atualizadas com sucesso!");
      window.location.reload(); // Recarrega para aplicar a nova cor globalmente
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pedidos da loja:{" "}
          <span
            className="font-semibold "
            style={{ color: tenant.primaryColor }}
          >
            {tenant.name}
          </span>
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Customize a identidade visual da sua loja
        </p>
      </header>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-8 transition-colors duration-300">
        {/* Nome da Loja */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Nome da Unidade
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg outline-none focus:ring-2"
            style={{ borderColor: color }}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Url da Logo
          </label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full p-3 border dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg outline-none focus:ring-2"
            style={{ borderColor: color }}
          />
        </div>

        {/* Cor Primária */}
        <div className="flex items-center gap-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Cor da Marca
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-16 cursor-pointer border-none rounded-2xl"
              />
              <span className="font-mono font-bold text-lg uppercase dark:text-white">
                {color}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Esta cor será aplicada em botões, cabeçalhos e elementos de
              destaque na vitrine do cliente.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-3 rounded-lg text-white font-black transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer"
          style={{ backgroundColor: color }}
        >
          {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
        </button>
      </div>
    </div>
  );
};

export default SettingsManager;
