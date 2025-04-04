import Image from "next/image";

interface ProductCartProps {
  product: {
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCartProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 active:scale-95"
      onClick={onClick}
      role="button"
      aria-label={`Selecionar ${product.name}`}
    >
      {/* Imagem do produto */}
      <div className="w-24 h-24 flex-shrink-0">
        <Image
          src={product.image.startsWith("http") ? product.image : `${product.image}`} // Suporte para URL externa
          alt={product.name}
          width={96}
          height={96}
          className="object-cover rounded-md w-full h-full"
        />
      </div>

      {/* Texto do produto */}
      <div className="flex-1">
        <h3 className="font-bold text-lg">{product.name.toUpperCase()}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <p className="font-bold mt-2 text-pink-600">R$ {product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
