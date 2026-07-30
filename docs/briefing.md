# Briefing: Dashboard de Vendas - Distribuidora RapidoLar

> Servico: Dashboard Admin MVP | Categoria: Core | Preco referencia: A partir de R$ 6.000

## Cliente (Fictional)

- **Nome:** Distribuidora RapidoLar
- **Ramo:** Distribuicao de produtos de limpeza e descartaveis
- **Porte:** 12 funcionarios (vendas, estoque, entrega), 300+ produtos em catalogo
- **Publico-alvo:** Mercadinhos de bairro, restaurantes, padarias

## O Problema

A RapidoLar gerencia pedidos, estoque e financeiro em planilhas de Excel compartilhadas via email. As planilhas vivem travando, versoes se perdem, e o dono nao sabe o lucro real do mes ate fechar tudo manualmente. Decisoes sao tomadas "no chute" porque nao ha visibilidade em tempo real.

## A Solucao Desejada

- Painel web protegido por login para a equipe
- Cadastro de produtos, clientes e pedidos
- Visualizacao em tempo real de: faturamento do dia/mes, produtos mais vendidos, clientes top 10, estoque baixo
- Exportacao de relatorios em PDF
- Nao precisa de integracao com nota fiscal nem pagamento online

## Requisitos Tecnicos

- Next.js + Tailwind + Shadcn/UI
- Supabase (autenticacao + banco + RLS)
- Dashboard com graficos usando Recharts ou Tremor
- Tabela de pedidos com filtros por data, cliente, status
- Layout responsivo (usado em desktop no escritorio e em tablet na rua)

## Diferenciais para o Portfolio

- **Autenticacao via Supabase:** Login seguro com controle de acesso por cargo
- **Dados reais simulados:** Script de seed com 6 meses de historico de vendas
- **RLS (Row Level Security):** Cada usuario ve apenas os dados do seu nivel de acesso
- **Multi-tenancy basico:** Se quiser evoluir, a estrutura ja suporta separar dados por empresa

## Criterios de Sucesso

- Login funcional com 2 usuarios (admin + vendedor)
- Dashboard carregar <2s com 6 meses de dados
- CRUD completo de produtos, clientes e pedidos
- Filtros funcionando na tabela de pedidos

---

## Estrutura de Paginas

```
/login (autenticacao)
/dashboard
  - Cards de metricas (faturamento, pedidos, clientes ativos)
  - Grafico de vendas (7 dias, 30 dias, 12 meses)
  - Top produtos (tabela)
  - Top clientes (tabela)
/produtos (lista + CRUD)
/clientes (lista + CRUD)
/pedidos (lista com filtros + CRUD)
/relatorios (exportacao PDF)

Tabelas Supabase:
  - profiles (id, nome, email, cargo)
  - produtos (id, nome, categoria, preco, estoque)
  - clientes (id, nome, telefone, endereco)
  - pedidos (id, cliente_id, data, status, total)
  - pedido_itens (id, pedido_id, produto_id, qtd, preco_unit)
```
