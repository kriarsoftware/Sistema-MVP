import { Workspace } from "../../../../../components/workspace";
import { notFound } from "next/navigation";
export default async function Page({ params }: {
  params: Promise<{ tenantId: string; branchId: string; section?: string[] }>;
}) {
  const { tenantId, branchId, section } = await params;
  const active = section?.join("/") ?? "overview";
  if (!["overview", "depositos", "auditoria", "proximos-passos"].includes(active)) notFound();
  return <Workspace key={`${tenantId}:${branchId}`} tenantId={tenantId} branchId={branchId} active={active}/>;
}
