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

export default function ProductCart({ product, onClick }: ProductCartProps) {
  return (
    <div
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      {/* Imagem do produto */}
      <div className="w-24 h-24">
        <Image
          src={`/images/${product.image}`}
          alt={product.name}
          width={96}
          height={96}
          className="object-cover rounded-md"
        />
      </div>
      {/* Texto do produto */}
      <div className="flex-1 pr-4">
        <h3 className="font-bold text-lg">{product.name.toUpperCase()}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="font-bold mt-2">R$ {product.price.toFixed(2)}</p>
      </div>

      
    </div>
  );
}
