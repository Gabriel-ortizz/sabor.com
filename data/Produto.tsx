export interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  extras: {
    name: string;
    description: string;
    price: number;
  }[];
}

export const categorias = [
  "Todos",
  "Novidade",
  "Hamburgueres",
  "Cachorros quentes",
  "Porções",
  "Bebidas",
];

export const produtos: Product[] = [
  {
    name: "Hambúrguer Artesanal",
    description: "Hambúrguer suculento feito na brasa",
    price: 25,
    image: "/img/hamburguer.jpeg",
    category: "Hamburgueres",
    extras: [
      { name: "Bacon", description: "Tiras crocantes de bacon", price: 3 },
      { name: "Onion Rings", description: "Cebola empanada", price: 2.5 },
    ],
  },
  {
    name: "Cachorro Quente",
    description: "Salsicha, queijo e molho especial",
    price: 18,
    image: "/img/cachorro-quente.jpg",
    category: "Cachorros quentes",
    extras: [
      { name: "Cheddar", description: "Creme de cheddar", price: 2 },
      { name: "Purê de batata", description: "Purê cremoso", price: 2.5 },
    ],
  },
  {
    name: "Porção de Batata",
    description: "Batata frita crocante",
    price: 15,
    image: "/img/batata.jpg",
    category: "Porções",
    extras: [
      { name: "Molho cheddar", description: "Molho de cheddar extra", price: 2 },
      { name: "Bacon", description: "Bacon crocante", price: 3 },
    ],
  },
  {
    name: "Refrigerante Lata",
    description: "Escolha entre Coca-Cola, Guaraná, Fanta...",
    price: 6,
    image: "/img/refrigerante.jpg",
    category: "Bebidas",
    extras: [],
  },
  {
    name: "Milkshake de Chocolate",
    description: "Feito com sorvete artesanal",
    price: 12,
    image: "/img/milkshake.jpg",
    category: "Novidade",
    extras: [
      { name: "Chantilly", description: "Cobertura de chantilly", price: 1.5 },
      { name: "Calda extra", description: "Mais calda de chocolate", price: 2 },
    ],
  },
];
