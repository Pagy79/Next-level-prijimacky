import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase/client";
import { saveAttempt, loadProgress } from "./lib/progress";
import { requestStartPracticeTest, requestStartBigTest, applyEntitlementSnapshot } from "./lib/entitlements";
import { activatePromoCode } from "./lib/promo";
import { startPremiumCheckout, restoreSessionAfterCheckout } from "./lib/stripe/checkout";
import ConfettiBurst from "./components/ConfettiBurst";
import {
  unlockAudio,
  playTap,
  playCorrect,
  playWrongSound,
  playShield,
  playStreak,
  playStart,
  playResults,
  startRocketEngine,
  stopRocketEngine,
  setSoundHapticsEnabled as syncSoundHapticsFlag,
} from "./lib/sounds";
import questionsData from "./data/questions.json";
import { CHEAT_SHEETS } from "./data/cheatsheets";
import { PRIVACY_POLICY } from "./data/privacyPolicy";
import { TERMS_OF_USE } from "./data/termsOfUse";
import {
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
} from "./components/icons";
import {
  COSMIC_BG_STYLE,
  COSMIC_GLASS_CARD_STYLE,
  COSMIC_GLASS_CARD_STYLE_SETTINGS,
  COSMIC_GLASS_CARD_STYLE_FULLTEST,
  COSMIC_GLASS_CARD_STYLE_ASTROLABE,
  COSMIC_GLASS_CARD_STYLE_BOOK,
  COSMIC_GLASS_CARD_STYLE_WATCH,
  QUIZ_CATEGORY_BG,
  COSMIC_TILE_STYLE,
  COSMIC_BUTTON_SHADOW,
  PARCHMENT_STYLE,
  CATEGORY_META,
} from "./lib/quizTheme";
import QuestionText from "./components/QuestionText";
import WelcomeAntiqueCompass from "./components/WelcomeAntiqueCompass";


// Supabase vrací anglické chybové hlášky — appka je celá v češtině, tak
// je překládáme. Cokoliv nezmapované projde beze změny, ať se žádná
// chyba "neztratí" tichem.
function translateAuthError(message) {
  const map = {
    "Invalid login credentials": "Nesprávný e-mail nebo heslo.",
    "User already registered": "Účet s tímto e-mailem už existuje. Zkus se přihlásit.",
    "Email not confirmed": "Nejdřív prosím potvrď e-mail — zkontroluj schránku.",
    "Password should be at least 6 characters": "Heslo musí mít alespoň 6 znaků.",
    "Unable to validate email address: invalid format": "Zadej platnou e-mailovou adresu.",
    "For security purposes, you can only request this after some time.":
      "Z bezpečnostních důvodů to zkus znovu až za chvíli.",
    "New password should be different from the old password.":
      "Nové heslo musí být jiné než původní.",
    "Auth session missing!": "Odkaz na obnovu hesla vypršel. Požádej o nový e-mail.",
  };
  return map[message] || message;
}


const LETTERS = ["A", "B", "C", "D"];

// Fixed topic areas shown in the chapter menu, in this order, regardless
// of how many real questions currently exist for each one.
const TOPIC_AREAS = [
  "Pravopis",
  "Skladba",
  "Tvarosloví",
  "Porozumění textu",
  "Slovní zásoba",
  "Literární teorie",
];

const QUIZ_LENGTH = 20; // per-topic practice round
const FULL_TEST_LENGTH = 30; // full timed mock exam, mirrors real JPZ length
const FULL_TEST_MINUTES = 40;
const MISTAKES_QUIZ_LENGTH = 20;

const FIRST_RUN_STORAGE_PREFIX = "kompas_cj_first_run_v1_";

function firstRunStorageKey(userId) {
  return `${FIRST_RUN_STORAGE_PREFIX}${userId || "anon"}`;
}

function hasCompletedFirstRun(userId) {
  try {
    return localStorage.getItem(firstRunStorageKey(userId)) === "1";
  } catch {
    return false;
  }
}

