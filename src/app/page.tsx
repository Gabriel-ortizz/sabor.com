"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import ProductModal from "@/components/ProductModal";
import ProductCard from "@/components/ProductCard";
import { Product, categorias, produtos } from "data/Produto";

interface CartItem {
  product: Product;
  extrasSelecionados: { name: string; price: number; quantidade: number }[];
  observacao?: string;
}

export default function Cardapio() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<null | Product>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const produtosFiltrados = produtos.filter((produto) =>
    (categoriaSelecionada === "Todos" || produto.category === categoriaSelecionada) &&
    (produto.name.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      produto.description.toLowerCase().includes(termoPesquisa.toLowerCase()))
  );

  const categoriasFiltradas = Array.from(new Set(produtosFiltrados.map((p) => p.category)));

  const addToCart = (
    produto: Product,
    extrasSelecionados: { name: string; price: number; quantidade: number }[],
    observacao: string
  ) => {
    setCartItems([
      ...cartItems,
      {
        product: produto,
        extrasSelecionados,
        observacao,
      },
    ]);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header
        onMenuClick={() => console.log("Menu aberto")}
        cartItemCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Categorias e pesquisa */}
      <div className="sticky top-[4rem] z-20 bg-white shadow-md px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaSelecionada(categoria)}
              className={`px-3 py-1 border rounded-full whitespace-nowrap text-sm transition-all ${
                categoriaSelecionada === categoria ? "bg-black text-white font-bold" : "border-black text-black"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="relative mt-2 flex items-center">
          <input
            type="text"
            placeholder="🔍 Pesquisar"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {termoPesquisa && (
            <button onClick={() => setTermoPesquisa("")} className="absolute right-3 text-gray-500">
              ✖
            </button>
          )}
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="pt-20 px-4 space-y-6">
        {categoriasFiltradas.map((categoria) => (
          <div key={categoria}>
            <h2 className="text-xl font-bold mt-4 mb-2 uppercase">{categoria}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {produtosFiltrados
                .filter((produto) => produto.category === categoria)
                .map((produto) => (
                  <ProductCard
                    key={produto.name}
                    product={produto}
                    onClick={() => setProdutoSelecionado(produto)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Carrinho */}
      <Cart
        itemCount={cartItems.length}
        onClick={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />

      {/* Modal de Produto */}
      {produtoSelecionado && (
        <ProductModal
          product={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
          addToCart={addToCart}
        />
      )}
    </div>
  );
}
