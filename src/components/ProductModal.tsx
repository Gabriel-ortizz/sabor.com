interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  extras: { name: string; description: string; price: number }[];
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <button onClick={onClose} className="text-xl font-bold">✖</button>
        </div>

        <div className="p-4">
          <img src={product.image} alt={product.name} className="w-full h-60 object-cover rounded-md" />
          <p className="mt-4">{product.description}</p>
          <p className="text-lg font-bold mt-2">R$ {product.price.toFixed(2)}</p>

          <button onClick={onClose} className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
