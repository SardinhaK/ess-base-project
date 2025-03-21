// // npx cucumber-js --require tests/steps_definitions tests/features/favoritos.feature

// const { Given, When, Then } = require('@cucumber/cucumber');
// const chai = require('chai');
// const request = require('supertest');
// const app = require('../../src/app.js');

// const expect = chai.expect;

// let userId;

// const { users } = require('../../src/database/users_list.js');
// const { categories } = require('../../src/database/categorias');

// // Passos de Given (Pré-condições)
// Given('o administrador {string} está autenticado no sistema', function (userName) {
//     const user = users.find(u => u.nome === userName);
//     if (user) {
//         userId = user.id; // Define o userId corretamente
//     } else {
//         throw new Error(`Usuário com o nome "${userName}" não encontrado.`);
//     }
// });

// Given('existem as seguintes categorias com dados de acesso:', function (dataTable) {
//     // Itera sobre as linhas da tabela
//     dataTable.hashes().forEach(row => {
//         const categoriaNome = row.Categoria;
//         const acessos = parseInt(row.Acessos);

//         // Encontra a categoria no banco de dados
//         const categoria = categories.find(c => c.name === categoriaNome);
//         if (!categoria) {
//             throw new Error(`Categoria "${categoriaNome}" não encontrada.`);
//         }

//         // Atualiza a categoria com os dados de acesso
//         categoria.acessos = acessos;
//     });
// });

// // Passos de When (Ações)
// When('o administrador faz uma requisição {string} para {string} com os seguintes parâmetros:', async function (method, endpoint, dataTable) {
//     const params = dataTable.hashes()[0];

//     console.log("Teste: Fazendo requisição..."); // Depuração
//     console.log("Método:", method); // Depuração
//     console.log("Endpoint:", endpoint); // Depuração
//     console.log("Parâmetros:", params); // Depuração
//     console.log("User ID:", userId); // Depuração

//     response = await request(app)
//         [method.toLowerCase()](endpoint)
//         .query(params) // Passa os parâmetros corretos
//         .set('Accept', 'application/json')
//         .set('user-id', userId); // Passa o ID do administrador no cabeçalho

//     console.log("Resposta:", response.status, response.body); // Depuração
// });

// // Passos de Then (Verificações)
// Then('o status da resposta deve ser {string}', function (expectedStatus) {
//     const statusCode = parseInt(expectedStatus);
//     expect(response.status).to.equal(statusCode);
//     console.log("teste2");
// });

// Then('o JSON da resposta deve conter:', function (expectedJson) {
//     // Converte o JSON esperado de string para objeto
//     const expected = JSON.parse(expectedJson);

//     // Verifica se o corpo da resposta contém o JSON esperado
//     expect(response.body).to.deep.include(expected);
// });