"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductCart from "@/components/ProductCart";
import Cart from "@/components/Cart";
import ProductModal from "@/components/ProductModal";

export default function Cardapio() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState<null | {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    extras: { name: string; description: string; price: number }[];
  }>(null);
  

  const categorias = [
    "Todos",
    "Hamburgueres",
    "Cachorros quentes",
    "Novidade",
    "Porções",
    "Bebidas",
  ];

  const produtos = [
    { name: "Cachorro Quente de Linguiça Boladão", description: "Pão, 4 linguiças, mostarda, ketchup...", price: 28, image: "dog-linguica.jpg", category: "Cachorros quentes", extras: [] },
    { name: "Cachorro Quente de Salsicha", description: "Pão, 4 salsichas, mostarda, ketchup...", price: 27, image: "dog-salsicha.jpg", category: "Cachorros quentes", extras: [] },
    { name: "Hambúrguer Artesanal", description: "Hambúrguer suculento feito na brasa", price: 25, image: "Hamburguer.jpeg", category: "Hamburgueres", extras: [] },
    { name: "Coca-cola", description: "Refrigerante gelado", price: 8, image: "coca-cola.jpg", category: "Bebidas", extras: [] },
    { name: "Batata-frita", description: "Porção de batata frita crocante", price: 20, image: "batata.jpg", category: "Porções", extras: [] },
  ];

  
  const produtosFiltrados = produtos.filter(produto =>
    (categoriaSelecionada === "Todos" || produto.category === categoriaSelecionada) &&
    (produto.name.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      produto.description.toLowerCase().includes(termoPesquisa.toLowerCase()))
  );

  const categoriasFiltradas = Array.from(new Set(produtosFiltrados.map(p => p.category)));

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header fixo */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <Header />
      </div>

      {/* Barra de categorias e pesquisa fixada abaixo do header */}
      <div className="sticky top-[4rem] z-20 bg-white shadow-md px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaSelecionada(categoria)}
              className={`px-3 py-1 border rounded-full whitespace-nowrap text-sm ${
                categoriaSelecionada === categoria ? "bg-black text-white font-bold" : "border-black text-black"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="relative mt-2">
          <input
            type="text"
            placeholder="🔍 Pesquisar"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Espaçamento extra para evitar sobreposição */}
      <div className="pt-20 px-4 space-y-6">
        {categoriasFiltradas.map((categoria) => (
          <div key={categoria}>
            <h2 className="text-xl font-bold mt-4 mb-2 uppercase">{categoria}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {produtosFiltrados
    .filter(produto => produto.category === categoria)
    .map((produto, index) => (
      <ProductCart key={index} product={produto} onClick={() => setProdutoSelecionado(produto)} />
    ))}
</div>
          </div>
        ))}
      </div>

      <Cart />

      {/* Modal de Produto */}
      {produtoSelecionado && (
        <ProductModal product={produtoSelecionado} onClose={() => setProdutoSelecionado(null)} />
      )}
    </div>
  );
}
