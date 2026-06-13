'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import RevealOnScroll from '@/components/RevealOnScroll';
import { RefreshCw } from 'lucide-react';

export default function CollectionPage() {
  const params = useParams();
  const type = params.type as 'gold' | 'silver';
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const metalTypeLabel = type === 'gold' ? 'Gold' : 'Silver';
  const isGold = type === 'gold';
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch categories on mount
  useEffect(() => {
    fetch(`/api/categories?metalType=${type}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data);
        }
      });
  }, [type]);

  const fetchProducts = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: '24',
        metalType: type,
        active: 'true',
        sort: sortBy
      });
      if (activeCategory !== 'all') {
        queryParams.append('category', activeCategory);
      }

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        if (isLoadMore) {
          setProducts(prev => [...prev, ...data.data]);
        } else {
          setProducts(data.data);
        }
        
        setTotalCount(data.pagination.totalItems);
        setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [type, activeCategory, sortBy]);

  // Refetch when filters change
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  return (
    <div className="collection-page">
      <div className={`collection-header ${isGold ? '' : 'silver-header'}`}>
        <div className="container">
          <RevealOnScroll>
            <div className="hero-badge">
              <span>Our Collections</span>
            </div>
            <h1 className="hero-title">
              <span className={isGold ? 'text-gold-gradient' : 'text-silver-gradient'}>
                {metalTypeLabel}
              </span> Collection
            </h1>
            <p className="hero-subtitle">
              Explore our exquisite range of {type} ornaments, crafted to perfection.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <div className="section section-darker">
        <div className="container">
          <RevealOnScroll>
            <div className="collection-toolbar">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                metalType={type}
              />
              
              <div className="sort-dropdown">
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="newest">Sort by: Newest Arrivals</option>
                  <option value="weight-asc">Sort by: Weight (Low to High)</option>
                  <option value="weight-desc">Sort by: Weight (High to Low)</option>
                </select>
                <div className="sort-icon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            <div className="collection-count">
              Showing {products.length} of {totalCount} {totalCount === 1 ? 'product' : 'products'}
            </div>
          </RevealOnScroll>

          {loading ? (
            <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="admin-spinner admin-spinner-lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid" style={{ marginTop: '32px' }}>
                {products.map((product, i) => (
                  <RevealOnScroll key={`${product.id}-${i}`} delay={i % 4 * 100}>
                    <ProductCard product={product} />
                  </RevealOnScroll>
                ))}
              </div>
              
              {hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
                  <button 
                    className={`btn ${isGold ? 'btn-outline' : 'btn-outline-silver'}`} 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{ padding: '12px 32px', display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    {loadingMore ? (
                      <><RefreshCw className="spin" size={18} /> Loading...</>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <h3 className="empty-state-title">No products found</h3>
              <p className="empty-state-desc">We couldn&apos;t find any products matching your current filters.</p>
              <button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={() => setActiveCategory('all')}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
