export type ThreatSeverity = "critical" | "high" | "medium" | "low";
export type ThreatProtocol = "SSH" | "HTTP" | "HTTPS" | "DNS" | "SMB" | "RDP";

export interface ThreatNode {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface ThreatEvent {
  id: string;
  source: ThreatNode;
  destination: ThreatNode;
  ip: string;
  protocol: ThreatProtocol;
  severity: ThreatSeverity;
  createdAt: string;
}

export const DEFENSE_NODE: ThreatNode = {
  id: "goettingen",
  city: "Göttingen",
  country: "Germany",
  latitude: 51.5413,
  longitude: 9.9158,
};

export const THREAT_NODES: ThreatNode[] = [
  { id: "new-york", city: "New York", country: "USA", latitude: 40.7128, longitude: -74.006 },
  { id: "sao-paulo", city: "São Paulo", country: "Brazil", latitude: -23.5505, longitude: -46.6333 },
  { id: "moscow", city: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6173 },
  { id: "beijing", city: "Beijing", country: "China", latitude: 39.9042, longitude: 116.4074 },
  { id: "tokyo", city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { id: "seoul", city: "Seoul", country: "South Korea", latitude: 37.5665, longitude: 126.978 },
  { id: "tehran", city: "Tehran", country: "Iran", latitude: 35.6892, longitude: 51.389 },
  { id: "lagos", city: "Lagos", country: "Nigeria", latitude: 6.5244, longitude: 3.3792 },
  { id: "cairo", city: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  { id: "madrid", city: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038 },
  { id: "new-delhi", city: "New Delhi", country: "India", latitude: 28.6139, longitude: 77.209 },
  { id: "singapore", city: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  { id: "sydney", city: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
  { id: "johannesburg", city: "Johannesburg", country: "South Africa", latitude: -26.2041, longitude: 28.0473 },
];

export const PROTOCOLS: ThreatProtocol[] = ["SSH", "HTTP", "HTTPS", "DNS", "SMB", "RDP"];

export const SEVERITY_COLORS: Record<ThreatSeverity, string> = {
  critical: "#ff0040",
  high: "#ff7f00",
  medium: "#ffcc00",
  low: "#00f3ff",
};

const SEVERITY_WEIGHTED_POOL: ThreatSeverity[] = [
  "critical",
  "critical",
  "high",
  "high",
  "high",
  "medium",
  "medium",
  "medium",
  "medium",
  "low",
  "low",
  "low",
];

const randomFrom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const randomByte = (minimum = 1, maximum = 254) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export const buildFakeIp = (): string =>
  `${randomByte(2, 223)}.${randomByte()}.${randomByte()}.${randomByte(2, 254)}`;

export const projectToPercent = (latitude: number, longitude: number): { x: number; y: number } => {
  const x = ((longitude + 180) / 360) * 100;
  const y = ((90 - latitude) / 180) * 100;

  return {
    x: Math.min(98, Math.max(2, x)),
    y: Math.min(96, Math.max(4, y)),
  };
};

export const formatThreatTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleTimeString("en-GB", { hour12: false });

export const createThreatEvent = (destination: ThreatNode = DEFENSE_NODE): ThreatEvent => {
  const source = randomFrom(THREAT_NODES);
  const severity = randomFrom(SEVERITY_WEIGHTED_POOL);
  const createdAt = new Date().toISOString();

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source,
    destination,
    ip: buildFakeIp(),
    protocol: randomFrom(PROTOCOLS),
    severity,
    createdAt,
  };
};
