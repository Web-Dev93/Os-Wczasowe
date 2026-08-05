import { useEffect } from "react";
import { useGetSettings } from "@workspace/api-client-react";

export function usePublicTheme() {
  const { data: settings, isLoading } = useGetSettings();

  useEffect(() => {
    if (settings?.theme) {
      const themes = [
        "theme-professional",
        "theme-exclusive",
        "theme-fun",
        "theme-family",
        "theme-rustic",
        "theme-modern",
      ];
      
      const html = document.documentElement;
      html.classList.remove(...themes);
      html.classList.add(`theme-${settings.theme}`);
    }
  }, [settings?.theme]);

  return { settings, isLoading };
}

export function useAdminTheme() {
  useEffect(() => {
    const themes = [
      "theme-professional",
      "theme-exclusive",
      "theme-fun",
      "theme-family",
      "theme-rustic",
      "theme-modern",
    ];
    
    const html = document.documentElement;
    html.classList.remove(...themes);
    html.classList.add("theme-professional");
  }, []);
}
