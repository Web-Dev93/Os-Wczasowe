import React from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminHelpProps {
  text: string;
}

export function AdminHelp({ text }: AdminHelpProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Pomoc"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs text-sm leading-relaxed">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}

/** Inline tip block shown below a field */
export function AdminTip({ text }: { text: string }) {
  return (
    <p className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/50 border border-border/50 rounded-md px-3 py-2 mt-1">
      <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/60" />
      {text}
    </p>
  );
}
