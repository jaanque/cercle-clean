export interface Oferta {
  id: string;
  title: string;
  storeName: string;
  image: string; // Remote URL or local asset reference
  savingAmount: number; // e.g., 75 translates to "Ahorras 75€"
  rating: number; // e.g., 4.6
  ratingCount: number; // e.g., 800
  price: number; // e.g., 45
  originalPrice: number; // e.g., 120
}

export const mockOfertas: Oferta[] = [
  {
    id: '1',
    title: 'Zapatillas Blancas',
    storeName: 'Fashion Hub',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', // Nike sneaker
    savingAmount: 75,
    rating: 4.6,
    ratingCount: 800,
    price: 45,
    originalPrice: 120,
  },
  {
    id: '2',
    title: 'Bolso de Piel',
    storeName: 'Fashion Hub',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop', // Leather bag
    savingAmount: 125,
    rating: 4.8,
    ratingCount: 350,
    price: 55,
    originalPrice: 180,
  },
];
