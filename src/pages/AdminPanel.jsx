import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OrdersManager from "../components/admin/OrdersManager";
import ProductsManager from "../components/admin/ProductsManager";
import SettingsManager from "../components/admin/SettingsManager";

const AdminPanel = () => {
  const { slug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchTenant = async () => {
    try {
      const tenantRes = await axios.get(
        `http://localhost:8080/api/tenants/${slug}`,
      );
      setTenant(tenantRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados do admin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, [slug]);

  if (loading)
    return <div className="p-10 text-center">Carregando painel...</div>;

  if (!tenant)
    return (
      <div className="p-10 text-center text-red-500">Loja não encontrada.</div>
    );

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersManager slug={slug} tenant={tenant} />;
      case "products":
        return <ProductsManager slug={slug} tenant={tenant} />;
      case "settings":
        return <SettingsManager tenant={tenant} />;
      default:
        return <OrdersManager slug={slug} tenant={tenant} />;
    }
  };

  const getTabClass = (tabName) => {
    const isActive = activeTab === tabName;
    return `block p-3 rounded-lg w-full text-left transition-colors hover:cursor-pointer ${
      isActive ? "bg-gray-100 font-medium" : "text-gray-600 hover:bg-gray-50"
    }`;
  };

  const getTabStyle = (tabName) => {
    return activeTab === tabName ? { color: tenant.primaryColor } : {};
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white h-16 px-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src={tenant.logoUrl} className="w-8 h-8 rounded" alt="logo" />
          <span className="font-bold text-gray-800">{tenant.name}</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isSidebarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Sidebar Simples (Desktop fixa, Mobile overlay) */}
      <aside
        className={`
          fixed md:sticky md:top-0 top-[64px] left-0 h-[calc(100vh-64px)] md:h-screen 
          w-64 bg-white shadow-md z-10 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 border-b hidden md:flex items-center gap-3">
          <img src={tenant.logoUrl} className="w-8 h-8 rounded" alt="logo" />
          <span className="font-bold text-gray-800">Admin {tenant.name}</span>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("orders");
              setIsSidebarOpen(false);
            }}
            className={getTabClass("orders")}
            style={getTabStyle("orders")}
          >
            Pedidos
          </button>
          <button
            onClick={() => {
              setActiveTab("products");
              setIsSidebarOpen(false);
            }}
            className={getTabClass("products")}
            style={getTabStyle("products")}
          >
            Produtos
          </button>
          <button
            onClick={() => {
              setActiveTab("settings");
              setIsSidebarOpen(false);
            }}
            className={getTabClass("settings")}
            style={getTabStyle("settings")}
          >
            Configurações
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {renderContent()}
      </main>

      {/* Overlay para fechar menu no mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-0 md:hidden top-[64px]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
