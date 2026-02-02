import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Tenta recuperar os dados passados pela navegação (opcional se usarmos o Context)
  const { orderData } = location.state || {};

  const [tenant, setTenant] = useState(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    paymentMethod: "pix",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Validação básica do carrinho
    if (cartItems.length === 0) {
      navigate(`/${slug}`);
      return;
    }

    const fetchTenant = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/tenants/${slug}`,
        );
        setTenant(res.data);
      } catch (err) {
        console.error("Erro ao carregar loja", err);
      }
    };
    fetchTenant();
  }, [slug, cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!tenant) return;

    // Constrói o payload para o backend
    // Nota: enviante customerPhone/paymentMethod na "descrição" do endereço ou criar campos no backend se existirem
    // Vou concatenar no endereço para garantir que chegue, caso o backend seja simples.
    const fullAddress = `${formData.customerAddress} | Tel: ${formData.customerPhone} | Pagamento: ${formData.paymentMethod}`;

    const payload = {
      customerName: formData.customerName,
      customerAddress: fullAddress, // Adaptando para enviar tudo no endereço
      totalValue: cartTotal,
      tenant: { id: tenant.id },
      items: cartItems.map((item) => ({
        quantity: item.quantity,
        priceAtTime: item.price,
        product: { id: item.id },
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders",
        payload,
      );
      alert(`Pedido #${response.data.id} realizado com sucesso!`);
      clearCart();
      navigate(`/${slug}`);
    } catch (err) {
      console.error(err);
      alert("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!tenant) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <header
        className="bg-white dark:bg-gray-900 shadow-sm p-4 text-center sticky top-0 z-10"
        style={{ borderBottom: `4px solid ${tenant.primaryColor}` }}
      >
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-gray-800 dark:text-gray-100">
          Finalizar Pedido
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          em {tenant.name}
        </p>
      </header>

      <div className="max-w-2xl mx-auto p-4 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 hover:cursor-pointer hover:underline text-gray-600 flex  justify-center items-center gap-1"
        >
          {" "}
          ← Voltar
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Lista de Itens (Resumo) */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100 mb-4">
              Resumo do Pedido
            </h2>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {item.quantity}x
                    </span>
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium dark:text-gray-200">
                        {item.name}
                      </span>
                      {/* <span className="text-xs text-gray-500">{item.description} (Opcional)</span> */}
                    </div>
                  </div>
                  <span className="font-medium whitespace-nowrap">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600 flex justify-between items-center">
              <span className="font-bold text-gray-600 dark:text-gray-50">
                Total
              </span>
              <span
                className="text-2xl font-black"
                style={{ color: tenant.primaryColor }}
              >
                R$ {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Seus Dados
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Completo
              </label>
              <input
                required
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:bg-white transition-all text-gray-700 dark:text-gray-700"
                style={{ "--tw-ring-color": tenant.primaryColor }}
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Endereço de Entrega
              </label>
              <textarea
                required
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:bg-white transition-all resize-none dark:text-gray-700 text-gray-700"
                style={{ "--tw-ring-color": tenant.primaryColor }}
                placeholder="Rua, Número, Bairro, Complemento..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefone / Whats
                </label>
                <input
                  type="text"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:bg-white transition-all text-gray-700 dark:text-gray-700"
                  style={{ "--tw-ring-color": tenant.primaryColor }}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pagamento
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:bg-white transition-all dark:text-gray-700"
                  style={{ "--tw-ring-color": tenant.primaryColor }}
                >
                  <option value="pix">PIX</option>
                  <option value="money">Dinheiro</option>
                  <option value="card">Cartão na Entrega</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              {loading ? "Enviando Pedido..." : "CONFIRMAR PEDIDO"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full text-gray-500 font-semibold py-2 text-sm hover:underline cursor-pointer"
            >
              Voltar / Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
