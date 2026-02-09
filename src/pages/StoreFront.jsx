import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import api from "../services/api";

const StoreFront = () => {
  const { slug } = useParams(); // Pega o "lebvil-burger" da URL
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const [activeHidden, setActiveHidden] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const navigate = useNavigate();
  const categories = [
    "Todos",
    "Hambúrgueres",
    "Bebidas",
    "Sobremesas",
    "Acompanhamentos",
  ];

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const tenantRes = await api.get(`/api/tenants/${slug}`);
        setTenant(tenantRes.data);
      } catch (err) {
        console.error("Erro ao carregar loja", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [slug]);

  useEffect(() => {
    if (tenant) {
      document.title = tenant.name;
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = tenant.logoUrl;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [tenant]);

  const hiddenMenu = () => {
    setActiveHidden(!activeHidden);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `/api/products/tenant/${slug}`;
        if (selectedCategory !== "Todos") {
          // Endpoint: /tenant/{slug}/{category} (presumindo base /api/products)
          url = `/api/products/tenant/${slug}/category/${encodeURIComponent(
            selectedCategory,
          )}`;
        }

        const productsRes = await api.get(url);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
      }
    };

    fetchProducts();
  }, [slug, selectedCategory]);

  const handleFinalize = async () => {
    if (cartItems.length === 0) return alert("Seu carrinho está vazio!");

    const orderData = {
      customerName: "Cliente Teste", // Futuramente você pode pegar de um <input>
      customerAddress: "Rua Exemplo, 123",
      totalValue: cartTotal,
      tenant: { id: tenant.id }, // O ID da loja que você carregou
      items: cartItems.map((item) => ({
        quantity: item.quantity,
        priceAtTime: item.price,
        product: { id: item.id },
      })),
    };

    navigate(`/checkout/${slug}`, { state: { orderData } });

    // try {
    //   const response = await axios.post(
    //     "http://localhost:8080/api/orders",
    //     orderData,
    //   )
    //   alert(`Pedido #${response.data.id} enviado com sucesso!`)
    //   clearCart() // Função que você pode criar no Context para zerar o carrinho
    // } catch (err) {
    //   console.error(err)
    //   alert("Erro ao enviar o pedido para o servidor.")
    // }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Carregando...
      </div>
    );
  if (!tenant)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loja não encontrada.
      </div>
    );

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(term);
    const descMatch = p.description?.toLowerCase().includes(term);
    const priceMatch = p.price?.toString().includes(term);
    return nameMatch || descMatch || priceMatch;
  });

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 pb-24">
      <Navbar
        tenant={tenant}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <header
        className="bg-white dark:bg-gray-900 top-0 z-50 shadow-sm px-4 py-4"
        style={{ borderBottom: `4px solid ${tenant.primaryColor}` }}
      >
        <div className="max-w-6xl mx-auto flex-col flex items-center justify-center gap-4">
          <img
            src={tenant.logoUrl}
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <h1 className="text-2xl font-black text-gray-800 dark:text-gray-50 uppercase tracking-tight">
            {tenant.name}
          </h1>
        </div>
      </header>

      {/* Banner de Boas-vindas */}
      <div
        className="h-32 flex items-center justify-center text-white mb-8"
        style={{ backgroundColor: tenant.primaryColor }}
      >
        <h2 className="text-xl md:text-4xl font-bold px-4 text-center">
          Bem-vindo! <br />
          Confira nossas delícias abaixo
        </h2>
      </div>

      {/* Grid de Produtos */}
      <main className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts
            .filter((p) => p.available === true)
            .map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                primaryColor={tenant.primaryColor}
              />
            ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </main>

      {/* Barra do Carrinho Flutuante (Estilo App Mobile) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex  flex-col z-50 animate-bounce-subtle p-6">
          {!activeHidden && (
            <div className="mb-4 max-h-60 overflow-y-auto border-b pb-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300 mt-2"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold whitespace-nowrap">
                      {item.quantity}x
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer dark:hover:text-red-400"
                    title="Remover Item"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={hiddenMenu}
            className="text-xs font-bold text-gray-500 dark:text-gray-300 mb-2 self-end uppercase hover:text-gray-700 dark:hover:text-gray-400 underline hover:cursor-pointer"
          >
            {activeHidden ? "Detalhes" : "Ocultar"}
          </button>
          <div className="flex flex-col items-end">
            <p className="text-xs text-gray-500 dark:text-gray-300 font-medium">
              {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
              Total: R$ {cartTotal.toFixed(2)}
            </p>
            {tenant.open ? (
              <button
                onClick={handleFinalize}
                style={{ backgroundColor: tenant.primaryColor }}
                className="text-white px-8 py-3 rounded-full font-bold hover:brightness-110 transition-all uppercase text-sm tracking-wider hover:cursor-pointer mt-2"
              >
                Fechar Pedido
              </button>
            ) : (
              <div className=" text-red-700 rounded-lg text-center font-bold">
                Desculpe, estamos fechados no momento!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreFront;
