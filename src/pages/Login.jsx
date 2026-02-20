import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);

      alert("Login realizado com sucesso!");
      isPresentStore(response.data.token, response.data.tenantSlug);
    } catch (err) {
      alert("Email ou senha inválidos.");
    }
  };

  const isPresentStore = async (token, slug) => {
    try {
      if (!slug) {
        alert(
          "Nenhuma loja associada a este usuário. Por favor, registre sua loja.",
        );
        window.location.href = "/register-store";
        return null;
      }
      const response = await api.get(`/api/tenants/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.href = `/admin/${response.data.slug}`;
      return response.data;
    } catch (err) {
      console.error("Erro ao verificar loja:", err);
      return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 dark:bg-gray-800">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-800 dark:text-white">
            Painel Admin
          </h2>
          <p className="text-gray-500 mt-2 dark:text-gray-400">
            Entre com suas credenciais para gerenciar sua loja
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              E-mail
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Senha
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
