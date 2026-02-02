import React from "react";
import { X } from "lucide-react";

const PerfilClient = ({ onClose, tenant }) => {
  const textColor = "text-gray-800 dark:text-white";
  const inputBgColor = "bg-gray-50 dark:bg-gray-700";
  const inputBorderColor = "border-gray-200 dark:border-gray-600";
  const inputTextColor = "text-gray-800 dark:text-gray-100";

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full animate-in fade-in zoom-in duration-200`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${textColor}`}>Seus Dados</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">
            Nome Completo
          </label>
          <input
            type="text"
            placeholder="Ex: João da Silva"
            className={`w-full ${inputBgColor} ${inputBorderColor} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${inputTextColor} placeholder-gray-400`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">
            Telefone / WhatsApp
          </label>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            className={`w-full ${inputBgColor} ${inputBorderColor} border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${inputTextColor} placeholder-gray-400`}
          />
        </div>

        <button
          className="mt-4 w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          style={{ backgroundColor: tenant?.primaryColor || "#3b82f6" }}
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default PerfilClient;
