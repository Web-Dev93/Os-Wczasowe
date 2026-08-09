import { useEffect } from "react";
import { useGetSettings } from "@workspace/api-client-react";

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

function applyTheme(theme: string) {
  const html = document.documentElement;
  html.classList.remove(...ALL_THEMES);
  html.classList.add(`theme-${theme}`);
}

export function usePublicTheme() {
  const urlTheme = getUrlTheme();
  // If URL forces a theme (iframe preview mode), skip API call
  const { data: settings, isLoading } = useGetSettings({
    query: { enabled: !urlTheme },
  });

  useEffect(() => {
    const theme = urlTheme ?? settings?.theme;
    if (theme) applyTheme(theme);
  }, [urlTheme, settings?.theme]);

  return { settings, isLoading };
}

export function useAdminTheme() {
  useEffect(() => {
    applyTheme("professional");
  }, []);
}
