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
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Cliente</th>
              <th className="p-4 font-semibold text-gray-600">Valor</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-sm text-gray-400">
                  #{order.id}
                </td>
                <td className="p-4 font-medium text-gray-800">
                  {order.customerName}
                </td>
                <td className="p-4 font-bold text-gray-900">
                  R$ {order.totalValue.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "PENDENTE"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "EM PREPARO"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  {order.status === "PENDENTE" && (
                    <button
                      onClick={() => updateStatus(order.id, "EM PREPARO")}
                      className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer"
                    >
                      {" "}
                      Aceitar{" "}
                    </button>
                  )}
                  {order.status === "EM PREPARO" && (
                    <button
                      onClick={() => updateStatus(order.id, "FINALIZADO")}
                      className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors hover:cursor-pointer"
                    >
                      {" "}
                      Finalizar{" "}
                    </button>
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
