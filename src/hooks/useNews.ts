import { useState, useEffect, useRef, useCallback } from 'react';
import type { NewsArticle, NewsCategory } from '@/types';

// Mock data for demo purposes - In production, replace with actual API
const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Inteligencia Artificial revoluciona la medicina moderna',
    description: 'Nuevos avances en IA permiten diagnósticos más precisos y tratamientos personalizados para pacientes de todo el mundo.',
    content: 'La inteligencia artificial está transformando el campo de la medicina...',
    url: 'https://example.com/ai-medicine',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: { name: 'TechNews', url: 'https://technews.com' },
    category: 'technology',
    author: 'María García'
  },
  {
    id: '2',
    title: 'Descubrimiento arqueológico cambia la historia antigua',
    description: 'Un equipo internacional de arqueólogos ha descubierto ruinas que podrían reescribir lo que sabemos sobre las civilizaciones antiguas.',
    content: 'El descubrimiento fue realizado en el desierto de Egipto...',
    url: 'https://example.com/archaeology',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ce0799?w=800&q=80',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: { name: 'Historia Hoy', url: 'https://historiahoy.com' },
    category: 'science',
    author: 'Carlos Ruiz'
  },
  {
    id: '3',
    title: 'Mercados financieros alcanzan máximos históricos',
    description: 'Los principales índices bursátiles han cerrado en niveles récord impulsados por datos económicos positivos.',
    content: 'Wall Street celebró hoy con números verdes...',
    url: 'https://example.com/markets',
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: { name: 'Finanzas Global', url: 'https://finanzas.com' },
    category: 'business',
    author: 'Ana Martínez'
  },
  {
    id: '4',
    title: 'Nueva película de Marvel rompe récords de taquilla',
    description: 'La última entrega del universo cinematográfico ha recaudado más de 500 millones en su primer fin de semana.',
    content: 'Los fans acudieron masivamente a los cines...',
    url: 'https://example.com/marvel',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    source: { name: 'CineTotal', url: 'https://cinetotal.com' },
    category: 'entertainment',
    author: 'Pedro López'
  },
  {
    id: '5',
    title: 'Descubren nueva especie de ballena en el Pacífico',
    description: 'Científicos marinos han identificado una especie previamente desconocida de cetáceo en aguas profundas.',
    content: 'La expedición duró más de 6 meses...',
    url: 'https://example.com/whale',
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&q=80',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: { name: 'National Geographic', url: 'https://natgeo.com' },
    category: 'science',
    author: 'Laura Sánchez'
  },
  {
    id: '6',
    title: 'Real Madrid gana la Champions League',
    description: 'El equipo merengue se coronó campeón de Europa por decimoquinta vez en su historia.',
    content: 'Un gol en el minuto 90 decidió el partido...',
    url: 'https://example.com/champions',
    imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    source: { name: 'ESPN', url: 'https://espn.com' },
    category: 'sports',
    author: 'Juan Pérez'
  },
  {
    id: '7',
    title: 'Nuevo tratamiento contra el cáncer muestra resultados prometedores',
    description: 'Ensayos clínicos de fase III demuestran una tasa de remisión del 85% en pacientes con cáncer de pulmón.',
    content: 'El tratamiento utiliza terapia génica...',
    url: 'https://example.com/cancer',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    source: { name: 'Medical News', url: 'https://medicalnews.com' },
    category: 'health',
    author: 'Dra. Elena Vargas'
  },
  {
    id: '8',
    title: 'Apple presenta nuevos productos en evento especial',
    description: 'La compañía de Cupertino reveló su última línea de dispositivos con innovadoras características de IA.',
    content: 'El evento se llevó a cabo en el Apple Park...',
    url: 'https://example.com/apple',
    imageUrl: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    source: { name: 'AppleInsider', url: 'https://appleinsider.com' },
    category: 'technology',
    author: 'Miguel Torres'
  },
  {
    id: '9',
    title: 'Cumbre mundial sobre cambio climático alcanza acuerdo histórico',
    description: '195 países acuerdan reducir emisiones de carbono en un 50% para 2030.',
    content: 'La cumbre duró dos semanas de negociaciones intensas...',
    url: 'https://example.com/climate',
    imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: { name: 'BBC Mundo', url: 'https://bbc.com' },
    category: 'general',
    author: 'Sofia Hernández'
  },
  {
    id: '10',
    title: 'Tesla anuncia baterías de nueva generación',
    description: 'Las nuevas baterías prometen el doble de autonomía y tiempos de carga reducidos a la mitad.',
    content: 'Elon Musk presentó la tecnología en conferencia de prensa...',
    url: 'https://example.com/tesla',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    source: { name: 'Electrek', url: 'https://electrek.com' },
    category: 'technology',
    author: 'Roberto Díaz'
  },
  {
    id: '11',
    title: 'Misión espacial llega exitosamente a Marte',
    description: 'La sonda exploradora ha comenzado su misión de 2 años para buscar signos de vida pasada.',
    content: 'El aterrizaje fue transmitido en vivo a millones...',
    url: 'https://example.com/mars',
    imageUrl: 'https://images.unsplash.com/photo-1614728853913-1e221a657a63?w=800&q=80',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    source: { name: 'NASA News', url: 'https://nasa.gov' },
    category: 'science',
    author: 'Dr. James Wilson'
  },
  {
    id: '12',
    title: 'Gobierno anuncia reforma fiscal integral',
    description: 'Las nuevas medidas buscan reducir la evasión y aumentar la recaudación sin afectar a la clase media.',
    content: 'La reforma será discutida en el congreso...',
    url: 'https://example.com/tax',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    source: { name: 'El País', url: 'https://elpais.com' },
    category: 'general',
    author: 'Carmen Vega'
  }
];

