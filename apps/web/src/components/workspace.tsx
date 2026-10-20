"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers3, LayoutDashboard, Warehouse as WarehouseIcon, ShieldCheck, Route, ArrowUpRight, ArrowRight, Building2, MapPin, Plus, Search, LogOut, ChevronsUpDown, Package, ShoppingBag, Wallet, Check, X } from "lucide-react";
import { api, productName, type Context, type Warehouse, type Audit } from "../lib/api";

const nextSteps = [
  ["02", "Catálogo e estoque", "Produtos, variações, preços e movimentos de estoque."],
  ["03", "Compras", "Pedidos, recebimentos parciais e custo médio."],
  ["04", "PDV e caixa", "Vendas, pagamentos manuais e fechamento."],
  ["05", "Financeiro e devoluções", "Parcelas, baixas, estornos e reembolsos."],
  ["06", "Relatórios e operação", "Indicadores, importações e rotinas de operação."],
];

export function Workspace({ tenantId, branchId, active }: { tenantId: string; branchId: string; active: string }) {
  const cache = useQueryClient(), router = useRouter();
  const scope = { tenantId, branchId };
  const [search, setSearch] = useState(""), [showForm, setShowForm] = useState(false), [message, setMessage] = useState("");
  const context = useQuery({ queryKey: ["context", tenantId, branchId], queryFn: ({ signal }) => api<Context>("/context", { ...scope, signal }) });
  const warehouses = useQuery({ queryKey: ["warehouses", tenantId, branchId], queryFn: ({ signal }) => api<Warehouse[]>("/warehouses", { ...scope, signal }), enabled: context.isSuccess });
  const canAudit = context.data?.permissions.includes("audit.read") ?? false;
  const audit = useQuery({ queryKey: ["audit", tenantId, branchId], queryFn: ({ signal }) => api<Audit[]>("/audit-logs", { ...scope, signal }), enabled: context.isSuccess && canAudit && active === "auditoria" });
  const form = useForm<{ name: string; code: string }>();
  const base = `/workspace/${encodeURIComponent(tenantId)}/${encodeURIComponent(branchId)}`;
  const names: Record<string, string> = { overview: "Visão geral", depositos: "Depósitos", auditoria: "Histórico de atividades", "proximos-passos": "Próximas etapas" };
  const createWarehouse = form.handleSubmit(async (body) => {
    setMessage("");
    try {
      await api("/warehouses", { ...scope, body });
      await cache.invalidateQueries({ queryKey: ["warehouses", tenantId, branchId] });
      await cache.invalidateQueries({ queryKey: ["audit", tenantId, branchId] });
      form.reset(); setShowForm(false); setMessage("Depósito criado com sucesso.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível salvar."); }
  });
  async function logout() {
    try { await api("/sign-out", { auth: true, body: {} }); await cache.cancelQueries(); cache.clear(); router.replace("/login"); }
    catch { setMessage("Não foi possível sair. Tente novamente."); }
  }
  if (context.isPending) return <main className="center-state" role="status"><span className="brand-mark"><Layers3/></span><h2>Preparando seu espaço…</h2><p>Validando organização, filial e permissões.</p></main>;
  if (context.error || !context.data) return <main className="center-state"><ShieldCheck size={40}/><h1>Não foi possível abrir este espaço.</h1><p role="alert">{context.error?.message ?? "Acesso não disponível."}</p><Link className="primary" href="/selecionar-organizacao">Selecionar organização</Link></main>;
  const ctx = context.data;
  const rows = warehouses.data?.filter((w) => `${w.name} ${w.code}`.toLowerCase().includes(search.toLowerCase())) ?? [];
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href={base} className="brand"><span className="brand-mark"><Layers3 size={22}/></span>{productName}<span className="brand-dot">.</span></Link>
      <Link href="/selecionar-organizacao" className="tenant-switch"><span className="tenant-avatar">{ctx.tenant.name.slice(0, 1)}</span><span><strong>{ctx.tenant.name}</strong><small>Trocar organização</small></span><ChevronsUpDown size={16}/></Link>
      <p className="nav-caption">ESPAÇO DE TRABALHO</p>
      <nav aria-label="Navegação principal">
        <Link className={active === "overview" ? "nav-link selected" : "nav-link"} href={base}><LayoutDashboard size={18}/>Visão geral</Link>
        <Link className={active === "depositos" ? "nav-link selected" : "nav-link"} href={`${base}/depositos`}><WarehouseIcon size={18}/>Depósitos</Link>
        {canAudit && <Link className={active === "auditoria" ? "nav-link selected" : "nav-link"} href={`${base}/auditoria`}><ShieldCheck size={18}/>Histórico de atividades</Link>}
        <Link className={active === "proximos-passos" ? "nav-link selected" : "nav-link"} href={`${base}/proximos-passos`}><Route size={18}/>Próximas etapas</Link>
      </nav>
      <p className="nav-caption future">EM CONSTRUÇÃO</p>
      <div className="future-item"><Package size={17}/>Produtos e estoque<span>02</span></div>
      <div className="future-item"><ShoppingBag size={17}/>Compras e vendas<span>03–04</span></div>
      <div className="future-item"><Wallet size={17}/>Financeiro<span>05</span></div>
      <div className="sidebar-bottom"><span className="mini-badge">ENTREGA 01</span><strong>A base do seu varejo.</strong><p>Organização, lojas e acesso em um só lugar.</p><Link href={`${base}/proximos-passos`}>Ver o que vem a seguir <ArrowUpRight size={15}/></Link></div>
      <button className="profile" onClick={logout}><span className="user-avatar">{ctx.user.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</span><span><strong>{ctx.user.name}</strong><small>Sair da conta</small></span><LogOut size={17}/></button>
    </aside>
    <div className="main-column">
      <header className="topbar"><div><span>Workspace</span><span className="divider">/</span><strong>{names[active]}</strong></div><Link href="/selecionar-organizacao" className="branch-pill"><MapPin size={15}/>{ctx.branch.name}<ChevronsUpDown size={14}/></Link></header>
      <main className="workspace-main">
        <div className="page-heading"><div><span className="eyebrow">ORGANIZE HOJE. CRESÇA AMANHÃ.</span><h1>{active === "overview" ? `Olá, ${ctx.user.name.split(" ")[0]}.` : names[active]}</h1><p>{active === "overview" ? "Seu espaço de gestão começa por uma operação bem organizada." : active === "depositos" ? "Organize os locais de armazenamento desta filial." : active === "auditoria" ? "As últimas 50 atividades registradas nesta filial." : "Um sistema construído por etapas, com prioridades claras."}</p></div>
          {active === "overview" && <Link className="primary" href={`${base}/depositos`}>Gerenciar depósitos<ArrowRight size={17}/></Link>}
          {active === "depositos" && ctx.permissions.includes("warehouses.create") && <button className="primary" onClick={() => { setShowForm(!showForm); setMessage(""); }}><Plus size={17}/>Novo depósito</button>}
        </div>
        {message && <p role="status" className="notice">{message}</p>}
        {active === "overview" && <>
          <section className="welcome-banner"><div><span className="mini-badge">SUA OPERAÇÃO, BEM ORGANIZADA</span><h2>Um bom começo<br/>faz toda a diferença.</h2><p>Confira sua loja, organize os depósitos e prepare<br className="desktop-break"/> o terreno para as próximas etapas.</p><Link href={`${base}/depositos`}>Ver meus depósitos <ArrowUpRight size={18}/></Link></div><div className="banner-art" aria-hidden="true"><div className="art-ring"/><div className="art-tile art-back"><Building2 size={52}/></div><div className="art-tile art-front"><Layers3 size={58}/></div><div className="art-check"><Check size={22}/></div></div></section>
          <section className="stats">
            <article><span className="stat-label">Organização atual<Building2 size={18}/></span><strong className="stat-name">{ctx.tenant.name}</strong><small>Acesso validado para sua conta</small></article>
            <article><span className="stat-label">Filial selecionada<MapPin size={18}/></span><strong className="stat-name">{ctx.branch.name}</strong><small>Código {ctx.branch.code}</small></article>
            <article><span className="stat-label">Depósitos na filial<WarehouseIcon size={18}/></span><strong>{warehouses.data?.length ?? "—"}</strong><small>{warehouses.isError ? "Consulta indisponível" : "Locais de armazenamento cadastrados"}</small></article>
          </section>
          <div className="overview-grid"><section className="panel"><div className="panel-heading"><div><h3>Sua base de operação</h3><p>O que está disponível nesta primeira entrega</p></div><span className="badge">FUNDAÇÃO</span></div>
            {[["Organização e filial", `${ctx.tenant.name} · ${ctx.branch.name}`], ["Permissões de acesso", ctx.roles.join(", ")], ["Depósitos", warehouses.data ? `${warehouses.data.length} locais cadastrados nesta filial` : "Consultando locais de armazenamento"]].map(([title, detail]) => <div className="check-row" key={title}><span className="check-circle"><Check size={16}/></span><div><strong>{title}</strong><p>{detail}</p></div></div>)}
          </section><section className="panel next-panel"><span className="tile-icon"><Package size={23}/></span><span className="eyebrow">PRÓXIMA ENTREGA</span><h3>Produtos e estoque.</h3><p>Catálogo, variações e controle de movimentações serão construídos na próxima etapa.</p><Link href={`${base}/proximos-passos`}>Conhecer as etapas<ArrowRight size={17}/></Link></section></div>
        </>}
        {active === "depositos" && <>
          {showForm && <section className="panel form-panel"><div className="panel-heading"><h3>Novo depósito</h3><button aria-label="Fechar formulário" className="icon-button" onClick={() => setShowForm(false)}><X size={20}/></button></div>
            <form onSubmit={createWarehouse} className="warehouse-form"><div><label htmlFor="warehouse-name">Nome</label><input id="warehouse-name" autoFocus placeholder="Ex.: Estoque da loja" {...form.register("name", { required: true, minLength: 2, maxLength: 100 })}/>{form.formState.errors.name && <small className="field-error">Informe um nome de 2 a 100 caracteres.</small>}</div><div><label htmlFor="warehouse-code">Código</label><input id="warehouse-code" placeholder="Ex.: LOJA-01" {...form.register("code", { required: true, pattern: /^[A-Z0-9_-]{1,30}$/ })}/>{form.formState.errors.code && <small className="field-error">Use até 30 letras maiúsculas, números, _ ou -.</small>}</div><button className="primary" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Salvando…" : "Salvar depósito"}</button></form></section>}
          <section className="panel"><div className="table-tools"><h3>Locais de armazenamento <span className="count">{warehouses.data?.length ?? "—"}</span></h3><label className="search-box"><Search size={17}/><input aria-label="Buscar depósitos" placeholder="Buscar nome ou código" value={search} onChange={e => setSearch(e.target.value)}/></label></div>
            {warehouses.isPending ? <p role="status" className="empty">Carregando depósitos…</p> : warehouses.error ? <p role="alert" className="empty">{warehouses.error.message} <button onClick={() => warehouses.refetch()}>Tentar novamente</button></p> : rows.length === 0 ? <div className="empty"><WarehouseIcon size={30}/><h3>Nenhum depósito encontrado.</h3><p>Cadastre um local ou altere a busca.</p></div> : <div className="table-scroll"><table><thead><tr><th>Depósito</th><th>Código</th><th>Situação</th><th>Criado em</th></tr></thead><tbody>{rows.map(w => <tr key={w.id}><td><span className="table-icon"><WarehouseIcon size={17}/></span><strong>{w.name}</strong></td><td><code>{w.code}</code></td><td><span className="status-active"><span className="dot"/>{w.active ? "Ativo" : "Inativo"}</span></td><td>{new Date(w.createdAt).toLocaleDateString("pt-BR")}</td></tr>)}</tbody></table></div>}
            <div className="table-footer">Dados da filial {ctx.branch.name} · até 200 depósitos</div>
          </section>
        </>}
        {active === "auditoria" && <section className="panel">
          {!canAudit ? <p role="alert" className="empty">Você não tem permissão para consultar a auditoria.</p> : audit.isPending ? <p role="status" className="empty">Carregando atividades…</p> : audit.error ? <p role="alert" className="empty">{audit.error.message}</p> : !audit.data?.length ? <div className="empty"><ShieldCheck size={34}/><h3>Nenhuma atividade registrada.</h3><p>Novos depósitos aparecerão aqui após serem cadastrados.</p></div> : <div className="table-scroll"><table><thead><tr><th>Atividade</th><th>Responsável</th><th>Data e hora</th><th>Referência</th></tr></thead><tbody>{audit.data.map(a => <tr key={a.id}><td>{a.action === "warehouse.created" ? "Depósito criado" : a.action}</td><td>{a.actorId === ctx.user.id ? ctx.user.name : "Outro usuário"}</td><td>{new Date(a.createdAt).toLocaleString("pt-BR")}</td><td><code title={a.requestId}>{a.requestId.slice(0, 8)}</code></td></tr>)}</tbody></table></div>}
        </section>}
        {active === "proximos-passos" && <section className="panel roadmap"><div className="roadmap-current"><ShieldCheck/><div><h3>01 · Fundação</h3><p>Login, contexto de organização e filial, depósitos e auditoria. A homologação da entrega depende da execução dos testes de integração.</p></div><span className="badge">ATUAL</span></div>{nextSteps.map(([n, title, description]) => <div className="roadmap-row" key={n}><span>{n}</span><div><h3>{title}</h3><p>{description}</p></div><small>Planejado</small></div>)}</section>}
        <footer className="workspace-footer"><span>{productName} · Primeira entrega</span><span>Ambiente de desenvolvimento · Sem emissão fiscal</span></footer>
      </main>
    </div>
  </div>;
}
