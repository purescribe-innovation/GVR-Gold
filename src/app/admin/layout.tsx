'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import './admin.css';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/pricing', label: 'Live Rates', icon: DollarSign },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
  const [desktopCollapsed, setDesktopCollapsed] = useState(false); // For PC
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');

  // Skip layout for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify');
        const data = await res.json();

        if (!data.authenticated) {
          router.push('/admin/login');
          return;
        }

        setUsername(data.username || 'Admin');
        setChecking(false);
      } catch {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  // Login page renders without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (checking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          gap: 12,
        }}
      >
        <div className="admin-spinner admin-spinner-lg" />
        <span>Loading...</span>
      </div>
    );
  }

  const handleLogout = async () => {
    // Clear the cookie by making a request or setting it expired client-side
    document.cookie = 'gvr_admin_token=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const getPageTitle = () => {
    const item = NAV_ITEMS.find((nav) => pathname.startsWith(nav.href));
    return item?.label || 'Admin';
  };

  return (
    <div className={`admin-layout ${desktopCollapsed ? 'desktop-collapsed' : ''}`}>
      {/* Mobile Toggle */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''} ${desktopCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-icon">GVR</div>
          <div className="admin-sidebar-brand-text">
            <h1>GVR Gold &amp; Silver</h1>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                title={item.label}
              >
                <Icon size={20} />
                <span className="admin-sidebar-link-text">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-sidebar-link logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={20} />
            <span className="admin-sidebar-link-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`admin-main ${desktopCollapsed ? 'collapsed' : ''}`}>
        <header className="admin-header">
          <div className="admin-header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="admin-desktop-toggle" 
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              aria-label="Toggle Desktop Sidebar"
              style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <Menu size={20} />
            </button>
            <h2 className="admin-header-title">{getPageTitle()}</h2>
          </div>
          <div className="admin-header-user">
            <div className="admin-header-avatar">
              <User size={16} />
            </div>
            <span>{username}</span>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
