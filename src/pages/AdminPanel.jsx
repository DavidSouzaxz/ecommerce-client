import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const { slug } = useParams();
  const [orders, setOrders] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tenantRes, ordersRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/tenants/${slug}`),
        axios.get(`http://localhost:8080/api/orders/tenant/${slug}`),
      ]);
      setTenant(tenantRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados do admin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh a cada 10s
    return () => clearInterval(interval);
  }, [slug]);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/orders/${id}/status`,
        status,
        {
          headers: { "Content-Type": "text/plain" },
        },
      );
      fetchData();
    } catch (err) {
      alert("Erro ao atualizar");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Carregando painel...</div>;

  const totalFaturamento = orders.reduce((acc, o) => acc + o.totalValue, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Simples */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b flex items-center gap-3">
          <img src={tenant.logoUrl} className="w-8 h-8 rounded" alt="logo" />
          <span className="font-bold text-gray-800">Admin {tenant.name}</span>
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="block p-3 rounded-lg bg-gray-100 font-medium"
            style={{ color: tenant.primaryColor }}
          >
            Pedidos
          </a>
          <a
            href={`/admin/${slug}/products`}
            className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Produtos
          </a>
          <a
            href="#"
            className="block p-3 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-gray-800">
            Gestão de Pedidos
          </h1>
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
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
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
      </main>
    </div>
  );
};

export default AdminPanel;
