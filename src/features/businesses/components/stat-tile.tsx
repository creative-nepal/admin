import type * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "default" | "danger";
}

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1 py-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-semibold text-2xl tabular-nums",
            tone === "danger" && "text-destructive",
          )}
        >
          {value}
        </span>
        {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
      </CardContent>
    </Card>
  );
}
