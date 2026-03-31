"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFENSE_NODE,
  SEVERITY_COLORS,
  THREAT_NODES,
  createThreatEvent,
  formatThreatTime,
  projectToPercent,
  type ThreatEvent,
  type ThreatSeverity,
} from "../data/threatmap-data";

// Removed incorrect gsap.registerPlugin(useGSAP) (useGSAP is a hook, not a GSAP plugin)
import type { Translation } from "../data/translations";

interface ThreatMapProps {
  onExit: () => void;
  currentTranslation: Translation;
}

interface GeoPoint {
  latitude: number;
  longitude: number;
}

const CONTINENT_POLYGONS: GeoPoint[][] = [
  [
    { latitude: 72, longitude: -168 },
    { latitude: 58, longitude: -145 },
    { latitude: 45, longitude: -123 },
    { latitude: 25, longitude: -106 },
    { latitude: 12, longitude: -96 },
    { latitude: 10, longitude: -84 },
    { latitude: 24, longitude: -77 },
    { latitude: 42, longitude: -60 },
    { latitude: 60, longitude: -76 },
  ],
  [
    { latitude: 58, longitude: -12 },
    { latitude: 69, longitude: 15 },
    { latitude: 66, longitude: 35 },
    { latitude: 55, longitude: 46 },
    { latitude: 44, longitude: 34 },
    { latitude: 35, longitude: 16 },
    { latitude: 42, longitude: -5 },
  ],
  [
    { latitude: 36, longitude: -17 },
    { latitude: 33, longitude: 5 },
    { latitude: 26, longitude: 23 },
    { latitude: 20, longitude: 35 },
    { latitude: 8, longitude: 43 },
    { latitude: -9, longitude: 37 },
    { latitude: -22, longitude: 20 },
    { latitude: -33, longitude: 17 },
    { latitude: -23, longitude: 4 },
    { latitude: -8, longitude: -4 },
    { latitude: 9, longitude: -8 },
  ],
  [
    { latitude: 56, longitude: 42 },
    { latitude: 66, longitude: 74 },
    { latitude: 62, longitude: 110 },
    { latitude: 56, longitude: 132 },
    { latitude: 49, longitude: 144 },
    { latitude: 39, longitude: 124 },
    { latitude: 24, longitude: 116 },
    { latitude: 8, longitude: 102 },
    { latitude: 6, longitude: 82 },
    { latitude: 17, longitude: 63 },
    { latitude: 32, longitude: 52 },
  ],
  [
    { latitude: -11, longitude: 112 },
    { latitude: -16, longitude: 126 },
    { latitude: -22, longitude: 139 },
    { latitude: -28, longitude: 148 },
    { latitude: -36, longitude: 146 },
    { latitude: -39, longitude: 132 },
    { latitude: -35, longitude: 116 },
    { latitude: -26, longitude: 113 },
  ],
  [
    { latitude: 13, longitude: -82 },
    { latitude: 4, longitude: -77 },
    { latitude: -9, longitude: -76 },
    { latitude: -22, longitude: -66 },
    { latitude: -36, longitude: -61 },
    { latitude: -45, longitude: -69 },
    { latitude: -41, longitude: -75 },
    { latitude: -28, longitude: -74 },
    { latitude: -8, longitude: -66 },
    { latitude: 7, longitude: -72 },
  ],
];

const severityOrder: ThreatSeverity[] = ["critical", "high", "medium", "low"];

const severityClassMap: Record<ThreatSeverity, string> = {
  critical: "threatmap-severity-critical",
  high: "threatmap-severity-high",
  medium: "threatmap-severity-medium",
  low: "threatmap-severity-low",
};

const drawWorldMap = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  if (!context) return;

  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const width = rect.width;
  const height = rect.height;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  const toCanvas = (point: GeoPoint) => {
    const projected = projectToPercent(point.latitude, point.longitude);
    return {
      x: (projected.x / 100) * width,
      y: (projected.y / 100) * height,
    };
  };

  const backgroundGradient = context.createLinearGradient(0, 0, width, height);
  backgroundGradient.addColorStop(0, "rgba(4, 12, 22, 0.95)");
  backgroundGradient.addColorStop(0.5, "rgba(5, 13, 25, 0.98)");
  backgroundGradient.addColorStop(1, "rgba(3, 9, 16, 0.95)");
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(0, 243, 255, 0.09)";
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += 34) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 0; y <= height; y += 34) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.fillStyle = "rgba(0, 243, 255, 0.09)";
  context.strokeStyle = "rgba(0, 243, 255, 0.18)";
  context.lineWidth = 1;

  CONTINENT_POLYGONS.forEach((polygon) => {
    context.beginPath();
    polygon.forEach((point, index) => {
      const coords = toCanvas(point);
      if (index === 0) {
        context.moveTo(coords.x, coords.y);
      } else {
        context.lineTo(coords.x, coords.y);
      }
    });
    context.closePath();
    context.fill();
    context.stroke();
  });
};

