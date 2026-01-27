import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const StoreFront = () => {
  const { slug } = useParams(); // Pega o "lebvil-burger" da URL
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { cartItems, cartTotal, clearCart } = useCart();
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
        const tenantRes = await axios.get(
          `http://localhost:8080/api/tenants/${slug}`,
        );
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
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:8080/api/products/tenant/${slug}`;
        if (selectedCategory !== "Todos") {
          // Endpoint: /tenant/{slug}/{category} (presumindo base /api/products)
          url = `http://localhost:8080/api/products/tenant/${slug}/${encodeURIComponent(
            selectedCategory,
          )}`;
        }

        const productsRes = await axios.get(url);
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
    //   );
    //   alert(`Pedido #${response.data.id} enviado com sucesso!`);
    //   clearCart(); // Função que você pode criar no Context para zerar o carrinho
    // } catch (err) {
    //   console.error(err);
    //   alert("Erro ao enviar o pedido para o servidor.");
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar
        tenant={tenant}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <header
        className="bg-white top-0 z-50 shadow-sm px-4 py-4"
        style={{ borderBottom: `4px solid ${tenant.primaryColor}` }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
          <img
            src={tenant.logoUrl}
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
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
          {filteredProducts.map((p) => (
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-full shadow-2xl border border-gray-100 p-2 flex items-center justify-between z-50 animate-bounce-subtle">
          <div className="pl-6">
            <p className="text-xs text-gray-500 font-medium">
              {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
            </p>
            <p className="text-lg font-bold text-gray-900">
              Total: R$ {cartTotal.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleFinalize}
            style={{ backgroundColor: tenant.primaryColor }}
            className="text-white px-8 py-3 rounded-full font-bold hover:brightness-110 transition-all uppercase text-sm tracking-wider hover:cursor-pointer"
          >
            Fechar Pedido
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreFront;
