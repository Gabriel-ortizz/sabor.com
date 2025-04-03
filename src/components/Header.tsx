import { FiMenu, FiShoppingCart } from "react-icons/fi";

const Header = () => (
  <header className="fixed top-0 left-0 w-full bg-pink-700 shadow-md p-4 flex justify-between items-center">
    <FiMenu size={24} className="cursor-pointer" />
    <h1 className="text-xl font-bold">Cardápio</h1>
    <FiShoppingCart size={24} className="cursor-pointer" />
  </header>
);

export default Header;
