import Image from "next/image";
import { FiMenu, FiShoppingCart } from "react-icons/fi";

interface HeaderProps {
  onMenuClick: () => void;
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ onMenuClick, cartItemCount, onCartClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-pink-600 to-pink-500 shadow-md p-5 flex justify-between items-center z-50">
      {/* Botão do Menu */}
      <button onClick={onMenuClick} className="text-white focus:outline-none" aria-label="Abrir menu">
        <FiMenu size={28} />
      </button>

      {/* Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-16 flex items-center justify-center">
        <Image src="/Logo.png" alt="Logo" width={70} height={80} />
      </div>

      {/* Carrinho */}
      <button onClick={onCartClick} className="relative text-white focus:outline-none" aria-label="Abrir carrinho">
        <FiShoppingCart size={28} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartItemCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default Header;
