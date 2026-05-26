export interface Locale {
  id: string;
  name: string;
  image: string;
  rating: number; // e.g., 4.8
  ratingCount: string; // e.g., "2,000+"
  distance: string; // e.g., "2.7 km" or "--"
  prepTime: string; // e.g., "Listo en 10-15 min"
}

export const mockLocales: Locale[] = [
  {
    id: '1',
    name: 'Fashion Hub',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop', // Clothing store / Boutique
    rating: 4.8,
    ratingCount: '2,000+',
    distance: '2.7 km',
    prepTime: 'Listo en 10-15 min',
  },
  {
    id: '2',
    name: 'Home Style',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', // Interior design / Home decor store
    rating: 4.9,
    ratingCount: '3,400+',
    distance: '--',
    prepTime: 'Listo en 30-40 min',
  },
];
