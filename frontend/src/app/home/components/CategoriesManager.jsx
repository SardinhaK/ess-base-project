// src/components/CategoriesManager.jsx
import React, { useState, useEffect } from 'react';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: '', description: '' });

  const fetchCategories = () => {
    fetch('http://localhost:4001/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    fetch('http://localhost:4001/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    })
      .then(res => res.json())
      .then(() => {
        fetchCategories();
        setNewCategory({ name: '', description: '' });
      })
      .catch(error => console.error('Error adding category:', error));
  };

  const handleEditCategory = (id) => {
    setEditCategoryId(id);
    const category = categories.find(cat => cat.id === id);
    if (category) {
      setEditCategory({ name: category.name, description: category.description });
    }
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4001/categories/${editCategoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCategory),
    })
      .then(res => res.json())
      .then(() => {
        fetchCategories();
        setEditCategoryId(null);
        setEditCategory({ name: '', description: '' });
      })
      .catch(error => console.error('Error updating category:', error));
  };

  const handleDeleteCategory = (id) => {
    fetch(`http://localhost:4001/categories/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchCategories())
      .catch(error => console.error('Error deleting category:', error));
  };

  return (
    <div>
      <h2>Manage Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <strong>{cat.name}</strong>: {cat.description}
            <button onClick={() => handleEditCategory(cat.id)}>Edit</button>
            <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Add New Category</h3>
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <button type="submit">Add Category</button>
      </form>
      {editCategoryId !== null && (
        <div>
          <h3>Edit Category</h3>
          <form onSubmit={handleUpdateCategory}>
            <input
              type="text"
              placeholder="Category Name"
              value={editCategory.name}
              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={editCategory.description}
              onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
            />
            <button type="submit">Update Category</button>
            <button type="button" onClick={() => setEditCategoryId(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