// Generate more mock articles for infinite scroll
const generateMoreArticles = (page: number, pageSize: number): NewsArticle[] => {
  const categories: NewsCategory[] = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
  const sources = ['BBC Mundo', 'CNN Español', 'El País', 'Reuters', 'Bloomberg', 'TechCrunch', 'The Verge'];
  
  return Array.from({ length: pageSize }, (_, i) => {
    const index = (page - 1) * pageSize + i;
    const category = categories[index % categories.length];
    const hoursAgo = index * 2 + 12;
    
    return {
      id: `generated-${page}-${i}`,
      title: `Noticia ${index + 1}: Avances importantes en ${category}`,
      description: `Resumen de los últimos acontecimientos en el sector de ${category}. Esta noticia cubre los eventos más relevantes del día.`,
      content: 'Contenido completo de la noticia...',
      url: `https://example.com/news/${index}`,
      imageUrl: `https://picsum.photos/800/450?random=${index}`,
      publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      source: { 
        name: sources[index % sources.length], 
        url: 'https://example.com' 
      },
      category,
      author: `Autor ${index + 1}`
    };
  });
};

// Simple in-memory cache
const cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseNewsOptions {
  category?: NewsCategory | 'all';
  pageSize?: number;
  initialPage?: number;
}

export function useNews(options: UseNewsOptions = {}) {
  const { category = 'all', pageSize = 10, initialPage = 1 } = options;
  
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [refreshing, setRefreshing] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchNews = useCallback(async (pageNum: number, isRefresh = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const cacheKey = `${category}-${pageNum}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION && !isRefresh) {
      if (pageNum === 1) {
        setArticles(cached.data);
      } else {
        setArticles(prev => [...prev, ...cached.data]);
      }
      return;
    }

    if (pageNum === 1) {
      setLoading(true);
    }
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let newArticles: NewsArticle[];
      
      if (pageNum === 1 && !isRefresh) {
        // First page uses mock articles
        newArticles = category === 'all' 
          ? MOCK_ARTICLES.slice(0, pageSize)
          : MOCK_ARTICLES.filter(a => a.category === category).slice(0, pageSize);
      } else {
        // Subsequent pages use generated articles
        newArticles = generateMoreArticles(pageNum, pageSize);
        if (category !== 'all') {
          newArticles = newArticles.map(a => ({ ...a, category: category as NewsCategory }));
        }
      }

      // Cache the results
      cache.set(cacheKey, { data: newArticles, timestamp: Date.now() });

      if (pageNum === 1 || isRefresh) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }

      // Stop after 5 pages for demo
      if (pageNum >= 5) {
        setHasMore(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Error al cargar las noticias. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage);
    }
  }, [loading, hasMore, page, fetchNews]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    // Clear cache for this category
    for (const key of cache.keys()) {
      if (key.startsWith(category)) {
        cache.delete(key);
      }
    }
    await fetchNews(1, true);
  }, [category, fetchNews]);

  const reset = useCallback(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  // Initial load
  useEffect(() => {
    reset();
    fetchNews(1);
  }, [category]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Prefetch next page
  useEffect(() => {
    if (hasMore && !loading && page < 5) {
      const nextPage = page + 1;
      const cacheKey = `${category}-${nextPage}`;
      if (!cache.has(cacheKey)) {
        // Prefetch in background
        setTimeout(() => {
          const prefetchArticles = generateMoreArticles(nextPage, pageSize);
          cache.set(cacheKey, { 
            data: prefetchArticles, 
            timestamp: Date.now() 
          });
        }, 2000);
      }
    }
  }, [page, hasMore, loading, category, pageSize]);

  return {
    articles,
    loading,
    error,
    hasMore,
    refreshing,
    loadMore,
    refresh,
  };
}

// Hook for personalized news based on user interests
export function usePersonalizedNews(interests: NewsCategory[], pageSize = 10) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPersonalized = useCallback(async (pageNum: number) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mix articles from user's interests
      const allArticles: NewsArticle[] = [];
      const articlesPerCategory = Math.ceil(pageSize / interests.length);
      
      interests.forEach((category, idx) => {
        const baseArticles = idx % 2 === 0 ? MOCK_ARTICLES : generateMoreArticles(pageNum + idx, articlesPerCategory);
        const categoryArticles = baseArticles
          .filter((_, i) => i < articlesPerCategory)
          .map(a => ({ ...a, category, id: `${a.id}-${category}-${pageNum}` }));
        allArticles.push(...categoryArticles);
      });

      // Shuffle and limit
      const shuffled = allArticles
        .sort(() => Math.random() - 0.5)
        .slice(0, pageSize);

      if (pageNum === 1) {
        setArticles(shuffled);
      } else {
        setArticles(prev => [...prev, ...shuffled]);
      }

      if (pageNum >= 5) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [interests, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPersonalized(nextPage);
    }
  }, [loading, hasMore, page, fetchPersonalized]);

  const refresh = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    await fetchPersonalized(1);
  }, [fetchPersonalized]);

  useEffect(() => {
    if (interests.length > 0) {
      setPage(1);
      fetchPersonalized(1);
    }
  }, [interests]);

  return {
    articles,
    loading,
    hasMore,
    loadMore,
    refresh,
  };
}
