import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-serif font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">Strona nie została znaleziona</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Button asChild size="lg">
        <Link href="/">Wróć na stronę główną</Link>
      </Button>
    </div>
  );
}
