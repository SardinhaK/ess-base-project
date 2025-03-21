const express = require("express");
const router = express.Router();

const { dishes } = require('../database/pratos.js');
const { users } = require('../database/users_list.js');

// Middleware para verificar se o usuário é administrador
function verificarAdmin(req, res, next) {
    const { userId } = req.body; // Pegamos o ID do usuário no body da requisição
    const user = users.find(u => u.id === parseInt(userId));

    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Acesso negado. Apenas administradores podem visualizar relatórios." });
    }

    next();
}

// Rota para obter relatório de uso
router.get("/", verificarAdmin, (req, res) => {
    const { filtro, periodo } = req.query;

    // Gerando estatísticas básicas
    const totalUsuarios = users.length;
    const totalPratos = dishes.length;
    const totalInteracoes = favorites.length;

    // Contagem de favoritos por prato
    const pratosFavoritados = {};
    favorites.forEach(fav => {
        pratosFavoritados[fav.dishId] = (pratosFavoritados[fav.dishId] || 0) + 1;
    });

    // Ordenar os pratos mais favoritados
    const pratosOrdenados = Object.entries(pratosFavoritados)
    .sort((a, b) => b[1] - a[1]) // Ordena do mais favoritado para o menos
    .map(([dishId, count]) => {
        const prato = dishes.find(d => d.id === parseInt(dishId));
        return { id: prato.id, nome: prato.name, favoritos: count };
    });

    // Filtro por categoria
    let relatorio = pratosOrdenados;
    if (filtro === "categoria") {
        const categoria = req.query.categoria;
        relatorio = relatorio.filter(prato => prato.categoria === categoria);
    }

    // Resposta
    res.json({
        totalUsuarios,
        totalPratos,
        totalInteracoes,
        pratosMaisFavoritados: relatorio.slice(0, 5), // Pegamos os 5 mais favoritados
        periodo: periodo || "geral" // Inclui o período solicitado
    });
});

module.exports = router;