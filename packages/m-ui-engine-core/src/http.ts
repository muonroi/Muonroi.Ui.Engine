import type { MUiEngineManifest } from "./contracts.js";

export interface MEngineHttpClientOptions {
  baseApiUrl: string;
  mGetAccessToken?: () => string | null;
  mGetTenantId?: () => string | null;
  mFetch?: typeof fetch;
}

export interface MEngineHttpError {
  status: number;
  code: string;
  message: string;
}

export function MCreateEngineFetch(options: MEngineHttpClientOptions) {
  const mFetchImpl = options.mFetch ?? fetch;

  return async function MFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers ?? {});
    const token = options.mGetAccessToken?.();
    const tenantId = options.mGetTenantId?.();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (tenantId) {
      headers.set("X-Tenant-Id", tenantId);
    }

    headers.set("X-Correlation-Id", globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);

    const response = await mFetchImpl(`${options.baseApiUrl}${path}`, {
      ...init,
      headers
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: { code?: string; message?: string } };
      const mError: MEngineHttpError = {
        status: response.status,
        code: payload.error?.code ?? "UNKNOWN_ERROR",
        message: payload.error?.message ?? response.statusText
      };

      throw mError;
    }

    return (await response.json()) as T;
  };
}

export class MUiEngineApiClient {
  private readonly mFetch: <T>(path: string, init?: RequestInit) => Promise<T>;

  constructor(fetcher: <T>(path: string, init?: RequestInit) => Promise<T>) {
    this.mFetch = fetcher;
  }

  public async MLoadByUserId(userId: string): Promise<MUiEngineManifest> {
    return await this.mFetch<MUiEngineManifest>(`/auth/ui-engine/${userId}`);
  }

  public async MLoadCurrent(): Promise<MUiEngineManifest> {
    return await this.mFetch<MUiEngineManifest>("/auth/ui-engine/current");
  }
}