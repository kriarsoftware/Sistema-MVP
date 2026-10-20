"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Layers3, ShieldCheck, ArrowRight } from "lucide-react";
import { api, productName } from "../../lib/api";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<{ email: string; password: string }>();
  const submit = handleSubmit(async (body) => {
    setError("");
    try { await api("/sign-in/email", { auth: true, body }); router.replace("/selecionar-organizacao"); }
    catch { setError("Não foi possível entrar. Verifique seus dados e a disponibilidade do serviço."); }
  });
  return <main className="login">
    <section className="login-story">
      <a href="/login" className="brand"><span className="brand-mark"><Layers3 size={23}/></span>{productName}<span className="brand-dot">.</span></a>
      <div className="story-main"><span className="eyebrow light">SEU NEGÓCIO. SUA PRÓXIMA FASE.</span>
        <h1>Mais clareza.<br/>Mais espaço<br/>para crescer<span>.</span></h1>
        <p>A base para conectar suas lojas, organizar sua operação e construir o próximo capítulo do seu varejo.</p>
        <div className="story-card"><div className="orbit"><Layers3 size={32}/></div><div><small>UM LUGAR PARA COMEÇAR</small><strong>Cada loja. Uma visão.</strong><span>Organizações e acessos bem definidos.</span></div><ArrowUpRight size={27}/></div>
      </div>
      <footer>Feito para o ritmo do varejo brasileiro.<span>01 / Fundação</span></footer>
    </section>
    <section className="login-form-area">
      <div className="login-form"><span className="badge"><span className="dot"/> ÁREA DE GESTÃO</span>
        <h2>Bom ter você aqui.</h2><p>Entre para acessar sua organização.</p>
        <form onSubmit={submit}>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="username" placeholder="voce@suaempresa.com.br" {...register("email", { required: "Informe seu e-mail." })}/>
          {errors.email && <small className="field-error">{errors.email.message}</small>}
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Sua senha de acesso" {...register("password", { required: "Informe sua senha." })}/>
          {errors.password && <small className="field-error">{errors.password.message}</small>}
          {error && <div role="alert" className="alert">{error}</div>}
          <button className="primary full" disabled={isSubmitting}>{isSubmitting ? "Entrando…" : "Entrar na minha conta"}<ArrowRight size={18}/></button>
        </form>
        <p className="access-note">Seu acesso é fornecido pelo administrador da organização. A recuperação de senha por e-mail será disponibilizada em uma próxima entrega.</p>
        <div className="security-note"><ShieldCheck size={17}/> Seu acesso respeita as permissões da sua organização.</div>
      </div>
      <small className="login-bottom">Varejo360 · Ambiente de desenvolvimento</small>
    </section>
  </main>;
}
