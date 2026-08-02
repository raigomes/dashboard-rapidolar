# Contract — Auth & Session (Contrato de Autenticação)

**Date**: 2026-08-01
**Source**: [spec.md](../spec.md) (FR-001 a FR-006, FR-025), [research.md](../research.md).

## Comportamento esperado

1. **Login**: usuário informa e-mail + senha. Sucesso → redireciona a `/dashboard`.
   Falha → mensagem de erro sem expor motivo interno.
2. **Recuperação de senha** (Q4/FR-025): link ou código enviado ao e-mail cadastrado via
   Supabase Auth; usuário redefine a senha e volta ao login.
3. **Proteção de rotas** (FR-005): qualquer rota protegida acessada sem sessão válida
   redireciona a `/login`. Sessão validada com `getUser()` (JWT validado), não
   `getSession()`, em toda requisição no middleware.
4. **Logout** (FR-006): revoga a sessão e redireciona a `/login`; acesso imediatamente
   perdido.
5. **Sessão expirada**: ao expirar o token durante o uso, o middleware redireciona ao
   login (edge case do spec).

## Infraestrutura

- `@supabase/ssr` com dois clientes:
  - `createBrowserClient` (`src/lib/supabase/client.ts`) — componentes client.
  - `createServerClient` (`src/lib/supabase/server.ts`) — Server Components, Route
    Handlers, Server Actions, usando `await cookies()` + `getAll()`/`setAll()` (setAll em
    try/catch; refresh tratado pelo middleware).
- `src/lib/supabase/middleware.ts` + `src/app/middleware.ts`: valida sessão e faz refresh.
- Cookies de sessão: **httpOnly**.
- `SUPABASE_URL` e `SUPABASE_ANON_KEY` em variáveis de ambiente (nunca versionadas).

## Guarda dupla

Além do middleware, rotas protegidas revalidam sessão/cargo no layout ou na página
(belt-and-suspenders). Relatórios (`/relatorios` e `/relatorio/imprimir`) exigem
`is_admin()` no servidor; vendedor recebe mensagem de acesso negado (FR-034 do PRD).

## Verificação manual (quickstart)

- Sem sessão → acesso a `/dashboard` cai em `/login`.
- Login admin@rapidolar.com → vê relatórios. Login vendedor@rapidolar.com → acesso negado
  em relatórios, sem botões de exclusão, e dashboard apenas com dados próprios.
- Logout → volta a `/login` e rotas protegidas ficam inacessíveis.
