export interface Product {
  id: string;
  name: string;
  category: 'boots' | 'sneakers';
  color: string;
  price: number;
  description: string;
  imageUrl: string;
}
