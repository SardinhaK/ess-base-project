"use client"

import { useState, useEffect, useContext } from "react"
import { dishesApi, categoriesApi, usersApi, newsApi } from "../utils/api"
import { AlertContext } from "../App"
import "../styles/AdminPage.css"

/**
 * AdminPage component for iLoveRU application
 * Admin dashboard for managing dishes, categories, users, and news
 */
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dishes")
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Use the global alert context
  const { showAlert, clearAlert } = useContext(AlertContext)

  // Form states
  const [dishForm, setDishForm] = useState({
    id: "",
    name: "",
    description: "",
    img: "",
    category: "",
    ingredients: "",
  })

  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    description: "",
  })

  const [userForm, setUserForm] = useState({
    id: "",
    nome: "",
    login: "",
    senha: "",
  })

  const [newsForm, setNewsForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    body: "",
    publicationDate: new Date().toISOString().split("T")[0],
  })

  // Edit mode states
  const [editMode, setEditMode] = useState({
    dishes: false,
    categories: false,
    users: false,
    news: false,
  })

  // Fetch data on component mount and tab change
  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  // Fetch data based on active tab
  const fetchData = async (tab) => {
    setIsLoading(true)
    try {
      switch (tab) {
        case "dishes":
          const dishesData = await dishesApi.getAll()
          setDishes(dishesData)
          // Also fetch categories for the dish form
          const categoriesData = await categoriesApi.getAll()
          setCategories(categoriesData)
          break
        case "categories":
          const categoriesOnly = await categoriesApi.getAll()
          setCategories(categoriesOnly)
          break
        case "users":
          const usersData = await usersApi.getAll()
          setUsers(usersData)
          break
        case "news":
          const newsData = await newsApi.getAll()
          setNews(newsData)
          break
        default:
          break
      }
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error)
      showAlert("error", `Erro ao carregar ${tab}: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form based on active tab
  const resetForm = (tab) => {
    switch (tab) {
      case "dishes":
        setDishForm({
          id: "",
          name: "",
          description: "",
          img: "",
          category: "",
          ingredients: "",
        })
        break
      case "categories":
        setCategoryForm({
          id: "",
          name: "",
          description: "",
        })
        break
      case "users":
        setUserForm({
          id: "",
          nome: "",
          login: "",
          senha: "",
        })
        break
      case "news":
        setNewsForm({
          id: "",
          title: "",
          subtitle: "",
          body: "",
          publicationDate: new Date().toISOString().split("T")[0],
        })
        break
      default:
        break
    }

    setEditMode({
      ...editMode,
      [tab]: false,
    })
  }

  // Handle form input change
  const handleInputChange = (e, formType) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === "checkbox" ? checked : value

    switch (formType) {
      case "dishes":
        setDishForm({
          ...dishForm,
          [name]: inputValue,
        })
        break
      case "categories":
        setCategoryForm({
          ...categoryForm,
          [name]: inputValue,
        })
        break
      case "users":
        setUserForm({
          ...userForm,
          [name]: inputValue,
        })
        break
      case "news":
        setNewsForm({
          ...newsForm,
          [name]: inputValue,
        })
        break
      default:
        break
    }
  }

  // Validate category form
  const validateCategoryForm = () => {
    if (!categoryForm.name) {
      showAlert("error", "Nome da categoria é obrigatório")
      return false
    }

    if (categoryForm.name.length < 2) {
      showAlert("error", "Nome deve ter pelo menos 2 caracteres")
      return false
    }

    if (categoryForm.name.length > 50) {
      showAlert("error", "Nome não pode ter mais que 50 caracteres")
      return false
    }

    if (categoryForm.description && categoryForm.description.length > 200) {
      showAlert("error", "Descrição não pode ter mais que 200 caracteres")
      return false
    }

    return true
  }

  // Handle form submission
  const handleSubmit = async (e, formType) => {
    e.preventDefault()
    clearAlert()

    try {
      switch (formType) {
        case "dishes":
          if (editMode.dishes) {
            await dishesApi.update(dishForm.id, dishForm)
            showAlert("success", "Prato atualizado com sucesso!")
          } else {
            await dishesApi.create(dishForm)
            showAlert("success", "Prato adicionado com sucesso!")
          }
          break
        case "categories":
          // Validate category form
          if (!validateCategoryForm()) {
            return
          }

          if (editMode.categories) {
            const result = await categoriesApi.update(categoryForm.id, categoryForm)
            if (result.error) {
              showAlert("error", result.error)
              return
            }
            showAlert("success", "Categoria atualizada com sucesso!")
          } else {
            const result = await categoriesApi.create(categoryForm)
            if (result.error) {
              showAlert("error", result.error)
              return
            }
            showAlert("success", "Categoria adicionada com sucesso!")
          }
          break
        case "users":
          if (editMode.users) {
            await usersApi.update(userForm.id, userForm)
            showAlert("success", "Usuário atualizado com sucesso!")
          } else {
            await usersApi.create(userForm)
            showAlert("success", "Usuário adicionado com sucesso!")
          }
          break
        case "news":
          if (editMode.news) {
            await newsApi.update(newsForm.id, newsForm)
            showAlert("success", "Notícia atualizada com sucesso!")
          } else {
            await newsApi.create(newsForm)
            showAlert("success", "Notícia adicionada com sucesso!")
          }
          break
        default:
          break
      }

      // Refresh data and reset form
      fetchData(formType)
      resetForm(formType)
    } catch (error) {
      console.error(`Error submitting ${formType} form:`, error)
      showAlert("error", `Erro ao salvar: ${error.message}`)
    }
  }

  // Handle edit button click
  const handleEdit = (item, formType) => {
    switch (formType) {
      case "dishes":
        setDishForm({
          id: item.id,
          name: item.name,
          description: item.description,
          img: item.img,
          category: item.category,
          ingredients: item.ingredients,
        })
        break
      case "categories":
        setCategoryForm({
          id: item.id,
          name: item.name,
          description: item.description,
        })
        break
      case "users":
        setUserForm({
          id: item.id,
          nome: item.nome,
          login: item.login,
          senha: item.senha,
        })
        break
      case "news":
        // Corrigir o problema da data
        let publicationDate = item.publicationDate

        // Garantir que estamos usando a data correta
        if (publicationDate.includes("T")) {
          publicationDate = publicationDate.split("T")[0]
        }

        setNewsForm({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          body: item.body,
          publicationDate: publicationDate,
        })
        break
      default:
        break
    }

    setEditMode({
      ...editMode,
      [formType]: true,
    })
  }

  // Handle delete button click
  const handleDelete = async (id, formType) => {
    if (!window.confirm(`Tem certeza que deseja excluir este item?`)) {
      return
    }

    clearAlert()

    try {
      switch (formType) {
        case "dishes":
          await dishesApi.delete(id)
          showAlert("success", "Prato excluído com sucesso!")
          break
        case "categories":
          const result = await categoriesApi.delete(id)
          if (result.error) {
            showAlert("error", result.error)
            return
          }
          showAlert("success", "Categoria excluída com sucesso!")
          break
        case "users":
          await usersApi.delete(id)
          showAlert("success", "Usuário excluído com sucesso!")
          break
        case "news":
          await newsApi.delete(id)
          showAlert("success", "Notícia excluída com sucesso!")
          break
        default:
          break
      }

      // Refresh data
      fetchData(formType)
    } catch (error) {
      console.error(`Error deleting ${formType} item:`, error)
      showAlert("error", `Erro ao excluir: ${error.message}`)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    // Criar um objeto Date com a data fornecida
    const date = new Date(dateString)

    // Formatar a data no estilo brasileiro
    return date.toLocaleDateString("pt-BR")
  }

  // Render dishes tab content
  const renderDishesTab = () => {
    return (
      <div className="admin-tab-content">
        <h2>Gerenciar Pratos</h2>

        {/* Dishes Form */}
        <form className="admin-form" onSubmit={(e) => handleSubmit(e, "dishes")}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={dishForm.name}
                onChange={(e) => handleInputChange(e, "dishes")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={dishForm.category}
                onChange={(e) => handleInputChange(e, "dishes")}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={dishForm.description}
              onChange={(e) => handleInputChange(e, "dishes")}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredientes</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={dishForm.ingredients}
              onChange={(e) => handleInputChange(e, "dishes")}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="img">URL da Imagem</label>
            <input
              type="url"
              id="img"
              name="img"
              value={dishForm.img}
              onChange={(e) => handleInputChange(e, "dishes")}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editMode.dishes ? "Atualizar Prato" : "Adicionar Prato"}
            </button>

            {editMode.dishes && (
              <button type="button" className="btn-secondary" onClick={() => resetForm("dishes")}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Dishes Table */}
        <div className="admin-table-container">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Carregando...</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Avaliação</th>
                  <th>Views</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dishes.length > 0 ? (
                  dishes.map((dish) => (
                    <tr key={dish.id}>
                      <td>{dish.name}</td>
                      <td>{dish.category}</td>
                      <td>{dish.rating !== undefined && dish.rating !== null ? dish.rating.toFixed(1) : "N/A"}</td>
                      <td>{dish.views}</td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(dish, "dishes")}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(dish.id, "dishes")}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      Nenhum prato cadastrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }

  // Render categories tab content
  const renderCategoriesTab = () => {
    return (
      <div className="admin-tab-content">
        <h2>Gerenciar Categorias</h2>

        {/* Categories Form */}
        <form className="admin-form" onSubmit={(e) => handleSubmit(e, "categories")}>
          <div className="form-group">
            <label htmlFor="category-name">Nome</label>
            <input
              type="text"
              id="category-name"
              name="name"
              value={categoryForm.name}
              onChange={(e) => handleInputChange(e, "categories")}
              required
              maxLength={50}
            />
            <small className="form-hint">
              O nome deve ter entre 2 e 50 caracteres. ({categoryForm.name.length}/50)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="category-description">Descrição</label>
            <textarea
              id="category-description"
              name="description"
              value={categoryForm.description}
              onChange={(e) => handleInputChange(e, "categories")}
              maxLength={200}
            ></textarea>
            <small className="form-hint">Máximo de 200 caracteres. ({categoryForm.description.length}/200)</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editMode.categories ? "Atualizar Categoria" : "Adicionar Categoria"}
            </button>

            {editMode.categories && (
              <button type="button" className="btn-secondary" onClick={() => resetForm("categories")}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Categories Table */}
        <div className="admin-table-container">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Carregando...</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(category, "categories")}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(category.id, "categories")}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-table">
                      Nenhuma categoria cadastrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }

  // Render users tab content
  const renderUsersTab = () => {
    return (
      <div className="admin-tab-content">
        <h2>Gerenciar Usuários</h2>

        {/* Users Form */}
        <form className="admin-form" onSubmit={(e) => handleSubmit(e, "users")}>
          <div className="form-group">
            <label htmlFor="user-nome">Nome</label>
            <input
              type="text"
              id="user-nome"
              name="nome"
              value={userForm.nome}
              onChange={(e) => handleInputChange(e, "users")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-login">Login</label>
            <input
              type="text"
              id="user-login"
              name="login"
              value={userForm.login}
              onChange={(e) => handleInputChange(e, "users")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-senha">Senha</label>
            <input
              type="password"
              id="user-senha"
              name="senha"
              value={userForm.senha}
              onChange={(e) => handleInputChange(e, "users")}
              required
              disabled={editMode.users} // Disable password field in edit mode
              className={editMode.users ? "disabled-input" : ""}
            />
            {editMode.users && <small className="form-hint">A senha não pode ser alterada durante a edição.</small>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editMode.users ? "Atualizar Usuário" : "Adicionar Usuário"}
            </button>

            {editMode.users && (
              <button type="button" className="btn-secondary" onClick={() => resetForm("users")}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Users Table */}
        <div className="admin-table-container">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Carregando...</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Login</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nome}</td>
                      <td>{user.login}</td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(user, "users")}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(user.id, "users")}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-table">
                      Nenhum usuário cadastrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }

  // Render news tab content
  const renderNewsTab = () => {
    return (
      <div className="admin-tab-content">
        <h2>Gerenciar Notícias</h2>

        {/* News Form */}
        <form className="admin-form" onSubmit={(e) => handleSubmit(e, "news")}>
          <div className="form-group">
            <label htmlFor="news-title">Título</label>
            <input
              type="text"
              id="news-title"
              name="title"
              value={newsForm.title}
              onChange={(e) => handleInputChange(e, "news")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="news-subtitle">Subtítulo</label>
            <input
              type="text"
              id="news-subtitle"
              name="subtitle"
              value={newsForm.subtitle}
              onChange={(e) => handleInputChange(e, "news")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="news-body">Conteúdo</label>
            <textarea
              id="news-body"
              name="body"
              value={newsForm.body}
              onChange={(e) => handleInputChange(e, "news")}
              required
              rows="6"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="news-date">Data de Publicação</label>
              <input
                type="date"
                id="news-date"
                name="publicationDate"
                value={newsForm.publicationDate}
                onChange={(e) => handleInputChange(e, "news")}
                required
                disabled={editMode.news} // Disable date field in edit mode
                className={editMode.news ? "disabled-input" : ""}
              />
              {editMode.news && (
                <small className="form-hint">A data de publicação não pode ser alterada durante a edição.</small>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editMode.news ? "Atualizar Notícia" : "Adicionar Notícia"}
            </button>

            {editMode.news && (
              <button type="button" className="btn-secondary" onClick={() => resetForm("news")}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* News Table */}
        <div className="admin-table-container">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Carregando...</span>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Data</th>
                  <th>Visualizações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {news.length > 0 ? (
                  news.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{formatDate(item.publicationDate)}</td>
                      <td>{item.views}</td>
                      <td className="action-buttons">
                        <button className="btn-edit" onClick={() => handleEdit(item, "news")}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id, "news")}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-table">
                      Nenhuma notícia cadastrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <p>Gerencie pratos, categorias, usuários e notícias do Restaurante Universitário</p>
      </div>

      <div className="admin-container">
        {/* Admin Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "dishes" ? "active" : ""}`}
            onClick={() => setActiveTab("dishes")}
          >
            <i className="fas fa-utensils"></i> Pratos
          </button>

          <button
            className={`admin-tab ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <i className="fas fa-tags"></i> Categorias
          </button>

          <button
            className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fas fa-users"></i> Usuários
          </button>

          <button className={`admin-tab ${activeTab === "news" ? "active" : ""}`} onClick={() => setActiveTab("news")}>
            <i className="fas fa-newspaper"></i> Notícias
          </button>
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {activeTab === "dishes" && renderDishesTab()}
          {activeTab === "categories" && renderCategoriesTab()}
          {activeTab === "users" && renderUsersTab()}
          {activeTab === "news" && renderNewsTab()}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

