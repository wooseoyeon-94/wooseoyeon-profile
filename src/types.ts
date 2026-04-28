export interface Profile {
  nameKo: string;
  nameEn: string;
  tagline: string;
  height: string;
  weight: string;
  shoeSize: string;
  specialties: string[];
  instagram: string;
  email: string;
  phone: string;
  pdfUrl: string;
  mainImageUrl: string;
  aboutImageUrl: string;
}

export interface Work {
  id: string;
  title: string;
  genre: string;
  year: string;
  director: string;
  characterName: string;
  characterDescription: string;
  imageUrl: string;
  imageUrls?: string[];
  videoUrl: string;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  order: number;
}

export interface Asset {
  id: string;
  category: 'tops' | 'bottoms' | 'shoes' | 'others';
  name: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface PortfolioData {
  profile: Profile | null;
  works: Work[];
  testimonials: Testimonial[];
  assets: Asset[];
}
