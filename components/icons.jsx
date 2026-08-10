import React from "react";

// ---------------------------------------------------------------------------
// Icon set — thin, precise line icons in the spirit of SF Symbols. Color is
// always inherited (currentColor) so a single neutral tone can be applied
// uniformly via Tailwind text-color utilities, keeping category identity in
// the icon shape rather than in decorative color variety.
// ---------------------------------------------------------------------------
const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function IconLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 7h16M12 7v13" strokeWidth={2.2} />
      <path d="M8 7V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" strokeWidth={2.2} />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" />
    </svg>
  );
}

function IconSettings({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.7 7.7 0 0 0-1.7-1L15 3.6h-4l-.4 2.4a7.7 7.7 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9c.5.4 1.1.8 1.7 1l.4 2.4h4l.4-2.4c.6-.2 1.2-.6 1.7-1l2.3.9 2-3.4-2-1.5Z" />
    </svg>
  );
}

function IconApple({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.1 1.1-.3 2.2-1 3-.7.8-1.9 1.5-3 1.4-.1-1.1.4-2.2 1.1-3C14.3 3.6 15.5 3 16.5 3z" />
      <path d="M20.5 17.2c-.5 1.2-1.1 2.3-1.9 3.3-1 1.3-2 2.6-3.6 2.7-1.5 0-2-1-3.7-1s-2.2 1-3.7.9c-1.6-.1-2.6-1.5-3.6-2.8C2.3 17.6 1.3 13.9 2.6 11.3c.9-1.8 2.6-3 4.4-3 1.6 0 2.6 1 3.9 1s2.1-1 3.9-.9c1.3.1 2.7.7 3.6 1.7-3.2 1.9-2.7 6.7 1.1 8.1z" />
    </svg>
  );
}

function IconGoogle({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22 12.2c0-.7-.06-1.4-.18-2H12v3.8h5.6c-.24 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.4-2.6c-.9.6-2.1 1-3.3 1-2.6 0-4.8-1.7-5.6-4.1H3v2.6C4.7 19.6 8.1 22 12 22z" />
      <path fill="#FBBC05" d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3C2.4 8.9 2 10.4 2 12s.4 3.1 1 4.5l3.4-2.6z" />
      <path fill="#EA4335" d="M12 6.3c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3.2 14.7 2 12 2 8.1 2 4.7 4.4 3 7.5l3.4 2.6c.8-2.4 3-4.1 5.6-4.1z" />
    </svg>
  );
}

