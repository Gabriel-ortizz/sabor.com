import { useState } from "react";

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
  const [quantity, setQuantity] = useState<number>(1);
  const [extras, setExtras] = useState<Record<string, number>>({});

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md" />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-sm text-gray-500">Escolha os adicionais:</p>
      {product.extras.map((extra) => (
        <div key={extra.name} className="flex justify-between">
          <span>{extra.name}</span>
          <button onClick={() => setExtras({ ...extras, [extra.name]: (extras[extra.name] || 0) + 1 })}>+</button>
          <span>{extras[extra.name] || 0}</span>
          <button onClick={() => setExtras({ ...extras, [extra.name]: Math.max((extras[extra.name] || 0) - 1, 0) })}>-</button>
        </div>
      ))}
      <p className="text-lg font-bold mt-2">
        Total: R$ {product.price + Object.values(extras).reduce((a: number, b: number) => a + b * 2, 0)}
      </p>
    </div>
  );
};

export default ProductOption;
