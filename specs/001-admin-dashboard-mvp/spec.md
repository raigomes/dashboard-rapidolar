# Feature Specification: Admin Dashboard MVP RapidoLar

**Feature Branch**: `001-admin-dashboard-mvp`

**Created**: 2026-08-01

**Status**: Draft

**Input**: User description: "Dashboard Admin MVP para a Distribuidora RapidoLar — painel web protegido por login, cadastro de produtos/clientes/pedidos, visão em tempo real de faturamento, produtos mais vendidos, top clientes e estoque baixo; exportação de relatórios PDF. Distribuidora de produtos de limpeza e descartáveis (12 funcionários, 300+ produtos). Hoje a gestão é feita em planilhas Excel compartilhadas por e-mail."

## Clarifications

### Session 2026-08-01

- Q: Quando um pedido é registrado, o sistema deve dar baixa automaticamente no estoque dos produtos? → A: Baixa no ato da criação do pedido; cancelamento reverte o estoque.
- Q: A partir de que critério um produto deve ser sinalizado como "estoque baixo" na listagem? → A: Limiar fixo de estoque ≤ 10 unidades para todo o catálogo.
- Q: Quais regras de transição entre os status do pedido o sistema deve aplicar? → A: Fluxo linear pendente → confirmado → entregue, com cancelamento antes da entrega; pedidos entregues ou cancelados são imutáveis (sem edição ou exclusão).
- Q: Como o vendedor deve recuperar o acesso caso esqueça a senha? → A: Recuperação de senha por e-mail (link ou código).
- Q: Como as listagens com muitos registros devem exibir os dados? → A: Paginação com páginas de 25 itens por página.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Login e Controle de Acesso por Cargo (Priority: P1)

Dono e vendedores da RapidoLar acessam o painel com e-mail e senha. O sistema reconhece o cargo de cada usuário (admin ou vendedor) e mostra apenas as funcionalidades e dados permitidos. Vendedores enxergam somente as próprias operações e nunca conseguem excluir registros; o admin tem acesso total.

**Why this priority**: Sem login e controle de acesso não há dados protegidos — é a fundação de segurança do MVP. Nenhuma outra funcionalidade faz sentido sem autenticação.

**Independent Test**: Pode ser testado criando um usuário admin e um vendedor, autenticando ambos e verificando que as permissões (o que cada um vê e não vê) são respeitadas.

**Acceptance Scenarios**:

1. **Given** um usuário com credenciais válidas, **When** ele faz login, **Then** ele é levado ao painel principal com seu perfil correto.
2. **Given** um usuário não autenticado, **When** ele tenta acessar qualquer tela do painel, **Then** ele é redirecionado para a tela de login.
3. **Given** um vendedor autenticado, **When** ele navega pelo painel, **Then** ele vê apenas seus próprios pedidos e dados, sem acesso a relatórios ou exclusões.
4. **Given** um usuário autenticado, **When** ele encerra a sessão, **Then** ele perde o acesso imediato ao painel.

---

### User Story 2 - Visão em Tempo Real do Negócio (Priority: P1)

O dono abre o painel e em uma única tela vê: faturamento de hoje e do mês, número de pedidos, ticket médio, um gráfico de vendas (7 dias, 30 dias, 12 meses), o top 10 de produtos mais vendidos e o top 10 de clientes. Isso substitui o fechamento manual das planilhas e dá visibilidade imediata do negócio.

**Why this priority**: É o coração do problema — o dono hoje não sabe o lucro real do mês até fechar tudo manualmente. É o diferencial que gera decisão imediata.

**Independent Test**: Com dados de exemplo carregados, verificar que todas as métricas e listas são exibidas com valores coerentes e atualizadas em tempo real.

**Acceptance Scenarios**:

1. **Given** dados de vendas dos últimos 6 meses, **When** o admin abre o painel, **Then** os cards de faturamento, pedidos e ticket médio mostram valores corretos.
2. **Given** o gráfico de vendas, **When** o admin alterna entre 7 dias, 30 dias e 12 meses, **Then** o gráfico atualiza o período exibido.
3. **Given** dados de vendas, **When** o painel carrega, **Then** top 10 produtos e top 10 clientes aparecem ordenados por receita.
4. **Given** um vendedor, **When** ele abre o painel, **Then** as métricas refletem apenas os seus próprios dados.
5. **Given** um período sem vendas, **When** o painel é aberto, **Then** é exibido um estado vazio claro em vez de erro ou números zerados confusos.

---

### User Story 3 - Registro e Gestão de Pedidos (Priority: P1)

Vendedores e admin registram pedidos com seus itens (produto + quantidade), com cálculo automático do total. A lista de pedidos permite filtrar por data, cliente e status (pendente, confirmado, entregue, cancelado). Vendedores gerenciam apenas os próprios pedidos; o admin gerencia todos.

