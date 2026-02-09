import { useState } from "react";
import api from "../../services/api";
import { Store, Clock, Palette, Save, Image as ImageIcon } from "lucide-react";

const SettingsManager = ({ slug, tenant }) => {
  const [name, setName] = useState(tenant?.name || "");
  const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl || "");
  const [color, setColor] = useState(tenant?.primaryColor || "#000000");
  const [loading, setLoading] = useState(false);
  const [openTime, setOpenTime] = useState(tenant?.openTime);
  const [closeTime, setCloseTime] = useState(tenant?.closeTime);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch(`/api/tenants/${tenant.id}`, {
        name,
        logoUrl,
        primaryColor: color,
        openTime,
        closeTime,
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
    <div className="max-w-4xl mx-auto pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Configurações da Loja
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie as informações principais e a aparência de{" "}
          <span
            className="font-semibold"
            style={{ color: tenant?.primaryColor }}
          >
            {tenant?.name}
          </span>
        </p>
      </header>

      <div className="grid gap-6">
        {/* Seção 1: Informações Básicas e Logo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b dark:border-gray-700 pb-4">
            <Store size={20} className="text-gray-400" />
            Informações Básicas
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Unidade
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                  style={{ "--tw-ring-color": color }}
                  placeholder="Ex: Minha Loja Matriz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL do Logotipo
                </label>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ImageIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                      style={{ "--tw-ring-color": color }}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview da Logo */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Preview da Logo
              </span>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Logo Preview"
                  className="h-24 object-contain"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div className="h-24 w-24 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
                  <ImageIcon
                    size={32}
                    className="text-gray-400 dark:text-gray-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Seção 2: Horários */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b dark:border-gray-700 pb-4">
              <Clock size={20} className="text-gray-400" />
              Funcionamento
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Abertura
                </label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 transition-all text-center font-mono"
                  style={{ "--tw-ring-color": color }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fechamento
                </label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 transition-all text-center font-mono"
                  style={{ "--tw-ring-color": color }}
                />
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Defina o período em que a loja aceita pedidos automaticamente.
            </p>
          </div>

          {/* Seção 3: Identidade Visual */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b dark:border-gray-700 pb-4">
              <Palette size={20} className="text-gray-400" />
              Identidade Visual
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Cor da Marca
              </label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-14 h-14 opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <div
                    className="w-14 h-14 rounded-full shadow-sm border-2 border-white dark:border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-lg font-bold text-gray-800 dark:text-white uppercase">
                    {color}
                  </span>
                  <span className="text-xs text-gray-500">
                    Cor primária da loja
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ backgroundColor: color }}
          >
            <Save size={20} />
            {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
