import { getStore } from "@netlify/blobs";
import fs from "node:fs/promises";
import path from "node:path";

export type IpVisit = {
  ip: string;
  firstSeen: string;
  lastSeen: string;
  hits: number;
  userAgent?: string;
  referer?: string;
  path?: string;
};

export type TrafficStats = {
  totalUniqueIps: number;
  totalPageviews: number;
  lastUpdated: string;
  visits: Record<string, IpVisit>;
};

const INITIAL_STATS: TrafficStats = {
  totalUniqueIps: 0,
  totalPageviews: 0,
  lastUpdated: new Date().toISOString(),
  visits: {},
};

const BLOB_KEY = "site_traffic_stats_v1";

// In-memory cache for fast local access
let memoryCache: TrafficStats | null = null;

function getBlobStore() {
  try {
    return getStore({ name: "traffic", consistency: "strong" });
  } catch {
    return null;
  }
}

function getLocalFilePath() {
  // Use /tmp in serverless environment if writable, otherwise .data locally
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "traffic.json");
  }
  return path.join(process.cwd(), ".data", "traffic.json");
}

async function readFromDisk(): Promise<TrafficStats | null> {
  try {
    const file = getLocalFilePath();
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data) as TrafficStats;
  } catch {
    return null;
  }
}

async function writeToDisk(stats: TrafficStats): Promise<void> {
  try {
    const file = getLocalFilePath();
    const dir = path.dirname(file);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, JSON.stringify(stats, null, 2), "utf-8");
  } catch {
    // Ignore disk write errors in read-only setups
  }
}

export async function getTrafficStats(): Promise<TrafficStats> {
  // 1. Try Netlify Blobs if in Netlify environment
  const store = getBlobStore();
  if (store) {
    try {
      const data = (await store.get(BLOB_KEY, { type: "json" })) as TrafficStats | null;
      if (data && typeof data === "object" && data.visits) {
        memoryCache = data;
        return data;
      }
    } catch {
      // Fallback
    }
  }

  // 2. Try disk storage
  const diskData = await readFromDisk();
  if (diskData && diskData.visits) {
    memoryCache = diskData;
    return diskData;
  }

  // 3. Fallback to in-memory or initial
  return memoryCache || { ...INITIAL_STATS, visits: {} };
}

export async function recordVisit(
  ip: string,
  userAgent = "",
  referer = "",
  visitPath = "/"
): Promise<TrafficStats> {
  const current = await getTrafficStats();
  const now = new Date().toISOString();

  // Normalize IP
  const cleanIp = ip.trim() || "unknown";

  const existing = current.visits[cleanIp];
  if (existing) {
    existing.hits += 1;
    existing.lastSeen = now;
    if (userAgent) existing.userAgent = userAgent;
    if (referer) existing.referer = referer;
    existing.path = visitPath;
  } else {
    current.visits[cleanIp] = {
      ip: cleanIp,
      firstSeen: now,
      lastSeen: now,
      hits: 1,
      userAgent,
      referer,
      path: visitPath,
    };
  }

  current.totalPageviews = Object.values(current.visits).reduce((acc, v) => acc + v.hits, 0);
  current.totalUniqueIps = Object.keys(current.visits).length;
  current.lastUpdated = now;

  memoryCache = current;

  // Persist to Netlify Blobs if available
  const store = getBlobStore();
  if (store) {
    try {
      await store.setJSON(BLOB_KEY, current);
    } catch {
      // Ignore blob error and fall back to disk
    }
  }

  // Persist to disk fallback
  await writeToDisk(current);

  return current;
}

export async function resetTrafficStats(): Promise<TrafficStats> {
  const fresh: TrafficStats = {
    totalUniqueIps: 0,
    totalPageviews: 0,
    lastUpdated: new Date().toISOString(),
    visits: {},
  };
  memoryCache = fresh;

  const store = getBlobStore();
  if (store) {
    try {
      await store.setJSON(BLOB_KEY, fresh);
    } catch {
      // Ignore
    }
  }
  await writeToDisk(fresh);
  return fresh;
}
