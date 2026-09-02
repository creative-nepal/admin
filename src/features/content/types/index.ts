import type { Translate } from "@/features/i18n/types";

export type ContentLocale = "en" | "ne";

export const CONTENT_LOCALES: ContentLocale[] = ["en", "ne"];

export const LOCALE_OPTIONS: { value: ContentLocale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ne", label: "नेपाली" },
];

export type ContentPageStatus = "draft" | "published" | "archived";

export const PAGE_STATUSES: ContentPageStatus[] = [
  "draft",
  "published",
  "archived",
];

export function pageStatusOptions(
  t: Translate,
): { value: ContentPageStatus; label: string }[] {
  return PAGE_STATUSES.map((value) => ({
    value,
    label: t(`ui.admin.content.pageStatus.${value}`),
  }));
}

export type ContentBlockType =
  | "hero"
  | "features"
  | "richText"
  | "faq"
  | "cta"
  | "pricing";

export const BLOCK_TYPES: ContentBlockType[] = [
  "hero",
  "features",
  "richText",
  "faq",
  "cta",
  "pricing",
];

export function blockTypeOptions(
  t: Translate,
): { value: ContentBlockType; label: string; hint: string }[] {
  return BLOCK_TYPES.map((value) => ({
    value,
    label: t(`ui.admin.content.blockType.${value}`),
    hint: t(`ui.admin.content.blockHint.${value}`),
  }));
}

export interface HeroBlock {
  id: string;
  type: "hero";
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
}

export interface FeaturesBlock {
  id: string;
  type: "features";
  heading?: string;
  subheading?: string;
  items: Array<{ title: string; body: string; icon?: string }>;
}

export interface RichTextBlock {
  id: string;
  type: "richText";
  heading?: string;
  markdown: string;
}

export interface FaqBlock {
  id: string;
  type: "faq";
  heading?: string;
  items: Array<{ question: string; answer: string }>;
}

export interface CtaBlock {
  id: string;
  type: "cta";
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface PricingBlock {
  id: string;
  type: "pricing";
  heading?: string;
  subheading?: string;
  sector?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export type ContentBlock =
  | HeroBlock
  | FeaturesBlock
  | RichTextBlock
  | FaqBlock
  | CtaBlock
  | PricingBlock;

export interface ContentSeo {
  title?: string;
  description?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
}

export interface ContentNavLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface ContentFooterGroup {
  id: string;
  label: string;
  links: ContentNavLink[];
}

export interface ContentPageTranslation {
  locale: ContentLocale;
  title: string;
  navLabel: string | null;
  seo: ContentSeo;
  blocks: ContentBlock[];
  updatedAt: string;
}

export interface ContentPage {
  id: string;
  slug: string;
  status: ContentPageStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: ContentPageTranslation[];
}

export interface ContentNavigation {
  locale: ContentLocale;
  header: ContentNavLink[];
  footer: ContentFooterGroup[];
  tagline: string | null;
  copyright: string | null;
}

export const HOME_SLUG = "home";

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function createBlock(type: ContentBlockType): ContentBlock {
  switch (type) {
    case "hero":
      return { id: newId("hero"), type, heading: "New heading" };
    case "features":
      return {
        id: newId("features"),
        type,
        items: [{ title: "Feature", body: "What it does for the reader." }],
      };
    case "richText":
      return { id: newId("text"), type, markdown: "Write something." };
    case "faq":
      return {
        id: newId("faq"),
        type,
        items: [{ question: "A question?", answer: "The answer." }],
      };
    case "cta":
      return {
        id: newId("cta"),
        type,
        heading: "Ready to start?",
        buttonLabel: "Get started",
        buttonHref: "/register",
      };
    case "pricing":
      return {
        id: newId("pricing"),
        type,
        heading: "Plans",
        ctaLabel: "Start free",
        ctaHref: "/register",
      };
  }
}

export function createNavLink(): ContentNavLink {
  return { id: newId("link"), label: "New link", href: "/" };
}

export function createFooterGroup(): ContentFooterGroup {
  return { id: newId("group"), label: "New group", links: [createNavLink()] };
}
