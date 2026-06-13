'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Lock, Mail, Server } from 'lucide-react';

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [smtp, setSmtp] = useState({
    host: '',
    port: '587',
    user: '',
    pass: '',
  });

  useEffect(() => {
    // We can fetch the initial profile data through an API route
    // But since the current verify route doesn't return everything, we will make a quick GET route
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile-data');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setProfile({
            name: data.data.name || '',
            email: data.data.email || '',
            username: data.data.username || '',
          });
          if (data.data.smtp) {
            setSmtp({
              host: data.data.smtp.host || '',
              port: data.data.smtp.port?.toString() || '587',
              user: data.data.smtp.user || '',
              pass: '', // Don't fetch password to client
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmtp({ ...smtp, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setMessage({ text: '', type: '' });

    if (passwords.newPassword && passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setSaving(true);

    try {
      const payload: any = {
        name: profile.name,
        email: profile.email,
        username: profile.username,
        smtp: smtp.host ? smtp : undefined
      };

      if (passwords.newPassword) {
        payload.currentPassword = passwords.currentPassword;
        payload.newPassword = passwords.newPassword;
      }

      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ text: data.error || 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div className="admin-spinner admin-spinner-lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Admin Profile</h2>
        <button
          className="btn btn-gold"
          onClick={saveProfile}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {message.text && (
        <div className={`admin-badge admin-badge-${message.type === 'success' ? 'success' : 'danger'}`} style={{ marginBottom: '24px', fontSize: '14px', padding: '12px 16px', display: 'block', borderRadius: '8px' }}>
          {message.text}
        </div>
      )}

      <div className="admin-settings-grid">
        
        {/* Basic Info */}
        <div className="admin-settings-section">
          <h3 className="admin-settings-section-title">
            <User size={18} />
            Basic Information
          </h3>
          <div className="admin-form-row admin-form-row-2">
            <div className="admin-form-group">
              <label className="admin-form-label">Full Name</label>
              <input
                type="text"
                className="admin-form-input"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Admin Name"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Username (Login ID)</label>
              <input
                type="text"
                className="admin-form-input"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                placeholder="admin"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="admin-settings-section">
          <h3 className="admin-settings-section-title">
            <Lock size={18} />
            Change Password
          </h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '14px', marginBottom: '16px' }}>Leave blank if you do not wish to change your password.</p>
          
          <div className="admin-form-group" style={{ marginBottom: '16px' }}>
            <label className="admin-form-label">Current Password</label>
            <input
              type="password"
              className="admin-form-input"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </div>
          
          <div className="admin-form-row admin-form-row-2">
            <div className="admin-form-group">
              <label className="admin-form-label">New Password</label>
              <input
                type="password"
                className="admin-form-input"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Confirm New Password</label>
              <input
                type="password"
                className="admin-form-input"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
