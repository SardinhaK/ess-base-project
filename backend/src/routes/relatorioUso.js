// const express = require("express");
// const router = express.Router();

// const { dishes } = require('../database/pratos.js');
// const { users } = require('../database/users_list.js');

// // Middleware para verificar se o usuário é administrador
// function verificarAdmin(req, res, next) {
//     const userId = req.headers['user-id'];
//     console.log("Middleware: Verificando admin..."); // Depuração
//     console.log("User ID recebido:", userId); // Depuração

//     const user = users.find(u => u.id === parseInt(userId));

//     if (!user || user.role !== "admin") {
//         console.log("Acesso negado. Usuário não é admin."); // Depuração
//         return res.status(403).json({ message: "Acesso negado. Apenas administradores podem visualizar relatórios." });
//     }

//     console.log("Usuário é admin. Acesso permitido."); // Depuração
//     next();
// }


// // Rota para obter relatório de uso
// router.get("/mais-acessados", verificarAdmin, (req, res) => {
//     const { filtro, periodo } = req.query;

//     console.log("Rota: Gerando relatório..."); // Depuração
//     console.log("Filtro:", filtro); // Depuração
//     console.log("Período:", periodo); // Depuração

//     if (filtro === "categoria") {
//         console.log("Filtro: categoria"); // Depuração
//         const relatorioPorCategoria = dishes.reduce((acc, dish) => {
//             const categoria = dish.category;
//             if (!acc[categoria]) {
//                 acc[categoria] = 0;
//             }
//             acc[categoria] += dish.views;
//             return acc;
//         }, {});

//         const relatorio = Object.entries(relatorioPorCategoria)
//             .map(([categoria, acessos]) => ({ categoria, acessos }))
//             .sort((a, b) => b.acessos - a.acessos);

//         console.log("Relatório gerado:", relatorio); // Depuração
//         res.json({
//             relatorio,
//             periodo: periodo || "semanal"
//         });
//     } else {
//         console.log("Filtro não suportado:", filtro); // Depuração
//         res.status(400).json({ error: "Filtro não suportado" });
//     }
// });

// module.exports = router;