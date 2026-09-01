"use client";

import { RiTranslate2 } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../hooks/use-translation";

export function LanguageSwitcher() {
  const router = useRouter();
  const { language, setLanguage, languages } = useTranslation();

  if (languages.length < 2) {
    return null;
  }

  const current = languages.find((option) => option.code === language);
  const other =
    languages.find((option) => option.code !== language) ?? languages[0];

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      title={`Switch to ${other.label}`}
      onClick={() => {
        setLanguage(other.code);
        router.refresh();
      }}
    >
      <RiTranslate2 className="size-4" />
      <span>{current?.label ?? language}</span>
    </Button>
  );
}
