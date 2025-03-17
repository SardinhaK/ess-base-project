// src/app/home/pages/admin/AdminPanel.jsx
import React, { useState } from 'react';
import NavigationBar from '../../components/NavigationBar';
import CategoriesManager from '../../components/CategoriesManager';
import UsageReports from './UsageReports';
import DishesManagement from './DishesManagement';
import NewsManagement from './NewsManagement';
import UserManagement from './UserManagement'; // New import
import './AdminPanel.css';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('reports');

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'reports':
        return <UsageReports />;
      case 'categories':
        return <CategoriesManager />;
      case 'dishes':
        return <DishesManagement />;
      case 'news':
        return <NewsManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <UsageReports />;
    }
  };

  return (
    <div className="admin-panel">
      <NavigationBar />
      <header className="admin-header">
        <h1>Admin Panel</h1>
      </header>
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('reports')} className={activeTab === 'reports' ? 'active' : ''}>
          Usage Reports
        </button>
        <button onClick={() => setActiveTab('categories')} className={activeTab === 'categories' ? 'active' : ''}>
          Category Management
        </button>
        <button onClick={() => setActiveTab('dishes')} className={activeTab === 'dishes' ? 'active' : ''}>
          Dishes Management
        </button>
        <button onClick={() => setActiveTab('news')} className={activeTab === 'news' ? 'active' : ''}>
          News Management
        </button>
        <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>
          User Management
        </button>
      </div>
      <main className="admin-content">
        {renderActiveTab()}
      </main>
      <footer className="admin-footer">
        <p>© 2025 University Pub Dish Reviews</p>
      </footer>
    </div>
  );
}
