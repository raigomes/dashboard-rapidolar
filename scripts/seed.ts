import "dotenv/config";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

loadEnv({ path: ".env.local" });

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local"
  );
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type Cargo = "admin" | "vendedor";
type Status = "pendente" | "confirmado" | "entregue" | "cancelado";

const CATEGORIAS = ["Limpeza", "Descartáveis", "Higiene"] as const;
const BASES = [
  "Detergente",
  "Desinfetante",
  "Água Sanitária",
  "Sabão em Pó",
  "Esponja",
  "Papel Toalha",
  "Guardanapo",
  "Copo",
  "Prato",
  "Talher",
  "Luva",
  "Saco de Lixo",
  "Álcool 70%",
  "Sabonete",
  "Papel Higiênico",
  "Toalha de Papel",
  "Creme Dental",
  "Desodorante",
] as const;

const CLIENTES = [
  "Mercadinho do Bairro",
  "Padaria Pão Quente",
  "Restaurante Sabor Local",
  "Adega Central",
  "Mercearia Boa Fé",
  "Bar do Zé",
  "Lanchonete Saborosa",
  "Hortifruti Primavera",
  "Supermercado Economia",
  "Cafeteria Aroma",
  "Pastelaria da Esquina",
  "Distribuidora Norte",
  "Mercado Casa Verde",
  "Pizzaria Bella",
  "Açougue do Seu João",
  "Conveniência 24h",
  "Restaurante Panela Cheia",
  "Empório Rural",
  "Mercadinho São José",
  "Sorveteria Gelado",
  "Padaria da Vila",
  "Restaurante Bem Temperado",
  "Mercado do Povo",
  "Drograria Vida",
  "Bistrô Central",
  "Mercadinho Esperança",
  "Lanches do Gordo",
  "Adega do Porto",
  "Supermercado Vitória",
  "Mercado Popular",
] as const;

const STATUS_WEIGHTS: Status[] = [
  "entregue",
  "entregue",
  "entregue",
  "confirmado",
  "pendente",
  "cancelado",
];

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slug(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

async function ensureUser(
  email: string,
  password: string,
  nome: string,
  cargo: Cargo
): Promise<string> {
  const { data: existingProfile } = await sb
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfile) {
    console.log(`👤 Usuário já existe: ${email}`);
    return existingProfile.id;
  }

  const { data: created, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nome, cargo },
  });

  if (error) {
    const { data: users } = await sb.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    const found = (users?.users ?? []).find((u) => u.email === email) as
      | { id: string; email: string }
      | undefined;

    if (!found) {
      console.error(`Erro ao criar usuário ${email}:`, error.message);
      process.exit(1);
    }

    const { error: errProfile } = await sb
      .from("profiles")
      .insert({ id: found.id, nome, email, cargo });

    if (errProfile) {
      console.error(`Erro ao recriar perfil ${email}:`, errProfile.message);
      process.exit(1);
    }

    console.log(`👤 Perfil recriado: ${email} (${cargo})`);
    return found.id;
  }

  console.log(`👤 Usuário criado: ${email} (${cargo})`);
  return created.user.id;
}

async function seedProdutos(): Promise<string[]> {
  const { data: count } = await sb
    .from("produtos")
    .select("id", { count: "exact", head: true });

  if (count && count.length > 0) {
    console.log("📦 Catálogo já existe — pulando produtos.");
    const { data } = await sb.from("produtos").select("id");
    return (data ?? []).map((p) => p.id as string);
  }

  const rows = BASES.flatMap((base) => [0, 1, 2].map((variante) => {
    const index = Math.floor(Math.random() * 3);
    const estoque = Math.random() < 0.15 ? randInt(2, 10) : randInt(20, 500);
    return {
      nome: `${base} ${randInt(500, 5000)}${rand(["ml", "g", "un"])} v${variante + 1}`,
      categoria: CATEGORIAS[index],
      preco: Number((Math.random() * 40 + 2).toFixed(2)),
      estoque,
    };
  }));

  const { data, error } = await sb.from("produtos").insert(rows).select("id");
  if (error) {
    console.error("Erro ao inserir produtos:", error.message);
    process.exit(1);
  }

  console.log(`📦 ${data.length} produtos inseridos.`);
  return data.map((p) => p.id as string);
}

