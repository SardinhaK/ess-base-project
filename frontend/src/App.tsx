// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FeedPage from './app/home/pages/feed/FeedPage';
import NewsPage from './app/home/pages/news/NewsPage';
import FavoritesPage from './app/home/pages/favorites/FavoritesPage';
import AdminPanel from './app/home/pages/admin/AdminPanel';

const router = createBrowserRouter([
  { path: '/', Component: FeedPage },
  { path: '/news', Component: NewsPage },
  { path: '/favorites', Component: FavoritesPage },
  { path: '/admin', Component: AdminPanel },
  { path: '*', Component: FeedPage },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}
