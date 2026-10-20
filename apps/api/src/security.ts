export function allowedMutationOrigin(method: string, origin: string | undefined, expected: string): boolean {
  return ["GET", "HEAD", "OPTIONS"].includes(method) || origin === expected;
}

export function selectedId(value: unknown): string | undefined {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value) ? value : undefined;
}
