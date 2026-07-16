export interface AuthClient {
  acquireToken(): Promise<string>;
  logout(): Promise<void>;
}

export interface AuthClientConfig {
  clientId: string;
  tenantId: string;
}
