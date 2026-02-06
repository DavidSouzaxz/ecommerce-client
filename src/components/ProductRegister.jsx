import React, { useState } from "react";
import api from "../services/api";

export const ProductRegister = ({ tenant, onSuccess }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:8080/api/products", {
        ...newProduct,
        tenant: { id: tenant.id },
      });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
      });
      alert("Produto cadastrado!");
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Erro ao cadastrar produto");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Novo Produto</h2>
      <form
        onSubmit={handleAddProduct}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Nome do Produto"
          className="border p-2 rounded"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Preço"
          className="border p-2 rounded"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Categoria (ex: Bebidas)"
          className="border p-2 rounded"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          className="border p-2 rounded"
          value={newProduct.imageUrl}
          onChange={(e) =>
            setNewProduct({ ...newProduct, imageUrl: e.target.value })
          }
        />
        <textarea
          placeholder="Descrição"
          className="border p-2 rounded md:col-span-2"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />
        <button
          type="submit"
          style={{ backgroundColor: tenant.primaryColor }}
          className="md:col-span-2 text-white py-2 rounded font-bold hover:brightness-110"
        >
          Cadastrar Novo Produto
        </button>
      </form>
    </div>
  );
};
