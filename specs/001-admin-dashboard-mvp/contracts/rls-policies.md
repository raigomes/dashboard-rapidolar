# Contract — RLS Policies (Contrato de Segurança)

**Date**: 2026-08-01
**Source**: [data-model.md](../data-model.md), [spec.md](../spec.md) (FR-003/FR-004),
Constituição (Princípios II, III, IV).

Regra soberana: **RLS habilitado em toda tabela; omissão de policy = negação**. Vendedores
não possuem policy `DELETE` em nenhuma tabela. Toda policy usa `(select auth.uid())`.

## Helper

```sql
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and cargo = 'admin'
  );
$$;
```

`is_admin()` consulta `profiles` com `security definer` (evita recursão de RLS em
`profiles`). Colunas usadas em policies são indexadas.

## Matriz por tabela

### profiles

| Operação | Policy | Regra |
|----------|--------|-------|
| SELECT | `own_or_admin` | `id = (select auth.uid()) OR is_admin()` |
| INSERT | `admin_only_insert` | `is_admin()` |
| UPDATE | `admin_only_update` | `is_admin()` |
| DELETE | `admin_only_delete` | `is_admin()` |

### produtos

| Operação | Policy | Regra |
|----------|--------|-------|
| SELECT | `read_all_authenticated` | `(select auth.uid()) is not null` |
| INSERT | `admin_only` | `is_admin()` |
| UPDATE | `admin_only` | `is_admin()` |
| DELETE | `admin_only` | `is_admin()` — vendedor: **sem policy** |

### clientes

Idêntico a `produtos` (SELECT para autenticados; INSERT/UPDATE/DELETE apenas admin).

### pedidos

| Operação | Policy | Regra |
|----------|--------|-------|
| SELECT | `own_or_admin` | `created_by = (select auth.uid()) OR is_admin()` |
| INSERT | `own_insert` | `created_by = (select auth.uid()) OR is_admin()` |
| UPDATE | `own_update` | `created_by = (select auth.uid()) OR is_admin()` |
| DELETE | `admin_only` | `is_admin()` — vendedor: **sem policy** (não deleta nem o próprio pedido) |

### pedido_itens

Herda o acesso do pedido pai via FK (`pedido_id`), inclusive para o caso de admin.

| Operação | Policy | Regra |
|----------|--------|-------|
| SELECT | `via_parent` | pedido pai visível para o usuário (`own_or_admin`) |
| INSERT | `via_parent` | pedido pai visível e mutável |
| UPDATE | `via_parent` | pedido pai visível e mutável |
| DELETE | `admin_only` | `is_admin()` — vendedor: **sem policy** |

## Garantias verificáveis

1. `select pg_policies` mostra policy DELETE para vendedores ausente em `produtos`,
   `clientes`, `pedidos`, `pedido_itens`.
2. `set role authenticated` + query fora do escopo retorna 0 linhas (RLS nega).
3. Tentativa de DELETE por vendedor retorna erro de policy, mesmo em pedido próprio.
4. Tentativa de UPDATE de `cargo` por não-admin retorna 0 linhas afetadas.
5. `service_role` nunca é usada no client (só no seed via Admin API).
