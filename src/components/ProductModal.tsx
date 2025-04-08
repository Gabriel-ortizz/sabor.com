import { useState, useEffect } from "react";
import Image from "next/image";

interface Extra {
  name: string;
  description: string;
  price: number;
}

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  extras: Extra[];
}

interface ExtraSelecionado {
  name: string;
  price: number;
  quantidade: number;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  addToCart: (
    produto: Product,
    extrasSelecionados: ExtraSelecionado[],
    observacao: string
  ) => void;
}

const ProductModal = ({ product, onClose, addToCart }: ProductModalProps) => {
  const [quantidade, setQuantidade] = useState(1);
  const [extrasSelecionados, setExtrasSelecionados] = useState<{ [key: string]: number }>({});
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const alterarExtra = (extraName: string, alterar: number) => {
    setExtrasSelecionados((prev) => {
      const quantidadeAtual = prev[extraName] || 0;
      const novaQuantidade = Math.max(0, quantidadeAtual + alterar);
      return { ...prev, [extraName]: novaQuantidade };
    });
  };

  const totalExtras = Object.values(extrasSelecionados).reduce((acc, cur) => acc + cur, 0);

  const precoExtras = Object.entries(extrasSelecionados).reduce((total, [extra, qtd]) => {
    const extraInfo = product.extras.find((e) => e.name === extra);
    return total + (extraInfo ? extraInfo.price * qtd : 0);
  }, 0);

  const precoTotal = (product.price + precoExtras) * quantidade;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <button onClick={onClose} className="text-xl font-bold hover:text-red-600 transition">✖</button>
        </div>

        {/* Imagem e Descrição */}
        <div className="p-4">
          <div className="w-full h-60 relative">
            <Image
              src={product.image.startsWith("http") ? product.image : `${product.image}`}
              alt={product.name}
              width={600}
              height={250}
              className="rounded-md object-cover w-full h-full"
            />
          </div>
          <p className="mt-4 text-gray-700">{product.description}</p>

          {/* Quantidade */}
          <div className="flex items-center gap-2 mt-4">
            <button onClick={() => setQuantidade((q) => Math.max(1, q - 1))} className="px-3 py-1 border rounded">−</button>
            <span className="text-lg">{quantidade}</span>
            <button onClick={() => setQuantidade((q) => q + 1)} className="px-3 py-1 border rounded">+</button>
          </div>

          {/* Adicionais */}
          {product.extras.length > 0 && (
            <>
              <div className="mt-6 text-lg font-bold">
                Adicionais {totalExtras > 0 && `(${totalExtras} selecionados)`}
              </div>

              {/* Pesquisa */}
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="🔍 Pesquisar adicionais"
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Lista */}
              <div className="mt-4 space-y-2">
                {product.extras
                  .filter((extra) =>
                    extra.name.toLowerCase().includes(termoPesquisa.toLowerCase())
                  )
                  .map((extra) => (
                    <div key={extra.name} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{extra.name}</p>
                        <p className="text-sm text-gray-500">{extra.description}</p>
                        <p className="text-sm font-bold text-pink-600">
                          R$ {extra.price.toFixed(2)}
                        </p>
                        {extrasSelecionados[extra.name] > 0 && (
                          <p className="text-sm text-gray-500">
                            Total: R$ {(extra.price * extrasSelecionados[extra.name]).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alterarExtra(extra.name, -1)}
                          className="px-2 py-1 border rounded"
                        >
                          −
                        </button>
                        <span>{extrasSelecionados[extra.name] || 0}</span>
                        <button
                          onClick={() => alterarExtra(extra.name, 1)}
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Observação */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Alguma observação?</label>
            <textarea
              className="w-full p-2 border rounded-md mt-1"
              placeholder="Ex: Sem cebola, maionese à parte..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>
        </div>

        {/* Preço total e botão */}
        <div className="mt-4 p-4 flex justify-between items-center border-t bg-white sticky bottom-0">
          <span className="text-lg font-bold text-pink-600">
            R$ {precoTotal.toFixed(2)}
          </span>
          <button
            className="bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition"
            onClick={() => {
              const extrasArray = Object.entries(extrasSelecionados)
                .filter(([, qtd]) => qtd > 0)
                .map(([extraName, qtd]) => {
                  const extraInfo = product.extras.find((e) => e.name === extraName);
                  return extraInfo
                    ? { name: extraInfo.name, price: extraInfo.price, quantidade: qtd }
                    : null;
                })
                .filter(Boolean) as ExtraSelecionado[];

              addToCart(product, extrasArray, observacao);
              onClose();
            }}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
