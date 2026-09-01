export function logRouteError(
  error: Error & { digest?: string },
  scope: string,
) {
  console.error(`[admin:${scope}]`, error);
}
