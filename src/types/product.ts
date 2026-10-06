export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: "Colares" | "Aneis" | "Conjuntos" | "Brincos";
  price: number;
  originalPrice?: number;
  image: string;
  additionalImages?: string[];
  description: string;
  botanicSpecimen: string;
  material: string;
  dimensions?: string;
  isPaused: boolean;
  isFeatured?: boolean;
  stock: number;
  createdAt: string;
}

export type CategoryFilter = "Todas" | "Colares" | "Aneis" | "Destaques";
