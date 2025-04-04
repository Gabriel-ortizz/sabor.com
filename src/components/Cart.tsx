import { FiShoppingCart } from "react-icons/fi";

interface CartProps {
  itemCount: number; // Número de itens no carrinho
  onClick: () => void;
}

const Cart = ({ itemCount, onClick }: CartProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-pink-500 text-white p-4 rounded-full shadow-lg cursor-pointer transition transform hover:scale-110 active:scale-95"
      aria-label="Abrir carrinho"
    >
      <div className="relative">
        <FiShoppingCart size={28} />
        
        {/* Contador de itens */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default Cart;
