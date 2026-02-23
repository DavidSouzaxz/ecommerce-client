import { useState } from "react";
import api from "../services/api";
import { Store, Clock, Palette, Save, Image as ImageIcon } from "lucide-react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "ADMIN",
    password: "",
  });
  const [passwordShow, setPasswordShow] = useState("");
  const [validacoes, setValidacoes] = useState({
    tamanho: true,
    letraMaiuscula: true,
    numero: true,
    caracterEspecial: true,
  });

  const handlePasswordChange = (e) => {
    const novaSenha = e.target.value;

    setPasswordShow(novaSenha);

    const tamanhoMinimo = novaSenha.length >= 8;
    const temLetraMaiuscula = /[A-Z]/.test(novaSenha);
    const temNumero = /[0-9]/.test(novaSenha);
    const temCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha);

    setValidacoes({
      tamanho: tamanhoMinimo,
      letraMaiuscula: temLetraMaiuscula,
      numero: temNumero,
      caracterEspecial: temCaracterEspecial,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users", formData);

      alert("Usuário criado! Agora faça login para acessar sua conta.");
      handleLogin(formData.email, formData.password);
    } catch (err) {
      alert("Erro ao cadastrar usuário.");
    } finally {
      console.log(formData);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);
      console.log("Token armazenado:", response.data.token);
      alert("Login realizado com sucesso!");
      window.location.href = "/register-store";
    } catch (err) {
      alert("Email ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-black text-white mb-2 text-center">
          Registre-se agora ☕
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Crie sua conta em minutos.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nome de Usuário"
            className="w-full p-4 bg-[#0f172a] text-white rounded-xl outline-none border border-gray-600 focus:border-yellow-500"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="w-full p-4 bg-[#0f172a] text-white rounded-xl outline-none border border-gray-600 focus:border-yellow-500"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Crie uma senha forte"
            className="w-full p-4 bg-[#0f172a] text-white rounded-xl outline-none border border-gray-600 focus:border-yellow-500"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              handlePasswordChange(e);
            }}
            required
          />
          <div>
            {!validacoes.letraMaiuscula && (
              <p className="text-red-500 text-sm">
                Senha deve conter letras maiusculas
              </p>
            )}
            {!validacoes.tamanho && (
              <p className="text-red-500 text-sm">
                Senha deve conter no minímo 8 caracteres
              </p>
            )}
            {!validacoes.caracterEspecial && (
              <p className="text-red-500 text-sm">
                Senha deve conter pelo menos um "!@#$%^&*(),.?":{}|"
              </p>
            )}
          </div>
          <button className="w-full py-4 bg-yellow-500 text-[#0f172a] font-black rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">
            CRIAR CONTA
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
