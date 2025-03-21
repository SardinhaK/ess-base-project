/**
 * API utility for iLoveRU application
 * Contains all API calls to the backend server
 */

const API_BASE_URL = "http://localhost:4001"

// Função para verificar se o backend está disponível
export const checkBackendAvailability = async () => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(`${API_BASE_URL}/dishes`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.warn("Backend não disponível:", error)
    return false
  }
}

// Placeholder image URL
export const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x200?text=iLoveRU"
export const PLACEHOLDER_NEWS = "https://static.vecteezy.com/ti/vetor-gratis/p1/7241519-estilo-de-icone-de-banner-de-noticias-gratis-vetor.jpg"

// Dishes API
export const dishesApi = {
  // Get all dishes
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching dishes:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        {
          id: 1,
          name: "Frango à Parmegiana",
          description: "Filé de frango empanado coberto com molho de tomate e queijo derretido.",
          img: PLACEHOLDER_IMAGE,
          category: "Aves",
          ingredients: "frango, farinha de rosca, ovos, molho de tomate, queijo muçarela",
          rating: 4.2,
          views: 1000,
          trending: true,
        },
        {
          id: 2,
          name: "Lasanha de Berinjela",
          description: "Camadas de berinjela, molho de tomate e queijo gratinado.",
          img: PLACEHOLDER_IMAGE,
          category: "Vegetariano",
          ingredients: "berinjela, molho de tomate, queijo, manjericão",
          rating: 4.5,
          views: 850,
          trending: true,
        },
        {
          id: 3,
          name: "Salada Caesar",
          description: "Mix de folhas verdes, croutons, frango grelhado e molho caesar.",
          img: PLACEHOLDER_IMAGE,
          category: "Saladas",
          ingredients: "alface, croutons, frango, molho caesar, queijo parmesão",
          rating: 4.0,
          views: 600,
          trending: false,
        },
      ]
    }
  },

  // Create a new dish
  create: async (dish) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dish),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "Erro ao criar prato" }
      }

      return data
    } catch (error) {
      console.error("Error creating dish:", error)
      return { error: "Falha na conexão com o servidor" }
    }
  },

  // Update a dish
  update: async (id, dish) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dish),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { error: errorData.error || `Erro ao atualizar prato ${id}` }
      }

      return await response.json()
    } catch (error) {
      console.error(`Error updating dish ${id}:`, error)
      return { error: "Falha na conexão com o servidor" }
    }
  },

  // Delete a dish
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        if (response.status === 404) {
          return { error: "Prato não encontrado" }
        }
        const errorData = await response.json()
        return { error: errorData.error || `Erro ao excluir prato ${id}` }
      }

      return { success: true }
    } catch (error) {
      console.error(`Error deleting dish ${id}:`, error)
      return { error: "Falha na conexão com o servidor" }
    }
  },

  // Get most viewed dishes
  getMostViewed: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/most-viewed`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching most viewed dishes:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        {
          id: 1,
          name: "Frango à Parmegiana",
          description: "Filé de frango empanado coberto com molho de tomate e queijo derretido.",
          img: PLACEHOLDER_IMAGE,
          category: "Aves",
          ingredients: "frango, farinha de rosca, ovos, molho de tomate, queijo muçarela",
          rating: 4.2,
          views: 1000,
        },
        {
          id: 2,
          name: "Lasanha de Berinjela",
          description: "Camadas de berinjela, molho de tomate e queijo gratinado.",
          img: PLACEHOLDER_IMAGE,
          category: "Vegetariano",
          ingredients: "berinjela, molho de tomate, queijo, manjericão",
          rating: 4.5,
          views: 850,
        },
        {
          id: 3,
          name: "Salada Caesar",
          description: "Mix de folhas verdes, croutons, frango grelhado e molho caesar.",
          img: PLACEHOLDER_IMAGE,
          category: "Saladas",
          ingredients: "alface, croutons, frango, molho caesar, queijo parmesão",
          rating: 4.0,
          views: 600,
        },
      ]
    }
  },

  // Get best rated dishes
  getBestRated: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dishes/best-rated`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching best rated dishes:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        {
          id: 4,
          name: "Risoto de Cogumelos",
          description: "Arroz arbóreo cremoso com mix de cogumelos frescos e parmesão.",
          img: PLACEHOLDER_IMAGE,
          category: "Vegetariano",
          ingredients: "arroz arbóreo, cogumelos, caldo de legumes, vinho branco, queijo parmesão",
          rating: 4.8,
          views: 750,
        },
        {
          id: 5,
          name: "Salmão Grelhado",
          description: "Filé de salmão grelhado com ervas finas e limão.",
          img: PLACEHOLDER_IMAGE,
          category: "Peixes",
          ingredients: "salmão, azeite, limão, alecrim, tomilho",
          rating: 4.7,
          views: 820,
        },
        {
          id: 6,
          name: "Ratatouille",
          description: "Prato tradicional francês com legumes assados em molho de tomate.",
          img: PLACEHOLDER_IMAGE,
          category: "Vegetariano",
          ingredients: "berinjela, abobrinha, pimentão, tomate, cebola, alho",
          rating: 4.6,
          views: 580,
        },
      ]
    }
  },
}

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching categories:", error)
      return [
        {
          id: 1,
          name: "Carnes",
          description: "Pratos com carne bovina, suína, frango, etc.",
        },
        {
          id: 2,
          name: "Vegetariano",
          description: "Pratos sem carne, ideais para vegetarianos.",
        },
        {
          id: 3,
          name: "Saladas",
          description: "Opções leves e saudáveis.",
        },
      ]
    }
  },

  // Get a specific category
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`)
      return await response.json()
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error)
      return {
        id: id,
        name: "Categoria Mock",
        description: "Descrição mock",
      }
    }
  },

  // Create a new category
  create: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { error: errorData.error || "Erro ao criar categoria" }
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating category:", error)
      return { error: "Failed to create category (mocked)" }
    }
  },

  // Update a category
  update: async (id, category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { error: errorData.error || `Erro ao atualizar categoria ${id}` }
      }

      return await response.json()
    } catch (error) {
      console.error(`Error updating category ${id}:`, error)
      return { error: `Failed to update category ${id} (mocked)` }
    }
  },

  // Delete a category
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { error: errorData.error || `Erro ao excluir categoria ${id}` }
      }

      return { success: true }
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error)
      return { error: `Failed to delete category ${id} (mocked)` }
    }
  },
}

// Search API
export const searchApi = {
  // Search dishes with filters
  search: async (params) => {
    try {
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/search?${queryParams}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Nenhum prato encontrado com esses filtros")
        }
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro na busca")
      }

      return await response.json()
    } catch (error) {
      console.error("Error searching dishes:", error)
      throw error // Re-throw to handle in the component
    }
  },

  // Get search history
  getHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/search/historico`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching search history:", error)
      return [
        {
          termo: "",
          filtros: {
            category: "Italiana",
          },
        },
        {
          termo: "Lasanha",
          filtros: {},
        },
      ]
    }
  },

  // Clear search history
  clearHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/search/historico`, {
        method: "DELETE",
      })
      return { success: true }
    } catch (error) {
      console.error("Error clearing search history:", error)
      return { success: true, message: "Histórico limpo com sucesso (mock)" }
    }
  },

  // Delete a specific search from history
  deleteFromHistory: async (index) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search/historico/${index}`, {
        method: "DELETE",
      })
      return { success: true }
    } catch (error) {
      console.error(`Error deleting search history item ${index}:`, error)
      return { success: true, message: `Item ${index} removido do histórico (mock)` }
    }
  },
}

