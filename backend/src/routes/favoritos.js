const express = require('express');
const router = express.Router();

const { dishes } = require('../database/pratos.js');
const { users } = require('../database/users_list.js');

// Middleware para validar usuário
const validateUser = (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send({ error: 'Usuário não identificado' });
    }

    const user = users.find(u => u.id === parseInt(userId));

    if (!user) {
        return res.status(404).send({ error: 'Usuário não encontrado' });
    }

    req.user = user; // Anexa o usuário ao objeto req
    next();
};

// Rota para adicionar um prato aos favoritos
router.post('/add', validateUser, (req, res) => {
    const { dishId } = req.body;
    const dish = dishes.find(d => d.id === parseInt(dishId));

    if (!dish) {
        return res.status(404).send({ error: 'Prato não encontrado' });
    }

    if (req.user.favoritos.includes(dishId)) {
        return res.status(409).send({ error: 'Prato já está nos favoritos' });
    }

    req.user.favoritos.push(dishId);
    res.status(200).send({ message: 'Prato adicionado aos favoritos', favorites: req.user.favoritos });
});

// Rota para remover um prato dos favoritos
router.delete('/remove', validateUser, (req, res) => {
    const { dishId } = req.body;
    const dish = dishes.find(d => d.id === parseInt(dishId));

    if (!dish) {
        return res.status(404).send({ error: 'Prato não encontrado' });
    }

    if (!req.user.favoritos.includes(dishId)) {
        return res.status(409).send({ error: 'Prato não está nos favoritos' });
    }

    req.user.favoritos = req.user.favoritos.filter(id => id !== parseInt(dishId));
    res.status(200).send({ message: 'Prato removido dos favoritos', favorites: req.user.favoritos });
});

// Rota para visualizar os pratos favoritos do usuário
router.get('/list', validateUser, (req, res) => {
    const user = req.user;

    // Verifica se a lista de favoritos está vazia
    if (user.favoritos.length === 0) {
        return res.status(200).send({ message: 'Sua lista de favoritos está vazia', favorites: [] });
    }

    // Retorna a lista de favoritos
    const favoriteDishes = user.favoritos.map(id => dishes.find(d => d.id === id));
    res.status(200).send(favoriteDishes);
});

// Rota para organizar favoritos (reordenar manualmente)
router.put('/reorder', validateUser, (req, res) => {
    const { orderedIds } = req.body;

    // Verifica se orderedIds é um array válido
    if (!Array.isArray(orderedIds)) {
        return res.status(400).send({ error: 'Ordem inválida: orderedIds deve ser um array' });
    }

    // Verifica se todos os IDs em orderedIds existem na lista de favoritos
    const invalidIds = orderedIds.filter(id => !req.user.favoritos.includes(id));
    if (invalidIds.length > 0) {
        return res.status(400).send({ error: `IDs inválidos: ${invalidIds.join(', ')}` });
    }

    // Atualiza a lista de favoritos do usuário com a nova ordem
    req.user.favoritos = orderedIds; // Atualiza a lista de favoritos
    res.status(200).send({ message: 'Lista de favoritos reordenada', favorites: req.user.favoritos });
});

module.exports = router;