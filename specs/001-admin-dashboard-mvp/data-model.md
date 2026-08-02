# Data Model — Admin Dashboard MVP RapidoLar

**Date**: 2026-08-01
**Source**: [spec.md](./spec.md) (FR-001 a FR-026 + clarificações Q1–Q5)
**Storage**: Supabase (PostgreSQL) — todas as tabelas com RLS habilitado (ver
[contracts/rls-policies.md](./contracts/rls-policies.md)).

## Convenções

- IDs UUID; `created_at`/`updated_at` TIMESTAMPTZ default `now()`.
- Preços em `DECIMAL(10,2)`, valores monetários sempre positivos.
- `updated_at` mantido por trigger em tabelas com mutação.

## Entidades

### profiles

Perfil de usuário; vincula o usuário autenticado ao cargo (admin/vendedor).

| Campo | Tipo | Regras |
|-------|------|--------|
| id | UUID | PK, `REFERENCES auth.users(id) ON DELETE CASCADE` |
| nome | TEXT | NOT NULL |
| email | TEXT | NOT NULL, UNIQUE |
| cargo | TEXT | NOT NULL, `CHECK (cargo IN ('admin','vendedor'))` |
| created_at | TIMESTAMPTZ | default `now()` |

**Invariantes**: admin só pode ser criado/editado por outro admin (policy RLS); vendedor
vê apenas o próprio perfil.

### produtos

Catálogo da distribuidora (300+ itens).

| Campo | Tipo | Regras |
|-------|------|--------|
| id | UUID | PK, default `gen_random_uuid()` |
| nome | TEXT | NOT NULL |
| categoria | TEXT | NOT NULL |
| preco | DECIMAL(10,2) | NOT NULL, `CHECK (preco > 0)` |
| estoque | INTEGER | NOT NULL, default 0, `CHECK (estoque >= 0)` |
| created_at / updated_at | TIMESTAMPTZ | default `now()` |

**Invariantes**: "estoque baixo" = `estoque <= 10` (Q2); `estoque` reflete baixa/reversão
por pedidos (Q1); exclusão bloqueada quando referenciado em `pedido_itens`
(`ON DELETE RESTRICT`).

### clientes

Compradores recorrentes (mercadinhos, restaurantes, padarias).

| Campo | Tipo | Regras |
|-------|------|--------|
| id | UUID | PK, default `gen_random_uuid()` |
| nome | TEXT | NOT NULL |
| telefone | TEXT | opcional |
| endereco | TEXT | opcional |
| created_at / updated_at | TIMESTAMPTZ | default `now()` |

**Invariantes**: exclusão bloqueada quando referenciado em `pedidos` (`ON DELETE RESTRICT`).

### pedidos

Operação de venda registrada. Pertencente a um usuário (`created_by`) para suportar o
escopo de visão do vendedor.

| Campo | Tipo | Regras |
|-------|------|--------|
| id | UUID | PK, default `gen_random_uuid()` |
| cliente_id | UUID | NOT NULL, `REFERENCES clientes(id) ON DELETE RESTRICT` |
| created_by | UUID | NOT NULL, `REFERENCES profiles(id)` — dono do pedido |
| data | DATE | NOT NULL, default `CURRENT_DATE` |
| status | TEXT | NOT NULL, default `'pendente'`, `CHECK (status IN ('pendente','confirmado','entregue','cancelado'))` |
| total | DECIMAL(10,2) | NOT NULL, default 0 |
| created_at / updated_at | TIMESTAMPTZ | default `now()` |

**Transições de status** (Q3): `pendente → confirmado → entregue`; `cancelado` permitido a
partir de `pendente` ou `confirmado`. `entregue` e `cancelado` são **terminais e imutáveis**
(sem edição/exclusão/mudança de status).

### pedido_itens

Linhas do pedido; compõem o `total` do pedido.

| Campo | Tipo | Regras |
|-------|------|--------|
| id | UUID | PK, default `gen_random_uuid()` |
| pedido_id | UUID | NOT NULL, `REFERENCES pedidos(id) ON DELETE CASCADE` |
| produto_id | UUID | NOT NULL, `REFERENCES produtos(id) ON DELETE RESTRICT` |
| qtd | INTEGER | NOT NULL, `CHECK (qtd > 0)` |
| preco_unit | DECIMAL(10,2) | NOT NULL, `CHECK (preco_unit > 0)` |
| created_at | TIMESTAMPTZ | default `now()` |

## Regras de negócio (transversais)

1. **Total do pedido** (FR-011): calculado automaticamente como soma de
   `qtd * preco_unit` dos itens.
2. **Baixa de estoque** (FR-022, Q1): na criação do pedido, `estoque -= qtd` por item; ao
   cancelar (Q3), `estoque += qtd`. Executado de forma atômica (transação) para nunca
   divergir.
3. **Estoque insuficiente** (FR-021/Edge): criação do pedido bloqueada com alerta quando
   `qtd > estoque` do produto.
4. **Imutabilidade** (FR-024): pedidos `entregue`/`cancelado` não aceitam edição, exclusão
   ou mudança de status; validação no servidor (Server Action) + gatilho de segurança.
5. **Menor privilégio** (FR-003/FR-004): vendedor não deleta nada; vendedor acessa apenas
   pedidos com `created_by = auth.uid()` e métricas derivadas desses pedidos.

## Índices

- `pedidos(cliente_id)`, `pedidos(data)`, `pedidos(status)`, `pedidos(created_by)`
- `pedido_itens(pedido_id)`, `pedido_itens(produto_id)`
- `produtos(categoria)`

## Diagrama de relacionamentos

```
profiles 1 ── < pedidos > ── 1 clientes
                  │
                  └── < pedido_itens > ── 1 produtos
```

## Migrations

Criar `supabase/migrations/00001_init.sql` com: tabelas, checks, índices, triggers de
`updated_at`, `enable ROW LEVEL SECURITY` em todas as tabelas, helper `is_admin()`, e
todas as policies (ver `contracts/rls-policies.md`).