const AttackFeedItem = ({ event }: { event: ThreatEvent }) => (
  <li className={`threatmap-feed-item ${severityClassMap[event.severity]}`}>
    <div className="threatmap-feed-head">
      <span className="threatmap-feed-protocol">{event.protocol}</span>
      <span className="threatmap-feed-time">{formatThreatTime(event.createdAt)}</span>
    </div>
    <div className="threatmap-feed-body">
      <span>
        {event.source.city}, {event.source.country}
      </span>
      <span>{event.ip}</span>
      <span className="threatmap-severity-tag">{event.severity.toUpperCase()}</span>
    </div>
  </li>
);

export default function ThreatMap({ onExit, currentTranslation }: ThreatMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const lineLayerRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const blockedCountRef = useRef<HTMLSpanElement>(null);

  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [totalBlocked, setTotalBlocked] = useState(0);
  const [packetsPerSecond, setPacketsPerSecond] = useState(72);
  const [activeSources, setActiveSources] = useState(5);

  const latestEvent = events[0] ?? null;
  const severityDistribution = useMemo(() => {
    const distribution: Record<ThreatSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    events.forEach((event) => {
      distribution[event.severity] += 1;
    });

    return distribution;
  }, [events]);

  const setNodeRef = useCallback(
    (id: string) => (element: HTMLDivElement | null) => {
      nodeRefs.current[id] = element;
    },
    [],
  );

  const animateThreatLine = useCallback((event: ThreatEvent) => {
    const overlay = overlayRef.current;
    const lineLayer = lineLayerRef.current;

    if (!overlay || !lineLayer) return;

    const width = overlay.clientWidth;
    const height = overlay.clientHeight;
    if (width === 0 || height === 0) return;

    const source = projectToPercent(event.source.latitude, event.source.longitude);
    const target = projectToPercent(event.destination.latitude, event.destination.longitude);

    const sourceX = (source.x / 100) * width;
    const sourceY = (source.y / 100) * height;
    const targetX = (target.x / 100) * width;
    const targetY = (target.y / 100) * height;
    const curvatureOffset = Math.max(32, Math.abs(targetX - sourceX) * 0.22);
    const controlX = (sourceX + targetX) / 2;
    const controlY = Math.min(sourceY, targetY) - curvatureOffset;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${sourceX} ${sourceY} Q ${controlX} ${controlY} ${targetX} ${targetY}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", SEVERITY_COLORS[event.severity]);
    path.setAttribute("stroke-width", event.severity === "critical" ? "2.8" : "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("opacity", "0.95");
    lineLayer.appendChild(path);

    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      autoAlpha: 0.96,
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        path.remove();
      },
    });

    timeline
      .to(path, {
        strokeDashoffset: 0,
        duration: 1.05,
        ease: "power2.inOut",
      })
      .to(
        path,
        {
          autoAlpha: 0,
          duration: 0.42,
          ease: "power1.out",
        },
        "-=0.12",
      );

    const sourceNode = nodeRefs.current[event.source.id];
    const destinationNode = nodeRefs.current[event.destination.id];

    if (sourceNode) {
      gsap.fromTo(
        sourceNode,
        { scale: 1 },
        { scale: 1.35, duration: 0.18, repeat: 1, yoyo: true, ease: "power1.inOut" },
      );
    }

    if (destinationNode) {
      gsap.fromTo(
        destinationNode,
        { scale: 1, autoAlpha: 1 },
        { scale: 1.45, autoAlpha: 1, duration: 0.2, repeat: 1, yoyo: true, ease: "power1.inOut" },
      );
    }
  }, []);

  useGSAP(
    () => {
      gsap.to(".threatmap-node-source", {
        scale: 1.18,
        duration: 1.35,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.08, from: "random" },
      });

      gsap.to(".threatmap-scanline", {
        yPercent: 830,
        duration: 3.6,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => drawWorldMap(canvas);
    render();
    window.addEventListener("resize", render);

    return () => {
      window.removeEventListener("resize", render);
    };
  }, []);

  useEffect(() => {
    if (!blockedCountRef.current) return;

    gsap.fromTo(
      blockedCountRef.current,
      { scale: 1.16 },
      { scale: 1, duration: 0.28, ease: "power1.out", clearProps: "transform" },
    );
  }, [totalBlocked]);

  useEffect(() => {
    const handleExit = (event: KeyboardEvent) => {
      if (event.key === "Escape" || (event.ctrlKey && event.key.toLowerCase() === "c")) {
        event.preventDefault();
        onExit();
      }
    };

    document.addEventListener("keydown", handleExit);
    return () => {
      document.removeEventListener("keydown", handleExit);
    };
  }, [onExit]);

  useEffect(() => {
    let timeoutId = 0;
    let isCancelled = false;

    const emitThreat = () => {
      if (isCancelled) return;

      const event = createThreatEvent();
      setEvents((previous) => [event, ...previous].slice(0, 9));
      setTotalBlocked((count) => count + 1);
      setPacketsPerSecond(Math.floor(Math.random() * 38) + 62);
      setActiveSources(Math.floor(Math.random() * 7) + 3);
      animateThreatLine(event);

      timeoutId = window.setTimeout(emitThreat, Math.floor(Math.random() * 1200) + 1050);
    };

    emitThreat();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [animateThreatLine]);

  const exitLabel = currentTranslation?.ui?.threatmapExit ?? "EXIT (ESC)";

  return (
    <section
      ref={rootRef}
      className="threatmap-panel"
      aria-label="Interactive Threat Map"
      role="region"
    >
      <div className="threatmap-header">
        <p className="neon-title">[ THREAT MAP :: GLOBAL ATTACK SURFACE ]</p>
        <button
          type="button"
          onClick={onExit}
          className="threatmap-exit-btn"
          aria-label={exitLabel}
        >
          {exitLabel}
        </button>
      </div>

      <div className="threatmap-grid-layout">
        <div className="threatmap-map-card">
          <canvas ref={canvasRef} className="threatmap-canvas" />
          <svg ref={overlayRef} className="threatmap-overlay" aria-hidden>
            <g ref={lineLayerRef} />
          </svg>

          <div className="threatmap-nodes-layer">
            {THREAT_NODES.map((node) => {
              const position = projectToPercent(node.latitude, node.longitude);
              return (
                <div
                  key={node.id}
                  ref={setNodeRef(node.id)}
                  className="threatmap-node threatmap-node-source"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  aria-hidden
                />
              );
            })}

            {(() => {
              const position = projectToPercent(DEFENSE_NODE.latitude, DEFENSE_NODE.longitude);
              return (
                <div
                  ref={setNodeRef(DEFENSE_NODE.id)}
                  className="threatmap-node threatmap-node-defense"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  aria-hidden
                />
              );
            })()}
          </div>

          <div className="threatmap-scanline" aria-hidden />
          <p className="threatmap-map-caption">
            Defense node: {DEFENSE_NODE.city}, {DEFENSE_NODE.country}
          </p>
        </div>

        <aside className="threatmap-stats-card">
          <div className="threatmap-stat-row">
            <span>ATTACKS BLOCKED</span>
            <strong ref={blockedCountRef}>{totalBlocked}</strong>
          </div>
          <div className="threatmap-stat-row">
            <span>PACKETS / SEC</span>
            <strong>{packetsPerSecond}</strong>
          </div>
          <div className="threatmap-stat-row">
            <span>ACTIVE SOURCES</span>
            <strong>{activeSources}</strong>
          </div>

          <div className="threatmap-last-event" aria-live="polite">
            <p className="threatmap-subtitle">Latest Event</p>
            {latestEvent ? (
              <>
                <p>
                  <span>IP:</span> {latestEvent.ip}
                </p>
                <p>
                  <span>Origin:</span> {latestEvent.source.city}, {latestEvent.source.country}
                </p>
                <p>
                  <span>Protocol:</span> {latestEvent.protocol}
                </p>
                <p>
                  <span>Severity:</span>{" "}
                  <span className={`threatmap-severity-tag ${severityClassMap[latestEvent.severity]}`}>
                    {latestEvent.severity.toUpperCase()}
                  </span>
                </p>
              </>
            ) : (
              <p>Collecting threat intelligence...</p>
            )}
          </div>

          <div className="threatmap-distribution">
            <p className="threatmap-subtitle">Severity Distribution</p>
            <ul>
              {severityOrder.map((severity) => (
                <li key={severity}>
                  <span>{severity.toUpperCase()}</span>
                  <strong>{severityDistribution[severity]}</strong>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="threatmap-feed">
        <p className="threatmap-subtitle">Recent Intercepted Events</p>
        <ul>
          {events.map((event) => (
            <AttackFeedItem key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </section>
  );
}
