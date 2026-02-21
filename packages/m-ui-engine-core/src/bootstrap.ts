import type { MUiEngineManifest } from "./contracts.js";
import { MUiEngineRuntime } from "./runtime.js";
import { MAssertUiEngineManifest, MUiEngineValidationError } from "./validation.js";

type MCacheKey = "current" | `user:${string}`;

interface MUiEngineBootstrapCacheEntry {
  runtime: MUiEngineRuntime;
  manifest: MUiEngineManifest;
  expiresAtEpochMs: number;
}

export interface MUiEngineManifestProvider {
  MLoadCurrent(): Promise<MUiEngineManifest>;
  MLoadByUserId(userId: string): Promise<MUiEngineManifest>;
}

export interface MUiEngineTelemetryEvent {
  kind: "cache_hit" | "cache_miss" | "manifest_loaded" | "manifest_invalid";
  source: "current" | "by_user";
  userId?: string;
  elapsedMs?: number;
  schemaVersion?: string;
  issueCount?: number;
}

export interface MUiEngineBootstrapOptions {
  mManifestProvider: MUiEngineManifestProvider;
  mTtlMs?: number;
  mNow?: () => number;
  mOnTelemetry?: (event: MUiEngineTelemetryEvent) => void;
}

export class MUiEngineBootstrapper {
  private readonly mManifestProvider: MUiEngineManifestProvider;
  private readonly mTtlMs: number;
  private readonly mNow: () => number;
  private readonly mOnTelemetry?: (event: MUiEngineTelemetryEvent) => void;
  private readonly mCache = new Map<MCacheKey, MUiEngineBootstrapCacheEntry>();

  constructor(options: MUiEngineBootstrapOptions) {
    this.mManifestProvider = options.mManifestProvider;
    this.mTtlMs = options.mTtlMs ?? 60_000;
    this.mNow = options.mNow ?? (() => Date.now());
    this.mOnTelemetry = options.mOnTelemetry;
  }

  public async MLoadCurrentRuntime(forceRefresh = false): Promise<MUiEngineRuntime> {
    const entry = await this.MLoad("current", "current", undefined, forceRefresh);
    return entry.runtime;
  }

  public async MLoadRuntimeByUserId(userId: string, forceRefresh = false): Promise<MUiEngineRuntime> {
    const entry = await this.MLoad(`user:${userId}`, "by_user", userId, forceRefresh);
    return entry.runtime;
  }

  public MResetCache(): void {
    this.mCache.clear();
  }

  private async MLoad(
    key: MCacheKey,
    source: "current" | "by_user",
    userId: string | undefined,
    forceRefresh: boolean
  ): Promise<MUiEngineBootstrapCacheEntry> {
    const now = this.mNow();
    const cached = this.mCache.get(key);

    if (!forceRefresh && cached && cached.expiresAtEpochMs > now) {
      this.mOnTelemetry?.({
        kind: "cache_hit",
        source,
        userId
      });
      return cached;
    }

    this.mOnTelemetry?.({
      kind: "cache_miss",
      source,
      userId
    });

    const startMs = now;
    const manifest =
      source === "current"
        ? await this.mManifestProvider.MLoadCurrent()
        : await this.mManifestProvider.MLoadByUserId(userId ?? "");

    try {
      MAssertUiEngineManifest(manifest);
    } catch (error) {
      if (error instanceof MUiEngineValidationError) {
        this.mOnTelemetry?.({
          kind: "manifest_invalid",
          source,
          userId,
          issueCount: error.mIssues.length
        });
      }

      throw error;
    }

    const runtime = new MUiEngineRuntime(manifest);
    const entry: MUiEngineBootstrapCacheEntry = {
      runtime,
      manifest,
      expiresAtEpochMs: this.mNow() + this.mTtlMs
    };

    this.mCache.set(key, entry);
    this.mOnTelemetry?.({
      kind: "manifest_loaded",
      source,
      userId,
      elapsedMs: this.mNow() - startMs,
      schemaVersion: manifest.schemaVersion
    });

    return entry;
  }
}
