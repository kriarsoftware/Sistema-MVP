export const productName = "Varejo360";
export type Tenant = { id: string; name: string; slug: string };
export type Branch = { id: string; name: string; code: string; company: { name: string } };
export type Context = {
  user: { id: string; name: string; email: string };
  tenant: { id: string; name: string };
  branch: { id: string; name: string; code: string };
  roles: string[];
  permissions: string[];
};
export type Warehouse = { id: string; name: string; code: string; active: boolean; createdAt: string };
export type Audit = { id: string; action: string; entityId: string; actorId: string; createdAt: string; requestId: string };

export async function api<T>(
  path: string,
  options: { tenantId?: string; branchId?: string; body?: unknown; signal?: AbortSignal; auth?: boolean } = {},
): Promise<T> {
  const response = await fetch(`${options.auth ? "/api/auth" : "/api/v1"}${path}`, {
    method: options.body === undefined ? "GET" : "POST",
    headers: {
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(options.tenantId ? { "x-tenant-id": options.tenantId } : {}),
      ...(options.branchId ? { "x-branch-id": options.branchId } : {}),
    },
    credentials: "same-origin",
    cache: "no-store",
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && !options.auth && typeof window !== "undefined") {
      window.location.assign("/login");
    }
    throw new Error(data?.error?.message ?? data?.message ?? "Não foi possível conectar. Tente novamente.");
  }
  return data as T;
}
