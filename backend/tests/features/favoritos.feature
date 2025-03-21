Feature: Favoritos
    As um usuário do sistema
    I want adicionar, visualizar, remover e organizar pratos na minha lista de favoritos
    So that eu possa acessar rapidamente os pratos que mais gosto ou desejo consumir novamente.

Scenario: Adicionar prato à lista de favoritos - GUI
    Given o usuário "Rafael Almeida" está autenticado no sistema  
    And o prato "Frango à Parmegiana" está listado na página "Feed"  
    And o prato "Frango à Parmegiana" não está na lista de favoritos do usuário "Rafael Almeida"
    When o usuário clica em "🤍" associado ao prato "Frango à Parmegiana"  
    Then o prato "Frango à Parmegiana" é adicionado à lista de favoritos do usuário
    And o sistema exibe o ícone "❤️" no prato  
    And uma mensagem "Prato adicionado aos favoritos" é exibida

Scenario: Remover prato da lista de favoritos
    Given o usuário "Maria Oliveira" está autenticado no sistema
    And o prato "Lasanha de Carne" está na lista de favoritos do usuário "Maria Oliveira"
    When o usuário clica em "❤️" associado ao prato "Lasanha de Carne"
    Then o prato "Lasanha de Carne" é removido da lista de favoritos do usuário
    And o sistema exibe o ícone "🤍" no prato
    And uma mensagem "Prato removido dos favoritos" é exibida

Scenario: Visualizar lista de pratos favoritos
    Given o usuário "Carlos Souza" está autenticado no sistema
    And a lista de favoritos do usuário contém os seguintes pratos:
        | Lasanha de Carne    |
        | Salada Caesar       |
    When o usuário acessa a página Meus Favoritos
    Then o sistema exibe a lista com os pratos favoritados:
        | Lasanha de Carne    |
        | Salada Caesar       |

Scenario: Limpar todos os pratos da lista de favoritos
    Given o usuário "Ana Costa" está autenticado no sistema
    And a lista de favoritos do usuário contém os seguintes pratos:
        | Feijoada            |
        | Risoto de Cogumelos |
    When o usuário clica na opção "Limpar Favoritos"
    Then o sistema remove todos os pratos da lista de favoritos
    And uma mensagem "Sua lista de favoritos foi limpa com sucesso" é exibida

Scenario: Favoritar prato enquanto navega por categorias
    Given o usuário "Pedro Santos" está autenticado no sistema
    And o usuário está navegando na categoria "Italiana"
    And o prato "Risoto de Cogumelos" está listado na página
    When o usuário clica em "🤍" associado ao prato "Risoto de Cogumelos"
    Then o prato "Risoto de Cogumelos" é adicionado à lista de favoritos do usuário
    And o sistema exibe o ícone "❤️" no prato
    And uma mensagem "Prato adicionado aos favoritos" é exibida

Scenario: Visualizar lista de favoritos vazia
    Given o usuário "Mariana Lima" está autenticado no sistema
    And a lista de favoritos fica vazia
    When o usuário acessa a página Meus Favoritos
    Then uma mensagem "Sua lista de favoritos está vazia" é exibida

Scenario: Reorganizar lista de favoritos
  Given o usuário "Lucas Pereira" está autenticado no sistema
  And a lista de favoritos do usuário contém os seguintes pratos:
      | Tacos de Carne      |
      | Bolo de Chocolate   |
  When o usuário reorganiza a lista para a seguinte ordem:
      | Bolo de Chocolate   |
      | Tacos de Carne      |
  Then o sistema salva a nova ordem da lista de favoritos
  And a lista de favoritos é exibida na ordem reorganizada