// Trending API
export const trendingApi = {
  // Get trending dishes
  getTrending: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/trending/em-alta`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching trending dishes:", error)
      return [
        {
          id: 1,
          name: "Frango à Parmegiana",
          description: "Filé de frango empanado coberto com molho de tomate e queijo derretido.",
          img: PLACEHOLDER_IMAGE,
          category: "Aves",
          ingredients: "frango, farinha de rosca, ovos, molho de tomate, queijo muçarela",
          rating: 4.2,
          views: 1000,
        },
        {
          id: 2,
          name: "Lasanha de Berinjela",
          description: "Camadas de berinjela, molho de tomate e queijo gratinado.",
          img: PLACEHOLDER_IMAGE,
          category: "Vegetariano",
          ingredients: "berinjela, molho de tomate, queijo, manjericão",
          rating: 4.5,
          views: 850,
        },
      ]
    }
  },
}

// News API
export const newsApi = {
  // Get all news
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching news:", error)
      return [
        {
          id: 1,
          title: "Novo cardápio no RU UFPE",
          subtitle: "Confira as novidades desta semana no restaurante universitário.",
          body: "O restaurante universitário da UFPE está com um novo cardápio esta semana, incluindo pratos especiais como frango grelhado com legumes e lasanha de berinjela. Venha experimentar!",
          publicationDate: "2025-01-01",
          views: 200,
        },
        {
          id: 2,
          title: "Semana da Alimentação Saudável",
          subtitle: "Eventos e cardápio especial para promover hábitos saudáveis.",
          body: "Durante a próxima semana, o RU terá um cardápio especial focado em alimentação saudável, com opções balanceadas e nutritivas. Além disso, haverá palestras sobre nutrição no auditório central.",
          publicationDate: "2025-01-05",
          views: 150,
        },
      ]
    }
  },

  // Create a news item
  create: async (news) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(news),
      })
      return await response.json()
    } catch (error) {
      console.error("Error creating news:", error)
      return { error: "Failed to create news (mocked)" }
    }
  },

  // Update a news item
  update: async (id, news) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(news),
      })
      return await response.json()
    } catch (error) {
      console.error(`Error updating news ${id}:`, error)
      return { error: `Failed to update news ${id} (mocked)` }
    }
  },

  // Delete a news item
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: "DELETE",
      })
      return await response.json()
    } catch (error) {
      console.error(`Error deleting news ${id}:`, error)
      return { error: `Failed to delete news ${id} (mocked)` }
    }
  },
}

// Users API
export const usersApi = {
  // Get all users
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching users:", error)
      return [
        {
          id: 1,
          nome: "Ana Silva",
          login: "ana.silva",
          senha: "as123456",
        },
        {
          id: 2,
          nome: "Carlos Oliveira",
          login: "carlos.oliveira",
          senha: "co789012",
        },
      ]
    }
  },

  // Create a user
  create: async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
      return await response.json()
    } catch (error) {
      console.error("Error creating user:", error)
      return { error: "Failed to create user (mocked)" }
    }
  },

  // Update a user
  update: async (id, user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
      return await response.json()
    } catch (error) {
      console.error(`Error updating user ${id}:`, error)
      return { error: `Failed to update user ${id} (mocked)` }
    }
  },

  // Delete a user
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      })
      return await response.json()
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error)
      return { error: `Failed to delete user ${id} (mocked)` }
    }
  },
}

// Favorites API
export const favoritesApi = {
  // Get user favorites
  getUserFavorites: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching user favorites:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [1, 2, 5] // IDs dos pratos favoritos
    }
  },

  // Add dish to favorites
  addToFavorites: async (userId, dishId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dishId }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error adding to favorites:", error)
      return { success: true, message: "Prato adicionado aos favoritos (mock)" }
    }
  },

  // Remove dish from favorites
  removeFromFavorites: async (userId, dishId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${dishId}`, {
        method: "DELETE",
      })
      return await response.json()
    } catch (error) {
      console.error("Error removing from favorites:", error)
      return { success: true, message: "Prato removido dos favoritos (mock)" }
    }
  },

  // Get all favorites (for admin)
  getAllFavorites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching all favorites:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        { userId: 1, dishId: 1 },
        { userId: 1, dishId: 2 },
        { userId: 2, dishId: 1 },
        { userId: 2, dishId: 3 },
        { userId: 3, dishId: 2 },
      ]
    }
  },
}

