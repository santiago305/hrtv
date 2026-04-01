export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  subcategories?: NewsSubCategory[];
}

export interface NewsSubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  image: string;
  images?: string[];
  videoUrl?: string | null;
  audioUrl?: string | null;
  category: NewsCategory;
  subcategory?: NewsSubCategory | null;
  author: string;
  publishedAt: string;
  views: number;
  likes: number;
  isBreaking?: boolean;
  isLive?: boolean;
}

export interface LiveStream {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  isLive: boolean;
  viewers?: number;
  startedAt?: string;
}

export interface NavItem {
  label: string;
  path: string;
  visible: boolean;
}

export interface AdPlacement {
  id: string;
  size: 'banner' | 'square' | 'leaderboard' | 'skyscraper' | 'rectangle';
  position: string;
}
