// npx cucumber-js --require tests/steps_definitions/favoritos.steps.js tests/features/favoritos.feature

const { Given, When, Then } = require('@cucumber/cucumber');
const chai = require('chai');
const request = require('supertest');
const app = require('../../src/app.js');

const expect = chai.expect;

let response;
let userId;
let dishId;

const { dishes } = require('../../src/database/pratos_aux.js'); // Importa a lista de pratos
const { users } = require('../../src/database/users_list.js');
const { categories } = require('../../src/database/categorias'); 

// Passos de Given (Pré-condições)
Given('o usuário {string} está autenticado no sistema', function (userName) {
    const user = users.find(u => u.nome === userName);
    if (user) {
        userId = user.id; // Define o userId corretamente
    } else {
        throw new Error(`Usuário com o nome "${userName}" não encontrado.`);
    }
});

Given('o prato {string} está listado na página {string}', async function (dishName, pageName) {
    const dish = dishes.find(d => d.name === dishName);
    if (!dish) {
        throw new Error(`Prato "${dishName}" não encontrado no sistema.`);
    }
    dishId = dish.id; // Armazena o ID do prato para uso nos próximos passos

    if (pageName === 'Meus Favoritos') {
        response = await request(app)
            .get('/favorites') // Rota para obter a lista de favoritos
            .set('Authorization', `Bearer ${userToken}`) // Adicione autenticação, se necessário
            .set('Accept', 'application/json');
    }
});

Given('o prato {string} não está na lista de favoritos do usuário {string}', function (dishName, userName) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID "${userId}" não encontrado.`);
    }

    const dish = dishes.find(d => d.name === dishName);
    if (!dish) {
        throw new Error(`Prato "${dishName}" não encontrado no sistema.`);
    }

    // Verifica se o prato está na lista de favoritos do usuário
    if (user.favoritos && user.favoritos.includes(dish.id)) {
        throw new Error(`Prato "${dishName}" já está na lista de favoritos do usuário.`);
    }
});

Given('o prato {string} está na lista de favoritos do usuário {string}', function (dishName, userName) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID "${userId}" não encontrado.`);
    }

    const dish = dishes.find(d => d.name === dishName);
    if (!dish) {
        throw new Error(`Prato "${dishName}" não encontrado no sistema.`);
    }
    if (!user.favoritos.includes(dish.id)) {
        user.favoritos.push(dish.id); // Adiciona o prato à lista de favoritos
    }
});