function IconZap({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function IconFire({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-.5-2 2 1 3.5 3.5 3.5 6a7 7 0 0 1-14 0c0-5 4-6 5-8 .5-1 .5-2 2-3Z" />
    </svg>
  );
}

function IconChevronRight({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M9 6l6 6-6 6" strokeWidth={2} />
    </svg>
  );
}

function IconBell({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13.5 6 9.5Z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconLogout({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9" />
      <path d="M15.5 16.5 20 12l-4.5-4.5" />
      <path d="M20 12H9" />
    </svg>
  );
}

function IconCheckBadge({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path
        d="M7.5 12.5l2.8 2.8L16.8 8.7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconRestore({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 12a8 8 0 1 1 2.5 5.8" />
      <path d="M4 17v-4h4" />
    </svg>
  );
}

function IconTrash({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
    </svg>
  );
}

function IconMail({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function IconCloud({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M7 18h10.5a3.5 3.5 0 0 0 0-7 5.5 5.5 0 0 0-10.6-1.7A4 4 0 0 0 7 18Z" />
    </svg>
  );
}

// Decorative artwork slot (quill pen / compass / astrolabe). Points at a
// project-relative asset path the user will supply themselves. Until that
// file exists, onError swaps in an elegant glowing placeholder instead of a
// broken-image icon, so the layout always looks finished.
function DecorativeImage({ src, alt, className, glowClassName }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`${glowClassName} rounded-full bg-gradient-to-br from-indigo-400 via-violet-400 to-blue-400 blur-2xl animate-pulse`}
        aria-hidden="true"
      />
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

// Brass compass/gear ring around an activity icon — a code-drawn stand-in
// for the "mechanical steam-space" badge look, since it's built from SVG
// ticks rather than painted artwork.
function GearCompassBadge({ children, tintClassName, glowColor }) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const outer = 20,
      inner = i % 3 === 0 ? 15.5 : 17.5;
    const x1 = 22 + outer * Math.sin(angle);
    const y1 = 22 - outer * Math.cos(angle);
    const x2 = 22 + inner * Math.sin(angle);
    const y2 = 22 - inner * Math.cos(angle);
    return { x1, y1, x2, y2, key: i };
  });
  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <circle cx="22" cy="22" r="20" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.55" />
        {ticks.map((t) => (
          <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#C9A227" strokeWidth="1" opacity="0.55" />
        ))}
      </svg>
      {tintClassName ? (
        <div
          className={`absolute inset-1.5 rounded-full bg-gradient-to-br ${tintClassName} flex items-center justify-center`}
          style={{ boxShadow: `0 0 14px 1px ${glowColor}` }}
        >
          {children}
        </div>
      ) : (
        <div className="absolute inset-1.5 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}


function IconClose({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeWidth={1.8} />
    </svg>
  );
}

function IconExternalLink({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M9 6H6a1.5 1.5 0 0 0-1.5 1.5v10.5A1.5 1.5 0 0 0 6 19.5h10.5A1.5 1.5 0 0 0 18 18v-3" />
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="M10.5 13.5 19 5" />
    </svg>
  );
}

function IconClock({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function IconPencil({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M14.5 4.5l5 5L8 21H3v-5L14.5 4.5Z" />
      <path d="M12.5 6.5l5 5" />
    </svg>
  );
}

function IconRulerTriangle({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 20 12 4l8 16Z" />
      <path d="M8.5 14h9" />
    </svg>
  );
}

function IconBookOpen({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M12 6c-1.6-1.2-3.6-1.8-6-1.8v13.6c2.4 0 4.4.6 6 1.8" />
      <path d="M12 6c1.6-1.2 3.6-1.8 6-1.8v13.6c-2.4 0-4.4.6-6 1.8" />
      <path d="M12 6v13.6" />
    </svg>
  );
}

function IconGear({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M4.9 6.5l1.9 1.4M17.2 16.1l1.9 1.4M3.5 12h2.4M18.1 12h2.4M4.9 17.5l1.9-1.4M17.2 7.9l1.9-1.4" />
    </svg>
  );
}

function IconChat({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <path d="M4 5.5h16v10H9.5L5 19v-3.5H4v-10Z" />
      <path d="M8 10h8M8 12.8h5" />
    </svg>
  );
}

function IconBooksStack({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconBase} aria-hidden="true">
      <rect x="4" y="4" width="14" height="4.2" rx="1" />
      <rect x="4" y="9.9" width="16" height="4.2" rx="1" />
      <rect x="4" y="15.8" width="12" height="4.2" rx="1" />
    </svg>
  );
}

// Clean, filled SF-Symbols-style status glyphs (checkmark.circle.fill /
// xmark.circle.fill) — replacing the earlier hand-drawn marks with precise,
// calm iconography appropriate for a trustworthy study tool.
function CheckCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path
        d="M7.5 12.5l2.8 2.8L16.8 8.7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function XCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path
        d="M8.5 8.5l7 7M15.5 8.5l-7 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Each category carries a soft, muted identity color — the same convention
// Apple uses for Reminders lists or Calendar calendars: a pastel chip color
// that ties the icon and its action button together, never a saturated
// decorative accent.
// Shared iOS/NASA-glass card look for the cosmic entry flow (Welcome, Auth,
// Onboarding). Uses inline rgba values instead of Tailwind's slash-opacity
// shorthand, since this sandbox serves a static Tailwind build that doesn't

export {
  IconLogo,
  IconUser,
  IconSettings,
  IconApple,
  IconGoogle,
  IconZap,
  IconFire,
  IconChevronRight,
  IconBell,
  IconLogout,
  IconCheckBadge,
  IconRestore,
  IconTrash,
  IconMail,
  IconCloud,
  DecorativeImage,
  GearCompassBadge,
  IconClose,
  IconExternalLink,
  IconClock,
  IconPencil,
  IconRulerTriangle,
  IconBookOpen,
  IconGear,
  IconChat,
  IconBooksStack,
  CheckCircleIcon,
  XCircleIcon,
};