// Reports API
export const reportsApi = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/dashboard`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return {
        totalDishes: 15,
        totalCategories: 5,
        totalUsers: 8,
        totalNews: 4,
        totalViews: 3250,
        averageRating: 4.2,
        totalFavorites: 27,
      }
    }
  },

  // Get most viewed dishes
  getMostViewedStats: async (limit = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/most-viewed?limit=${limit}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching most viewed stats:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        { id: 1, name: "Frango à Parmegiana", views: 1000 },
        { id: 2, name: "Lasanha de Berinjela", views: 850 },
        { id: 5, name: "Salmão Grelhado", views: 820 },
        { id: 4, name: "Risoto de Cogumelos", views: 750 },
        { id: 3, name: "Salada Caesar", views: 600 },
      ]
    }
  },

  // Get best rated dishes
  getBestRatedStats: async (limit = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/best-rated?limit=${limit}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching best rated stats:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        { id: 4, name: "Risoto de Cogumelos", rating: 4.8 },
        { id: 5, name: "Salmão Grelhado", rating: 4.7 },
        { id: 6, name: "Ratatouille", rating: 4.6 },
        { id: 2, name: "Lasanha de Berinjela", rating: 4.5 },
        { id: 1, name: "Frango à Parmegiana", rating: 4.2 },
      ]
    }
  },

  // Get category distribution
  getCategoryDistribution: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/category-distribution`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching category distribution:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        { category: "Vegetariano", count: 5 },
        { category: "Aves", count: 3 },
        { category: "Carnes", count: 3 },
        { category: "Peixes", count: 2 },
        { category: "Saladas", count: 2 },
      ]
    }
  },

  // Get rating distribution
  getRatingDistribution: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/rating-distribution`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching rating distribution:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        { rating: 5, count: 3 },
        { rating: 4, count: 7 },
        { rating: 3, count: 4 },
        { rating: 2, count: 1 },
        { rating: 1, count: 0 },
      ]
    }
  },

  // Get monthly views
  getMonthlyViews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/monthly-views`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching monthly views:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        { month: "Jan", views: 250 },
        { month: "Fev", views: 320 },
        { month: "Mar", views: 410 },
        { month: "Abr", views: 380 },
        { month: "Mai", views: 450 },
        { month: "Jun", views: 520 },
        { month: "Jul", views: 480 },
        { month: "Ago", views: 600 },
        { month: "Set", views: 550 },
        { month: "Out", views: 700 },
        { month: "Nov", views: 680 },
        { month: "Dez", views: 750 },
      ]
    }
  },

  // Get most favorited dishes
  getMostFavoritedDishes: async (limit = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/most-favorited?limit=${limit}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching most favorited dishes:", error)
      // Retornar dados mockados quando o backend não estiver disponível
      return [
        { id: 2, name: "Lasanha de Berinjela", favorites: 8 },
        { id: 1, name: "Frango à Parmegiana", favorites: 7 },
        { id: 5, name: "Salmão Grelhado", favorites: 5 },
        { id: 4, name: "Risoto de Cogumelos", favorites: 4 },
        { id: 3, name: "Salada Caesar", favorites: 3 },
      ]
    }
  },
}

