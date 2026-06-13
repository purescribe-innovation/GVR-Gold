'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Gem,
  Star,
  TrendingUp,
  Plus,
  DollarSign,
  ArrowRight,
  ImageIcon,
  Settings,
} from 'lucide-react';
import type { Product } from '@/lib/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const goldProducts = products.filter((p) => p.metalType === 'gold').length;
  const silverProducts = products.filter((p) => p.metalType === 'silver').length;
  const featuredProducts = products.filter((p) => p.featured).length;

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner admin-spinner-lg" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Welcome back! Here&apos;s an overview of your store.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <span className="admin-stat-card-label">Total Products</span>
            <div className="admin-stat-card-icon gold">
              <Package size={22} />
            </div>
          </div>
          <div className="admin-stat-card-value">{totalProducts}</div>
          <div className="admin-stat-card-change">All active & inactive</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <span className="admin-stat-card-label">Gold Products</span>
            <div className="admin-stat-card-icon warning">
              <Gem size={22} />
            </div>
          </div>
          <div className="admin-stat-card-value">{goldProducts}</div>
          <div className="admin-stat-card-change">
            {totalProducts > 0
              ? `${((goldProducts / totalProducts) * 100).toFixed(0)}% of catalog`
              : 'No products yet'}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <span className="admin-stat-card-label">Silver Products</span>
            <div className="admin-stat-card-icon silver">
              <Gem size={22} />
            </div>
          </div>
          <div className="admin-stat-card-value">{silverProducts}</div>
          <div className="admin-stat-card-change">
            {totalProducts > 0
              ? `${((silverProducts / totalProducts) * 100).toFixed(0)}% of catalog`
              : 'No products yet'}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <span className="admin-stat-card-label">Featured Products</span>
            <div className="admin-stat-card-icon success">
              <Star size={22} />
            </div>
          </div>
          <div className="admin-stat-card-value">{featuredProducts}</div>
          <div className="admin-stat-card-change">Shown on homepage</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Quick Actions</h3>
        </div>
        <div className="admin-card-body">
          <div className="admin-quick-actions">
            <button
              className="admin-btn admin-btn-primary"
              onClick={() => router.push('/admin/products')}
            >
              <Plus size={18} />
              Add Product
            </button>

            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => router.push('/admin/settings')}
            >
              <Settings size={18} />
              Business Settings
            </button>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Recent Products</h3>
          <button
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => router.push('/admin/products')}
          >
            View All
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="admin-table-wrapper">
          {recentProducts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">
                <Package size={40} />
              </div>
              <h4 className="admin-empty-title">No products yet</h4>
              <p className="admin-empty-text">
                Start by adding your first product.
              </p>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => router.push('/admin/products')}
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Metal</th>
                  <th>Weight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="admin-table-thumbnail"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('admin-hidden');
                          }}
                        />
                      ) : (
                        <div className="admin-table-thumbnail-placeholder">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 13 }}>
                        {product.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          product.metalType === 'gold'
                            ? 'admin-badge-gold'
                            : 'admin-badge-silver'
                        }`}
                      >
                        {product.metalType === 'gold' ? '🥇 Gold' : '🥈 Silver'}
                      </span>
                    </td>
                    <td>{product.weight}g</td>
                    <td>
                      <span
                        className={`admin-badge ${
                          product.active
                            ? 'admin-badge-success'
                            : 'admin-badge-danger'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
