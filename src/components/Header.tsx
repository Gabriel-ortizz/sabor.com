import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-black shadow-md p-10 flex justify-between items-center z-50">

      
      <div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-16 flex items-center justify-center">
        <Link href="/">
          <Image
            src="/img/Logo.png"
            alt="Logo"
            width={70}
            height={80}
            className="cursor-pointer"
          />
        </Link>
      </div>

    </header>
  );
};

export default Header;