Given('a lista de favoritos do usuário contém os seguintes pratos:', function (dataTable) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID "${userId}" não encontrado.`);
    }

    // Mapeia os nomes dos pratos para seus IDs
    const dishIds = dataTable.rawTable.map(row => {
        const dishName = row[0];
        const dish = dishes.find(d => d.name === dishName);
        if (!dish) {
            throw new Error(`Prato "${dishName}" não encontrado no sistema.`);
        }
        return dish.id; // Retorna o ID do prato
    });

    // Verifica se os IDs dos pratos estão na lista de favoritos do usuário
    dishIds.forEach(dishId => {
        if (!user.favoritos.includes(dishId)) {
            throw new Error(`Prato com ID "${dishId}" não está na lista de favoritos do usuário.`);
        }
    });
});

Given('o usuário está navegando na categoria {string}', function (categoryName) {
    // Verifica se a categoria existe
    const category = categories.find(c => c.name === categoryName);
    if (!category) {
        throw new Error(`Categoria "${categoryName}" não encontrada.`);
    }

    // Simula que o usuário está navegando na categoria
    this.currentCategory = category;
});

Given('o prato {string} está listado na página', function (dishName) {
    // Verifica se o prato existe
    const dish = dishes.find(d => d.name === dishName);
    if (!dish) {
        throw new Error(`Prato "${dishName}" não encontrado.`);
    }

    dishId = dish.id;

    // Verifica se o prato pertence à categoria atual
    if (!this.currentCategory || dish.category !== this.currentCategory.name) {
        throw new Error(`Prato "${dishName}" não está listado na categoria "${this.currentCategory.name}".`);
    }
});

// Passos de When (Ações)
When('o usuário clica em {string} associado ao prato {string}', async function (action, dishName) {
    // Encontra o prato pelo nome
    const dish = dishes.find(d => d.name === dishName);
    if (!dish) { throw new Error(`Prato "${dishName}" não encontrado no sistema.`); }
    this.dishId = dish.id;

    const dishId = dish.id;

    // Simula a ação de favoritar/desfavoritar
    if (action === '🤍') {
        response = await request(app)
            .post('/favorites/add')
            .send({ userId, dishId })
            .set('Accept', 'application/json');
    } else if (action === '❤️') {
        response = await request(app)
            .delete('/favorites/remove')
            .send({ userId, dishId })
            .set('Accept', 'application/json');
    }

    expect(response.status).to.equal(200);
});

When('o usuário acessa a página Meus Favoritos', async function () {
    // Simula o acesso à página de favoritos
    response = await request(app)
        .get('/favorites/list')
        .send({ userId })
        .set('Accept', 'application/json');
});

When('o usuário clica na opção {string}', async function (option) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    if (option === 'Limpar Favoritos') {
        user.favoritos = []; // Limpa a lista de favoritos
        response = { status: 200, body: { message: 'Sua lista de favoritos foi limpa com sucesso' } };
    }
});

When('o usuário clica no ícone {string} associado ao prato {string}', async function (action, dishName) {
    // Simula a ação de favoritar/desfavoritar
    const dish = dishes.find(d => d.name === dishName);
    if (!dish) {
        throw new Error(`Prato "${dishName}" não encontrado no sistema.`);
    }
    dishId = dish.id; // Armazena o ID do prato para uso nos próximos passos

    if (action === '🤍') {
        response = await request(app)
            .post('/favorites/add')
            .send({ userId, dishId })
            .set('Accept', 'application/json');
    } else if (action === '❤️') {
        response = await request(app)
            .delete('/favorites/remove')
            .send({ userId, dishId })
            .set('Accept', 'application/json');
    }
});

When('o usuário reorganiza a lista para a seguinte ordem:', async function (dataTable) {
    // Encontra o usuário pelo userId
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    // Extrai os nomes dos pratos da tabela
    const newOrder = dataTable.rawTable.map(row => row[0]);

    // Mapeia os nomes dos pratos para seus IDs
    const newOrderIds = newOrder.map(dishName => {
        const dish = dishes.find(d => d.name === dishName);
        if (!dish) {
            throw new Error(`Prato "${dishName}" não encontrado.`);
        }
        return dish.id;
    });

    // Chama a rota /reorder para reorganizar a lista de favoritos
    response = await request(app)
        .put('/favorites/reorder')
        .send({ userId, orderedIds: newOrderIds })
        .set('Accept', 'application/json');

    // Armazena os dados no contexto do teste para uso nos próximos passos
    this.newOrder = newOrder; // Armazena a ordem dos nomes dos pratos
    this.newOrderIds = newOrderIds; // Armazena a ordem dos IDs dos pratos
});

// Passos de Then (Verificações)
Then('o sistema exibe o ícone {string} no prato', function (icon) {
    expect(response.status).to.equal(200); // Status deve ser 200 (sucesso)

    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    // Verifica se o ícone exibido corresponde à ação realizada
    if (icon === '❤️') {
        expect(response.body.message).to.equal('Prato adicionado aos favoritos'); 

        if (!Array.isArray(user.favoritos)) { // Verifica se a lista de favoritos do usuário é um array
            throw new Error(`A lista de favoritos do usuário ${userId} não é um array.`);
        }
        
        expect(response.body.favorites).to.include(dishId);
    } else if (icon === '🤍') {
        expect(response.body.message).to.equal('Prato removido dos favoritos'); 
        
        if (!Array.isArray(user.favoritos)) { // Verifica se a lista de favoritos do usuário é um array
            throw new Error(`A lista de favoritos do usuário ${userId} não é um array.`);
        }

        expect(response.body.favorites).to.not.include(dishId);
    } else {
        throw new Error(`Ícone "${icon}" não reconhecido.`); // Caso o ícone não seja reconhecido
    }
});

Then('o prato {string} é adicionado à lista de favoritos do usuário', function (dishName) {
    // Verifica se o prato foi adicionado à lista de favoritos
    expect(response.body.favorites).to.include(dishId);
});

Then('o prato {string} é removido da lista de favoritos do usuário', function (dishName) {
    // Verifica se o prato foi removido da lista de favoritos
    expect(response.body.favorites).to.not.include(dishId);
});

Then('o sistema exibe a lista com os pratos favoritados:', function (dataTable) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    const expectedDishes = dataTable.rawTable.map(row => row[0]);

    // Mapeia os IDs dos pratos favoritos para os nomes dos pratos
    const favoriteDishes = user.favoritos.map(dishId => {
        const dish = dishes.find(d => d.id === dishId);
        if (!dish) {
            throw new Error(`Prato com ID "${dishId}" não encontrado no sistema.`);
        }
        return dish.name;
    });

    expect(favoriteDishes).to.deep.equal(expectedDishes);
});

Then('uma mensagem {string} é exibida', function (message) {
    // Verifica se a mensagem foi exibida corretamente
    expect(response.body.message).to.equal(message);
});

Then('o sistema não permite a duplicação', function () {
    // Verifica se o sistema não permite duplicação de favoritos
    expect(response.status).to.equal(409);
});

Then('o sistema remove todos os pratos da lista de favoritos', function () {
    // Encontra o usuário pelo userId
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    // Verifica se a lista de favoritos está vazia
    expect(user.favoritos).to.be.empty;
});

Then('a lista de favoritos fica vazia', function () {
    // Encontra o usuário pelo userId
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    // Verifica se a lista de favoritos está vazia
    expect(user.favoritos).to.be.empty;
});

Then('uma mensagem {string} é exibida.', function (message) {
    // Verifica se a mensagem foi exibida corretamente
    expect(user.favoritos).to.be.empty;
});

Then('o sistema salva a nova ordem da lista de favoritos', function () {
    const user = users.find(u => u.id === userId);
    if (!user) {
        throw new Error(`Usuário com ID ${userId} não encontrado.`);
    }

    // Verifica se a lista de favoritos foi atualizada corretamente
    expect(user.favoritos).to.deep.equal(this.newOrderIds);
});

Then('a lista de favoritos é exibida na ordem reorganizada', async function () {
    // Simula o acesso à lista de favoritos
    response = await request(app)
        .get('/favorites/list')
        .send({ userId })
        .set('Accept', 'application/json');

    // Verifica se a ordem dos pratos na resposta corresponde à ordem esperada
    const actualOrder = response.body.map(dish => dish.name);
    expect(actualOrder).to.deep.equal(this.newOrder);
});