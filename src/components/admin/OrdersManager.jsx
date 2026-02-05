import { useEffect, useState } from "react";
import axios from "axios";

const OrdersManager = ({ slug, tenant }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/orders/tenant/${slug}`,
        { headers: getAuthHeader() },
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Erro ao carregar pedidos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [slug]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/orders/${id}/status`,
        status,
        {
          headers: { "Content-Type": "text/plain", ...getAuthHeader() },
        },
      );
      fetchOrders();
    } catch (err) {
      alert("Erro ao atualizar status");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Carregando pedidos...</div>;

  const totalFaturamento = orders.reduce((acc, o) => acc + o.totalValue, 0);

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
        <h1 className="text-2xl font-black text-gray-800">Gestão de Pedidos</h1>
        <div className="text-sm text-gray-500">
          Loja: <span className="font-bold">{slug}</span>
        </div>
      </header>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className="bg-white p-6 rounded-xl shadow-sm border-l-4"
          style={{ borderColor: tenant.primaryColor }}
        >
          <p className="text-gray-500 text-sm font-medium uppercase">
            Vendas Hoje
          </p>
          <p className="text-2xl font-bold text-gray-800">
            R$ {totalFaturamento.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium uppercase">
            Total Pedidos
          </p>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm font-medium uppercase">
            Aguardando
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter((o) => o.status === "PENDENTE").length}
          </p>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-gray-600 text-sm">PEDIDO</th>
              <th className="p-4 font-bold text-gray-600 text-sm">
                CLIENTE / WHATSAPP
              </th>
              <th className="p-4 font-bold text-gray-600 text-sm">
                ENDEREÇO DE ENTREGA
              </th>
              <th className="p-4 font-bold text-gray-600 text-sm">
                TOTAL / PGTO
              </th>
              <th className="p-4 font-bold text-gray-600 text-sm text-center">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="font-mono text-blue-600 font-bold">
                    #{order.id}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">
                      {order.customerName}
                    </span>
                    {/* Link direto para o WhatsApp do cliente */}
                    <a
                      href={`https://wa.me/55${order.customerPhone?.replace(/\D/g, "")}`}
                      target="_blank"
                      className="text-xs text-green-600 font-bold hover:underline flex items-center gap-1"
                    >
                      📱 {order.customerPhone}
                    </a>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-gray-600 max-w-[250px] leading-tight italic">
                    {order.customerAddress}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900">
                      R$ {order.totalValue.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 rounded self-start mt-1">
                      {order.paymentMethod}
                    </span>
                  </div>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  {order.status === "PENDENTE" && (
                    <button
                      onClick={() => updateStatus(order.id, "EM PREPARO")}
                      className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:cursor-pointer"
                    >
                      ACEITAR
                    </button>
                  )}
                  {order.status === "EM PREPARO" && (
                    <button
                      onClick={() => updateStatus(order.id, "FINALIZADO")}
                      className="bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:cursor-pointer"
                    >
                      FINALIZAR
                    </button>
                  )}
                  {order.status === "FINALIZADO" && (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Concluído
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManager;
