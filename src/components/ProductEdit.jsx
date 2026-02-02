import React, { useEffect, useState } from "react";
import axios from "axios";

export const ProductEdit = ({ product, tenant, onSuccess }) => {
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product]);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/products/${product.id}`, {
        ...editedProduct,
        tenant: { id: tenant.id },
      });
      alert("Produto atualizado!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar produto");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Produto</h2>
      <form
        onSubmit={handleUpdateProduct}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Nome do Produto"
          className="border p-2 rounded"
          value={editedProduct.name}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Preço"
          className="border p-2 rounded"
          value={editedProduct.price}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, price: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Categoria (ex: Bebidas)"
          className="border p-2 rounded"
          value={editedProduct.category}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, category: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          className="border p-2 rounded"
          value={editedProduct.imageUrl}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, imageUrl: e.target.value })
          }
        />
        <textarea
          placeholder="Descrição"
          className="border p-2 rounded md:col-span-2"
          value={editedProduct.description}
          onChange={(e) =>
            setEditedProduct({ ...editedProduct, description: e.target.value })
          }
        />
        <button
          type="submit"
          style={{ backgroundColor: tenant.primaryColor }}
          className="md:col-span-2 text-white py-2 rounded font-bold hover:brightness-110"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};
