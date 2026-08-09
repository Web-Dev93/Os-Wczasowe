import { useEffect } from "react";
import { useGetSettings, useAdminGetSettings } from "@workspace/api-client-react";

const ALL_THEMES = [
  "theme-professional",
  "theme-exclusive",
  "theme-fun",
  "theme-family",
  "theme-rustic",
  "theme-modern",
] as const;

const VALID_THEMES = new Set([
  "professional", "exclusive", "fun", "family", "rustic", "modern",
]);

const SESSION_THEME_KEY = "osrodek_theme";
const SESSION_DEMO_KEY  = "osrodek_demo";

/** Czyta ?theme= z URL — używane przez landing page do podglądu na żywo */
function getUrlTheme(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("theme");
    return t && VALID_THEMES.has(t) ? t : null;
  } catch {
    return null;
  }
}

/** Czyta ?demo=1 z URL */
function getUrlDemo(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("demo") === "1";
  } catch {
    return false;
  }
}

function applyTheme(theme: string) {
  const html = document.documentElement;
  html.classList.remove(...ALL_THEMES);
  html.classList.add(`theme-${theme}`);
}

export function usePublicTheme() {
  const urlTheme = getUrlTheme();
  const urlDemo  = getUrlDemo();

  // Persist theme + demo flag to sessionStorage so they survive navigation
  if (urlTheme) {
    try { sessionStorage.setItem(SESSION_THEME_KEY, urlTheme); } catch { /* noop */ }
  }
  if (urlDemo) {
    try { sessionStorage.setItem(SESSION_DEMO_KEY, "1"); } catch { /* noop */ }
  }

  // Read sessionStorage fallback (used when navigating between pages)
  const storedTheme = (() => {
    try { return sessionStorage.getItem(SESSION_THEME_KEY); } catch { return null; }
  })();
  const storedDemo = (() => {
    try { return sessionStorage.getItem(SESSION_DEMO_KEY) === "1"; } catch { return false; }
  })();

  const activeUrlTheme = urlTheme ?? storedTheme;
  const isDemo = urlDemo || storedDemo;

  // If URL/session forces a theme (iframe preview or demo mode), skip API call
  const { data: settings, isLoading } = useGetSettings({
    query: { enabled: !activeUrlTheme } as never,
  });

  useEffect(() => {
    const theme = activeUrlTheme ?? settings?.theme;
    if (theme) applyTheme(theme);
  }, [activeUrlTheme, settings?.theme]);

  return { settings, isLoading, isDemo, activeTheme: activeUrlTheme ?? settings?.theme };
}

export function useAdminTheme() {
  // Demo preview (landing showcase iframe): honor ?theme= from URL/session first
  const urlTheme = getUrlTheme();
  if (urlTheme) {
    try { sessionStorage.setItem(SESSION_THEME_KEY, urlTheme); } catch { /* noop */ }
  }
  const storedTheme = (() => {
    try { return sessionStorage.getItem(SESSION_THEME_KEY); } catch { return null; }
  })();
  const forcedTheme = urlTheme ?? storedTheme;

  // Use authenticated admin endpoint for reliability in secured context
  const { data: settings } = useAdminGetSettings({
    query: { retry: 1, enabled: !forcedTheme } as never,
  });
  useEffect(() => {
    applyTheme(forcedTheme ?? settings?.theme ?? "professional");
  }, [forcedTheme, settings?.theme]);
}
