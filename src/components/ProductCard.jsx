import { useCart } from "../context/CartContext";

const ProductCard = ({ product, primaryColor }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-sm border dark:border-gray-700 border-gray-50">
      <img
        src={product.imageUrl || "https://via.placeholder.com/400x200"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm h-10 overflow-hidden line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-6">
          <span className="text-lg font-extrabold text-gray-900 dark:text-gray-50">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(product.price)}
          </span>
          <button
            onClick={() => addToCart(product)}
            style={{ backgroundColor: primaryColor }}
            className="text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all hover:cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
