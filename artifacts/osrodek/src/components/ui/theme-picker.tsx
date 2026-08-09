import { useAdminGetSettings, useAdminUpdateSettings, getAdminGetSettingsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";

export const THEMES = [
  {
    value: "professional",
    label: "Nadmorski",
    emoji: "〰",
    desc: "Navy i biel — klasyczny, profesjonalny",
    swatches: ["#1e3a6e", "#ffffff", "#e8ecf4"],
    bg: "#ffffff",
    text: "#1e3a6e",
  },
  {
    value: "exclusive",
    label: "Ekskluzywny",
    emoji: "✦",
    desc: "Czerń i złoto — luksusowy, premium",
    swatches: ["#c9a227", "#0a0a10", "#1a1a28"],
    bg: "#0a0a10",
    text: "#c9a227",
  },
  {
    value: "fun",
    label: "Wakacyjny",
    emoji: "☀",
    desc: "Turkus i koral — energiczny, letni",
    swatches: ["#00bcd4", "#f1694d", "#ffffff"],
    bg: "#ffffff",
    text: "#00bcd4",
  },
  {
    value: "family",
    label: "Rodzinny",
    emoji: "🌊",
    desc: "Błękit i piasek — ciepły, przyjazny",
    swatches: ["#2da8d8", "#e0b97a", "#faf7f2"],
    bg: "#faf7f2",
    text: "#2da8d8",
  },
  {
    value: "rustic",
    label: "Rustykalny",
    emoji: "🌿",
    desc: "Drewno i zieleń — naturalny, przytulny",
    swatches: ["#7a5c3a", "#a8c090", "#f5f0eb"],
    bg: "#f5f0eb",
    text: "#7a5c3a",
  },
  {
    value: "modern",
    label: "Nowoczesny",
    emoji: "◼",
    desc: "Czerń i biel — minimalizm, design",
    swatches: ["#141414", "#888888", "#ffffff"],
    bg: "#ffffff",
    text: "#141414",
  },
] as const;

type ThemeValue = (typeof THEMES)[number]["value"];

interface ThemePickerProps {
  value: string;
  onChange: (value: string) => void;
  /** If true, changes are applied immediately via API (for quick switcher) */
  immediate?: boolean;
}

export function ThemePicker({ value, onChange, immediate }: ThemePickerProps) {
  const queryClient = useQueryClient();
  const updateSettings = useAdminUpdateSettings();

  const handleSelect = (theme: ThemeValue) => {
    onChange(theme);
    if (immediate) {
      updateSettings.mutate(
        { data: { theme } as never },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminGetSettingsQueryKey() }) }
      );
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {THEMES.map((t) => {
        const selected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => handleSelect(t.value as ThemeValue)}
            className={`relative rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
              selected
                ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md"
                : "border-border hover:border-primary/40"
            }`}
            style={{ background: t.bg }}
          >
            {/* Selected checkmark */}
            {selected && (
              <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}

            {/* Emoji + name */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base leading-none">{t.emoji}</span>
              <span className="font-bold text-sm" style={{ color: t.text }}>{t.label}</span>
            </div>

            {/* Color swatches */}
            <div className="flex gap-1 mb-2">
              {t.swatches.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
                  style={{ background: color }}
                />
              ))}
            </div>

            {/* Description */}
            <p className="text-[11px] leading-snug text-foreground/50">{t.desc}</p>
          </button>
        );
      })}
    </div>
  );
}

/** Compact dot switcher for the sidebar footer */
export function QuickThemeSwitcher() {
  const { data: settings } = useAdminGetSettings();
  const queryClient = useQueryClient();
  const updateSettings = useAdminUpdateSettings();

  const current = settings?.theme ?? "professional";

  const handleSwitch = (theme: ThemeValue) => {
    updateSettings.mutate(
      { data: { theme } as never },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getAdminGetSettingsQueryKey() }) }
    );
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground mr-1 whitespace-nowrap">Motyw:</span>
      {THEMES.map((t) => (
        <button
          key={t.value}
          type="button"
          title={t.label}
          onClick={() => handleSwitch(t.value as ThemeValue)}
          className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${
            current === t.value
              ? "border-foreground scale-125 shadow-md"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
          style={{ background: t.swatches[0] }}
        />
      ))}
    </div>
  );
}