**Why this priority**: O pedido é a operação central do negócio e a fonte dos dados que alimentam o painel. Sem ele, não há visão em tempo real.

**Independent Test**: Registrar um pedido com itens e verificar que o total é calculado, o pedido aparece na lista e os filtros o encontram.

**Acceptance Scenarios**:

1. **Given** um vendedor autenticado, **When** ele cria um pedido com itens, **Then** o total é calculado automaticamente e o pedido fica visível para ele.
2. **Given** um vendedor, **When** ele tenta excluir ou alterar um pedido de outro vendedor, **Then** o sistema bloqueia a operação.
3. **Given** a lista de pedidos, **When** o usuário aplica filtros por data, cliente ou status, **Then** apenas os pedidos que atendem aos critérios são exibidos.
4. **Given** um pedido existente, **When** o usuário edita o status (ex.: de pendente para entregue), **Then** a mudança é refletida imediatamente na lista e nas métricas.

---

### User Story 4 - Cadastro de Produtos e Clientes (Priority: P2)

O admin cadastra, edita e exclui produtos (nome, categoria, preço, estoque) e clientes (nome, telefone, endereço). Vendedores visualizam esses cadastros para consulta, mas não alteram.

**Why this priority**: Necessário para operar, porém de menor urgência que o painel e os pedidos; vendedores já conseguem operar com os dados existentes.

**Independent Test**: Criar, editar e excluir um produto e um cliente como admin; confirmar que o vendedor vê os dados mas não pode alterá-los.

**Acceptance Scenarios**:

1. **Given** um admin, **When** ele cria um produto, **Then** o produto aparece imediatamente na listagem e fica disponível para pedidos.
2. **Given** um admin, **When** ele exclui um produto ou cliente, **Then** o sistema confirma antes e impede exclusão quando o registro está em uso.
3. **Given** um vendedor, **When** ele acessa produtos ou clientes, **Then** ele vê a listagem, mas nenhuma opção de criar, editar ou excluir.
4. **Given** produtos com estoque baixo, **When** a listagem é aberta, **Then** esses produtos são sinalizados com clareza.

---

### User Story 5 - Exportação de Relatório em PDF (Priority: P3)

O admin seleciona um período e exporta um relatório em PDF com o resumo do período: faturamento total, total de pedidos, top 10 produtos e top 10 clientes. Vendedores não acessam relatórios.

**Why this priority**: Gera valor para fechamento e prestação de contas, mas é utilizável após o núcleo operacional; bloqueado a admin por política de acesso.

**Independent Test**: Selecionar um período e exportar o PDF; verificar conteúdo, e confirmar que vendedor recebe acesso negado.

**Acceptance Scenarios**:

1. **Given** um admin, **When** ele seleciona um período e exporta, **Then** um PDF é gerado com período, faturamento, total de pedidos, top 10 produtos e top 10 clientes.
2. **Given** um vendedor, **When** ele tenta acessar a área de relatórios, **Then** ele vê uma mensagem de acesso negado.

---

### Edge Cases

