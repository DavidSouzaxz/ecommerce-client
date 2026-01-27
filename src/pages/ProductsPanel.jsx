import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductsPanel = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carrega os produtos da API
  const fetchData = async () => {
    try {
      const [tenantRes, productsRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/tenants/${slug}`),
        axios.get(`http://localhost:8080/api/products/tenant/${slug}`),
      ]);

      setTenant(tenantRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      // alert("Erro ao carregar produtos. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  // Função placeholder para exclusão
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        fetchData(); // Recarrega a lista
        alert("Produto excluído com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir o produto.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Carregando Estoque...
        </div>
      </div>
    );
  }

  if (!tenant) return <div>Erro ao carregar loja.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-5 hover:cursor-pointer hover:underline text-gray-600 flex items-center gap-1"
            >
              {" "}
              ← Voltar
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerenciar Estoque
            </h1>
            <p className="text-gray-500 mt-1">
              Vendo produtos da loja:{" "}
              <span
                className="font-semibold "
                style={{ color: tenant.primaryColor }}
              >
                {slug}
              </span>
            </p>
          </div>
          <button
            className=" text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all flex items-center gap-2 hover:opacity-75 hover:cursor-pointer"
            style={{
              backgroundColor: tenant.primaryColor,
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Novo Produto
          </button>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <span className="text-lg font-medium">
                          Nenhum produto encontrado
                        </span>
                        <span className="text-sm">
                          Cadastre seu primeiro item para começar a vender.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                              src={
                                product.imageUrl ||
                                "https://via.placeholder.com/150"
                              }
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.description || "Sem descrição"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                          style={{ backgroundColor: tenant.primaryColor }}
                        >
                          {product.category || "Geral"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        R$ {product.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors mr-2 hover:cursor-pointer">
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors hover:cursor-pointer"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPanel;
