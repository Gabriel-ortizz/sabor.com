import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CartItem} from "types/CartItem";

interface CartProps {
  itemCount: number;
  onClick: () => void;
  isCartOpen: boolean;
  setIsCartOpen: Dispatch<SetStateAction<boolean>>;
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}

const Cart = ({
  itemCount,
  onClick,
  isCartOpen,
  setIsCartOpen,
  cartItems,
  setCartItems,
}: CartProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'Cartão' | 'Pix' | 'Dinheiro' | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'retirada' | 'entrega' | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const whatsappNumber = '5521991453401';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  const taxaEntrega = deliveryMethod === 'entrega' ? 5 : 0;

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      (item.product.price +
        item.extrasSelecionados.reduce((sum, extra) => sum + extra.quantidade * extra.price, 0)) *
        item.quantidade,
    0
  ) + taxaEntrega;

  const clearCart = () => setCartItems([]);

  const updateQuantity = (index: number, amount: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (!item) return prev;
      const newQty = item.quantidade + amount;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...item, quantidade: newQty };
      }
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const fetchAddress = async () => {
    if (cep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro);
        } else {
          setRua('');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  useEffect(() => {
    if (deliveryMethod === 'entrega') {
      fetchAddress();
    } else {
      setCep('');
      setRua('');
      setNumeroCasa('');
    }
  }, [cep, deliveryMethod]);

  const generateWhatsAppMessage = () => {
    const itemsText = cartItems
      .map((item) => {
        const extras = item.extrasSelecionados.map(extra => `+ ${extra.name} (x${extra.quantidade})`).join(", ");
        const observacaoText = item.observacao ? `\nObs: ${item.observacao}` : '';
        const itemTotal = (item.product.price + item.extrasSelecionados.reduce((sum, e) => sum + e.quantidade * e.price, 0)) * item.quantidade;
        return `• ${item.product.name}${extras ? ` (${extras})` : ''} x${item.quantidade} - R$ ${itemTotal.toFixed(2)}${observacaoText}`;
      })
      .join('%0A');

    const entregaText = deliveryMethod === 'entrega' ? `Entrega - ${rua}, ${numeroCasa}` : 'Retirada';
    const pagamentoText = paymentMethod ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : 'Não informado';

    return `https://wa.me/${whatsappNumber}?text=Pedido:%0A${itemsText}%0A%0AForma de entrega: ${entregaText}%0AForma de pagamento: ${pagamentoText}%0ATaxa de entrega: R$ ${taxaEntrega.toFixed(2)}%0ATotal: R$ ${totalPrice.toFixed(2)}`;
  };

  const handleCheckout = () => {
    if (!paymentMethod || !deliveryMethod) {
      setCheckoutError('Selecione a forma de pagamento e entrega antes de finalizar o pedido.');
      return;
    }

    if (deliveryMethod === 'entrega' && (!cep || !rua || !numeroCasa)) {
      setCheckoutError('Preencha o CEP, nome da rua e número da casa para entrega.');
      return;
    }

    setCheckoutError('');
    window.open(generateWhatsAppMessage(), '_blank');
  };

  return (
    <>
      <button
        onClick={onClick}
        className="fixed bottom-4 right-4 bg-pink-500 text-white p-4 rounded-full shadow-lg cursor-pointer transition transform hover:scale-110 active:scale-95 z-50"
        aria-label="Abrir carrinho"
      >
        <div className="relative">
          <FiShoppingCart size={28} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      {isCartOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-end z-[999]" onClick={() => setIsCartOpen(false)}>
          <div className="w-full max-w-md bg-white h-full p-4 overflow-y-auto relative shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Seu Carrinho</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 text-xl">✖</button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-600">Seu carrinho está vazio.</p>
            ) : (
              <>
                <ul className="space-y-4 border-b pb-4">
                  {cartItems.map((item, index) => (
                    <li key={index} className="border-b pb-2">
                      <div className="flex items-center gap-2">
                        <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-bold text-base md:text-lg">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">R$ {item.product.price.toFixed(2)}</p>
                          {item.extrasSelecionados.length > 0 && (
                            <ul className="text-xs mt-1 text-gray-500">
                              {item.extrasSelecionados.map((extra, i) => (
                                <li key={i}>+ {extra.name} (x{extra.quantidade}) - R$ {(extra.quantidade * extra.price).toFixed(2)}</li>
                              ))}
                            </ul>
                          )}
                          {item.observacao && (
                            <p className="text-xs text-gray-500 italic mt-1">Obs: {item.observacao}</p>
                          )}
                          <div className="flex items-center mt-2 gap-2">
                            <button onClick={() => updateQuantity(index, -1)} className="text-gray-600 p-1 border rounded">
                              <AiOutlineMinus />
                            </button>
                            <span className="px-2 font-medium">{item.quantidade}</span>
                            <button onClick={() => updateQuantity(index, 1)} className="text-gray-600 p-1 border rounded">
                              <AiOutlinePlus />
                            </button>
                            <button onClick={() => removeItem(index)} className="ml-auto text-red-500 p-1">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Entrega ou retirada:</label>
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="delivery"
                          value="entrega"
                          onChange={() => setDeliveryMethod('entrega')}
                          checked={deliveryMethod === 'entrega'}
                        /> Entrega
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="delivery"
                          value="retirada"
                          onChange={() => setDeliveryMethod('retirada')}
                          checked={deliveryMethod === 'retirada'}
                        /> Retirada
                      </label>
                    </div>

                    {deliveryMethod === 'entrega' && (
                      <div className="mt-3 space-y-2">
                        <input
                          type="text"
                          placeholder="Digite o CEP"
                          value={cep}
                          maxLength={8}
                          onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 border rounded"
                        />
                        {isLoadingCep ? (
                          <p className="text-sm text-gray-500">Buscando endereço...</p>
                        ) : rua && (
                          <>
                            <input
                              type="text"
                              placeholder="Rua"
                              value={rua}
                              disabled
                              className="w-full px-3 py-2 border rounded bg-gray-100"
                            />
                            <input
                              type="text"
                              placeholder="Número da casa"
                              value={numeroCasa}
                              onChange={(e) => setNumeroCasa(e.target.value)}
                              className="w-full px-3 py-2 border rounded"
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Forma de pagamento:</label>
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          value="Cartão"
                          onChange={() => setPaymentMethod('Cartão')}
                          checked={paymentMethod === 'Cartão'}
                        /> Cartão
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          value="pix"
                          onChange={() => setPaymentMethod('Pix')}
                          checked={paymentMethod === 'Pix'}
                        /> Pix
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          value="dinheiro"
                          onChange={() => setPaymentMethod('Dinheiro')}
                          checked={paymentMethod === 'Dinheiro'}
                        /> Dinheiro
                      </label>
                    </div>
                  </div>

                  <p className="font-bold text-xl text-center mt-2">Total: R$ {totalPrice.toFixed(2)}</p>
                  {checkoutError && <p className="text-red-500 text-sm text-center mt-2">{checkoutError}</p>}

                  <div className="mt-4 flex flex-col gap-2">
                    <button onClick={clearCart} className="bg-red-500 text-white py-2 rounded-lg">Limpar Carrinho</button>
                    <button
                      onClick={handleCheckout}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors w-full text-center"
                    >
                      Comprar no WhatsApp
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
