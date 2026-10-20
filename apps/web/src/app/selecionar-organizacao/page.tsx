"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Layers3, MapPin, LogOut } from "lucide-react";
import { api, productName, type Tenant, type Branch } from "../../lib/api";

export default function SelectOrganization() {
  const router = useRouter(), cache = useQueryClient();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [signoutError, setSignoutError] = useState("");
  const tenants = useQuery({ queryKey: ["tenants"], queryFn: ({ signal }) => api<Tenant[]>("/me/tenants", { signal }) });
  const branches = useQuery({
    queryKey: ["branches", tenant?.id],
    queryFn: ({ signal }) => api<Branch[]>("/branches", { tenantId: tenant!.id, signal }),
    enabled: !!tenant,
  });
  async function signout() {
    try { await api("/sign-out", { auth: true, body: {} }); await cache.cancelQueries(); cache.clear(); router.replace("/login"); }
    catch { setSignoutError("Não foi possível sair. Tente novamente."); }
  }
  return <main className="selection">
    <header><a href="/login" className="brand"><span className="brand-mark"><Layers3 size={22}/></span>{productName}<span className="brand-dot">.</span></a>
      <button className="text-button" onClick={signout}><LogOut size={16}/> Sair</button></header>
    <div className="selection-content">
      <span className="eyebrow">SEU ESPAÇO DE TRABALHO</span>
      <h1>{tenant ? "Em qual loja vamos trabalhar?" : "Escolha sua organização."}</h1>
      <p>{tenant ? tenant.name : "Você verá apenas as organizações e lojas às quais tem acesso."}</p>
      {signoutError && <p role="alert" className="alert">{signoutError}</p>}
      {tenant && <button className="text-button back" onClick={() => setTenant(null)}>← Trocar organização</button>}
      {(tenant ? branches.isPending : tenants.isPending) && <p role="status" className="loading">Carregando seus acessos…</p>}
      {(tenant ? branches.error : tenants.error) && <div role="alert" className="alert">Não foi possível carregar. <button onClick={() => tenant ? branches.refetch() : tenants.refetch()}>Tentar novamente</button></div>}
      <div className="selection-grid">
        {!tenant && tenants.data?.map((item) => <button className="selection-card" key={item.id} onClick={() => setTenant(item)}>
          <span className="tile-icon"><Building2/></span><strong>{item.name}</strong><small>Organização</small><ArrowRight className="card-arrow" size={20}/></button>)}
        {tenant && branches.data?.map((branch) => <button className="selection-card" key={branch.id} onClick={async () => {
          await cache.cancelQueries(); cache.clear();
          router.push(`/workspace/${encodeURIComponent(tenant.id)}/${encodeURIComponent(branch.id)}`);
        }}>
          <span className="tile-icon"><MapPin/></span><strong>{branch.name}</strong><small>{branch.company.name} · {branch.code}</small><ArrowRight className="card-arrow" size={20}/></button>)}
      </div>
      {(tenant ? branches.data?.length === 0 : tenants.data?.length === 0) && <div className="empty">Nenhum acesso disponível. Entre em contato com o administrador.</div>}
    </div>
  </main>;
}
