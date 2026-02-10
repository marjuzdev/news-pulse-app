export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category: NewsCategory;
  author?: string;
}

export type NewsCategory = 
  | 'general'
  | 'business'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

export interface UserPreferences {
  interests: NewsCategory[];
  darkMode: boolean;
}

export interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  source: string;
  addedAt: string;
}

export type TabType = 'foryou' | 'headlines' | 'favorites';

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  page: number;
  pageSize: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}
