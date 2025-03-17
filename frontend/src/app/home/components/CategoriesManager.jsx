import React, { useEffect, useState } from "react";
import "./CategoriesManager.css"; // Same CSS file from before

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: "", description: "" });

  // Fetch categories from backend
  const fetchCategories = () => {
    fetch("http://localhost:4001/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    fetch("http://localhost:4001/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    })
      .then(async (res) => {
        if (!res.ok) {
          // Extract error message from backend
          const errorData = await res.json();
          throw new Error(errorData.error);
        }
        return res.json(); // If status 201, parse the new category
      })
      .then(() => {
        fetchCategories();
        setNewCategory({ name: "", description: "" });
      })
      .catch((error) => {
        alert(error.message); // Display backend validation errors
      });
  };

  // Prepare category for editing
  const handleEditCategory = (id) => {
    setEditCategoryId(id);
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setEditCategory({ name: category.name, description: category.description });
    }
  };

  // Handle updating the category
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4001/categories/${editCategoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCategory),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error);
        }
        return res.json(); // If status 200, parse updated category
      })
      .then(() => {
        fetchCategories();
        setEditCategoryId(null);
        setEditCategory({ name: "", description: "" });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // Handle deleting a category
  const handleDeleteCategory = (id) => {
    fetch(`http://localhost:4001/categories/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok && res.status !== 204) {
          // If it’s not OK and not a 204, parse the error
          const errorData = await res.json();
          throw new Error(errorData.error);
        }
        // If status is 204 or 200, we can refresh
        fetchCategories();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="category-management">
      <h2>Manage Categories</h2>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            <div>
              <strong>{cat.name}</strong>: {cat.description}
            </div>
            <div className="category-actions">
              <button onClick={() => handleEditCategory(cat.id)}>Edit</button>
              <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Add New Category</h3>
      <form onSubmit={handleAddCategory} className="category-form">
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
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
        <button type="submit">Add Category</button>
      </form>

      {editCategoryId !== null && (
        <div className="edit-category-section">
          <h3>Edit Category</h3>
          <form onSubmit={handleUpdateCategory} className="category-form">
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
              onChange={(e) =>
                setEditCategory({ ...editCategory, description: e.target.value })
              }
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