function markFirstRunCompleted(userId) {
  try {
    localStorage.setItem(firstRunStorageKey(userId), "1");
  } catch {
    // ignore quota / private mode
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draws exactly `count` questions from `pool`. If the pool has fewer
// questions than requested, it reshuffles and cycles through the pool again
// rather than stopping short — while avoiding placing the same question
// twice in a row where possible. Once a topic has enough real questions,
// this naturally behaves like a plain no-repeat shuffle.
function drawQuestions(pool, count) {
  if (pool.length === 0) return [];
  const result = [];
  let bag = shuffle(pool);
  while (result.length < count) {
    if (bag.length === 0) bag = shuffle(pool);
    let candidate = bag.shift();
    if (
      pool.length > 1 &&
      result.length > 0 &&
      candidate === result[result.length - 1] &&
      bag.length > 0
    ) {
      bag.push(candidate);
      candidate = bag.shift();
    }
    result.push(candidate);
  }
  return result;
}

/** Session result metrics: accuracy matches category tiles; points drive mock-test trophies. */
function getSessionResultStats({ questions, answerLog, score }) {
  const questionCount = questions?.length || 0;
  const maxScore = questionCount * 2;
  const correctCount = (answerLog || []).filter((a) => a.isCorrect).length;
  const accuracyPct =
    questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;
  const safeScore = Math.max(0, Number(score) || 0);
  const pointsPct =
    maxScore > 0 ? Math.max(0, Math.min(100, (safeScore / maxScore) * 100)) : 0;
  return { questionCount, maxScore, correctCount, accuracyPct, pointsPct, safeScore };
}

/** Wrong answers in this attempt, grouped by category (for results breakdown). */
function getSessionMistakeBreakdown(answerLog) {
  const wrong = (answerLog || []).filter((a) => a && !a.isCorrect && a.questionId);
  const byCategory = {};
  for (const a of wrong) {
    const cat = a.category || "Ostatní";
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  }
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  return {
    wrongCount: wrong.length,
    wrongIds: wrong.map((a) => a.questionId),
    categories,
  };
}

// Maps a percentage score (0-100) to the final result tier.
function getResultTier(percentage) {
  if (percentage >= 90) {
    return { emoji: "🏆", label: "Zlatý pohár", tone: "text-amber-500" };
  }
  if (percentage >= 80) {
    return { emoji: "🥈", label: "Stříbrný pohár", tone: "text-zinc-400" };
  }
  if (percentage >= 70) {
    return { emoji: "🥉", label: "Bronzový pohár", tone: "text-orange-400" };
  }
  return {
    emoji: null,
    label: "Není to špatné, ale chce to víc testovat a učit se.",
    tone: "text-zinc-500",
  };
}

function formatTime(totalSeconds) {
  const clamped = Math.max(0, totalSeconds);
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function makeDashboardRocketFlight() {
  const pick = (min, max) => min + Math.random() * (max - min);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    // Control points in % of the fly zone (x: width, y: height)
    x0: -8,
    y0: pick(10, 36),
    x1: pick(32, 62),
    y1: pick(12, 58),
    x2: 108,
    y2: pick(8, 40),
    durationMs: pick(4200, 7200),
    /** Pauza mezi průlety — max. 1× za 30 s */
    pauseMs: 30_000,
  };
}

function bezier2(a, b, c, t) {
  const u = 1 - t;
  return u * u * a + 2 * u * t * b + t * t * c;
}

function bezier2Deriv(a, b, c, t) {
  return 2 * (1 - t) * (b - a) + 2 * t * (c - b);
}

/** Ease in-out without changing the geometric tangent of the path. */
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Raketka proletí horní polovinou dashboardu zleva doprava.
 * Rotace = směr tečny dráhy (špička → plamen v jedné přímce se směrem jízdy).
 * 🚀 je vykreslená špičkou nahoru / plamenem dolů.
 */
function DashboardFlybyRocket({ soundEnabled = true }) {
  const zoneRef = useRef(null);
  const rocketRef = useRef(null);
  const rafRef = useRef(0);
  const timeoutRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    if (!soundEnabled) stopRocketEngine();
  }, [soundEnabled]);

  useEffect(() => {
    let cancelled = false;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduceMotion) {
      if (rocketRef.current) rocketRef.current.style.opacity = "0";
      return undefined;
    }

    const wait = (ms) =>
      new Promise((resolve) => {
        timeoutRef.current = window.setTimeout(resolve, ms);
      });

    const flyOnce = (flight) =>
      new Promise((resolve) => {
        if (soundEnabledRef.current) {
          startRocketEngine(true);
        } else {
          stopRocketEngine();
        }
        const start = performance.now();
        const { x0, y0, x1, y1, x2, y2, durationMs } = flight;

        const tick = (nowMs) => {
          if (cancelled) {
            stopRocketEngine();
            resolve();
            return;
          }
          const zone = zoneRef.current;
          const el = rocketRef.current;
          if (!zone || !el) {
            stopRocketEngine();
            resolve();
            return;
          }

          const raw = Math.min(1, (nowMs - start) / durationMs);
          const t = easeInOut(raw);

          const w = zone.clientWidth || 1;
          const h = zone.clientHeight || 1;

          const xPct = bezier2(x0, x1, x2, t);
          const yPct = bezier2(y0, y1, y2, t);
          // Velocity in px so heading matches the visible path
          const vx = bezier2Deriv(x0, x1, x2, t) * (w / 100);
          const vy = bezier2Deriv(y0, y1, y2, t) * (h / 100);

          // Travel angle: 0° = up, 90° = right (screen Y grows downward).
          const travelDeg = (Math.atan2(vx, -vy) * 180) / Math.PI;
          // Segoe/Windows 🚀 is drawn tip→flame along ~NE, not straight up.
          const GLYPH_TIP_OFFSET_DEG = 45;
          const deg = travelDeg - GLYPH_TIP_OFFSET_DEG;

          const fade =
            raw < 0.06 ? raw / 0.06 : raw > 0.94 ? (1 - raw) / 0.06 : 1;

          el.style.transform = `translate(-50%, -50%) translate(${(xPct / 100) * w}px, ${(yPct / 100) * h}px) rotate(${deg}deg)`;
          el.style.opacity = String(Math.max(0, Math.min(1, fade)));

          if (raw < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            el.style.opacity = "0";
            stopRocketEngine();
            resolve();
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      });

    (async () => {
      while (!cancelled) {
        const flight = makeDashboardRocketFlight();
        await flyOnce(flight);
        if (cancelled) break;
        await wait(flight.pauseMs);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
      stopRocketEngine();
    };
  }, []);

  return (
    <div ref={zoneRef} className="absolute inset-0" aria-hidden="true">
      <span
        ref={rocketRef}
        className="dashboard-flyby-rocket"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontSize: "1.35rem",
          lineHeight: 1,
          opacity: 0,
          pointerEvents: "none",
          willChange: "transform, opacity",
          filter: "drop-shadow(0 0 10px rgba(251, 146, 60, 0.55))",
          transformOrigin: "center center",
        }}
      >
        🚀
      </span>
    </div>
  );
}

export default function QuizPrototype() {
  // ---- Auth & onboarding gate ----
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authFlow, setAuthFlow] = useState(null); // null | "auth" | "onboarding-nickname" | "onboarding-notifications"
  const [authMode, setAuthMode] = useState("register"); // "register" | "login" | "forgot" | "reset"
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const passwordRecoveryRef = useRef(false);
  const [nickname, setNickname] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationJustConfirmed, setNotificationJustConfirmed] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  /** First-run product tour: 1 | 2 | 3, or null when hidden. */
  const [firstRunStep, setFirstRunStep] = useState(null);
  const [showFirstRunResultsTip, setShowFirstRunResultsTip] = useState(false);

  useEffect(() => {
    if (authFlow !== null || firstRunStep !== null) {
      setOverlayVisible(false);
      const t = setTimeout(() => setOverlayVisible(true), 20);
      return () => clearTimeout(t);
    }
    setOverlayVisible(false);
  }, [authFlow, firstRunStep]);

  // Lokální test: http://localhost:5173/?resetFirstRun=1 znovu ukáže první běh.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("resetFirstRun") !== "1") return;
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith(FIRST_RUN_STORAGE_PREFIX)) localStorage.removeItem(key);
      }
      params.delete("resetFirstRun");
      const next = `${window.location.pathname}${params.toString() ? `?${params}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", next);
    } catch {
      // ignore
    }
  }, []);

  // Obnoví přihlášení po refreshi stránky / návratu z Google OAuth / Stripe Checkout.
  // (Supabase JS klient si session drží sám v localStorage — tady ji jen
  // načteme do UI stavu appky) a drží stav živě synchronizovaný přes
  // onAuthStateChange (přihlášení v jiném okně, vypršení session apod.).
  useEffect(() => {
    let active = true;

    function isMissingProfile(profile, error) {
      return !profile || error?.code === "PGRST116";
    }

    async function rejectMissingProfile() {
      await supabase.auth.signOut().catch(() => {});
      if (!active) return;
      setIsAuthenticated(false);
      setNickname("");
      setUserEmail("");
      setAuthMode("login");
      setAuthError("Tento účet už neexistuje. Založ si nový registrací.");
      setAuthInfo("");
      setAuthFlow("auth");
    }

    async function loadFromSession(user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "nickname, email, notifications_enabled, is_premium, practice_tests_today, last_practice_test_date, last_big_test_at"
        )
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      if (isMissingProfile(profile, error)) {
        // Smazaný řádek v profiles ≠ smazaný auth.users — bez profilu nepustíme dál.
        console.warn("Profil chybí, odhlašuji session:", error?.message || "no row");
        await rejectMissingProfile();
        return;
      }
      if (error) {
        // Nejčastější příčina: chybějící/špatně nastavená RLS SELECT
        // politika na tabulce profiles. Bez tohoto logu appka tiše spadne na e-mail
        // jako přezdívku a vypadá to jako "neuložilo se to".
        console.error("Načtení profilu při přihlášení selhalo:", error);
      }
      setNickname(profile?.nickname || (user.email ? user.email.split("@")[0] : "Žák"));
      setUserEmail(profile?.email || user.email || "");
      setNotificationsEnabled(profile?.notifications_enabled ?? false);
      setIsPremium(profile?.is_premium ?? false);
      setPracticeTestsToday(profile?.practice_tests_today ?? 0);
      setLastPracticeTestDate(profile?.last_practice_test_date ?? null);
      setLastBigTestAt(profile?.last_big_test_at ?? null);
      setIsAuthenticated(true);
    }

    (async () => {
      // Po návratu ze Stripe může localStorage chybět — zkus sessionStorage backup.
      let session = (await supabase.auth.getSession()).data.session;
      if (!session?.user) {
        session = await restoreSessionAfterCheckout();
      }
      if (!active) return;

      const params = new URLSearchParams(window.location.search);
      const isResetReturn = params.get("reset") === "1";
      if (isResetReturn) {
        const url = new URL(window.location.href);
        url.searchParams.delete("reset");
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
        passwordRecoveryRef.current = true;
        setAuthMode("reset");
        setAuthInfo("Zvol si nové heslo k účtu.");
        setPasswordInput("");
        setPasswordConfirmInput("");
        setAuthFlow("auth");
        // Session z recovery odkazu už může být — nechceme rovnou dashboard.
        return;
      }

      if (session?.user && !passwordRecoveryRef.current) {
        await loadFromSession(session.user);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        passwordRecoveryRef.current = true;
        setAuthMode("reset");
        setAuthError("");
        setAuthInfo("Zvol si nové heslo k účtu.");
        setPasswordInput("");
        setPasswordConfirmInput("");
        setAuthFlow("auth");
        return;
      }
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") && session?.user) {
        // Po odkazu z e-mailu nejdřív necháme nastavit nové heslo, až potom dashboard.
        if (passwordRecoveryRef.current) return;
        loadFromSession(session.user);
      }
      if (event === "SIGNED_OUT") {
        passwordRecoveryRef.current = false;
        setIsAuthenticated(false);
        setNickname("");
        setUserEmail("");
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const [showSettings, setShowSettings] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [nicknameSaveError, setNicknameSaveError] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [practiceTestsToday, setPracticeTestsToday] = useState(0);
  const [lastPracticeTestDate, setLastPracticeTestDate] = useState(null);
  const [lastBigTestAt, setLastBigTestAt] = useState(null);
  const [paywallMessage, setPaywallMessage] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [premiumPurchaseConsent, setPremiumPurchaseConsent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");
  const [soundHapticsEnabled, setSoundHapticsEnabled] = useState(true);
  const [isRestoringPurchases, setIsRestoringPurchases] = useState(false);
  const [restoreConfirmed, setRestoreConfirmed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  useEffect(() => {
    if (showSettings) {
      setSettingsVisible(false);
      const t = setTimeout(() => setSettingsVisible(true), 20);
      return () => clearTimeout(t);
    }
    setSettingsVisible(false);
  }, [showSettings]);

  useEffect(() => {
    if (showPaywall) {
      setPaywallVisible(false);
      const t = setTimeout(() => setPaywallVisible(true), 20);
      return () => clearTimeout(t);
    }
    setPaywallVisible(false);
  }, [showPaywall]);

  useEffect(() => {
    if (showDeleteConfirm) {
      setDeleteConfirmVisible(false);
      const t = setTimeout(() => setDeleteConfirmVisible(true), 20);
      return () => clearTimeout(t);
    }
    setDeleteConfirmVisible(false);
  }, [showDeleteConfirm]);

  useEffect(() => {
    if (showHelp) {
      setHelpVisible(false);
      const t = setTimeout(() => setHelpVisible(true), 20);
      return () => clearTimeout(t);
    }
    setHelpVisible(false);
  }, [showHelp]);

  useEffect(() => {
    if (showPrivacy) {
      setPrivacyVisible(false);
      const t = setTimeout(() => setPrivacyVisible(true), 20);
      return () => clearTimeout(t);
    }
    setPrivacyVisible(false);
  }, [showPrivacy]);

  useEffect(() => {
    if (showTerms) {
      setTermsVisible(false);
      const t = setTimeout(() => setTermsVisible(true), 20);
      return () => clearTimeout(t);
    }
    setTermsVisible(false);
  }, [showTerms]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.location.pathname === "/privacy") {
      setShowPrivacy(true);
    }
    const onPopState = () => {
      setShowPrivacy(window.location.pathname === "/privacy");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function openHelp() {
    setShowHelp(true);
  }

  function closeHelp() {
    setShowHelp(false);
  }

  function openPrivacy() {
    setShowPrivacy(true);
    if (typeof window !== "undefined" && window.location.pathname !== "/privacy") {
      window.history.pushState({ privacy: true }, "", "/privacy");
    }
  }

  function closePrivacy() {
    setShowPrivacy(false);
    if (typeof window !== "undefined" && window.location.pathname === "/privacy") {
      window.history.replaceState({}, "", "/");
    }
  }

  function openTerms() {
    setShowTerms(true);
  }

  function closeTerms() {
    setShowTerms(false);
  }

  function openSettings() {
    setNicknameDraft(nickname);
    setIsEditingNickname(false);
    setShowSettings(true);
  }

  function closeSettings() {
    setShowSettings(false);
  }

  function startEditingNickname() {
    setNicknameDraft(nickname);
    setIsEditingNickname(true);
  }

  async function saveNicknameDraft() {
    const trimmed = nicknameDraft.trim();
    if (!trimmed) {
      setIsEditingNickname(false);
      return;
    }
    const previousNickname = nickname;
    setNickname(trimmed); // optimistický update UI
    setIsEditingNickname(false);
    setNicknameSaveError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNickname(previousNickname);
      setNicknameSaveError("Nejsi přihlášen/a — zkus se odhlásit a znovu přihlásit.");
      return;
    }

    const { error } = await supabase.from("profiles").update({ nickname: trimmed }).eq("id", user.id);

    if (error) {
      console.error("Uložení přezdívky selhalo:", error);
      setNickname(previousNickname); // vrátit zpět, ať appka netvrdí, že se to povedlo
      setNicknameSaveError(translateAuthError(error.message));
      setIsEditingNickname(true);
      setNicknameDraft(trimmed);
    }
  }

  async function toggleNotificationsInSettings() {
    let nextValue = false;
    if (notificationsEnabled) {
      nextValue = false;
      setNotificationsEnabled(false);
    } else {
      try {
        if (typeof window !== "undefined" && "Notification" in window) {
          const permission = await Notification.requestPermission();
          nextValue = permission === "granted";
        }
      } catch (err) {
        nextValue = false;
      }
      setNotificationsEnabled(nextValue);
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ notifications_enabled: nextValue }).eq("id", user.id);
    }
  }

  function openPaywall(message) {
    setPaywallMessage(typeof message === "string" ? message : "");
    setPromoError("");
    setPromoSuccess("");
    setPromoCodeInput("");
    setCheckoutError("");
    setPremiumPurchaseConsent(false);
    setShowPaywall(true);
  }

  function closePaywall() {
    setShowPaywall(false);
    setPaywallMessage("");
    setPromoError("");
    setPromoSuccess("");
    setPromoLoading(false);
    setCheckoutError("");
    setCheckoutLoading(false);
    setPremiumPurchaseConsent(false);
  }

  async function handleActivatePromoCode(e) {
    e?.preventDefault?.();
    if (promoLoading) return;
    setPromoError("");
    setPromoSuccess("");
    const code = promoCodeInput.trim();
    if (!code) {
      setPromoError("Neplatný kód. Napiš si o něj na info@fachmanka.cz");
      return;
    }
    setPromoLoading(true);
    try {
      const result = await activatePromoCode(code);
      if (!result?.ok) {
        setPromoError(
          result?.message || "Neplatný kód. Napiš si o něj na info@fachmanka.cz"
        );
        return;
      }

      setIsPremium(true);
      setPromoSuccess(result.message || "Vesmírný Premium přístup aktivován! 🚀");
      setShowConfetti(true);
      playStreak(soundHapticsEnabled);
      setTimeout(() => setShowConfetti(false), 3200);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium, practice_tests_today, last_practice_test_date, last_big_test_at")
          .eq("id", user.id)
          .single();
        if (profile) {
          setIsPremium(!!profile.is_premium);
          setPracticeTestsToday(profile.practice_tests_today ?? 0);
          setLastPracticeTestDate(profile.last_practice_test_date ?? null);
          setLastBigTestAt(profile.last_big_test_at ?? null);
        }
      }

      setTimeout(() => {
        closePaywall();
      }, 1800);
    } catch (err) {
      setPromoError("Neplatný kód. Napiš si o něj na info@fachmanka.cz");
    } finally {
      setPromoLoading(false);
    }
  }

  // Vrací dnešní datum ve formátu YYYY-MM-DD (odpovídá typu `date` ve
  // Supabase) — používá se pro porovnání s last_practice_test_date.
  function todayDateString() {
    return new Date().toISOString().split("T")[0];
  }

  // Kolik krátkých testů dnes uživatel už vyčerpal (0, pokud je
  // last_practice_test_date jiný den než dnes — počítadlo se resetuje).
  function practiceTestsUsedToday() {
    return lastPracticeTestDate === todayDateString() ? practiceTestsToday : 0;
  }

  const FREE_PRACTICE_TESTS_PER_DAY = 2;
  const FREE_BIG_TEST_INTERVAL_DAYS = 7;

  // Centrální kontrola limitů Verze ZDARMA. PREMIUM nemá žádné omezení.
  function canTakeTest(type) {
    if (isPremium) return { allowed: true };

    if (type === "practice") {
      if (practiceTestsUsedToday() >= FREE_PRACTICE_TESTS_PER_DAY) {
        return {
          allowed: false,
          message: `Dnes jsi využil/a oba testy zdarma (${FREE_PRACTICE_TESTS_PER_DAY}/${FREE_PRACTICE_TESTS_PER_DAY}). Nové testy budou zase zítra, nebo přejdi na PREMIUM pro neomezený přístup.`,
        };
      }
      return { allowed: true };
    }

    if (type === "big") {
      if (!lastBigTestAt) return { allowed: true };
      const diffMs = Date.now() - new Date(lastBigTestAt).getTime();
      const intervalMs = FREE_BIG_TEST_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
      if (diffMs < intervalMs) {
        const remainingDays = Math.ceil((intervalMs - diffMs) / (24 * 60 * 60 * 1000));
        return {
          allowed: false,
          message: `Další test nanečisto zdarma bude dostupný za ${remainingDays} ${
            remainingDays === 1 ? "den" : remainingDays < 5 ? "dny" : "dní"
          }. S PREMIUM ho můžeš zkusit hned.`,
        };
      }
      return { allowed: true };
    }

    return { allowed: true };
  }

  // Sync local entitlement state after a server RPC (start_practice_test / start_big_test).
  function syncEntitlementsFromServer(snapshot) {
    applyEntitlementSnapshot(snapshot, {
      setIsPremium,
      setPracticeTestsToday,
      setLastPracticeTestDate,
      setLastBigTestAt,
    });
  }

  // Paywall CTA — Stripe Checkout (69 Kč) or refresh existing Premium status.
  async function handleBuyPremium() {
    if (checkoutLoading || !premiumPurchaseConsent) return;
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const result = await startPremiumCheckout();
      if (result.error) {
        setCheckoutError(result.error);
        return;
      }
      window.location.href = result.url;
    } catch (e) {
      setCheckoutError(e?.message || "Platbu se nepodařilo spustit.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleUnlockPremium() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium, practice_tests_today, last_practice_test_date, last_big_test_at")
        .eq("id", user.id)
        .single();
      if (profile) {
        setIsPremium(!!profile.is_premium);
        setPracticeTestsToday(profile.practice_tests_today ?? 0);
        setLastPracticeTestDate(profile.last_practice_test_date ?? null);
        setLastBigTestAt(profile.last_big_test_at ?? null);
        if (profile.is_premium) {
          closePaywall();
          return;
        }
      }
    }
    setCheckoutError(
      "Na účtu zatím není aktivní PREMIUM. Zaplať 69 Kč nebo aktivuj promo kód."
    );
  }

  // After Stripe Checkout redirect (?premium=success) → restore session, refresh profile + confetti.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const premium = params.get("premium");
    if (!premium) return;

    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("premium");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    };

    if (premium === "cancel") {
      cleanUrl();
      (async () => {
        await restoreSessionAfterCheckout();
        openPaywall("Platba byla zruena. Můžeš to zkusit znovu nebo použít promo kód.");
      })();
      return;
    }

    if (premium !== "success") {
      cleanUrl();
      return;
    }

    let cancelled = false;
    (async () => {
      cleanUrl();
      // Nejdřív obnov session (localStorage po Stripe redirectu občas chybí).
      let session = await restoreSessionAfterCheckout();
      if (!session?.user) {
        session = (await supabase.auth.getSession()).data.session;
      }

      // Webhook může dorazit o chvilku později — pár pokusů (i když session ještě nabíhá).
      for (let i = 0; i < 8; i++) {
        if (cancelled) return;
        if (!session?.user) {
          session = await restoreSessionAfterCheckout();
          if (!session?.user) {
            session = (await supabase.auth.getSession()).data.session;
          }
        }
        const user = session?.user;
        if (!user) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium, practice_tests_today, last_practice_test_date, last_big_test_at")
          .eq("id", user.id)
          .single();
        if (cancelled) return;
        if (profile?.is_premium) {
          setIsAuthenticated(true);
          setIsPremium(true);
          setPracticeTestsToday(profile.practice_tests_today ?? 0);
          setLastPracticeTestDate(profile.last_practice_test_date ?? null);
          setLastBigTestAt(profile.last_big_test_at ?? null);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4500);
          closePaywall();
          return;
        }
        await new Promise((r) => setTimeout(r, 700));
      }
      if (!cancelled) {
        openPaywall(
          "Platba proběhla. Pokud PREMIUM ještě nevidíš, počkej chvilku a klepni na Obnovit stav PREMIUM."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  async function handleRestorePurchases() {
    setIsRestoringPurchases(true);
    setRestoreConfirmed(false);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium, practice_tests_today, last_practice_test_date, last_big_test_at")
          .eq("id", user.id)
          .single();
        if (profile) {
          setIsPremium(!!profile.is_premium);
          setPracticeTestsToday(profile.practice_tests_today ?? 0);
          setLastPracticeTestDate(profile.last_practice_test_date ?? null);
          setLastBigTestAt(profile.last_big_test_at ?? null);
          if (profile.is_premium) {
            setRestoreConfirmed(true);
            setTimeout(() => setRestoreConfirmed(false), 3500);
            return;
          }
        }
      }
      openPaywall("Žádné aktivní PREMIUM na účtu. Kup přístup za 69 Kč nebo aktivuj promo kód.");
    } finally {
      setIsRestoringPurchases(false);
    }
  }

  function openDeleteConfirm() {
    setDeleteAccountError("");
    setShowDeleteConfirm(true);
  }

  function closeDeleteConfirm() {
    if (isDeletingAccount) return; // nenech uživatele zavřít modal uprostřed mazání
    setShowDeleteConfirm(false);
    setDeleteAccountError("");
  }

  async function handleDeleteAccount() {
    setDeleteAccountError("");
    setIsDeletingAccount(true);

    const { error } = await supabase.rpc("delete_user");

    if (error) {
      setIsDeletingAccount(false);
      setDeleteAccountError(translateAuthError(error.message));
      return; // účet zůstal — nesmíme uživatele odhlásit ani mazat lokální stav
    }

    // Účet je smazaný na serveru. Odhlásíme a promažeme kompletně lokální
    // stav appky (stejná logika jako běžné odhlášení), ať appka spolehlivě
    // skončí zpátky na Welcome/přihlašovací obrazovce bez zbytků starého
    // uživatele (přezdívka, e-mail, premium, ...).
    setIsDeletingAccount(false);
    setShowDeleteConfirm(false);
    setShowSettings(false);
    await handleLogout();
  }

  function openAuth(mode) {
    setAuthMode(mode);
    setAuthError("");
    setAuthInfo("");
    setPasswordConfirmInput("");
    if (mode !== "reset") {
      passwordRecoveryRef.current = false;
    }
    setAuthFlow("auth");
  }

  function closeAuth() {
    if (passwordRecoveryRef.current || authMode === "reset") {
      // Zrušení obnovy hesla = konec recovery session, zpět na welcome.
      passwordRecoveryRef.current = false;
      setAuthMode("login");
      setAuthError("");
      setAuthInfo("");
      setPasswordInput("");
      setPasswordConfirmInput("");
      setAuthFlow(null);
      supabase.auth.signOut().catch(() => {});
      return;
    }
    setAuthFlow(null);
    setAuthInfo("");
  }

  function beginOnboarding() {
    setNicknameInput("");
    setAuthFlow("onboarding-nickname");
  }

  async function handleSocialAuth(provider) {
    setAuthError("");
    setAuthInfo("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider, // "apple" | "google"
      options: { redirectTo: window.location.origin },
    });
    // Úspěch: prohlížeč se hned přesměruje pryč na přihlašovací stránku
    // Google/Apple, takže se sem appka po úspěchu vůbec nevrátí — session
    // se vytvoří až po návratu (viz useEffect s onAuthStateChange níže).
    if (error) setAuthError(translateAuthError(error.message));
  }

  async function handleForgotPasswordSubmit() {
    const email = emailInput.trim();
    if (!email || !email.includes("@")) {
      setAuthError("Zadej platnou e-mailovou adresu.");
      return;
    }
    setAuthError("");
    setAuthInfo("");
    setAuthLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/?reset=1`,
    });
    setAuthLoading(false);
    if (error) {
      setAuthError(translateAuthError(error.message));
      return;
    }
    setAuthInfo(
      "Když účet s tímto e-mailem existuje, poslali jsme odkaz pro obnovu hesla. Zkontroluj schránku (i spam)."
    );
  }

  async function handleResetPasswordSubmit() {
    const next = passwordInput;
    const confirm = passwordConfirmInput;
    if (!next || next.length < 6) {
      setAuthError("Heslo musí mít alespoň 6 znaků.");
      return;
    }
    if (next !== confirm) {
      setAuthError("Hesla se neshodují.");
      return;
    }
    setAuthError("");
    setAuthInfo("");
    setAuthLoading(true);
    const { error } = await supabase.auth.updateUser({ password: next });
    setAuthLoading(false);
    if (error) {
      setAuthError(translateAuthError(error.message));
      return;
    }
    passwordRecoveryRef.current = false;
    setPasswordInput("");
    setPasswordConfirmInput("");
    setAuthInfo("Heslo je změněné. Jsi přihlášený/á.");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "nickname, email, notifications_enabled, is_premium, practice_tests_today, last_practice_test_date, last_big_test_at"
        )
        .eq("id", user.id)
        .single();
      setNickname(profile?.nickname || (user.email ? user.email.split("@")[0] : "Žák"));
      setUserEmail(profile?.email || user.email || "");
      setNotificationsEnabled(profile?.notifications_enabled ?? false);
      setIsPremium(profile?.is_premium ?? false);
      setPracticeTestsToday(profile?.practice_tests_today ?? 0);
      setLastPracticeTestDate(profile?.last_practice_test_date ?? null);
      setLastBigTestAt(profile?.last_big_test_at ?? null);
      setIsAuthenticated(true);
    }
    setTimeout(() => {
      setAuthFlow(null);
      setAuthInfo("");
      setAuthMode("login");
    }, 900);
  }

  async function handleEmailAuthSubmit() {
    if (authMode === "forgot") {
      await handleForgotPasswordSubmit();
      return;
    }
    if (authMode === "reset") {
      await handleResetPasswordSubmit();
      return;
    }

    const email = emailInput.trim();
    if (!email || !passwordInput) {
      setAuthError("Vyplň prosím e-mail i heslo.");
      return;
    }
    if (!email.includes("@")) {
      setAuthError("Zadej platnou e-mailovou adresu.");
      return;
    }
    setAuthError("");
    setAuthInfo("");
    setAuthLoading(true);

    if (authMode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: passwordInput,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      setAuthLoading(false);
      if (error) {
        setAuthError(translateAuthError(error.message));
        return;
      }
      // Pokud má projekt zapnuté "Confirm email", session zatím neexistuje —
      // uživatel musí nejdřív kliknout na odkaz v e-mailu.
      if (data.user && !data.session) {
        setAuthError("Zkontroluj e-mail a potvrď registraci, pak se přihlas.");
        return;
      }
      setUserEmail(email);
      beginOnboarding();
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordInput,
      });
      setAuthLoading(false);
      if (error) {
        setAuthError(translateAuthError(error.message));
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          "nickname, email, notifications_enabled, is_premium, practice_tests_today, last_practice_test_date, last_big_test_at"
        )
        .eq("id", data.user.id)
        .maybeSingle();
      if (!profile || profileError?.code === "PGRST116") {
        await supabase.auth.signOut().catch(() => {});
        setAuthError("Tento účet už neexistuje. Založ si nový registrací.");
        return;
      }
      if (profileError) {
        console.error("Načtení profilu při přihlášení selhalo:", profileError);
      }
      setNickname(profile?.nickname || email.split("@")[0]);
      setUserEmail(email);
      setNotificationsEnabled(profile?.notifications_enabled ?? false);
      setIsPremium(profile?.is_premium ?? false);
      setPracticeTestsToday(profile?.practice_tests_today ?? 0);
      setLastPracticeTestDate(profile?.last_practice_test_date ?? null);
      setLastBigTestAt(profile?.last_big_test_at ?? null);
      setAuthFlow(null);
      setIsAuthenticated(true);
      // První běh jen po nové registraci (completeOnboarding), ne po běžném loginu.
    }
  }

  async function handleNicknameSubmit() {
    const trimmed = nicknameInput.trim();
    if (!trimmed) return;
    setNickname(trimmed);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("profiles").update({ nickname: trimmed }).eq("id", user.id);
      if (error) {
        // Nechceme uživatele zaseknout uprostřed onboardingu kvůli chybě
        // uložení — necháme appku pokračovat dál, ale chybu zalogujeme, ať
        // je vidět v konzoli / Supabase logách, proč se přezdívka neuložila.
        console.error("Uložení přezdívky (onboarding) selhalo:", error);
      }
    }
    setAuthFlow("onboarding-notifications");
  }

  async function handleEnableNotifications() {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationsEnabled(true);
          try {
            new Notification("Notifikace aktivovány! 🚀", {
              body: `Ahoj ${nickname}, zítra v 17:00 dáme první procvičování.`,
            });
          } catch (err) {
            // Native notification may be blocked in a sandboxed context —
            // the in-app confirmation below still informs the user.
          }
        } else {
          setNotificationsEnabled(false);
        }
      } else {
        setNotificationsEnabled(false);
      }
    } catch (err) {
      setNotificationsEnabled(false);
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ notifications_enabled: notificationsEnabled })
        .eq("id", user.id);
    }
    setNotificationJustConfirmed(true);
  }

  function handleSkipNotifications() {
    setNotificationsEnabled(false);
    completeOnboarding();
  }

  async function maybeStartFirstRun(userId) {
    let id = userId;
    if (!id) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      id = user?.id;
    }
    if (!id || hasCompletedFirstRun(id)) return;
    if (passwordRecoveryRef.current) return;
    setFirstRunStep((current) => (current != null ? current : 1));
  }

  async function finishFirstRun(action = "dashboard") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    markFirstRunCompleted(user?.id);
    setFirstRunStep(null);
    if (action === "practice") {
      // Stejný start jako dlaždice Pravopis — server RPC započte 1/2 free practice.
      setShowFirstRunResultsTip(true);
      await startQuiz("Pravopis");
      return;
    }
    if (action === "full") {
      // Stejný start jako Test nanečisto — server RPC započte 1/1 free big test.
      await startFullTest();
    }
  }

  function completeOnboarding() {
    setNotificationJustConfirmed(false);
    setAuthFlow(null);
    setIsAuthenticated(true);
    // Jen nové registrace (přezdívka + notifikace) — ne login / refresh.
    void maybeStartFirstRun();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAuthFlow(null);
    setNickname("");
    setNicknameInput("");
    setEmailInput("");
    setPasswordInput("");
    setAuthError("");
    setNotificationsEnabled(false);
    setNotificationJustConfirmed(false);
    setScreen("dashboard");
    setCheatSheetCategory(null);
    setShowSettings(false);
    setUserEmail("");
    setIsPremium(false);
    setIsEditingNickname(false);
    setFirstRunStep(null);
    setShowFirstRunResultsTip(false);
  }

  const [screen, setScreen] = useState("dashboard"); // dashboard | quiz | results | cheatsheet
  const [cheatSheetCategory, setCheatSheetCategory] = useState(null);
  const [cheatSheetOpenIds, setCheatSheetOpenIds] = useState({ 0: true });
  const [cheatSheetRevealed, setCheatSheetRevealed] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]); // [{originalIndex, text}]
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswerEvaluated, setIsAnswerEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [timeRemainingSec, setTimeRemainingSec] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [streakCount, setStreakCount] = useState(0); // consecutive correct without a shield, 0-2
  const [hasShield, setHasShield] = useState(false); // active "second chance" shield
  const [shieldPulse, setShieldPulse] = useState(false); // transient activation glow
  const [eliminatedOptionIds, setEliminatedOptionIds] = useState([]); // wrong picks absorbed by the shield this question
  const [shieldUsedThisQuestion, setShieldUsedThisQuestion] = useState(false); // blocks the eventual correct answer from earning a star
  const [answerLog, setAnswerLog] = useState([]); // per-question outcomes for the current attempt
  const [quizMode, setQuizMode] = useState("practice"); // practice | full | mistakes
  const [weakestArea, setWeakestArea] = useState(null);
  const [categoryStats, setCategoryStats] = useState({});
  const [hasPractice, setHasPractice] = useState(false);
  const [fullTestBestPct, setFullTestBestPct] = useState(null);
  const [fullTestLastPct, setFullTestLastPct] = useState(null);
  const [mistakeQuestionIds, setMistakeQuestionIds] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressSource, setProgressSource] = useState(null);
  const attemptSavedRef = useRef(false);

  const availableCategories = TOPIC_AREAS;

  const categoryCount = (cat) =>
    questionsData.filter((q) => q.category === cat).length;

  const categorySuccessPct = (cat) => categoryStats[cat]?.percentage ?? 0;

  const bestFullTestTier =
    fullTestBestPct != null ? getResultTier(fullTestBestPct) : null;

  async function refreshProgress(userId) {
    setProgressLoading(true);
    try {
      const progress = await loadProgress(userId || null);
      setWeakestArea(progress.weakestArea || null);
      setCategoryStats(progress.categoryStats || {});
      setHasPractice(!!progress.hasPractice);
      setFullTestBestPct(
        progress.fullTestBestPct != null ? progress.fullTestBestPct : null
      );
      setFullTestLastPct(
        progress.fullTestLastPct != null ? progress.fullTestLastPct : null
      );
      setMistakeQuestionIds(progress.mistakeQuestionIds || []);
      setProgressSource(progress.source || null);
    } catch (e) {
      console.warn("Načtení progress selhalo:", e);
    } finally {
      setProgressLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setWeakestArea(null);
      setCategoryStats({});
      setHasPractice(false);
      setFullTestBestPct(null);
      setFullTestLastPct(null);
      setMistakeQuestionIds([]);
      setProgressSource(null);
      return;
    }
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      await refreshProgress(user?.id || null);
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // Persist attempt once when entering results (also covers timer expiry).
  useEffect(() => {
    if (screen !== "results" || attemptSavedRef.current) return;
    if (!filteredQuestions.length) return;
    attemptSavedRef.current = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const stats = getSessionResultStats({
        questions: filteredQuestions,
        answerLog,
        score,
      });
      // Practice tiles use % správných; mock-test banner/trophies use body.
      const percentage =
        quizMode === "full" ? stats.pointsPct : stats.accuracyPct;
      await saveAttempt({
        userId: user?.id || null,
        mode: quizMode,
        category: selectedCategory,
        score: stats.safeScore,
        maxScore: stats.maxScore,
        questionCount: stats.questionCount,
        answeredCount,
        percentage: Math.round(percentage * 100) / 100,
        timeExpired,
        answers: answerLog,
      });
      await refreshProgress(user?.id || null);
    })();
  }, [screen]);

  // Countdown for the full timed mock exam only. Hits 0 → auto-submit.
  useEffect(() => {
    if (screen !== "quiz" || !isTimedMode || timeRemainingSec === null) return;
    if (timeRemainingSec <= 0) {
      setTimeExpired(true);
      playResults(soundHapticsEnabled);
      setScreen("results");
      return;
    }
    const id = setTimeout(() => {
      setTimeRemainingSec((t) => (t !== null ? t - 1 : t));
    }, 1000);
    return () => clearTimeout(id);
  }, [screen, isTimedMode, timeRemainingSec]);

  function prepareQuestion(question) {
    const opts = question.options.map((text, originalIndex) => ({
      originalIndex,
      text,
    }));
    setShuffledOptions(shuffle(opts));
    setSelectedOptionId(null);
    setIsAnswerEvaluated(false);
    setShowHint(false);
    setEliminatedOptionIds([]);
    setShieldUsedThisQuestion(false);
  }

  async function startQuiz(category, options = {}) {
    const length = options.length ?? QUIZ_LENGTH;
    // Optimistic UI hint — authoritative gate is the server RPC below.
    const check = canTakeTest("practice");
    if (!check.allowed) {
      openPaywall(check.message);
      return;
    }
    const pool = category
      ? questionsData.filter((q) => q.category === category)
      : questionsData;
    if (pool.length === 0) return; // topic has no questions yet

    const gate = await requestStartPracticeTest();
    syncEntitlementsFromServer(gate);
    if (!gate.allowed) {
      openPaywall(gate.message || check.message);
      return;
    }

    setSelectedCategory(category);
    const drawnQs = drawQuestions(pool, length);
    setFilteredQuestions(drawnQs);
    setQuizMode("practice");
    setAnswerLog([]);
    attemptSavedRef.current = false;
    setScore(0);
    setConsecutiveWrong(0);
    setCurrentIndex(0);
    setIsTimedMode(false);
    setTimeRemainingSec(null);
    setAnsweredCount(0);
    setTimeExpired(false);
    setStreakCount(0);
    setHasShield(false);
    setShieldPulse(false);
    prepareQuestion(drawnQs[0]);
    playStart(soundHapticsEnabled);
    setScreen("quiz");
  }

  async function startFullTest() {
    const check = canTakeTest("big");
    if (!check.allowed) {
      openPaywall(check.message);
      return;
    }

    const gate = await requestStartBigTest();
    syncEntitlementsFromServer(gate);
    if (!gate.allowed) {
      openPaywall(gate.message || check.message);
      return;
    }

    const drawnQs = drawQuestions(questionsData, FULL_TEST_LENGTH);
    setSelectedCategory(null);
    setFilteredQuestions(drawnQs);
    setQuizMode("full");
    setAnswerLog([]);
    attemptSavedRef.current = false;
    setScore(0);
    setConsecutiveWrong(0);
    setCurrentIndex(0);
    setAnsweredCount(0);
    setTimeExpired(false);
    setStreakCount(0);
    setHasShield(false);
    setShieldPulse(false);
    prepareQuestion(drawnQs[0]);
    setIsTimedMode(true);
    setTimeRemainingSec(FULL_TEST_MINUTES * 60);
    playStart(soundHapticsEnabled);
    setScreen("quiz");
  }

  /**
   * Mistakes / remediation mode — free for Free users (does not call start_practice_test).
   * @param {{ preferSessionIds?: string[] }} options
   *        preferSessionIds = wrong IDs from the attempt just finished (shown first).
   */
  async function startMistakesQuiz(options = {}) {
    const preferIds = Array.isArray(options.preferSessionIds)
      ? options.preferSessionIds.filter(Boolean)
      : [];
    const seen = new Set();
    const orderedIds = [];
    for (const id of preferIds) {
      if (!seen.has(id)) {
        seen.add(id);
        orderedIds.push(id);
      }
    }
    for (const id of mistakeQuestionIds) {
      if (!seen.has(id)) {
        seen.add(id);
        orderedIds.push(id);
      }
    }

    const byId = new Map(questionsData.map((q) => [q.id, q]));
    const pool = orderedIds.map((id) => byId.get(id)).filter(Boolean);
    if (pool.length === 0) return;

    const preferCount = preferIds.filter((id) => byId.has(id)).length;
    const preferSlice = pool.slice(0, preferCount);
    const restSlice = pool.slice(preferCount);
    let drawnQs;
    if (preferSlice.length >= MISTAKES_QUIZ_LENGTH) {
      drawnQs = shuffle(preferSlice).slice(0, MISTAKES_QUIZ_LENGTH);
    } else {
      drawnQs = [
        ...shuffle(preferSlice),
        ...drawQuestions(restSlice, MISTAKES_QUIZ_LENGTH - preferSlice.length),
      ];
    }

    setSelectedCategory(null);
    setFilteredQuestions(drawnQs);
    setQuizMode("mistakes");
    setAnswerLog([]);
    attemptSavedRef.current = false;
    setScore(0);
    setConsecutiveWrong(0);
    setCurrentIndex(0);
    setIsTimedMode(false);
    setTimeRemainingSec(null);
    setAnsweredCount(0);
    setTimeExpired(false);
    setStreakCount(0);
    setHasShield(false);
    setShieldPulse(false);
    setShowFirstRunResultsTip(false);
    prepareQuestion(drawnQs[0]);
    playStart(soundHapticsEnabled);
    setScreen("quiz");
  }

  function selectOption(originalIndex) {
    if (isAnswerEvaluated) return;
    if (eliminatedOptionIds.includes(originalIndex)) return; // already ruled out this attempt
    playTap(soundHapticsEnabled);
    const isCorrect =
      originalIndex === filteredQuestions[currentIndex].correctAnswerIndex;

    if (!isCorrect && hasShield) {
      // Shield absorbs the mistake: consume it, reveal the hint, mark this
      // option as ruled out, but let the player try again on the SAME
      // question — this does not finalize the answer or touch score. The
      // streak is explicitly zeroed, and this question is flagged so its
      // eventual correct answer won't start a new streak either.
      playShield(soundHapticsEnabled);
      setHasShield(false);
      setStreakCount(0);
      setShieldUsedThisQuestion(true);
      setEliminatedOptionIds((prev) => [...prev, originalIndex]);
      setShowHint(true);
      return;
    }

    setSelectedOptionId(originalIndex);
    setIsAnswerEvaluated(true);
    setAnsweredCount((c) => c + 1);

    let pointsEarned = 0;
    if (isCorrect) {
      playCorrect(soundHapticsEnabled);
      pointsEarned = showHint ? 1 : 2;
      setConsecutiveWrong(0);
      if (!hasShield && !shieldUsedThisQuestion) {
        const newStreak = streakCount + 1;
        if (newStreak >= 3) {
          // Nejdřív dohraje „správně“, krátká pauza, teprve pak fanfára za štít
          const soundsOn = soundHapticsEnabled;
          setTimeout(() => playStreak(soundsOn), 420);
          setHasShield(true);
          setStreakCount(0);
          setShieldPulse(true);
          setTimeout(() => setShieldPulse(false), 700);
        } else {
          setStreakCount(newStreak);
        }
      }
    } else {
      // Unprotected mistake: normal penalty logic, and the star streak resets.
      playWrongSound(soundHapticsEnabled);
      const newWrongStreak = consecutiveWrong + 1;
      if (newWrongStreak >= 2) {
        pointsEarned = -1; // penalty: two wrong answers in a row
      }
      setConsecutiveWrong(newWrongStreak);
      setStreakCount(0);
    }

    setLastPointsEarned(pointsEarned);
    setScore((s) => s + pointsEarned);

    const q = filteredQuestions[currentIndex];
    if (q?.id) {
      setAnswerLog((prev) => [
        ...prev,
        {
          questionId: q.id,
          category: q.category,
          isCorrect,
          selectedIndex: originalIndex,
          hintUsed: showHint || shieldUsedThisQuestion,
          pointsEarned,
        },
      ]);
    }
  }

  function nextQuestion() {
    if (currentIndex < filteredQuestions.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      prepareQuestion(filteredQuestions[next]);
    } else {
      playResults(soundHapticsEnabled);
      setScreen("results");
    }
  }

  function returnToDashboard() {
    setScreen("dashboard");
    setSelectedCategory(null);
    setIsTimedMode(false);
    setTimeRemainingSec(null);
    setShowFirstRunResultsTip(false);
  }

  function openCheatSheet(category) {
    setCheatSheetCategory(category);
    setCheatSheetOpenIds({ 0: true });
    setCheatSheetRevealed({});
    setScreen("cheatsheet");
  }

  function closeCheatSheet() {
    setCheatSheetCategory(null);
    setCheatSheetOpenIds({});
    setCheatSheetRevealed({});
    setScreen("dashboard");
  }

  function getOptionState(originalIndex) {
    if (eliminatedOptionIds.includes(originalIndex)) return "wrong";
    if (!isAnswerEvaluated) return null;
    const correctIndex = filteredQuestions[currentIndex].correctAnswerIndex;
    if (originalIndex === correctIndex) return "correct";
    if (originalIndex === selectedOptionId) return "wrong";
    return null;
  }

  const currentQuestion = filteredQuestions[currentIndex];

  return (
    <div
      className="fixed inset-0 z-0 w-full max-w-[100vw] flex justify-center sm:items-center p-0 sm:p-6 font-sans text-zinc-900 overflow-hidden"
      style={COSMIC_BG_STYLE}
    >
      <div
        className="w-full max-w-md h-full max-h-full min-h-0 sm:h-auto sm:max-h-[calc(100dvh-3rem)] overflow-hidden flex flex-col relative rounded-none sm:rounded-3xl border-0 sm:border app-shell-safe"
        style={
          screen === "quiz" && isTimedMode
            ? COSMIC_GLASS_CARD_STYLE_FULLTEST
            : screen === "quiz" && QUIZ_CATEGORY_BG[selectedCategory]
            ? QUIZ_CATEGORY_BG[selectedCategory]
            : COSMIC_GLASS_CARD_STYLE
        }
      >
        {!isAuthenticated && (
          <div
            className="flex-1 min-h-0 sm:flex-none relative overflow-y-auto overscroll-y-contain app-hide-scrollbar"
            style={{
              backgroundImage: "url('/images/bg-a61d37ff49.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Jemné ztmavení dole, ať zůstane text nad patou obrazovky čitelný */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none z-0"
              style={{ background: "linear-gradient(to top, rgba(8, 11, 26, 0.55), rgba(8, 11, 26, 0))" }}
              aria-hidden="true"
            />

            {/* Padající hvězdy — čistě CSS animace (transform + opacity, GPU
                akcelerované), žádný JS interval ani re-render appky. Pár
                prvků s různě dlouhou dobou animace a zpožděním vytváří dojem
                náhodného, občasného přeletu. */}
            <style>{`
              @keyframes shootingStarFly {
                0% { transform: translate(0, 0) rotate(-45deg); opacity: 0; }
                6% { opacity: 1; }
                22% { opacity: 1; }
                32% { transform: translate(-260px, 260px) rotate(-45deg); opacity: 0; }
                100% { transform: translate(-260px, 260px) rotate(-45deg); opacity: 0; }
              }
              .shooting-star {
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 9999px;
                box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.9);
                animation-name: shootingStarFly;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
              }
              .shooting-star::before {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                width: 90px;
                height: 1px;
                background: linear-gradient(to right, rgba(255, 255, 255, 0.85), transparent);
                transform: translateY(-50%);
              }
              @keyframes compassNeedleSeek {
                0% { transform: rotate(-18deg); }
                12% { transform: rotate(48deg); }
                24% { transform: rotate(12deg); }
                38% { transform: rotate(175deg); }
                52% { transform: rotate(142deg); }
                66% { transform: rotate(268deg); }
                80% { transform: rotate(338deg); }
                92% { transform: rotate(352deg); }
                100% { transform: rotate(342deg); }
              }
              .headline-compass {
                display: inline-flex;
                flex-shrink: 0;
                filter: drop-shadow(0 0 10px rgba(140, 90, 40, 0.4));
              }
              .headline-compass .compass-needle {
                transform-box: fill-box;
                transform-origin: center;
                animation: compassNeedleSeek 7s ease-in-out infinite;
                will-change: transform;
              }
              @media (prefers-reduced-motion: reduce) {
                .headline-compass .compass-needle { animation: none; }
              }
            `}</style>
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
              <span className="shooting-star" style={{ top: "6%", left: "70%", animationDuration: "8s", animationDelay: "0.5s" }} />
              <span className="shooting-star" style={{ top: "14%", left: "88%", animationDuration: "11s", animationDelay: "4s" }} />
              <span className="shooting-star" style={{ top: "2%", left: "45%", animationDuration: "9.5s", animationDelay: "7.5s" }} />
              <span className="shooting-star" style={{ top: "20%", left: "60%", animationDuration: "13s", animationDelay: "2.5s" }} />
            </div>

            {/* Na mobilu min-h-full tlačí CTA dolů; na PC stačí výška obsahu (bez falešného scrollbaru). */}
            <div className="relative z-10 min-h-full sm:min-h-0 flex flex-col p-5 sm:p-6">
              <div
                className="flex flex-col items-center text-center flex-shrink-0"
                style={{ paddingTop: "max(4.5rem, min(9.5rem, 22svh))" }}
              >
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto mb-3 border"
                  style={{
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    color: "#67e8f9",
                    borderColor: "rgba(6, 182, 212, 0.3)",
                  }}
                >
                  Procvičuj ČJ
                </span>

                <div className="flex items-center justify-center gap-2.5 mb-2 overflow-visible">
                  <h1 className="text-xl min-[390px]:text-2xl font-extrabold text-white leading-snug">
                    Tvůj parťák na češtinu
                  </h1>
                  <WelcomeAntiqueCompass className="w-12 h-12 min-[390px]:w-14 min-[390px]:h-14 flex-shrink-0" />
                </div>
                <p className="text-sm text-indigo-200 text-opacity-80 leading-relaxed px-1">
                  Trénuj češtinu, získej vědomosti a ukaž všem, jak na tom jsi.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 py-4 flex-shrink-0">
                <div
                  className="flex items-center gap-3 rounded-2xl p-3.5 border transition-all duration-200"
                  style={COSMIC_TILE_STYLE}
                >
                  <GearCompassBadge tintClassName="from-amber-400 to-orange-500" glowColor="rgba(251, 191, 36, 0.45)">
                    <IconZap className="w-4 h-4 text-white" />
                  </GearCompassBadge>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-100">1000+ Otázek na testování</p>
                    <p className="text-xs text-indigo-200 text-opacity-70">Trénuj mozek kdekoli a kdykoli.</p>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                </div>
                <div
                  className="flex items-center gap-3 rounded-2xl p-3.5 border transition-all duration-200"
                  style={COSMIC_TILE_STYLE}
                >
                  <GearCompassBadge tintClassName="from-rose-500 to-red-500" glowColor="rgba(244, 63, 94, 0.45)">
                    <IconFire className="w-4 h-4 text-white" />
                  </GearCompassBadge>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-100">Testy nanečisto</p>
                    <p className="text-xs text-indigo-200 text-opacity-70">Odhal chytáky přijímacích zkoušek.</p>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                </div>
                <div
                  className="flex items-center gap-3 rounded-2xl p-3.5 border transition-all duration-200"
                  style={COSMIC_TILE_STYLE}
                >
                  <GearCompassBadge tintClassName="from-blue-500 to-violet-500" glowColor="rgba(129, 140, 248, 0.45)">
                    <IconBooksStack className="w-4 h-4 text-white" />
                  </GearCompassBadge>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-100">Praktické taháky a triky</p>
                    <p className="text-xs text-indigo-200 text-opacity-70">Nauč se super triky a ušetři čas.</p>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                </div>
                <div
                  className="flex items-center gap-3 rounded-2xl p-3.5 border transition-all duration-200"
                  style={COSMIC_TILE_STYLE}
                >
                  <GearCompassBadge tintClassName="from-emerald-500 to-teal-500" glowColor="rgba(52, 211, 153, 0.45)">
                    <IconCheckBadge className="w-4 h-4 text-white" />
                  </GearCompassBadge>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-100">Sleduj svůj pokrok</p>
                    <p className="text-xs text-indigo-200 text-opacity-70">Denní série, skóre a odznaky za výsledky.</p>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                </div>
              </div>

              <div className="flex-1 min-h-3" aria-hidden="true" />

              <div className="flex flex-col items-center gap-3 pb-2 flex-shrink-0">
                <button
                  onClick={() => openAuth("register")}
                  className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 hover:opacity-90 text-white font-bold text-base py-3.5 sm:py-4 rounded-2xl transition-all active:scale-95 border"
                  style={{
                    boxShadow: "0 0 24px 2px rgba(34, 211, 238, 0.35), 0 10px 25px -5px rgba(99, 102, 241, 0.5)",
                    borderColor: "rgba(34, 211, 238, 0.5)",
                  }}
                >
                  ZAČÍT HNED
                </button>
                <button
                  onClick={() => openAuth("login")}
                  className="w-full font-bold text-base py-3.5 sm:py-4 rounded-2xl transition-all active:scale-95 border text-white hover:bg-white hover:bg-opacity-10"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    borderColor: "rgba(255, 255, 255, 0.25)",
                  }}
                >
                  Již máš účet? Přihlásit se
                </button>

                {/* Subtilní metalický bezel dole */}
                <div
                  className="w-24 h-1 rounded-full mt-2"
                  style={{ background: "linear-gradient(to right, #475569, #94a3b8, #475569)", opacity: 0.5 }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
        <div className="flex-1 min-h-0 flex flex-col p-5 sm:p-6 overflow-y-auto overscroll-y-contain app-hide-scrollbar">
          {screen === "dashboard" && (
            <>
              <div className="relative mb-7">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden z-20"
                  aria-hidden="true"
                >
                  <DashboardFlybyRocket soundEnabled={soundHapticsEnabled} />
                </div>

                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <WelcomeAntiqueCompass className="w-10 h-10 flex-shrink-0" />
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-white">Trénink</p>
                      <p className="text-xs text-indigo-200 text-opacity-70 -mt-0.5">češtiny</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-full px-3 py-1.5 truncate"
                        style={{ maxWidth: "7rem" }}
                      >
                        {nickname || "Žák"}
                      </span>
                      {isPremium ? (
                        <span className="flex-shrink-0 text-[10px] font-bold tracking-wide uppercase text-amber-900 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full px-2 py-1 border border-amber-200/80">
                          Premium
                        </span>
                      ) : (
                        <span className="flex-shrink-0 text-[10px] font-bold tracking-wide uppercase text-zinc-500 bg-zinc-100 border border-zinc-200 rounded-full px-2 py-1">
                          Zdarma
                        </span>
                      )}
                    </div>
                    <button
                      onClick={openSettings}
                      className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
                      aria-label="Nastavení"
                    >
                      <IconSettings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-red-600 hover:border-red-200 transition-colors"
                      aria-label="Odhlásit se"
                    >
                      <IconLogout className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="relative z-10 text-xl font-semibold text-white leading-snug mb-1">
                  Procvičuj češtinu kdykoliv a kdekoliv, třeba ve vesmíru.
                </h1>
                <p className="relative z-10 text-sm text-indigo-200 text-opacity-70 mb-4">
                  Český jazyk a literatura · 2026
                </p>

                {!isPremium && (
                  <div
                    className="relative z-10 mb-5 flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(251, 191, 36, 0.14), rgba(249, 115, 22, 0.10))",
                      borderColor: "rgba(251, 191, 36, 0.35)",
                      boxShadow: "0 0 20px rgba(251, 191, 36, 0.08)",
                    }}
                  >
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold text-amber-100 leading-tight">
                        Aktivovaná verze ZDARMA
                      </p>
                      <p className="text-[11px] text-amber-100/70 leading-snug mt-0.5">
                        Odemkni všechny otázky a neomezené testy.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPaywall()}
                      className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-md"
                    >
                      Aktivovat Premium
                    </button>
                  </div>
                )}

                <button
                  onClick={startFullTest}
                  className="relative z-10 w-full text-left border rounded-2xl p-5 transition-all active:scale-95 hover:bg-opacity-90 overflow-hidden"
                  style={COSMIC_TILE_STYLE}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 pr-2">
                      <p className="text-white text-base font-semibold mb-1">Zkus si test nanečisto</p>
                      <p className="text-indigo-200 text-opacity-70 text-xs font-medium tracking-wide">
                        {FULL_TEST_LENGTH} úloh · {FULL_TEST_MINUTES} minut · {FULL_TEST_LENGTH * 2} bodů
                      </p>
                    </div>
                    <IconClock className="w-6 h-6 text-indigo-300 flex-shrink-0" />
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="inline-flex items-center justify-center bg-blue-600 text-white text-sm font-semibold px-7 py-2.5 rounded-full">
                          Start
                        </span>
                        {!isPremium &&
                          (canTakeTest("big").allowed ? (
                            <span className="text-xs font-medium text-emerald-300">
                              1× zdarma tento týden
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-amber-300">
                              {canTakeTest("big").message.split(".")[0]}.
                            </span>
                          ))}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] tabular-nums">
                        <span className="text-indigo-200 text-opacity-80">
                          Nejlepší:{" "}
                          <strong className="text-white font-semibold">
                            {fullTestBestPct != null ? `${fullTestBestPct}%` : "—"}
                          </strong>
                        </span>
                        <span className="text-indigo-300 text-opacity-40">·</span>
                        <span className="text-indigo-200 text-opacity-80">
                          Poslední:{" "}
                          <strong className="text-white font-semibold">
                            {fullTestLastPct != null ? `${fullTestLastPct}%` : "—"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-end flex-shrink-0 min-w-[3rem]">
                      {bestFullTestTier?.emoji ? (
                        <>
                          <span
                            className="text-4xl leading-none drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]"
                            title={bestFullTestTier.label}
                            aria-label={bestFullTestTier.label}
                          >
                            {bestFullTestTier.emoji}
                          </span>
                          <span className={`text-[10px] font-semibold mt-1 ${bestFullTestTier.tone}`}>
                            {bestFullTestTier.label.replace(" pohár", "")}
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-3xl leading-none opacity-25 grayscale"
                          title="Zatím bez poháru"
                          aria-hidden="true"
                        >
                          🏆
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              <div className="mb-7 border rounded-2xl p-4" style={COSMIC_TILE_STYLE}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-indigo-300 text-opacity-80 uppercase tracking-wide">
                    Na čem zapracovat
                  </p>
                  {progressLoading && (
                    <span className="text-[10px] text-indigo-200 text-opacity-60">načítám…</span>
                  )}
                </div>
                {!hasPractice ? (
                  <p className="text-xs text-indigo-200 text-opacity-80 mb-3 leading-relaxed">
                    Zatím jsi s procvičováním nezačal/a. Až dokončíš první test, uvidíš tady okruh,
                    na kterém je potřeba nejvíc zapracovat.
                  </p>
                ) : weakestArea ? (
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {weakestArea.category}
                      </p>
                      <p className="text-[11px] text-indigo-200 text-opacity-70">
                        {weakestArea.correct}/{weakestArea.total} správně · nejslabší okruh
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        weakestArea.percentage >= 70
                          ? "text-emerald-300"
                          : weakestArea.percentage >= 50
                          ? "text-amber-300"
                          : "text-rose-300"
                      }`}
                    >
                      {weakestArea.percentage}%
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-indigo-200 text-opacity-70 mb-3 leading-relaxed">
                    Zatím nemáme dost dat k vyhodnocení okruhů.
                  </p>
                )}
                <button
                  onClick={() => startMistakesQuiz()}
                  disabled={mistakeQuestionIds.length === 0}
                  className="w-full text-xs font-semibold border rounded-full py-2.5 transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-default bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-20"
                >
                  Jen moje chyby
                  {mistakeQuestionIds.length > 0
                    ? ` · ${Math.min(MISTAKES_QUIZ_LENGTH, mistakeQuestionIds.length)} otázek`
                    : ""}
                </button>
                {mistakeQuestionIds.length > 0 && (
                  <p className="text-[10px] text-indigo-300 text-opacity-60 mt-2 leading-relaxed">
                    Neodečítá se z denního limitu testů zdarma.
                  </p>
                )}
                {progressSource === "local" && (
                  <p className="text-[10px] text-indigo-300 text-opacity-50 mt-2 leading-relaxed">
                    Progress je zatím lokální. Pro sync napříč zařízeními spusť SQL z scripts/supabase-setup-reference.sql.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-indigo-300 text-opacity-80 uppercase tracking-wide">
                  Trénink tematických okruhů
                </p>
                {!isPremium && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      practiceTestsUsedToday() >= FREE_PRACTICE_TESTS_PER_DAY
                        ? "bg-red-500 bg-opacity-20 text-red-300"
                        : "bg-emerald-500 bg-opacity-20 text-emerald-300"
                    }`}
                  >
                    Dnes zbývá: {Math.max(0, FREE_PRACTICE_TESTS_PER_DAY - practiceTestsUsedToday())}/
                    {FREE_PRACTICE_TESTS_PER_DAY} zdarma
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {availableCategories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  const Icon = meta.icon;
                  const isEmpty = categoryCount(cat) === 0;
                  return (
                    <div
                      key={cat}
                      className="rounded-2xl border p-4 flex flex-col"
                      style={COSMIC_TILE_STYLE}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${meta.badgeBg} ${meta.badgeText} flex items-center justify-center mb-3`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-semibold text-white leading-tight mb-1">
                        {cat}
                        <span
                          className={`ml-1.5 font-bold tabular-nums ${
                            categorySuccessPct(cat) >= 70
                              ? "text-emerald-300"
                              : categorySuccessPct(cat) >= 50
                              ? "text-amber-300"
                              : categorySuccessPct(cat) > 0
                              ? "text-rose-300"
                              : "text-indigo-300 text-opacity-70"
                          }`}
                        >
                          {categorySuccessPct(cat)}%
                        </span>
                      </p>
                      <p className="text-xs text-indigo-200 text-opacity-70 leading-relaxed mb-3">
                        {isEmpty ? (
                          "Připravujeme"
                        ) : (
                          <>
                            {QUIZ_LENGTH} náhodných otázek
                            <br />
                            Max. {QUIZ_LENGTH * 2} bodů
                          </>
                        )}
                      </p>
                      <button
                        onClick={() => startQuiz(cat)}
                        disabled={isEmpty}
                        className={`mt-auto w-full text-xs font-semibold border rounded-full py-2.5 transition-colors active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 disabled:cursor-default ${meta.btn}`}
                      >
                        Procvičovat
                      </button>
                      {CHEAT_SHEETS[cat] && (
                        <button
                          onClick={() => openCheatSheet(cat)}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold border rounded-full py-2.5 transition-colors active:scale-95 text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                        >
                          <IconBookOpen className="w-3.5 h-3.5" />
                          Tahák
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-indigo-300 text-opacity-60 text-center leading-relaxed">
                Za správnou odpověď bez nápovědy získáváš 2 body, s nápovědou 1 bod.
              </p>
            </>
          )}

          {screen === "quiz" && currentQuestion && (
            <>
              <div className="flex items-center justify-between mb-2.5">
                <button
                  onClick={returnToDashboard}
                  aria-label="Zavřít test"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <IconClose className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-indigo-300 text-opacity-90 uppercase tracking-wide">
                  {currentQuestion.category}
                </span>
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                  {currentIndex + 1} z {filteredQuestions.length}
                </span>
              </div>

              <div className="flex items-center justify-center mb-4">
                {!hasShield ? (
                  <div className="flex items-center gap-1.5" aria-label={`Streak: ${streakCount} ze 3`}>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`text-base leading-none transition-transform ${
                          i < streakCount ? "scale-110" : "opacity-30"
                        }`}
                        aria-hidden="true"
                      >
                        {i < streakCount ? "⭐" : "☆"}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 transition-transform duration-300 ${
                      shieldPulse ? "scale-110" : "scale-100"
                    }`}
                  >
                    <span className="text-base leading-none" aria-hidden="true">
                      🛡️
                    </span>
                    <span className="text-xs font-semibold text-blue-700">Štít aktivní</span>
                  </div>
                )}
              </div>

              {eliminatedOptionIds.length > 0 && !isAnswerEvaluated && (
                <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 mb-4 text-sm font-semibold bg-blue-50 border border-blue-200 text-blue-700 animate-bounce motion-reduce:animate-none">
                  🛡️ Štít tě zachránil! Zkus to znovu.
                </div>
              )}

              {isTimedMode && timeRemainingSec !== null && (
                <div
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 mb-4 text-sm font-semibold border ${
                    timeRemainingSec <= 300
                      ? "bg-red-50 border-red-200 text-red-600 animate-pulse motion-reduce:animate-none"
                      : "bg-zinc-100 border-zinc-200 text-zinc-700"
                  }`}
                >
                  <IconClock className="w-4 h-4" />
                  Zbývá čas: {formatTime(timeRemainingSec)}
                </div>
              )}

              <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentIndex / filteredQuestions.length) * 100}%` }}
                />
              </div>

              {currentQuestion.workingText && (
                <div className="bg-white border border-zinc-200 rounded-xl p-3.5 mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 mb-1.5">
                    Výchozí text
                  </p>
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                    {currentQuestion.workingText}
                  </p>
                </div>
              )}

              <p className="text-lg font-semibold text-white leading-snug mb-4">
                <QuestionText text={currentQuestion.text} />
              </p>

              {!showHint && (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs font-medium text-indigo-300 underline decoration-dashed underline-offset-2 hover:text-cyan-300 transition-colors mb-4 self-start"
                >
                  💡 Potřebuješ nápovědu?
                </button>
              )}

              {showHint && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
                  <p className="text-sm text-amber-800 italic leading-relaxed">
                    {currentQuestion.hint}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                {shuffledOptions.map((opt, i) => {
                  const isCorrectOpt = opt.originalIndex === currentQuestion.correctAnswerIndex;
                  const isSelected = opt.originalIndex === selectedOptionId;
                  const isEliminated = eliminatedOptionIds.includes(opt.originalIndex);
                  const dim = isAnswerEvaluated && !isSelected && !isCorrectOpt;
                  const state = getOptionState(opt.originalIndex);
                  const isDisabled = isAnswerEvaluated || isEliminated;

                  return (
                    <button
                      key={opt.originalIndex}
                      disabled={isDisabled}
                      onClick={() => selectOption(opt.originalIndex)}
                      className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition-all ${
                        state === "correct"
                          ? "bg-green-50 border-green-300"
                          : state === "wrong"
                          ? "bg-red-50 border-red-300"
                          : "bg-white border-zinc-200 hover:border-zinc-300 active:scale-95"
                      } ${dim ? "opacity-40" : ""} ${
                        isDisabled ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                          state === "correct"
                            ? "border-green-400 text-green-700"
                            : state === "wrong"
                            ? "border-red-400 text-red-700"
                            : "border-zinc-300 text-zinc-600"
                        }`}
                      >
                        {LETTERS[i]}
                      </span>
                      <span className="text-sm text-zinc-800 flex-1">{opt.text}</span>
                      {state === "correct" && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {state === "wrong" && (
                        <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerEvaluated && (
                <div
                  className={`rounded-xl border p-4 mt-4 ${
                    selectedOptionId === currentQuestion.correctAnswerIndex
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <p
                      className={`text-base font-semibold ${
                        selectedOptionId === currentQuestion.correctAnswerIndex
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedOptionId === currentQuestion.correctAnswerIndex ? "Správně!" : "Chyba."}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        lastPointsEarned > 0
                          ? "bg-green-100 text-green-700"
                          : lastPointsEarned < 0
                          ? "bg-red-100 text-red-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {lastPointsEarned > 0 ? `+${lastPointsEarned}` : lastPointsEarned}{" "}
                      {Math.abs(lastPointsEarned) === 1
                        ? "bod"
                        : Math.abs(lastPointsEarned) === 2
                        ? "body"
                        : "bodů"}
                    </span>
                  </div>
                  {lastPointsEarned === 1 && (
                    <p className="text-xs italic text-zinc-500 mb-2">
                      Použil(a) jsi nápovědu, proto jen 1 bod.
                    </p>
                  )}
                  {lastPointsEarned === -1 && (
                    <p className="text-xs italic text-zinc-500 mb-2">
                      Penalizace: dvě špatné odpovědi za sebou.
                    </p>
                  )}
                  <p className="text-sm text-zinc-700 leading-relaxed mb-4">
                    {currentQuestion.explanation}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                  >
                    {currentIndex < filteredQuestions.length - 1 ? "Další otázka" : "Dokončit test"}
                  </button>
                </div>
              )}
            </>
          )}

          {screen === "results" && (() => {
            const stats = getSessionResultStats({
              questions: filteredQuestions,
              answerLog,
              score,
            });
            // Tematický trénink: stejná metrika jako % u kategorie (správně/celkem).
            // Test nanečisto: body (poháry 70/80/90).
            const percentage =
              quizMode === "full" ? stats.pointsPct : stats.accuracyPct;
            const tier = getResultTier(percentage);
            const mistakes = getSessionMistakeBreakdown(answerLog);
            const sessionOutcomeById = new Map(
              (answerLog || [])
                .filter((a) => a?.questionId)
                .map((a) => [a.questionId, a.isCorrect])
            );
            const remainingMistakeIds = mistakeQuestionIds.filter((id) => {
              if (sessionOutcomeById.has(id)) return sessionOutcomeById.get(id) === false;
              return true;
            });
            const canDrillMistakes =
              mistakes.wrongCount > 0 || remainingMistakeIds.length > 0;

            return (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-6">
                <h2 className="text-xl font-semibold text-white">Konec testu</h2>

                {tier.emoji ? (
                  <div>
                    <span className="text-5xl leading-none">{tier.emoji}</span>
                    <p className={`text-base font-semibold mt-2 ${tier.tone}`}>{tier.label}</p>
                  </div>
                ) : (
                  <p className={`text-sm italic max-w-xs leading-relaxed ${tier.tone}`}>
                    {tier.label}
                  </p>
                )}

                <div
                  className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${
                    percentage >= 70 ? "border-green-500" : "border-red-400"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    úspěšnost
                  </p>
                  <p className="text-2xl font-bold text-white">{Math.round(percentage)}%</p>
                </div>

                <p className="text-xs text-zinc-400">
                  {stats.correctCount}/{stats.questionCount} správně
                  {" · "}
                  {stats.safeScore} z max. {stats.maxScore} bodů
                </p>

                {mistakes.wrongCount > 0 ? (
                  <div className="w-full max-w-sm rounded-xl border border-white border-opacity-15 bg-white bg-opacity-5 px-3.5 py-3 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-300 text-opacity-80 mb-1.5">
                      V tomto testu
                    </p>
                    <p className="text-sm font-semibold text-white mb-1">
                      {mistakes.wrongCount}{" "}
                      {mistakes.wrongCount === 1
                        ? "chyba"
                        : mistakes.wrongCount < 5
                        ? "chyby"
                        : "chyb"}
                    </p>
                    {mistakes.categories.length > 0 && (
                      <p className="text-[11px] text-indigo-200 text-opacity-80 leading-relaxed">
                        {mistakes.categories
                          .map(([cat, n]) => `${cat} ${n}`)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-300/90 max-w-xs leading-relaxed">
                    Bez chyb v tomto běhu — výborně.
                  </p>
                )}

                {showFirstRunResultsTip && quizMode === "practice" && (
                  <div className="w-full max-w-sm rounded-xl border border-cyan-400 border-opacity-30 bg-cyan-500 bg-opacity-10 px-3.5 py-3 text-left">
                    <p className="text-xs text-cyan-100 leading-relaxed">
                      Tohle je tvoje úspěšnost. Tahák k kategorii najdeš na
                      dashboardu — chyby můžeš procvičit znovu.
                    </p>
                  </div>
                )}

                {timeExpired && answeredCount < filteredQuestions.length && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-xs leading-relaxed">
                    ⏰ Čas vypršel – {filteredQuestions.length - answeredCount}{" "}
                    {filteredQuestions.length - answeredCount === 1
                      ? "otázka zůstala nezodpovězena"
                      : "otázek zůstalo nezodpovězeno"}{" "}
                    a byla započítána za 0 bodů.
                  </p>
                )}

                <div className="w-full flex flex-col gap-2.5 mt-1">
                  {canDrillMistakes && (
                    <button
                      type="button"
                      onClick={() =>
                        startMistakesQuiz({
                          preferSessionIds:
                            mistakes.wrongCount > 0
                              ? mistakes.wrongIds
                              : remainingMistakeIds,
                        })
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                    >
                      {mistakes.wrongCount > 0
                        ? "Procvičit tyto chyby"
                        : "Procvičit zbývající chyby"}
                    </button>
                  )}
                  {quizMode !== "mistakes" && (
                    <button
                      type="button"
                      onClick={() =>
                        quizMode === "full"
                          ? startFullTest()
                          : startQuiz(selectedCategory)
                      }
                      className={`w-full font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 ${
                        canDrillMistakes
                          ? "bg-white bg-opacity-10 hover:bg-opacity-15 border border-white border-opacity-20 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Opakovat stejný test
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={returnToDashboard}
                    className="w-full bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                  >
                    Zpět na výběr kategorií
                  </button>
                </div>
              </div>
            );
          })()}

          {screen === "cheatsheet" && cheatSheetCategory && CHEAT_SHEETS[cheatSheetCategory] && (
            <>
              <div className="flex items-center justify-between mb-5 flex-shrink-0">
                <button
                  onClick={closeCheatSheet}
                  aria-label="Zavřít tahák"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <IconClose className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <p className="text-xs font-semibold text-indigo-200 text-opacity-70 uppercase tracking-wide">
                    Tahák
                  </p>
                  <p className="text-sm font-bold text-white">{cheatSheetCategory}</p>
                </div>
                <span className="w-8" aria-hidden="true" />
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain app-hide-scrollbar pb-2">
                <div className="flex flex-col gap-3">
                  {CHEAT_SHEETS[cheatSheetCategory].map((section, idx) => {
                    const isOpen = !!cheatSheetOpenIds[idx];
                    return (
                      <div
                        key={idx}
                        id={`cheat-sec-${idx}`}
                        className="flex-shrink-0 rounded-2xl border overflow-hidden"
                        style={COSMIC_TILE_STYLE}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setCheatSheetOpenIds((prev) => {
                              const nextOpen = !prev[idx];
                              // Jen jedna sekce otevřená — přehlednější na mobilu
                              return nextOpen ? { [idx]: true } : {};
                            });
                          }}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                          aria-expanded={isOpen}
                        >
                          <h3 className="text-sm font-semibold text-white leading-snug">
                            {section.title}
                          </h3>
                          <span
                            className={`text-indigo-300 text-lg leading-none flex-shrink-0 transition-transform ${
                              isOpen ? "rotate-90" : ""
                            }`}
                            aria-hidden="true"
                          >
                            ›
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 border-t border-white border-opacity-10 pt-3">
                            {section.links ? (
                              <div className="flex flex-col gap-2">
                                {section.links.map((link, i) => (
                                  <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl p-3 border border-white border-opacity-10 bg-white bg-opacity-5 hover:bg-opacity-10 transition-colors"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-white mb-0.5">
                                        {link.title}
                                      </p>
                                      <p className="text-xs text-indigo-200 text-opacity-70 leading-relaxed">
                                        {link.description}
                                      </p>
                                    </div>
                                    <IconExternalLink className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <>
                                {section.rule?.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-[10px] font-semibold text-indigo-300 text-opacity-60 uppercase tracking-wide mb-1.5">
                                      Pravidlo
                                    </p>
                                    {section.rule.map((line, i) => (
                                      <p
                                        key={i}
                                        className="text-sm text-slate-100 leading-relaxed mb-1 last:mb-0"
                                      >
                                        {line}
                                      </p>
                                    ))}
                                  </div>
                                )}

                                {section.steps?.length > 0 && (
                                  <div className="mb-3 rounded-xl border border-cyan-400 border-opacity-20 bg-cyan-400 bg-opacity-10 p-3">
                                    <p className="text-[10px] font-semibold text-cyan-200 uppercase tracking-wide mb-2">
                                      Postup
                                    </p>
                                    <ol className="flex flex-col gap-2">
                                      {section.steps.map((step, i) => (
                                        <li
                                          key={i}
                                          className="text-xs text-slate-100 leading-relaxed flex gap-2.5"
                                        >
                                          <span className="font-bold text-cyan-300 flex-shrink-0 tabular-nums w-4">
                                            {i + 1}.
                                          </span>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}

                                {section.groups?.length > 0 && (
                                  <div className="mb-3 rounded-xl border border-white border-opacity-10 overflow-hidden">
                                    <p className="text-[10px] font-semibold text-indigo-300 text-opacity-60 uppercase tracking-wide px-3 py-2 bg-white bg-opacity-5 border-b border-white border-opacity-10">
                                      Přehled
                                    </p>
                                    <ul>
                                      {section.groups.map((g, i) => (
                                        <li
                                          key={i}
                                          className="px-3 py-2 flex gap-2.5 text-xs border-b border-white border-opacity-5 last:border-0"
                                        >
                                          <span className="font-bold text-amber-300 w-4 flex-shrink-0">
                                            {g.label}
                                          </span>
                                          <span className="text-indigo-100 text-opacity-90 leading-relaxed">
                                            {g.items}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {section.tip && (
                                  <div className="rounded-xl border border-blue-400 border-opacity-25 bg-blue-500 bg-opacity-10 p-3 mb-3">
                                    <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-wide mb-1">
                                      Tip
                                    </p>
                                    <p className="text-xs text-blue-100 leading-relaxed">{section.tip}</p>
                                  </div>
                                )}

                                {section.trap && (
                                  <div className="rounded-xl border border-amber-400 border-opacity-25 bg-amber-500 bg-opacity-10 p-3 mb-3">
                                    <p className="text-[10px] font-semibold text-amber-200 uppercase tracking-wide mb-1">
                                      Chyták
                                    </p>
                                    <p className="text-xs text-amber-100 leading-relaxed">{section.trap}</p>
                                  </div>
                                )}

                                {section.examples?.length > 0 && (
                                  <div className="rounded-xl border border-white border-opacity-10 bg-white bg-opacity-5 p-3 mb-3">
                                    <p className="text-[10px] font-semibold text-indigo-300 text-opacity-60 uppercase tracking-wide mb-1.5">
                                      Příklady
                                    </p>
                                    <ul className="flex flex-col gap-1.5">
                                      {section.examples.map((ex, i) => (
                                        <li
                                          key={i}
                                          className="text-xs text-slate-200 leading-relaxed font-mono"
                                        >
                                          {ex}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {section.practice?.length > 0 && (
                                  <div className="rounded-xl border border-emerald-400 border-opacity-25 bg-emerald-500 bg-opacity-10 p-3">
                                    <p className="text-[10px] font-semibold text-emerald-200 uppercase tracking-wide mb-2">
                                      Zkus to
                                    </p>
                                    <ul className="flex flex-col gap-2">
                                      {section.practice.map((item, pi) => {
                                        const key = `${idx}-${pi}`;
                                        const shown = !!cheatSheetRevealed[key];
                                        return (
                                          <li key={pi}>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setCheatSheetRevealed((prev) => ({
                                                  ...prev,
                                                  [key]: !prev[key],
                                                }))
                                              }
                                              className="w-full text-left rounded-xl px-3 py-2.5 border border-white border-opacity-10 bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors"
                                            >
                                              <p className="text-xs text-slate-100 font-mono mb-1">
                                                {item.prompt}
                                              </p>
                                              <p
                                                className={`text-xs font-semibold ${
                                                  shown ? "text-emerald-300" : "text-emerald-200/60"
                                                }`}
                                              >
                                                {shown ? `→ ${item.answer}` : "Ťukni pro odpověď"}
                                              </p>
                                            </button>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    onClick={() => startQuiz(cheatSheetCategory)}
                    className="flex-shrink-0 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3.5 rounded-2xl transition-all active:scale-95 mt-1"
                    style={COSMIC_BUTTON_SHADOW}
                  >
                    Vyzkoušet v praxi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        )}

        {authFlow === "auth" && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
                overlayVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeAuth}
            />
            <div
              className={`relative w-full backdrop-blur-xl border rounded-t-3xl sm:rounded-3xl p-6 transition-all duration-300 ${
                overlayVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('/images/bg-5b23fc7152.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: "rgba(34, 211, 238, 0.3)",
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
              }}
            >
              <button
                onClick={closeAuth}
                aria-label="Zavřít"
                className="absolute right-4 safe-top-4 w-8 h-8 rounded-full flex items-center justify-center text-indigo-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>

              <h2 className="text-lg font-bold text-white mb-1">
                {authMode === "register"
                  ? "Vytvoř si účet"
                  : authMode === "forgot"
                  ? "Obnova hesla"
                  : authMode === "reset"
                  ? "Nové heslo"
                  : "Vítej zpátky"}
              </h2>
              <p className="text-xs text-indigo-200 text-opacity-70 mb-5">
                {authMode === "register"
                  ? "Začni trénovat během chvilky."
                  : authMode === "forgot"
                  ? "Pošleme ti odkaz na e-mail pro nastavení nového hesla."
                  : authMode === "reset"
                  ? "Zadej nové heslo (min. 6 znaků)."
                  : "Přihlas se a pokračuj v tréninku."}
              </p>

              <div className="flex flex-col gap-3 mb-5">
                {authMode !== "reset" && (
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEmailAuthSubmit();
                    }}
                    placeholder="E-mail"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-300 placeholder-opacity-50 border focus:outline-none focus:border-indigo-400 transition-colors"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                  />
                )}
                {(authMode === "register" || authMode === "login" || authMode === "reset") && (
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEmailAuthSubmit();
                    }}
                    placeholder={authMode === "reset" ? "Nové heslo" : "Heslo"}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-300 placeholder-opacity-50 border focus:outline-none focus:border-indigo-400 transition-colors"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                  />
                )}
                {authMode === "reset" && (
                  <input
                    type="password"
                    value={passwordConfirmInput}
                    onChange={(e) => setPasswordConfirmInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEmailAuthSubmit();
                    }}
                    placeholder="Nové heslo znovu"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-300 placeholder-opacity-50 border focus:outline-none focus:border-indigo-400 transition-colors"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                  />
                )}
                {authMode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot");
                      setAuthError("");
                      setAuthInfo("");
                      setPasswordInput("");
                    }}
                    className="self-end text-xs font-medium text-indigo-300 hover:text-white transition-colors -mt-1"
                  >
                    Zapomněl(a) jsi heslo?
                  </button>
                )}
                {authError && <p className="text-xs text-red-400">{authError}</p>}
                {authInfo && <p className="text-xs text-emerald-300 leading-relaxed">{authInfo}</p>}
                <button
                  onClick={handleEmailAuthSubmit}
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 mt-1 disabled:opacity-60 disabled:active:scale-100"
                  style={COSMIC_BUTTON_SHADOW}
                >
                  {authLoading
                    ? "Chvilku…"
                    : authMode === "register"
                    ? "Vytvořit účet"
                    : authMode === "forgot"
                    ? "Poslat odkaz e-mailem"
                    : authMode === "reset"
                    ? "Uložit nové heslo"
                    : "Přihlásit"}
                </button>
                {authMode !== "reset" && (
                  <p className="text-[11px] leading-relaxed text-center text-indigo-200/45 px-1">
                    Zadáním e-mailu berete na vědomí zpracování osobních údajů dle našich{" "}
                    <a
                      href="/privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        openPrivacy();
                      }}
                      className="underline text-indigo-200/65 hover:text-indigo-100 transition-colors"
                    >
                      Zásad ochrany osobních údajů
                    </a>
                    .
                  </p>
                )}
              </div>

              {authMode !== "forgot" && authMode !== "reset" && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex-1 h-px bg-white bg-opacity-10" />
                    <span className="text-xs text-indigo-300 text-opacity-70 whitespace-nowrap">
                      nebo
                    </span>
                    <span className="flex-1 h-px bg-white bg-opacity-10" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth("google")}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center gap-2 bg-white text-zinc-800 font-semibold text-sm py-3 rounded-xl border border-white border-opacity-20 hover:bg-zinc-100 transition-colors active:scale-95 disabled:opacity-60 mb-1"
                  >
                    <IconGoogle className="w-4 h-4" />
                    Pokračovat přes Google
                  </button>
                </>
              )}

              {authMode === "forgot" ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                    setAuthInfo("");
                  }}
                  className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white mt-4 transition-colors"
                >
                  Zpět na přihlášení
                </button>
              ) : authMode === "reset" ? null : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "register" ? "login" : "register");
                    setAuthError("");
                    setAuthInfo("");
                  }}
                  className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white mt-4 transition-colors"
                >
                  {authMode === "register" ? "Už máš účet? Přihlásit se" : "Nemáš účet? Zaregistrovat se"}
                </button>
              )}
            </div>
          </div>
        )}

        {(authFlow === "onboarding-nickname" || authFlow === "onboarding-notifications") && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
                overlayVisible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`relative w-full backdrop-blur-xl border rounded-t-3xl sm:rounded-3xl p-6 transition-all duration-300 ${
                overlayVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('/images/bg-5b23fc7152.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: "rgba(34, 211, 238, 0.3)",
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
              }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-6">
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    authFlow === "onboarding-nickname"
                      ? "w-6 bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "w-1.5 bg-white bg-opacity-20"
                  }`}
                />
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    authFlow === "onboarding-notifications"
                      ? "w-6 bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "w-1.5 bg-white bg-opacity-20"
                  }`}
                />
              </div>

              {authFlow === "onboarding-nickname" && (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 text-center">
                    Jak ti máme říkat? 👋
                  </h2>
                  <p className="text-xs text-indigo-200 text-opacity-70 mb-5 text-center leading-relaxed">
                    Tvoji přezdívku budeme používat při fandění a v žebříčcích.
                  </p>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      autoFocus
                      value={nicknameInput}
                      onChange={(e) => setNicknameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNicknameSubmit();
                      }}
                      placeholder="Tvoje přezdívka"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-indigo-300 placeholder-opacity-50 text-center border focus:outline-none focus:border-indigo-400 transition-colors"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", borderColor: "rgba(255, 255, 255, 0.15)" }}
                    />
                    <button
                      onClick={handleNicknameSubmit}
                      disabled={!nicknameInput.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                      style={COSMIC_BUTTON_SHADOW}
                    >
                      Pokračovat ➔
                    </button>
                  </div>
                </>
              )}

              {authFlow === "onboarding-notifications" && (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 text-center">
                    Nenech si pláchnout streak! 🎯
                  </h2>
                  <p className="text-xs text-indigo-200 text-opacity-70 mb-5 text-center leading-relaxed">
                    Povol upozornění. Připomeneme ti denní opakování a týdenní test, abys neztratil/a
                    vědomosti.
                  </p>

                  {!notificationJustConfirmed ? (
                    <div className="flex flex-col gap-2.5">
                      <button
                        onClick={handleEnableNotifications}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                        style={COSMIC_BUTTON_SHADOW}
                      >
                        <IconBell className="w-4 h-4" />
                        Zapnout připomínky 🔔
                      </button>
                      <button
                        onClick={handleSkipNotifications}
                        className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white py-2 transition-colors"
                      >
                        Přeskočit zatím bez notifikací
                      </button>
                      <button
                        onClick={() => setAuthFlow("onboarding-nickname")}
                        className="w-full text-center text-xs font-medium text-indigo-400 text-opacity-60 hover:text-indigo-200 transition-colors"
                      >
                        ← Zpět
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {notificationsEnabled ? (
                        <div className="flex items-start gap-2.5 bg-emerald-500 bg-opacity-10 border border-emerald-400 border-opacity-30 rounded-xl p-3.5">
                          <IconCheckBadge className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-emerald-300 leading-relaxed">
                            Notifikace aktivovány! 🚀 Ahoj {nickname}, zítra v 17:00 dáme první
                            procvičování.
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-3.5">
                          <IconBell className="w-5 h-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-indigo-200 text-opacity-80 leading-relaxed">
                            Notifikace se nepodařilo povolit (možná je blokuje prohlížeč). Nastavení
                            můžeš kdykoli změnit později — teď pokračujme dál!
                          </p>
                        </div>
                      )}
                      <button
                        onClick={completeOnboarding}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                        style={COSMIC_BUTTON_SHADOW}
                      >
                        Pokračovat do aplikace
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {firstRunStep !== null && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
                overlayVisible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`relative w-full backdrop-blur-xl border rounded-t-3xl sm:rounded-3xl p-6 transition-all duration-300 ${
                overlayVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('/images/bg-5b23fc7152.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: "rgba(34, 211, 238, 0.3)",
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
              }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {[1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      firstRunStep === step
                        ? "w-6 bg-gradient-to-r from-blue-500 to-indigo-500"
                        : "w-1.5 bg-white bg-opacity-20"
                    }`}
                  />
                ))}
              </div>

              {firstRunStep === 1 && (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 text-center">
                    Vítej v procvičování ČJ
                  </h2>
                  <p className="text-xs text-indigo-200 text-opacity-70 mb-5 text-center leading-relaxed">
                    Kompas ČJ — trénuj češtinu buď po jednotlivých kategoriích, ve
                    kterých se chceš zlepšit, nebo si vyzkoušej Test nanečisto
                    složený ze všech kategorií najednou.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFirstRunStep(2)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                      style={COSMIC_BUTTON_SHADOW}
                    >
                      Další
                    </button>
                    <button
                      type="button"
                      onClick={() => finishFirstRun("dashboard")}
                      className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white py-2 transition-colors"
                    >
                      Přeskočit
                    </button>
                  </div>
                </>
              )}

              {firstRunStep === 2 && (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 text-center">
                    Jak trénovat
                  </h2>
                  <ul className="text-xs text-indigo-100 text-opacity-90 mb-5 space-y-2.5 leading-relaxed">
                    <li>
                      <span className="text-cyan-300 font-semibold">1.</span> Vybereš
                      kategorii a odpovídáš A–D
                    </li>
                    <li>
                      <span className="text-cyan-300 font-semibold">2.</span> Po testu
                      uvidíš % úspěšnosti
                    </li>
                    <li>
                      <span className="text-cyan-300 font-semibold">3.</span> Tahák a
                      chyby ti pomůžou se zlepšit
                    </li>
                  </ul>
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFirstRunStep(3)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                      style={COSMIC_BUTTON_SHADOW}
                    >
                      Další
                    </button>
                    <button
                      type="button"
                      onClick={() => setFirstRunStep(1)}
                      className="w-full text-center text-xs font-medium text-indigo-400 text-opacity-60 hover:text-indigo-200 transition-colors"
                    >
                      ← Zpět
                    </button>
                  </div>
                </>
              )}

              {firstRunStep === 3 && (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 text-center">
                    Kam dál?
                  </h2>
                  <p className="text-xs text-indigo-200 text-opacity-70 mb-5 text-center leading-relaxed">
                    Vyber si — hned spustíme test. Můžeš začít kategorií, nebo
                    rovnou celým testem nanečisto.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => finishFirstRun("practice")}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                      style={COSMIC_BUTTON_SHADOW}
                    >
                      Procvičovat Pravopis ({QUIZ_LENGTH} otázek)
                    </button>
                    <button
                      type="button"
                      onClick={() => finishFirstRun("full")}
                      className="w-full bg-white bg-opacity-10 hover:bg-opacity-15 border border-white border-opacity-20 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95"
                    >
                      Test nanečisto
                    </button>
                    <button
                      type="button"
                      onClick={() => finishFirstRun("dashboard")}
                      className="w-full text-center text-xs font-medium text-indigo-300 hover:text-white py-2 transition-colors"
                    >
                      Na dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => setFirstRunStep(2)}
                      className="w-full text-center text-xs font-medium text-indigo-400 text-opacity-60 hover:text-indigo-200 transition-colors"
                    >
                      ← Zpět
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showSettings && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-50 transition-opacity duration-300 ${
                settingsVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeSettings}
            />
            <div
              className={`relative w-full backdrop-blur-xl rounded-t-3xl sm:rounded-3xl transition-all duration-300 flex flex-col border ${
                settingsVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{ ...COSMIC_GLASS_CARD_STYLE_SETTINGS, maxHeight: "min(88%, 88dvh)" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white border-opacity-10 flex-shrink-0">
                <span className="w-14" aria-hidden="true" />
                <h2 className="text-base font-bold text-white">Nastavení</h2>
                <button
                  onClick={closeSettings}
                  className="w-14 text-right text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Hotovo
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {/* BLOK 1: Profil & účet */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {(nickname || "Ž").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {nickname || "Žák"}
                      </p>
                      <p className="text-xs text-indigo-300 text-opacity-70 truncate">
                        {userEmail || "bez e-mailu"}
                      </p>
                    </div>
                  </div>

                  {!isEditingNickname ? (
                    <button
                      onClick={startEditingNickname}
                      className="w-full flex items-center justify-between text-sm font-medium text-indigo-100 hover:text-white py-2.5 border-t border-white border-opacity-10 transition-colors"
                    >
                      Upravit přezdívku
                      <IconChevronRight className="w-4 h-4 text-indigo-300 text-opacity-50" />
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2.5 border-t border-white border-opacity-10">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={nicknameDraft}
                          onChange={(e) => setNicknameDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveNicknameDraft();
                          }}
                          className="flex-1 rounded-xl px-3 py-2 text-sm text-white border focus:outline-none focus:border-blue-400 transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)" }}
                        />
                        <button
                          onClick={saveNicknameDraft}
                          disabled={!nicknameDraft.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:active:scale-100"
                        >
                          Uložit
                        </button>
                      </div>
                      {nicknameSaveError && (
                        <p className="text-xs text-red-400">{nicknameSaveError}</p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between text-sm font-medium text-indigo-100 hover:text-red-400 py-2.5 border-t border-white border-opacity-10 transition-colors"
                  >
                    Odhlásit se
                    <IconLogout className="w-4 h-4 text-indigo-300 text-opacity-50" />
                  </button>
                </div>

                {/* BLOK 2: Předplatné & platby */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-indigo-300 text-opacity-70 uppercase tracking-wide">
                      Předplatné
                    </p>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isPremium
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                          : "bg-white bg-opacity-10 text-indigo-200 text-opacity-90"
                      }`}
                    >
                      {isPremium ? "PREMIUM 🚀" : "Verze ZDARMA"}
                    </span>
                  </div>

                  {!isPremium && (
                    <button
                      onClick={openPaywall}
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 mb-2.5"
                    >
                      Odemknout PREMIUM verzi ✨
                    </button>
                  )}

                  <button
                    onClick={handleRestorePurchases}
                    disabled={isRestoringPurchases}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-100 hover:text-white py-2.5 border border-white border-opacity-15 rounded-xl transition-colors disabled:opacity-60"
                  >
                    <IconRestore className={`w-4 h-4 ${isRestoringPurchases ? "animate-spin" : ""}`} />
                    {isRestoringPurchases ? "Obnovuji…" : "Obnovit nákupy"}
                  </button>

                  {restoreConfirmed && (
                    <p className="text-xs text-emerald-600 font-medium mt-2.5 text-center">
                      Tvá předplatná byla úspěšně obnovena! ✅
                    </p>
                  )}
                </div>

                {/* BLOK 3: Preference & notifikace */}
                <div className="backdrop-blur-xl rounded-2xl border p-4 flex flex-col gap-3" style={COSMIC_TILE_STYLE}>
                  <button onClick={toggleNotificationsInSettings} className="w-full flex items-center gap-3">
                    <span className="flex-1 text-left text-sm font-medium text-slate-100">
                      Denní připomínky procvičování
                    </span>
                    <div
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${
                        notificationsEnabled ? "bg-blue-600 justify-end" : "bg-white bg-opacity-20 justify-start"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </button>
                  <div className="h-px bg-white bg-opacity-10" />
                  <button
                    onClick={() => {
                      setSoundHapticsEnabled((v) => {
                        const next = !v;
                        syncSoundHapticsFlag(next);
                        if (next) {
                          unlockAudio();
                          playTap(true);
                        } else {
                          stopRocketEngine();
                        }
                        return next;
                      });
                    }}
                    className="w-full flex items-center gap-3"
                  >
                    <span className="flex-1 text-left text-sm font-medium text-slate-100">
                      Zvuky a haptická odezva
                    </span>
                    <div
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ${
                        soundHapticsEnabled ? "bg-blue-600 justify-end" : "bg-white bg-opacity-20 justify-start"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </div>
                  </button>
                </div>

                {/* BLOK 4: Podpora & právo */}
                <div className="backdrop-blur-xl rounded-2xl border p-4 flex flex-col" style={COSMIC_TILE_STYLE}>
                  <button
                    onClick={openHelp}
                    className="w-full flex items-center justify-between text-sm font-medium text-indigo-100 hover:text-white py-2.5 transition-colors"
                  >
                    Nápověda a podpora
                    <IconChevronRight className="w-4 h-4 text-indigo-300 text-opacity-50" />
                  </button>
                  <div className="h-px bg-white bg-opacity-10" />
                  <button
                    onClick={openPrivacy}
                    className="w-full flex items-center justify-between text-sm font-medium text-indigo-100 hover:text-white py-2.5 transition-colors"
                  >
                    Ochrana osobních údajů
                    <IconChevronRight className="w-4 h-4 text-indigo-300 text-opacity-50" />
                  </button>
                  <div className="h-px bg-white bg-opacity-10" />
                  <button
                    onClick={openTerms}
                    className="w-full flex items-center justify-between text-sm font-medium text-indigo-100 hover:text-white py-2.5 transition-colors"
                  >
                    Podmínky použití
                    <IconChevronRight className="w-4 h-4 text-indigo-300 text-opacity-50" />
                  </button>
                </div>

                {/* BLOK 5: Nebezpečná zóna */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", borderColor: "rgba(248, 113, 113, 0.3)" }}>
                  <button
                    onClick={openDeleteConfirm}
                    className="w-full flex items-center justify-between text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Smazat účet a data
                    <IconTrash className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-50 transition-opacity duration-300 ${
                helpVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeHelp}
            />
            <div
              className={`relative w-full backdrop-blur-xl rounded-t-3xl sm:rounded-3xl transition-all duration-300 flex flex-col border ${
                helpVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{ ...COSMIC_GLASS_CARD_STYLE, maxHeight: "min(88%, 88dvh)" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white border-opacity-10 flex-shrink-0">
                <span className="w-14" aria-hidden="true" />
                <h2 className="text-base font-bold text-white">Nápověda a podpora</h2>
                <button
                  onClick={closeHelp}
                  className="w-14 text-right text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Hotovo
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {/* Co v appce najdeš */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <p className="text-xs font-semibold text-indigo-300 text-opacity-70 uppercase tracking-wide mb-3">
                    Co v appce najdeš
                  </p>
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                        <IconZap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Tematické okruhy</p>
                        <p className="text-xs text-indigo-300 text-opacity-70 leading-relaxed">
                          Procvičuj češtinu po tématech (např. pravopis, skladba). U každého okruhu
                          vidíš svou úspěšnost v % — nezačaté má 0 %.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                        <IconClock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Test nanečisto</p>
                        <p className="text-xs text-indigo-300 text-opacity-70 leading-relaxed">
                          30 úloh · 40 minut · jako ostrá zkouška. Na kartě uvidíš nejlepší i
                          poslední výsledek a nejvyšší dosažený pohár (bronz / stříbro / zlato).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                        <IconFire className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Na čem zapracovat</p>
                        <p className="text-xs text-indigo-300 text-opacity-70 leading-relaxed">
                          Po prvním procvičení ti appka ukáže nejslabší okruh. Tlačítko{" "}
                          <strong className="text-slate-100">Jen moje chyby</strong> otevře otázky,
                          které jsi měl/a naposledy špatně — neodečítá se z denního limitu zdarma.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0">
                        <IconBookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Taháky</p>
                        <p className="text-xs text-indigo-300 text-opacity-70 leading-relaxed">
                          Ke každému okruhu máš rychlý tahák — shrnutí pravidel, když potřebuješ
                          osvěžit paměť.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instalace na plochu (PWA) */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <p className="text-xs font-semibold text-indigo-300 text-opacity-70 uppercase tracking-wide mb-3">
                    Appka na plochu telefonu
                  </p>
                  <p className="text-xs text-indigo-200 text-opacity-90 leading-relaxed mb-3">
                    Můžeš si Procvičování češtiny přidat na plochu jako běžnou aplikaci (bez
                    App Store / Google Play). Otevři web v prohlížeči a postupuj podle telefonu:
                  </p>
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center flex-shrink-0">
                        <IconApple className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">iPhone / iPad (Safari)</p>
                        <ol className="mt-1 flex flex-col gap-1 list-decimal list-inside text-xs text-indigo-300 text-opacity-80 leading-relaxed">
                          <li>Otevři appku v <strong className="text-slate-100">Safari</strong> (ne v Chrome).</li>
                          <li>Klepni na ikonu <strong className="text-slate-100">Sdílet</strong> (čtverec se šipkou nahoru).</li>
                          <li>Zvol <strong className="text-slate-100">Přidat na plochu</strong> → Přidat.</li>
                        </ol>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <IconGoogle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Android (Chrome)</p>
                        <ol className="mt-1 flex flex-col gap-1 list-decimal list-inside text-xs text-indigo-300 text-opacity-80 leading-relaxed">
                          <li>Otevři appku v <strong className="text-slate-100">Chrome</strong>.</li>
                          <li>Klepni na <strong className="text-slate-100">⋮</strong> (tři tečky vpravo nahoře).</li>
                          <li>
                            Zvol <strong className="text-slate-100">Nainstalovat aplikaci</strong>{" "}
                            nebo <strong className="text-slate-100">Přidat na plochu</strong> →
                            potvrď.
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Freemium a Premium */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <p className="text-xs font-semibold text-indigo-300 text-opacity-70 uppercase tracking-wide mb-2">
                    Verze zdarma a PREMIUM
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        <strong className="text-slate-100">Zdarma:</strong> 2 tematická procvičování
                        denně a 1 test nanečisto týdně. Procvičování chyb limit neubírá.
                      </span>
                    </li>
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        <strong className="text-slate-100">PREMIUM:</strong> neomezené testy, všechny
                        otázky a taháky za 69&nbsp;Kč jednorázově (Stripe), nebo přes promo kód.
                      </span>
                    </li>
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        Nemáš kód? Napiš na{" "}
                        <a
                          href="mailto:info@fachmanka.cz?subject=Zadost%20o%20testovaci%20kod"
                          className="text-blue-300 underline underline-offset-2"
                        >
                          info@fachmanka.cz
                        </a>
                        .
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Bodování a štít */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <p className="text-xs font-semibold text-indigo-300 text-opacity-70 uppercase tracking-wide mb-2">
                    Bodování, štít a poháry
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        <strong className="text-slate-100">Správně bez nápovědy:</strong> 2 body ·{" "}
                        <strong className="text-slate-100">s nápovědou:</strong> 1 bod.
                      </span>
                    </li>
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        <strong className="text-slate-100">Špatně:</strong> 0 bodů. Dvě chyby za sebou
                        = navíc −1 bod.
                      </span>
                    </li>
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        3 správné odpovědi v řadě (bez nápovědy) ti dají{" "}
                        <strong className="text-slate-100">štít</strong> — jedna chyba se pohltí a
                        můžeš zkusit otázku znovu.
                      </span>
                    </li>
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        Otázky jsou výběr A–D. Po testu nanečisto dostaneš % úspěšnosti a od 70 /
                        80 / 90 % bronzový, stříbrný nebo zlatý pohár.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Zvuky a připomínky */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <p className="text-xs font-semibold text-indigo-300 text-opacity-70 uppercase tracking-wide mb-2">
                    Zvuky, haptika a připomínky
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        V Nastavení zapneš{" "}
                        <strong className="text-slate-100">Zvuky a haptickou odezvu</strong> —
                        kosmické blipy při odpovědích a vibrace (kde to telefon umí).
                      </span>
                    </li>
                    <li className="text-xs text-indigo-200 text-opacity-90 leading-relaxed flex gap-2">
                      <span className="text-zinc-300 flex-shrink-0">•</span>
                      <span>
                        <strong className="text-slate-100">Denní připomínky:</strong> když ten den
                        ještě neprocvičuješ, kolem 18:00 ti přijde e-mail z info@fachmanka.cz s
                        odkazem do appky.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Účet */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0">
                      <IconCloud className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Tvůj účet</p>
                      <p className="text-xs text-indigo-300 text-opacity-70 leading-relaxed">
                        Přezdívka, pokrok, limity a stav PREMIUM se ukládají do cloudu (Supabase).
                        V Nastavení můžeš obnovit nákupy / stav PREMIUM, upravit preference nebo
                        smazat účet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Podpora a kontakt */}
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <p className="text-xs font-semibold text-indigo-300 text-opacity-70 uppercase tracking-wide mb-2">
                    Podpora a kontakt
                  </p>
                  <p className="text-xs text-indigo-200 text-opacity-90 leading-relaxed mb-3">
                    Hlášení chyb, dotazy, nápady i žádost o testovací kód:
                  </p>
                  <a
                    href="mailto:info@fachmanka.cz"
                    className="w-full flex items-center gap-3 hover:bg-opacity-20 border border-white border-opacity-15 rounded-xl p-3.5 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500 bg-opacity-20 text-blue-300 flex items-center justify-center flex-shrink-0">
                      <IconMail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-blue-300">info@fachmanka.cz</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPrivacy && (
          <div className="absolute inset-0 z-[70] flex items-end sm:items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-50 transition-opacity duration-300 ${
                privacyVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closePrivacy}
            />
            <div
              className={`relative w-full backdrop-blur-xl rounded-t-3xl sm:rounded-3xl transition-all duration-300 flex flex-col border ${
                privacyVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{ ...COSMIC_GLASS_CARD_STYLE, maxHeight: "min(88%, 88dvh)" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white border-opacity-10 flex-shrink-0">
                <span className="w-14" aria-hidden="true" />
                <h2 className="text-base font-bold text-white text-center px-2">
                  Ochrana osobních údajů
                </h2>
                <button
                  onClick={closePrivacy}
                  className="w-14 text-right text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Hotovo
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">
                    {PRIVACY_POLICY.title}
                  </h3>
                  <p className="text-xs text-indigo-300 text-opacity-70">
                    Účinnost: {PRIVACY_POLICY.effectiveFrom} · Aktualizace: {PRIVACY_POLICY.lastUpdated}
                  </p>
                </div>

                {PRIVACY_POLICY.sections.map((section) => (
                  <div
                    key={section.heading}
                    className="backdrop-blur-xl rounded-2xl border p-4 flex flex-col gap-2.5"
                    style={COSMIC_TILE_STYLE}
                  >
                    <p className="text-xs font-semibold text-indigo-300 text-opacity-80 uppercase tracking-wide">
                      {section.heading}
                    </p>
                    {(section.paragraphs || []).map((p, i) => (
                      <p key={`p-${i}`} className="text-xs text-indigo-100 text-opacity-90 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {(section.bullets || []).length > 0 && (
                      <ul className="flex flex-col gap-2 pl-0.5">
                        {section.bullets.map((b, i) => (
                          <li
                            key={`b-${i}`}
                            className="text-xs text-indigo-100 text-opacity-90 leading-relaxed flex gap-2"
                          >
                            <span className="text-indigo-300 flex-shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {(section.paragraphsAfter || []).map((p, i) => (
                      <p key={`pa-${i}`} className="text-xs text-indigo-100 text-opacity-90 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {(section.bulletsAfter || []).length > 0 && (
                      <ul className="flex flex-col gap-2 pl-0.5">
                        {section.bulletsAfter.map((b, i) => (
                          <li
                            key={`ba-${i}`}
                            className="text-xs text-indigo-100 text-opacity-90 leading-relaxed flex gap-2"
                          >
                            <span className="text-indigo-300 flex-shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {(section.closing || []).map((p, i) => (
                      <p key={`c-${i}`} className="text-xs text-indigo-100 text-opacity-90 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showTerms && (
          <div className="absolute inset-0 z-[70] flex items-end sm:items-center justify-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-50 transition-opacity duration-300 ${
                termsVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeTerms}
            />
            <div
              className={`relative w-full backdrop-blur-xl rounded-t-3xl sm:rounded-3xl transition-all duration-300 flex flex-col border ${
                termsVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
              style={{ ...COSMIC_GLASS_CARD_STYLE, maxHeight: "min(88%, 88dvh)" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white border-opacity-10 flex-shrink-0">
                <span className="w-14" aria-hidden="true" />
                <h2 className="text-base font-bold text-white text-center px-2">
                  Podmínky použití
                </h2>
                <button
                  onClick={closeTerms}
                  className="w-14 text-right text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Hotovo
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                <div className="backdrop-blur-xl rounded-2xl border p-4" style={COSMIC_TILE_STYLE}>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-1">
                    {TERMS_OF_USE.title}
                  </h3>
                  <p className="text-xs text-indigo-300 text-opacity-70">
                    Účinnost: {TERMS_OF_USE.effectiveFrom} · Aktualizace: {TERMS_OF_USE.lastUpdated}
                  </p>
                </div>

                {TERMS_OF_USE.sections.map((section) => (
                  <div
                    key={section.heading}
                    className="backdrop-blur-xl rounded-2xl border p-4 flex flex-col gap-2.5"
                    style={COSMIC_TILE_STYLE}
                  >
                    <p className="text-xs font-semibold text-indigo-300 text-opacity-80 uppercase tracking-wide">
                      {section.heading}
                    </p>
                    {(section.paragraphs || []).map((p, i) => (
                      <p key={`p-${i}`} className="text-xs text-indigo-100 text-opacity-90 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {(section.bullets || []).length > 0 && (
                      <ul className="flex flex-col gap-2 pl-0.5">
                        {section.bullets.map((b, i) => (
                          <li
                            key={`b-${i}`}
                            className="text-xs text-indigo-100 text-opacity-90 leading-relaxed flex gap-2"
                          >
                            <span className="text-indigo-300 flex-shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {(section.paragraphsAfter || []).map((p, i) => (
                      <p key={`pa-${i}`} className="text-xs text-indigo-100 text-opacity-90 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showPaywall && (
          <div
            className="absolute inset-0 flex items-end sm:items-center justify-center overflow-hidden"
            style={{ zIndex: 60 }}
          >
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-60 transition-opacity duration-300 ${
                paywallVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closePaywall}
            />
            <div
              className={`relative w-full bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                paywallVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <button
                onClick={closePaywall}
                aria-label="Zavřít"
                className="absolute right-4 safe-top-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-2xl">🚀</span>
                </div>
                <h2 className="text-lg font-bold text-zinc-900 mb-1">Přejdi na PREMIUM</h2>
                {paywallMessage && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed mb-2">
                    {paywallMessage}
                  </p>
                )}
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Odemkni všechny otázky, taháky a neomezené testy nanečisto.
                </p>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {[
                  "Přístup ke všem 1000+ otázkám",
                  "Neomezené testy nanečisto",
                  "Všechny taháky bez omezení",
                  "Bez reklam",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <IconCheckBadge className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-zinc-700">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold text-zinc-900 mb-1">
                  69&nbsp;Kč
                  <span className="text-sm font-semibold text-zinc-500 ml-1.5">jednorázově</span>
                </p>
                <label className="flex items-start gap-2.5 mb-3 text-left cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={premiumPurchaseConsent}
                    onChange={(e) => setPremiumPurchaseConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-zinc-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-[11px] text-zinc-500 leading-relaxed">
                    Souhlasím s{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openTerms();
                      }}
                      className="underline text-zinc-700 hover:text-zinc-900 font-medium"
                    >
                      Podmínkami použití
                    </button>{" "}
                    a{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openPrivacy();
                      }}
                      className="underline text-zinc-700 hover:text-zinc-900 font-medium"
                    >
                      Zásadami ochrany osobních údajů
                    </button>
                    . Výslovně žádám o okamžité zpřístupnění digitálního obsahu a beru na vědomí, že
                    tím ztrácím právo na odstoupení od smlouvy do 14 dnů.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleBuyPremium}
                  disabled={checkoutLoading || !!promoSuccess || !premiumPurchaseConsent}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-white font-bold text-sm py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-60 disabled:active:scale-100 shadow-md"
                >
                  {checkoutLoading ? "Přesměrovávám na platbu…" : "Koupit PREMIUM · 69 Kč"}
                </button>
                {checkoutError && (
                  <p className="mt-2 text-xs text-rose-600 leading-relaxed text-left">
                    {checkoutError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="flex-1 h-px bg-zinc-200" />
                <span className="text-xs text-zinc-400 whitespace-nowrap">nebo máš kód</span>
                <span className="flex-1 h-px bg-zinc-200" />
              </div>

              <form onSubmit={handleActivatePromoCode} className="mb-4">
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 text-left">
                  Promo kód
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => {
                      setPromoCodeInput(e.target.value);
                      if (promoError) setPromoError("");
                    }}
                    placeholder="Zadej kód"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    disabled={promoLoading || !!promoSuccess}
                    className="flex-1 min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={promoLoading || !!promoSuccess}
                    className="flex-shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white text-sm font-semibold px-4 py-3 transition-all active:scale-95 disabled:opacity-60 disabled:active:scale-100"
                  >
                    {promoLoading ? "…" : "Aktivovat kód"}
                  </button>
                </div>
                {promoError && (
                  <p className="mt-2 text-xs text-rose-600 leading-relaxed text-left">
                    {promoError}
                  </p>
                )}
                {promoSuccess && (
                  <p className="mt-2 text-xs text-emerald-600 font-semibold leading-relaxed text-left">
                    {promoSuccess}
                  </p>
                )}
                <p className="mt-2.5 text-xs text-zinc-500 leading-relaxed text-left">
                  Nemáš promo kód?{" "}
                  <a
                    href="mailto:info@fachmanka.cz?subject=Zadost%20o%20testovaci%20kod"
                    className="text-violet-600 font-semibold underline underline-offset-2 hover:text-violet-700"
                  >
                    Napiš na info@fachmanka.cz
                  </a>
                </p>
              </form>

              <button
                onClick={handleUnlockPremium}
                className="w-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold py-3 rounded-2xl transition-all active:scale-95 mb-2 text-sm"
              >
                Obnovit stav PREMIUM
              </button>
              <p className="text-xs text-zinc-400 text-center">
                Platba probíhá bezpečně přes Stripe · 69 Kč jednorázově
              </p>
            </div>
          </div>
        )}

        <ConfettiBurst active={showConfetti} />

        {showDeleteConfirm && (
          <div
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{ zIndex: 60 }}
          >
            <div
              className={`absolute inset-0 bg-zinc-900 bg-opacity-60 transition-opacity duration-300 ${
                deleteConfirmVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeDeleteConfirm}
            />
            <div
              className={`relative w-full bg-white rounded-3xl p-6 shadow-2xl transition-all duration-300 ${
                deleteConfirmVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <IconTrash className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-base font-bold text-zinc-900 mb-2">
                  Opravdu chceš smazat účet?
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  Smaže se tvůj účet a veškerý postup. Tato akce je nevratná.
                </p>
                {deleteAccountError && (
                  <p className="text-xs text-red-600 font-medium leading-relaxed mb-4 -mt-2">
                    {deleteAccountError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60 disabled:active:scale-100"
                >
                  {isDeletingAccount ? "Mažu účet…" : "Ano, smazat účet a data"}
                </button>
                <button
                  onClick={closeDeleteConfirm}
                  disabled={isDeletingAccount}
                  className="w-full text-center text-sm font-medium text-zinc-500 hover:text-zinc-700 py-2 transition-colors disabled:opacity-50"
                >
                  Zrušit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

