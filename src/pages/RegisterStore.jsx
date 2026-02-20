import { useState } from "react";
import api from "../services/api";
import { Image as ImageIcon } from "lucide-react";

const RegisterStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    primaryColor: "#000000",
    closeTime: "22:00:00",
    openTime: "10:00:00",
    user: { id: localStorage.getItem("id") },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/tenants", formData);
      alert("Loja criada! ");
      window.location.href = `/${formData.slug}`;
    } catch (err) {
      alert("Erro ao cadastrar empresa.");
    } finally {
      console.log(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-black text-white mb-2 text-center">
          Comece agora 🚀
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Crie seu cardápio digital em minutos.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da sua Hamburgueria/Loja"
            className="w-full p-4 bg-[#0f172a] text-white rounded-xl outline-none border border-gray-600 focus:border-yellow-500"
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
            required
          />
          <div className="flex gap-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, logoUrl: e.target.value })
                }
                className="w-full p-4 pl-10 bg-[#0f172a] text-white rounded-xl outline-none border border-gray-600 focus:border-yellow-500"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <div className="w-full p-4 bg-[#0f172a] text-white rounded-xl outline-none border border-gray-600 focus:border-yellow-500 flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryColor: e.target.value })
                  }
                  className="w-14 h-14 opacity-0 absolute inset-0 cursor-pointer"
                />
                <div
                  className="w-14 h-14 rounded-full shadow-sm bg-[#0f172a] border-2 border-white dark:border-gray-600"
                  style={{ backgroundColor: formData.primaryColor }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-lg font-bold text-gray-800 dark:text-white uppercase">
                  {formData.primaryColor}
                </span>
                <span className="text-xs text-gray-500">
                  Cor primária da loja
                </span>
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-yellow-500 text-[#0f172a] font-black rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">
            CRIAR MEU CARDÁPIO
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterStore;