- Sessão expira durante o uso: o usuário é redirecionado ao login sem perder os dados não salvos de forma crítica.
- Período sem dados no relatório ou no dashboard: estado vazio claro, sem erros.
- Tentativa de acessar uma URL direta de página restrita (ex.: relatórios) sem permissão: acesso negado.
- Produto ou cliente em uso por pedidos: exclusão bloqueada com mensagem explicativa.
- Dois usuários editam o mesmo pedido: o sistema preserva a última alteração e comunica conflitos quando aplicável.
- Serviço de dados temporariamente indisponível: mensagem amigável de erro com opção de tentar novamente.
- Estoque insuficiente ao registrar item de pedido: alerta claro, sem permitir quantidade inválida.
- Cancelamento de pedido reverte a baixa de estoque dos itens envolvidos.
- Tentativa de editar, excluir ou mudar o status de um pedido entregue ou cancelado: operação bloqueada pelo sistema.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST autenticar usuários por e-mail e senha e redirecionar autenticados ao painel principal.
- **FR-002**: O sistema MUST distinguir dois cargos — admin e vendedor — e aplicar permissões por cargo em todas as telas.
- **FR-003**: O sistema MUST impedir vendedores de excluir qualquer dado (pedidos, produtos, clientes).
- **FR-004**: O sistema MUST garantir que vendedores visualizem apenas suas próprias operações (pedidos e métricas derivadas).
- **FR-005**: O sistema MUST bloquear acesso a páginas protegidas sem autenticação, redirecionando ao login.
- **FR-006**: O sistema MUST permitir encerrar a sessão e remover o acesso imediatamente.
- **FR-007**: O sistema MUST exibir no painel: faturamento do dia, faturamento do mês, pedidos do dia e ticket médio do mês.
- **FR-008**: O sistema MUST exibir gráfico de vendas com seleção de período (7 dias, 30 dias, 12 meses).
- **FR-009**: O sistema MUST exibir tabelas de top 10 produtos e top 10 clientes por receita.
- **FR-010**: O sistema MUST permitir criar, editar e excluir pedidos com itens (produto + quantidade).
- **FR-011**: O sistema MUST calcular automaticamente o total do pedido a partir dos seus itens.
- **FR-012**: O sistema MUST permitir filtrar pedidos por data (intervalo), cliente e status.
- **FR-013**: O sistema MUST dar suporte aos status de pedido: pendente, confirmado, entregue e cancelado.
- **FR-014**: O sistema MUST permitir ao admin criar, editar e excluir produtos e clientes, com confirmação antes de excluir.
- **FR-015**: O sistema MUST impedir a exclusão de produtos ou clientes referenciados por pedidos.
- **FR-016**: O sistema MUST sinalizar como "estoque baixo" todo produto com quantidade em estoque menor ou igual a 10 unidades.
- **FR-017**: O sistema MUST permitir ao admin exportar relatório PDF de um período com faturamento, total de pedidos, top 10 produtos e top 10 clientes.
- **FR-018**: O sistema MUST negar acesso a relatórios para vendedores com mensagem clara.
- **FR-019**: O sistema MUST apresentar estado vazio claro quando não há dados para exibir.
- **FR-020**: O sistema MUST apresentar mensagens de erro amigáveis com opção de tentar novamente quando o serviço de dados estiver indisponível.
- **FR-021**: O sistema MUST validar entradas de formulário (dados obrigatórios, valores positivos, quantidades válidas).
- **FR-022**: O sistema MUST dar baixa no estoque dos produtos no ato da criação do pedido e reverter essa baixa quando o pedido for cancelado.
- **FR-023**: O sistema MUST restringir as transições de status do pedido ao fluxo pendente → confirmado → entregue, com cancelamento permitido a partir de pendente ou confirmado.
- **FR-024**: O sistema MUST tornar pedidos com status entregue ou cancelado imutáveis (sem edição, exclusão ou mudança de status).
- **FR-025**: O sistema MUST permitir ao usuário recuperar a senha esquecida por meio de link ou código enviado ao e-mail cadastrado.
- **FR-026**: O sistema MUST exibir as listagens de pedidos, produtos e clientes em páginas de até 25 itens, mantendo a paginação aplicada após o uso de filtros.

### Key Entities *(include if feature involves data)*

- **Perfil de Usuário**: Representa cada usuário do sistema, com nome, e-mail e cargo (admin ou vendedor). Determina o que cada pessoa vê e faz.
- **Produto**: Item comercializado pela distribuidora, com nome, categoria, preço e quantidade em estoque.
- **Cliente**: Comprador recorrente (mercadinho, restaurante, padaria), com nome, telefone e endereço.
- **Pedido**: Operação de venda registrada, vinculada a um cliente, com data, status e total; pertencente a um usuário responsável.
- **Item de Pedido**: Linha de um pedido, ligando um produto a uma quantidade e preço praticado; compõe o total do pedido.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin e vendedor conseguem autenticar com sucesso e acessar o painel em até 5 segundos.
- **SC-002**: O painel exibe todas as métricas do dia/mês com dados de 6 meses em até 2 segundos de carregamento.
- **SC-003**: Um pedido com itens é registrado e calculado em menos de 1 minuto por um usuário treinado.
- **SC-004**: 100% das tentativas de exclusão por vendedores são bloqueadas pelo sistema.
- **SC-005**: 100% das tentativas de acesso de vendedor a dados fora do próprio escopo são negadas.
- **SC-006**: 95% das buscas com filtros na lista de pedidos retornam a lista correta na primeira tentativa.
- **SC-007**: O dono fecha a apuração do mês (faturamento, top produtos, top clientes) em até 5 minutos usando o relatório, versus dias no processo atual.

## Assumptions

- Dois usuários de teste: um admin e um vendedor, com senhas definidas.
- Dados de demonstração com 6 meses de histórico de vendas para validar painel, gráficos e relatórios.
- Sem integração com nota fiscal nem pagamento online — fora do escopo do MVP.
- Uso em desktop no escritório e tablet em campo; telas pequenas não são prioridade.
- Idioma da interface: português (pt-BR).
- Sem multi-tenancy: o MVP atende uma única empresa (RapidoLar); a arquitetura não precisa suportar múltiplas empresas nesta versão.
- Consulta a produtos e clientes é permitida a vendedores; apenas criação/edição/exclusão são restritas a admin.
- Controle de acesso segue o princípio do menor privilégio conforme a Constituição do projeto.
