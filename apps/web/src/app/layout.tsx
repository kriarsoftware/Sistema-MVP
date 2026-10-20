import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { productName } from "../lib/api";
import "./globals.css";

export const metadata: Metadata = { title: `${productName} — Gestão para o seu próximo passo`, description: "Gestão de varejo, organizada ao seu redor." };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body><Providers>{children}</Providers></body></html>;
}
