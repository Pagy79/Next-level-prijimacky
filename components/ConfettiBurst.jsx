import React, { useEffect, useMemo, useState } from "react";

const COLORS = ["#a78bfa", "#67e8f9", "#fbbf24", "#f472b6", "#34d399", "#818cf8", "#fb923c"];

/**
 * Lightweight confetti burst (no extra dependency).
 */
export default function ConfettiBurst({ active, durationMs = 2800 }) {
  const [visible, setVisible] = useState(false);
  const pieces = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.45,
      duration: 1.4 + Math.random() * 1.4,
      color: COLORS[i % COLORS.length],
      rotate: Math.random() * 360,
      size: 6 + Math.random() * 8,
      drift: -40 + Math.random() * 80,
    }));
  }, [active]);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return undefined;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [active, durationMs]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate3d(var(--drift), 110vh, 0) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden="true">
        {pieces.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              top: "-5%",
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.55,
              background: p.color,
              borderRadius: 2,
              "--drift": `${p.drift}px`,
              animation: `confettiFall ${p.duration}s linear ${p.delay}s forwards`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
