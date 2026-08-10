import {
  IconPencil,
  IconRulerTriangle,
  IconBookOpen,
  IconGear,
  IconChat,
  IconBooksStack,
} from "../components/icons";

const COSMIC_BG_STYLE = {
  backgroundColor: "#080B1A",
  backgroundImage:
    "radial-gradient(rgba(59, 130, 246, 0.35) 1px, transparent 1px), " +
    "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))",
  backgroundSize: "16px 16px, 100% 100%",
};
const COSMIC_GLASS_CARD_STYLE = {
  backgroundImage:
    "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('/images/bg-a20b26b78d.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderColor: "rgba(34, 211, 238, 0.3)",
  boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
};
// Alternate frame background (pocket watch + quill) used specifically for
// the Pravopis and Slovní zásoba quiz screens.
// Alternate frame background (floating astronomical book) used specifically
// for the Porozumění textu and Literární teorie quiz screens.
// Alternate frame background (compass + astrolabe) used specifically for
// the Skladba and Tvarosloví quiz screens.
// Alternate frame background (all four artifacts together) used specifically
// for the timed "Zkus si test nanečisto" mock exam.
// Dedicated frame background used specifically for the Settings screen.
const COSMIC_GLASS_CARD_STYLE_SETTINGS = {
  backgroundImage:
    "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('/images/bg-9bcc9f8553.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderColor: "rgba(34, 211, 238, 0.3)",
  boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
};
const COSMIC_GLASS_CARD_STYLE_FULLTEST = {
  backgroundImage:
    "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('/images/bg-47d40cd9b1.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderColor: "rgba(34, 211, 238, 0.3)",
  boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
};
const COSMIC_GLASS_CARD_STYLE_ASTROLABE = {
  backgroundImage:
    "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('/images/bg-866a93636a.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderColor: "rgba(34, 211, 238, 0.3)",
  boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
};
const COSMIC_GLASS_CARD_STYLE_BOOK = {
  backgroundImage:
    "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('/images/bg-2de001ed0c.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderColor: "rgba(34, 211, 238, 0.3)",
  boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
};
const COSMIC_GLASS_CARD_STYLE_WATCH = {
  backgroundImage:
    "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('/images/bg-563c4a1a30.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderColor: "rgba(34, 211, 238, 0.3)",
  boxShadow: "0 0 30px rgba(56, 189, 248, 0.15), 0 25px 50px -12px rgba(15, 23, 42, 0.5)",
};
// Maps each practice category to its dedicated quiz-screen background.
const QUIZ_CATEGORY_BG = {
  Pravopis: COSMIC_GLASS_CARD_STYLE_WATCH,
  "Slovní zásoba": COSMIC_GLASS_CARD_STYLE_WATCH,
  "Porozumění textu": COSMIC_GLASS_CARD_STYLE_BOOK,
  "Literární teorie": COSMIC_GLASS_CARD_STYLE_BOOK,
  Skladba: COSMIC_GLASS_CARD_STYLE_ASTROLABE,
  Tvarosloví: COSMIC_GLASS_CARD_STYLE_ASTROLABE,
};

const COSMIC_TILE_STYLE = {
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  borderColor: "rgba(255, 255, 255, 0.12)",
};
const COSMIC_BUTTON_SHADOW = { boxShadow: "0 10px 30px -5px rgba(99, 102, 241, 0.3)" };
// Warm aged-parchment card look for the dashboard's hero and category cards —
// built from layered radial gradients (no texture image needed) to mimic
// subtle stains and age blotches on cream paper.
const PARCHMENT_STYLE = {
  backgroundColor: "#F3E6C8",
  backgroundImage:
    "radial-gradient(ellipse 55% 40% at 15% 10%, rgba(139, 111, 71, 0.13), transparent 60%), " +
    "radial-gradient(ellipse 45% 35% at 90% 80%, rgba(139, 111, 71, 0.11), transparent 60%), " +
    "radial-gradient(ellipse 70% 50% at 50% 105%, rgba(101, 78, 46, 0.09), transparent 65%), " +
    "radial-gradient(ellipse 35% 30% at 60% 25%, rgba(139, 111, 71, 0.07), transparent 55%)",
  borderColor: "#D8C39A",
};

const CATEGORY_META = {
  Pravopis: {
    icon: IconPencil,
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-500",
    btn: "text-rose-300 border-rose-400 hover:bg-white hover:bg-opacity-10",
    cheatText: "text-rose-700",
  },
  Skladba: {
    icon: IconRulerTriangle,
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-500",
    btn: "text-blue-300 border-blue-400 hover:bg-white hover:bg-opacity-10",
    cheatText: "text-blue-700",
  },
  "Porozumění textu": {
    icon: IconBookOpen,
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-500",
    btn: "text-sky-300 border-sky-400 hover:bg-white hover:bg-opacity-10",
    cheatText: "text-sky-700",
  },
  Tvarosloví: {
    icon: IconGear,
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-500",
    btn: "text-amber-300 border-amber-400 hover:bg-white hover:bg-opacity-10",
    cheatText: "text-amber-700",
  },
  "Slovní zásoba": {
    icon: IconChat,
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-500",
    btn: "text-emerald-300 border-emerald-400 hover:bg-white hover:bg-opacity-10",
    cheatText: "text-emerald-700",
  },
  "Literární teorie": {
    icon: IconBooksStack,
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-500",
    btn: "text-violet-300 border-violet-400 hover:bg-white hover:bg-opacity-10",
    cheatText: "text-violet-700",
  },
};

export {
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
};
