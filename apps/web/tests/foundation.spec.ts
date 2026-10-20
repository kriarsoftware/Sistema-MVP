import { test, expect, type Page } from "@playwright/test";

async function login(page: Page, email: string) {
  const password = process.env.DEMO_PASSWORD;
  if (!password) throw new Error("Defina DEMO_PASSWORD com a senha usada no seed.");
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Entrar na minha conta" }).click();
  await expect(page.getByRole("heading", { name: "Escolha sua organização." })).toBeVisible();
}

test("login, seleção, depósito persistido, auditoria e logout", async ({ page }) => {
  await login(page, "admin@varejo360.test");
  await page.getByRole("button", { name: /Aurora Varejo/ }).click();
  await page.getByRole("button", { name: /Loja Centro/ }).click();
  await expect(page.getByRole("heading", { name: "Olá, Marina." })).toBeVisible();
  await page.getByRole("link", { name: "Gerenciar depósitos" }).click();
  await page.getByRole("button", { name: "Novo depósito" }).click();
  const code = `E2E-${Date.now()}`;
  await page.getByLabel("Nome", { exact: true }).fill("Depósito de verificação");
  await page.getByLabel("Código", { exact: true }).fill(code);
  await page.getByRole("button", { name: "Salvar depósito" }).click();
  await expect(page.getByText("Depósito criado com sucesso.")).toBeVisible();
  await page.reload();
  await expect(page.getByText(code, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Histórico de atividades" }).click();
  await expect(page.getByRole("cell", { name: "Depósito criado" }).first()).toBeVisible();
  await page.getByRole("button", { name: /Sair da conta/ }).click();
  await expect(page).toHaveURL(/\/login$/);
  const unauthorized = await page.request.get("/api/v1/me/tenants");
  expect(unauthorized.status()).toBe(401);
});

test("operador não acessa tenant ou filial alheios nem cria depósitos", async ({ page }) => {
  await login(page, "operador@varejo360.test");
  await expect(page.getByRole("button", { name: /Horizonte Calçados/ })).toHaveCount(0);
  await page.getByRole("button", { name: /Aurora Varejo/ }).click();
  await expect(page.getByRole("button", { name: /Loja Shopping/ })).toHaveCount(0);
  await page.getByRole("button", { name: /Loja Centro/ }).click();
  const origin = "http://localhost:3000";
  const forbiddenTenant = await page.request.get("/api/v1/branches", { headers: { "x-tenant-id": "demo-horizonte" } });
  expect(forbiddenTenant.status()).toBe(403);
  const forbiddenBranch = await page.request.get("/api/v1/warehouses", { headers: { "x-tenant-id": "demo-aurora", "x-branch-id": "demo-aurora-02" } });
  expect(forbiddenBranch.status()).toBe(403);
  const forbiddenWrite = await page.request.post("/api/v1/warehouses", {
    headers: { Origin: origin, "x-tenant-id": "demo-aurora", "x-branch-id": "demo-aurora-01" },
    data: { name: "Inválido", code: "FORBIDDEN" },
  });
  expect(forbiddenWrite.status()).toBe(403);
});

test("mutações rejeitam origem estrangeira", async ({ page }) => {
  const response = await page.request.post("/api/auth/sign-in/email", {
    headers: { Origin: "https://evil.test" }, data: { email: "admin@varejo360.test", password: "invalid" },
  });
  expect(response.status()).toBe(403);
});
