import { useEffect, useState } from "react";
import api from "../../services/api";
import { ProductRegister } from "../ProductRegister";
import { ProductEdit } from "../ProductEdit";

const ProductsManager = ({ slug, tenant }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const productsRes = await api.get(
        `http://localhost:8080/api/products/tenant/${slug}`,
      );
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const toggleAvailability = async (product) => {
    try {
      await api.patch(`http://localhost:8080/api/products/${product.id}`, {
        available: !product.available,
      });
      fetchProducts();
    } catch (err) {
      console.error("Erro ao mudar status do produto:", err);
      alert("Erro ao atualizar a disponibilidade.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.delete(
          `http://localhost:8080/api/products/tenant/${slug}/product/${id}`,
        );
        fetchProducts();
        alert("Produto excluído com sucesso!");
      } catch (err) {
        if (err.response?.status === 409) {
          alert(
            "Não é possível excluir um produto que está associado a pedidos.",
          );
        } else {
          console.error("Erro ao excluir produto:", err);
          alert("Erro ao excluir o produto.");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Carregando Estoque...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Gerenciar Estoque
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Vendo produtos da loja:{" "}
              <span
                className="font-semibold "
                style={{ color: tenant.primaryColor }}
              >
                {tenant.name}
              </span>
            </p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                    Disponível
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
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
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!product.available ? "opacity-60" : ""}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            <img
                              className="h-12 w-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                              src={
                                product.imageUrl ||
                                "https://via.placeholder.com/150"
                              }
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
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

                      <td className="px-6 py-4 whitespace-nowrap text-start">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all hover:cursor-pointer ${
                            product.available
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {product.available ? "Disponível" : "Indisponível"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        R$ {product.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-md transition-colors mr-2 hover:cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-md transition-colors hover:cursor-pointer"
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

      {/* Modais mantidos conforme original */}
      {openModal && (
        <div className="fixed inset-0 bg-none backdrop-blur-[5px] flex items-center justify-center z-50 p-4">
          <div className="fixed w-full h-full bg-black opacity-30"></div>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative p-6">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ProductRegister
              tenant={tenant}
              onSuccess={() => {
                setOpenModal(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}
      {editingProduct && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="fixed w-full h-full bg-black opacity-30"></div>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative p-6">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ProductEdit
              product={editingProduct}
              tenant={tenant}
              onSuccess={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
