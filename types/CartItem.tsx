export interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  extras: { name: string; description: string; price: number }[];
}

export interface CartItem {
  product: Product;
  extrasSelecionados: { name: string; quantidade: number; price: number }[];
  observacao?: string;
  quantidade: number;
}
