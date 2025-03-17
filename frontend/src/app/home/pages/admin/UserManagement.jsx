// src/app/home/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nome: '', login: '', senha: '' });
  const [editUserId, setEditUserId] = useState(null);
  const [editUser, setEditUser] = useState({ nome: '', login: '', senha: '' });

  const fetchUsers = () => {
    fetch('http://localhost:4001/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    fetch('http://localhost:4001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then(() => {
        fetchUsers();
        setNewUser({ nome: '', login: '', senha: '' });
      })
      .catch((error) => console.error('Error adding user:', error));
  };

  const handleEditUser = (id) => {
    setEditUserId(id);
    const user = users.find((u) => u.id === id);
    if (user) {
      setEditUser({ nome: user.nome, login: user.login, senha: user.senha });
    }
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4001/users/${editUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser),
    })
      .then((res) => res.json())
      .then(() => {
        fetchUsers();
        setEditUserId(null);
        setEditUser({ nome: '', login: '', senha: '' });
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  const handleDeleteUser = (id) => {
    fetch(`http://localhost:4001/users/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchUsers())
      .catch((error) => console.error('Error deleting user:', error));
  };

  return (
    <div>
      <h2>User Management</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Login</th>
            <th>Senha</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.login}</td>
              <td>{user.senha}</td>
              <td>
                <button onClick={() => handleEditUser(user.id)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add New User</h3>
      <form onSubmit={handleAddUser} className="admin-form">
        <input
          type="text"
          placeholder="Nome"
          value={newUser.nome}
          onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Login"
          value={newUser.login}
          onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={newUser.senha}
          onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
          required
        />
        <button type="submit">Add User</button>
      </form>
      {editUserId !== null && (
        <div>
          <h3>Edit User</h3>
          <form onSubmit={handleUpdateUser} className="admin-form">
            <input
              type="text"
              placeholder="Nome"
              value={editUser.nome}
              onChange={(e) => setEditUser({ ...editUser, nome: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Login"
              value={editUser.login}
              onChange={(e) => setEditUser({ ...editUser, login: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={editUser.senha}
              onChange={(e) => setEditUser({ ...editUser, senha: e.target.value })}
              required
            />
            <button type="submit">Update User</button>
            <button type="button" onClick={() => setEditUserId(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
