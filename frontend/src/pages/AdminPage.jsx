"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { AlertContext } from "../App"
import Button from "../components/Button"
import { dishesApi, categoriesApi, newsApi, usersApi, reportsApi } from "../utils/api"
import "../styles/AdminPage.css"
import "../styles/ReportsPage.css"

// Adicionar a função renderReportsTab diretamente no arquivo AdminPage.jsx
// Adicionar antes da função principal AdminPage
const renderReportsTab = ({ activeTab, showAlert }) => {
  const [dashboardStats, setDashboardStats] = useState({
    totalDishes: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalNews: 0,
    totalViews: 0,
    averageRating: 0,
    totalFavorites: 0,
  })
  const [mostViewedDishes, setMostViewedDishes] = useState([])
  const [bestRatedDishes, setBestRatedDishes] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [ratingDistribution, setRatingDistribution] = useState([])
  const [monthlyViews, setMonthlyViews] = useState([])
  const [mostFavoritedDishes, setMostFavoritedDishes] = useState([])
  const [isReportsLoading, setIsReportsLoading] = useState(false)

  const loadReportsData = useCallback(async () => {
    setIsReportsLoading(true)
    try {
      // Carregar estatísticas do dashboard
      const stats = await reportsApi.getDashboardStats()
      setDashboardStats(stats)

      // Carregar pratos mais visualizados
      const mostViewed = await reportsApi.getMostViewedStats()
      setMostViewedDishes(mostViewed)

      // Carregar pratos melhor avaliados
      const bestRated = await reportsApi.getBestRatedStats()
      setBestRatedDishes(bestRated)

      // Carregar distribuição por categoria
      const categoryDist = await reportsApi.getCategoryDistribution()
      setCategoryDistribution(categoryDist)

      // Carregar distribuição de avaliações
      const ratingDist = await reportsApi.getRatingDistribution()
      setRatingDistribution(ratingDist)

      // Carregar visualizações mensais
      const monthlyViewsData = await reportsApi.getMonthlyViews()
      setMonthlyViews(monthlyViewsData)

      // Carregar pratos mais favoritados
      const mostFavoritedDishes = await reportsApi.getMostFavoritedDishes()
      setMostFavoritedDishes(mostFavoritedDishes)
    } catch (error) {
      console.error("Erro ao carregar dados de relatórios:", error)
      showAlert("error", "Erro ao carregar dados de relatórios")
    } finally {
      setIsReportsLoading(false)
    }
  }, [showAlert])

  // Carregar dados de relatórios
  useEffect(() => {
    if (activeTab === "reports") {
      loadReportsData()
    }
  }, [activeTab, loadReportsData])

  // Renderizar gráfico de barras para visualizações mensais
  const renderMonthlyViewsChart = () => {
    const maxViews = Math.max(...monthlyViews.map((item) => item.views))

    return (
      <div className="bar-chart">
        {monthlyViews.map((item, index) => {
          const height = (item.views / maxViews) * 100
          return (
            <div key={index} className="bar" style={{ height: `${height}%` }}>
              <div className="bar-value">{item.views}</div>
              <div className="bar-label">{item.month}</div>
            </div>
          )
        })}
      </div>
    )
  }

  // Renderizar gráfico de barras para distribuição de avaliações
  const renderRatingDistributionChart = () => {
    const maxCount = Math.max(...ratingDistribution.map((item) => item.count))

    return (
      <div className="bar-chart">
        {ratingDistribution.map((item, index) => {
          const height = (item.count / maxCount) * 100
          return (
            <div key={index} className="bar" style={{ height: `${height}%` }}>
              <div className="bar-value">{item.count}</div>
              <div className="bar-label">{item.rating} ★</div>
            </div>
          )
        })}
      </div>
    )
  }

  // Renderizar gráfico de pizza para distribuição por categoria
  const renderCategoryDistributionChart = () => {
    const totalDishes = categoryDistribution.reduce((sum, item) => sum + item.count, 0)
    let startAngle = 0

    const colors = [
      "#008489", // primary
      "#ff5a5f", // secondary
      "#ffb400", // yellow
      "#00a699", // teal
      "#fc642d", // orange
      "#7b0051", // purple
      "#00d1c1", // light teal
      "#ffaa91", // light orange
      "#b4a76c", // olive
      "#6cb4a7", // sage
    ]

    return (
      <div className="pie-chart">
        {categoryDistribution.map((item, index) => {
          const percentage = (item.count / totalDishes) * 100
          const angle = (percentage / 100) * 360
          const rotate = startAngle
          startAngle += angle

          return (
            <div
              key={index}
              className="pie-segment"
              style={{
                backgroundColor: colors[index % colors.length],
                transform: `rotate(${rotate}deg)`,
                clipPath: `polygon(50% 50%, 100% 0, ${angle < 180 ? "100% 100%" : "0 100%"}, ${angle < 270 ? "0 0" : "100% 0"})`,
              }}
            />
          )
        })}

        <div className="pie-legend">
          {categoryDistribution.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: colors[index % colors.length] }} />
              <span className="legend-label">{item.category}</span>
              <span className="legend-value">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-tab-content">
      <h2>Relatórios e Estatísticas</h2>

      {isReportsLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando relatórios...</span>
        </div>
      ) : (
        <div className="reports-container">
          {/* Cards de estatísticas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <div className="stat-value">{dashboardStats.totalDishes}</div>
              <div className="stat-label">Pratos Cadastrados</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-eye"></i>
              </div>
              <div className="stat-value">{dashboardStats.totalViews.toLocaleString()}</div>
              <div className="stat-label">Visualizações Totais</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-value">{dashboardStats.averageRating.toFixed(1)}</div>
              <div className="stat-label">Avaliação Média</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="stat-value">{dashboardStats.totalFavorites}</div>
              <div className="stat-label">Favoritos Totais</div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Visualizações Mensais</h3>
                <p className="chart-description">Número de visualizações por mês</p>
              </div>
              <div className="chart-container">{renderMonthlyViewsChart()}</div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Distribuição de Avaliações</h3>
                <p className="chart-description">Número de pratos por avaliação</p>
              </div>
              <div className="chart-container">{renderRatingDistributionChart()}</div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Distribuição por Categoria</h3>
                <p className="chart-description">Número de pratos por categoria</p>
              </div>
              <div className="chart-container">{renderCategoryDistributionChart()}</div>
            </div>
          </div>

          {/* Tabelas */}
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Pratos Mais Visualizados</h3>
              <p className="table-description">Os 5 pratos com mais visualizações</p>
            </div>
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Nome do Prato</th>
                  <th>Visualizações</th>
                </tr>
              </thead>
              <tbody>
                {mostViewedDishes.map((dish, index) => (
                  <tr key={dish.id}>
                    <td>{index + 1}</td>
                    <td>{dish.name}</td>
                    <td>{dish.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Pratos Melhor Avaliados</h3>
              <p className="table-description">Os 5 pratos com as melhores avaliações</p>
            </div>
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Nome do Prato</th>
                  <th>Avaliação</th>
                </tr>
              </thead>
              <tbody>
                {bestRatedDishes.map((dish, index) => (
                  <tr key={dish.id}>
                    <td>{index + 1}</td>
                    <td>{dish.name}</td>
                    <td>{dish.rating.toFixed(1)} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Pratos Mais Favoritados</h3>
              <p className="table-description">Os 5 pratos mais adicionados aos favoritos</p>
            </div>
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Nome do Prato</th>
                  <th>Favoritos</th>
                </tr>
              </thead>
              <tbody>
                {mostFavoritedDishes.map((dish, index) => (
                  <tr key={dish.id}>
                    <td>{index + 1}</td>
                    <td>{dish.name}</td>
                    <td>{dish.favorites}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * AdminPage component for iLoveRU application
 * Provides admin functionalities to manage dishes, categories, news, and users
 */
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dishes")
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])
  const [news, setNews] = useState([])
  const [users, setUsers] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editItemId, setEditItemId] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { showAlert } = useContext(AlertContext)
  const [dashboardStats, setDashboardStats] = useState({
    totalDishes: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalNews: 0,
    totalViews: 0,
    averageRating: 0,
    totalFavorites: 0,
  })
  const [mostViewedDishes, setMostViewedDishes] = useState([])
  const [bestRatedDishes, setBestRatedDishes] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [ratingDistribution, setRatingDistribution] = useState([])
  const [monthlyViews, setMonthlyViews] = useState([])
  const [mostFavoritedDishes, setMostFavoritedDishes] = useState([])
  const [isReportsLoading, setIsReportsLoading] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Fetch dishes, categories, news, and users from API
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const dishesData = await dishesApi.getAll()
      setDishes(dishesData)

      const categoriesData = await categoriesApi.getAll()
      setCategories(categoriesData)

      const newsData = await newsApi.getAll()
      setNews(newsData)

      const usersData = await usersApi.getAll()
      setUsers(usersData)

      // Load reports data if the active tab is 'reports'
      if (activeTab === "reports") {
        await loadReportsData()
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      showAlert("error", "Erro ao carregar os dados. Por favor, tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadReportsData = useCallback(async () => {
    setIsReportsLoading(true)
    try {
      // Carregar estatísticas do dashboard
      const stats = await reportsApi.getDashboardStats()
      setDashboardStats(stats)

      // Carregar pratos mais visualizados
      const mostViewed = await reportsApi.getMostViewedStats()
      setMostViewedDishes(mostViewed)

      // Carregar pratos melhor avaliados
      const bestRated = await reportsApi.getBestRatedStats()
      setBestRatedDishes(bestRated)

      // Carregar distribuição por categoria
      const categoryDist = await reportsApi.getCategoryDistribution()
      setCategoryDistribution(categoryDist)

      // Carregar distribuição de avaliações
      const ratingDist = await reportsApi.getRatingDistribution()
      setRatingDistribution(ratingDist)

      // Carregar visualizações mensais
      const monthlyViewsData = await reportsApi.getMonthlyViews()
      setMonthlyViews(monthlyViewsData)

      // Carregar pratos mais favoritados
      const mostFavoritedDishes = await reportsApi.getMostFavoritedDishes()
      setMostFavoritedDishes(mostFavoritedDishes)
    } catch (error) {
      console.error("Erro ao carregar dados de relatórios:", error)
      showAlert("error", "Erro ao carregar dados de relatórios")
    } finally {
      setIsReportsLoading(false)
    }
  }, [showAlert])

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setIsEditing(false)
    setEditItemId(null)
    setFormValues({})
    setFormErrors({})

    // Load reports data when the 'reports' tab is selected
    if (tab === "reports") {
      loadReportsData()
    }
  }

  // Handle edit item
  const handleEditItem = (item, tab) => {
    setIsEditing(true)
    setEditItemId(item.id)
    setFormValues(item)
    setActiveTab(tab)
    setFormErrors({})
  }

  // Handle delete item
  const handleDeleteItem = async (id, tab) => {
    try {
      let result
      switch (tab) {
        case "dishes":
          result = await dishesApi.delete(id)
          break
        case "categories":
          result = await categoriesApi.delete(id)
          break
        case "news":
          result = await newsApi.delete(id)
          break
        case "users":
          result = await usersApi.delete(id)
          break
        default:
          showAlert("error", "Aba inválida")
          return
      }

      if (result.error) {
        showAlert("error", result.error)
      } else {
        showAlert("success", "Item excluído com sucesso")
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      showAlert("error", "Erro ao excluir o item. Por favor, tente novamente mais tarde.")
    }
  }

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Validate form values
  const validateForm = (values, tab) => {
    const errors = {}

    switch (tab) {
      case "dishes":
        if (!values.name) errors.name = "Nome é obrigatório"
        if (!values.category) errors.category = "Categoria é obrigatória"
        if (!values.ingredients) errors.ingredients = "Ingredientes são obrigatórios"
        break
      case "categories":
        if (!values.name) errors.name = "Nome é obrigatório"
        break
      case "news":
        if (!values.title) errors.title = "Título é obrigatório"
        if (!values.subtitle) errors.subtitle = "Subtítulo é obrigatório"
        if (!values.body) errors.body = "Corpo da notícia é obrigatório"
        break
      case "users":
        if (!values.nome) errors.nome = "Nome é obrigatório"
        if (!values.login) errors.login = "Login é obrigatório"
        if (!values.senha) errors.senha = "Senha é obrigatória"
        break
      default:
        break
    }

    return errors
  }

  // Handle form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm(formValues, activeTab)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      showAlert("error", "Por favor, corrija os erros no formulário.")
      return
    }

    try {
      let result
      if (isEditing) {
        // Update existing item
        switch (activeTab) {
          case "dishes":
            result = await dishesApi.update(editItemId, formValues)
            break
          case "categories":
            result = await categoriesApi.update(editItemId, formValues)
            break
          case "news":
            result = await newsApi.update(editItemId, formValues)
            break
          case "users":
            result = await usersApi.update(editItemId, formValues)
            break
          default:
            showAlert("error", "Aba inválida")
            return
        }
      } else {
        // Create new item
        switch (activeTab) {
          case "dishes":
            result = await dishesApi.create(formValues)
            break
          case "categories":
            result = await categoriesApi.create(formValues)
            break
          case "news":
            result = await newsApi.create(formValues)
            break
          case "users":
            result = await usersApi.create(formValues)
            break
          default:
            showAlert("error", "Aba inválida")
            return
        }
      }

      if (result.error) {
        showAlert("error", result.error)
      } else {
        showAlert("success", "Item salvo com sucesso")
        fetchData()
        setIsEditing(false)
        setEditItemId(null)
        setFormValues({})
      }
    } catch (error) {
      console.error("Error saving item:", error)
      showAlert("error", "Erro ao salvar o item. Por favor, tente novamente mais tarde.")
    }
  }

  // Render form
  const renderForm = () => {
    switch (activeTab) {
      case "dishes":
        return (
          <form className="admin-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name || ""}
                onChange={handleFormChange}
                className={formErrors.name ? "input-error" : ""}
              />
              {formErrors.name && <span className="form-error">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formValues.description || ""}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="img">URL da Imagem</label>
              <input type="text" id="img" name="img" value={formValues.img || ""} onChange={handleFormChange} />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={formValues.category || ""}
                onChange={handleFormChange}
                className={formErrors.category ? "input-error" : ""}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formErrors.category && <span className="form-error">{formErrors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ingredients">Ingredientes</label>
              <input
                type="text"
                id="ingredients"
                name="ingredients"
                value={formValues.ingredients || ""}
                onChange={handleFormChange}
                className={formErrors.ingredients ? "input-error" : ""}
              />
              {formErrors.ingredients && <span className="form-error">{formErrors.ingredients}</span>}
            </div>

            <div className="form-actions">
              <Button type="submit" text="Salvar" />
              {isEditing && <Button type="secondary" text="Cancelar" onClick={() => setIsEditing(false)} />}
            </div>
          </form>
        )
      case "categories":
        return (
          <form className="admin-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="category-name">Nome</label>
              <input
                type="text"
                id="category-name"
                name="name"
                value={formValues.name || ""}
                onChange={handleFormChange}
                className={formErrors.name ? "input-error" : ""}
              />
              {formErrors.name && <span className="form-error">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category-description">Descrição</label>
              <textarea
                id="category-description"
                name="description"
                value={formValues.description || ""}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-actions">
              <Button type="submit" text="Salvar" />
              {isEditing && <Button type="secondary" text="Cancelar" onClick={() => setIsEditing(false)} />}
            </div>
          </form>
        )
      case "news":
        return (
          <form className="admin-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="news-title">Título</label>
              <input
                type="text"
                id="news-title"
                name="title"
                value={formValues.title || ""}
                onChange={handleFormChange}
                className={formErrors.title ? "input-error" : ""}
              />
              {formErrors.title && <span className="form-error">{formErrors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="news-subtitle">Subtítulo</label>
              <input
                type="text"
                id="news-subtitle"
                name="subtitle"
                value={formValues.subtitle || ""}
                onChange={handleFormChange}
                className={formErrors.subtitle ? "input-error" : ""}
              />
              {formErrors.subtitle && <span className="form-error">{formErrors.subtitle}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="news-body">Corpo da Notícia</label>
              <textarea
                id="news-body"
                name="body"
                value={formValues.body || ""}
                onChange={handleFormChange}
                className={formErrors.body ? "input-error" : ""}
              />
              {formErrors.body && <span className="form-error">{formErrors.body}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="news-img">URL da Imagem</label>
              <input type="text" id="news-img" name="img" value={formValues.img || ""} onChange={handleFormChange} />
            </div>

            <div className="form-actions">
              <Button type="submit" text="Salvar" />
              {isEditing && <Button type="secondary" text="Cancelar" onClick={() => setIsEditing(false)} />}
            </div>
          </form>
        )
      case "users":
        return (
          <form className="admin-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="user-nome">Nome</label>
              <input
                type="text"
                id="user-nome"
                name="nome"
                value={formValues.nome || ""}
                onChange={handleFormChange}
                className={formErrors.nome ? "input-error" : ""}
              />
              {formErrors.nome && <span className="form-error">{formErrors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="user-login">Login</label>
              <input
                type="text"
                id="user-login"
                name="login"
                value={formValues.login || ""}
                onChange={handleFormChange}
                className={formErrors.login ? "input-error" : ""}
              />
              {formErrors.login && <span className="form-error">{formErrors.login}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="user-senha">Senha</label>
              <input
                type="password"
                id="user-senha"
                name="senha"
                value={formValues.senha || ""}
                onChange={handleFormChange}
                className={formErrors.senha ? "input-error" : ""}
              />
              {formErrors.senha && <span className="form-error">{formErrors.senha}</span>}
            </div>

            <div className="form-actions">
              <Button type="submit" text="Salvar" />
              {isEditing && <Button type="secondary" text="Cancelar" onClick={() => setIsEditing(false)} />}
            </div>
          </form>
        )
      default:
        return null
    }
  }

  // Render table
  const renderTable = () => {
    let data = []
    let columns = []
    let tabName = ""

    switch (activeTab) {
      case "dishes":
        data = dishes
        columns = ["Nome", "Categoria", "Ingredientes"]
        tabName = "Pratos"
        break
      case "categories":
        data = categories
        columns = ["Nome", "Descrição"]
        tabName = "Categorias"
        break
      case "news":
        data = news
        columns = ["Título", "Subtítulo", "Data de Publicação"]
        tabName = "Notícias"
        break
      case "users":
        data = users
        columns = ["Nome", "Login"]
        tabName = "Usuários"
        break
      default:
        return null
    }

    return (
      <div className="admin-table-container">
        <h2>Lista de {tabName}</h2>
        {data.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  {activeTab === "dishes" && (
                    <>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.ingredients}</td>
                    </>
                  )}
                  {activeTab === "categories" && (
                    <>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                    </>
                  )}
                  {activeTab === "news" && (
                    <>
                      <td>{item.title}</td>
                      <td>{item.subtitle}</td>
                      <td>{item.publicationDate}</td>
                    </>
                  )}
                  {activeTab === "users" && (
                    <>
                      <td>{item.nome}</td>
                      <td>{item.login}</td>
                    </>
                  )}
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEditItem(item, activeTab)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteItem(item.id, activeTab)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-table">Nenhum item cadastrado</div>
        )}
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <p>Gerencie os dados do aplicativo iLoveRU</p>
      </div>

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "dishes" ? "active" : ""}`}
            onClick={() => handleTabChange("dishes")}
          >
            <i className="fas fa-utensils"></i> Pratos
          </button>

          <button
            className={`admin-tab ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => handleTabChange("categories")}
          >
            <i className="fas fa-tags"></i> Categorias
          </button>

          <button
            className={`admin-tab ${activeTab === "news" ? "active" : ""}`}
            onClick={() => handleTabChange("news")}
          >
            <i className="fas fa-newspaper"></i> Notícias
          </button>

          <button
            className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => handleTabChange("users")}
          >
            <i className="fas fa-users"></i> Usuários
          </button>

          <button
            className={`admin-tab ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => handleTabChange("reports")}
          >
            <i className="fas fa-chart-bar"></i> Relatórios
          </button>
        </div>

        <div className="admin-content">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Carregando...</span>
            </div>
          ) : activeTab === "reports" ? (
            renderReportsTab({ activeTab, showAlert })
          ) : (
            <>
              <h2>
                {isEditing ? "Editar" : "Adicionar"}{" "}
                {activeTab === "dishes"
                  ? "Prato"
                  : activeTab === "categories"
                    ? "Categoria"
                    : activeTab === "news"
                      ? "Notícia"
                      : "Usuário"}
              </h2>
              {renderForm()}
              {renderTable()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

