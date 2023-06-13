export function isTokenResponse(data: unknown): data is {accessToken: string} {
  return typeof data === 'object' && !!data && 'accessToken' in data;
}