async function seedClientes(): Promise<string[]> {
  const { data: count } = await sb
    .from("clientes")
    .select("id", { count: "exact", head: true });

  if (count && count.length > 0) {
    console.log("🏪 Clientes já existem — pulando clientes.");
    const { data } = await sb.from("clientes").select("id");
    return (data ?? []).map((c) => c.id as string);
  }

  const rows = CLIENTES.map((nome) => ({
    nome,
    telefone: `11${randInt(900000000, 999999999)}`,
    endereco: `Rua ${slug(nome)}, ${randInt(1, 900)}`,
  }));

  const { data, error } = await sb.from("clientes").insert(rows).select("id");
  if (error) {
    console.error("Erro ao inserir clientes:", error.message);
    process.exit(1);
  }

  console.log(`🏪 ${data.length} clientes inseridos.`);
  return data.map((c) => c.id as string);
}

async function seedPedidos(
  adminId: string,
  vendedorId: string,
  clientes: string[],
  produtos: { id: string; preco: number; estoque: number }[]
): Promise<void> {
  const { data: count } = await sb
    .from("pedidos")
    .select("id", { count: "exact", head: true });

  if (count && count.length > 0) {
    console.log("🛒 Pedidos já existem — pulando pedidos.");
    return;
  }

  let inseridos = 0;
  const estoqueAtual = new Map(
    produtos.map((p) => [p.id, p.estoque])
  );

  const hoje = new Date();

  for (let dia = 179; dia >= 0; dia--) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - dia);
    const qtdPedidos = randInt(3, 5);

    for (let i = 0; i < qtdPedidos; i++) {
      const cliente = rand(clientes);
      const dono = Math.random() < 0.5 ? adminId : vendedorId;
      const status = rand(STATUS_WEIGHTS);
      const nItens = randInt(1, 3);
      const itens: {
        produto_id: string;
        qtd: number;
        preco_unit: number;
      }[] = [];

      for (let j = 0; j < nItens; j++) {
        const produto = rand(produtos);
        const disponivel = estoqueAtual.get(produto.id) ?? 0;
        const qtd = Math.min(randInt(1, 5), Math.max(disponivel, 1));
        itens.push({ produto_id: produto.id, qtd, preco_unit: produto.preco });
        if (status !== "cancelado") {
          estoqueAtual.set(produto.id, disponivel - qtd);
        }
      }

      const total = itens.reduce((acc, it) => acc + it.qtd * it.preco_unit, 0);

      const { data: pedido, error } = await sb
        .from("pedidos")
        .insert({
          cliente_id: cliente,
          created_by: dono,
          data: data.toISOString().slice(0, 10),
          status,
          total: Number(total.toFixed(2)),
        })
        .select("id")
        .single();

      if (error) {
        console.error("Erro ao inserir pedido:", error.message);
        process.exit(1);
      }

      const { error: errItens } = await sb
        .from("pedido_itens")
        .insert(itens.map((it) => ({ ...it, pedido_id: pedido.id })));

      if (errItens) {
        console.error("Erro ao inserir itens:", errItens.message);
        process.exit(1);
      }

      if (status !== "cancelado") {
        await sb.from("produtos").upsert(
          itens.map((it) => ({
            id: it.produto_id,
            estoque: estoqueAtual.get(it.produto_id) ?? 0,
          }))
        );
      }

      inseridos++;
    }
  }

  console.log(`🛒 ${inseridos} pedidos inseridos (6 meses).`);
}

async function main(): Promise<void> {
  const adminId = await ensureUser(
    "admin@rapidolar.com",
    "admin123",
    "Admin RapidoLar",
    "admin"
  );
  const vendedorId = await ensureUser(
    "vendedor@rapidolar.com",
    "vendedor123",
    "Vendedor Teste",
    "vendedor"
  );

  await seedProdutos();
  const { data: produtos } = await sb
    .from("produtos")
    .select("id, preco, estoque");
  const produtosFull = (produtos ?? []).map((p) => ({
    id: p.id as string,
    preco: Number(p.preco),
    estoque: p.estoque as number,
  }));

  const clientes = await seedClientes();

  await seedPedidos(adminId, vendedorId, clientes, produtosFull);

  console.log("✅ Seed concluído.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
