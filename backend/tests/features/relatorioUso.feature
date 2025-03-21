# Feature: Relatórios de Uso
#     As um administrador do sistema
#     I want gerar e visualizar relatórios detalhados sobre o uso do sistema, como pratos mais acessados ou categorias mais populares
#     So that eu possa tomar decisões informadas para melhorar a experiência do usuário e otimizar o sistema.

# Scenario: Gerar relatório de pratos mais acessados por categoria - Serviço
#     Given o administrador "Fernanda Rocha" está autenticado no sistema  
#     And existem as seguintes categorias com dados de acesso:  
#         | Categoria   | Acessos   |  
#         | Massas      | 120       |  
#         | Carnes      | 80        |  
#         | Saladas     | 50        |  
#     When o administrador faz uma requisição "GET" para "/usage-report/mais-acessados" com os seguintes parâmetros:  
#         | filtro      | periodo   |  
#         | categoria   | semanal   |   
#     Then o status da resposta deve ser "200"  
#     And o JSON da resposta deve conter:  
#         """
#         {
#             "relatorio": [
#                 { "categoria": "Sobremesas", "acessos": 120 },
#                 { "categoria": "Carnes", "acessos": 80 },
#                 { "categoria": "Veganos", "acessos": 50 }
#             ],
#             "periodo": "semanal"
#         }
#         """
#     And o relatório gerado deve refletir os dados do período solicitado