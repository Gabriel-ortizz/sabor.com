import { useState } from "react";
import Image from "next/image";

interface Extra {
  name: string;
  price: number;
}

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  extras: Extra[];
}

const ProductOption = ({ product }: { product: Product }) => {
  const [extras, setExtras] = useState<Record<string, number>>({});

  const handleIncrease = (extra: Extra) => {
    setExtras((prev) => ({
      ...prev,
      [extra.name]: (prev[extra.name] || 0) + 1,
    }));
  };

  const handleDecrease = (extra: Extra) => {
    setExtras((prev) => ({
      ...prev,
      [extra.name]: Math.max((prev[extra.name] || 0) - 1, 0),
    }));
  };

  // Cálculo correto do total com os adicionais
  const totalExtras = Object.entries(extras).reduce((acc, [name, qty]) => {
    const extraPrice = product.extras.find((e) => e.name === name)?.price || 0;
    return acc + extraPrice * qty;
  }, 0);

  const totalPrice = product.price + totalExtras;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white max-w-md mx-auto">
      {/* Imagem */}
      <div className="w-full h-40 relative">
        <Image
          src={product.image.startsWith("http") ? product.image : `/images/${product.image}`}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.description}</p>

      {/* Seção de adicionais */}
      <p className="text-sm text-gray-600 mt-2 font-medium">Escolha os adicionais:</p>
      <div className="space-y-2 mt-2">
        {product.extras.map((extra) => (
          <div key={extra.name} className="flex justify-between items-center border p-2 rounded-md">
            <span>{extra.name} (+ R$ {extra.price.toFixed(2)})</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDecrease(extra)}
                className="bg-gray-200 px-2 py-1 rounded-md text-gray-700 hover:bg-gray-300 transition"
                aria-label={`Remover ${extra.name}`}
              >
                -
              </button>
              <span className="font-medium">{extras[extra.name] || 0}</span>
              <button
                onClick={() => handleIncrease(extra)}
                className="bg-pink-500 px-2 py-1 rounded-md text-white hover:bg-pink-600 transition"
                aria-label={`Adicionar ${extra.name}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preço total */}
      <p className="text-lg font-bold mt-4">
        Total: <span className="text-pink-600">R$ {totalPrice.toFixed(2)}</span>
      </p>
    </div>
  );
};

export default ProductOption;
