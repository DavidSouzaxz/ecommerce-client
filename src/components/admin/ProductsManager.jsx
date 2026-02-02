import { useEffect, useState } from "react";
import axios from "axios";
import { ProductRegister } from "../ProductRegister";
import { ProductEdit } from "../ProductEdit";

const ProductsManager = ({ slug, tenant }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const productsRes = await axios.get(
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

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        fetchProducts(); //
        alert("Produto excluído com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir o produto.");
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

  // Adjusted layout: removed min-h-screen and bg-gray-50 from outer wrapper to fit inside AdminPanel
  // Kept internal structure
  return (
    <div>
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
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
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors mr-2 hover:cursor-pointer"
                        >
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
      {/* Modal de Cadastro */}
      {openModal && (
        <div className="fixed inset-0 bg-none  backdrop-blur-[5px] flex items-center justify-center z-50 p-4">
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
