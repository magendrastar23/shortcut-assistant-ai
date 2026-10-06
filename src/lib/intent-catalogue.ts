import {
  AppWindow, Battery, BellRing, Bluetooth, Image, Languages, LayoutGrid, Lock,
  MapPin, MonitorSmartphone, Signal, Volume2, Wifi, type LucideIcon,
} from "lucide-react";

export type CatalogueEntry = {
  id: string;
  intent: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tone: string;
  keywords: string[];
  related: string[];
};

export const catalogue: CatalogueEntry[] = [
  { id: "wifi", intent: "Manage Wi-Fi", name: "Wi-Fi Settings", description: "Manage Wi-Fi connections and network settings on your device.", icon: Wifi, tone: "bg-tile-blue", keywords: ["wifi", "wireless", "internet", "hotspot", "router"], related: ["mobile-data", "bluetooth"] },
  { id: "bluetooth", intent: "Manage Bluetooth", name: "Bluetooth Settings", description: "Pair and manage Bluetooth devices like headphones and speakers.", icon: Bluetooth, tone: "bg-tile-cyan", keywords: ["bluetooth", "pair", "pairing", "headphones", "earbuds", "speaker"], related: ["wifi", "sound"] },
  { id: "permissions", intent: "Manage App Permissions", name: "App Permissions", description: "Control which apps can use your camera, microphone, location and more.", icon: AppWindow, tone: "bg-tile-violet", keywords: ["permission", "permissions", "camera access", "microphone access", "allow access"], related: ["apps", "location", "security"] },
  { id: "notifications", intent: "Manage Notifications", name: "Notification Settings", description: "Choose which apps can notify you and how.", icon: BellRing, tone: "bg-tile-rose", keywords: ["notification", "notifications", "notify", "alerts", "pop ups", "popups", "badges"], related: ["sound", "apps"] },
  { id: "battery", intent: "Manage Battery", name: "Battery Settings", description: "Check battery usage and power saving options.", icon: Battery, tone: "bg-tile-green", keywords: ["battery", "power saving", "battery saver", "charging", "charge"], related: ["display", "apps"] },
  { id: "display", intent: "Manage Display", name: "Display Settings", description: "Adjust brightness, dark theme, screen timeout and font size.", icon: MonitorSmartphone, tone: "bg-tile-cyan", keywords: ["display", "brightness", "bright", "screen", "dark mode", "font size", "screen timeout"], related: ["wallpaper", "battery"] },
  { id: "wallpaper", intent: "Manage Wallpaper", name: "Wallpaper Settings", description: "Change your home and lock screen wallpaper.", icon: Image, tone: "bg-tile-gold", keywords: ["wallpaper", "background", "lock screen image", "home screen image"], related: ["display"] },
  { id: "apps", intent: "Manage Apps", name: "App Management", description: "View, update, force stop or uninstall installed apps.", icon: LayoutGrid, tone: "bg-tile-violet", keywords: ["installed apps", "manage apps", "uninstall", "apps", "app", "applications", "force stop"], related: ["permissions", "notifications"] },
  { id: "mobile-data", intent: "Manage Mobile Data", name: "Mobile Data / Network Settings", description: "Manage mobile data, SIM and cellular network options.", icon: Signal, tone: "bg-tile-blue", keywords: ["mobile data", "data", "cellular", "sim", "network", "roaming", "4g", "5g"], related: ["wifi"] },
  { id: "language", intent: "Manage Language", name: "Language Settings", description: "Change your device language and input preferences.", icon: Languages, tone: "bg-tile-green", keywords: ["language", "languages", "translate", "keyboard language"], related: ["display"] },
  { id: "location", intent: "Manage Location", name: "Location Settings", description: "Turn location on or off and review location access.", icon: MapPin, tone: "bg-tile-red", keywords: ["location", "gps", "where i am", "maps access"], related: ["permissions", "security"] },
  { id: "sound", intent: "Manage Sound / Do Not Disturb", name: "Sound / Do Not Disturb Settings", description: "Adjust volume, ringtone, silent mode and Do Not Disturb.", icon: Volume2, tone: "bg-tile-rose", keywords: ["do not disturb", "dnd", "silent", "mute", "sound", "volume", "ringtone", "vibrate", "quiet"], related: ["notifications"] },
  { id: "security", intent: "Manage Security", name: "Security Settings", description: "Set up screen lock, password, PIN and fingerprint.", icon: Lock, tone: "bg-tile-gold", keywords: ["password", "security", "screen lock", "lock screen", "pin", "fingerprint", "face unlock", "passcode"], related: ["permissions", "location"] },
];

export const clarificationOptions = [
  { label: "Wi-Fi & Network", id: "wifi" },
  { label: "Apps", id: "apps" },
  { label: "Notifications", id: "notifications" },
  { label: "Battery", id: "battery" },
  { label: "Security", id: "security" },
  { label: "Display", id: "display" },
];

const broadTerms = ["manage", "phone", "device", "working", "broken", "fix", "help", "slow", "problem", "settings", "setup", "set up"];

export function getEntry(id: string) {
  return catalogue.find((e) => e.id === id);
}

export function getEntryByName(name: string) {
  return catalogue.find((e) => e.name === name);
}

export function normalise(text: string) {
  return ` ${text
    .toLowerCase()
    .replace(/wi[\s-]?fi/g, "wifi")
    .replace(/blue[\s-]?tooth/g, "bluetooth")
    .replace(/n['’]t\b/g, " not")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

export type MatchResult =
  | { kind: "match"; entry: CatalogueEntry }
  | { kind: "clarify" }
  | { kind: "none" };

export function matchIntent(request: string): MatchResult {
  const text = normalise(request);
  if (text.trim() === "") return { kind: "none" };

  let best: CatalogueEntry | null = null;
  let bestScore = 0;

  for (const entry of catalogue) {
    for (const kw of entry.keywords) {
      if (text.includes(` ${kw} `) && kw.length > bestScore) {
        best = entry;
        bestScore = kw.length;
      }
    }
  }

  if (best) return { kind: "match", entry: best };
  if (broadTerms.some((term) => text.includes(` ${term} `))) return { kind: "clarify" };
  return { kind: "none" };
}
