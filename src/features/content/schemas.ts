import { z } from "zod";
import type {
  ContentBlock,
  ContentNavigation,
  ContentPageTranslation,
} from "./types";

const SAFE_HREF =
  /^(?:\/[^\s]*|https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+|#[^\s]*)$/i;
const SAFE_IMAGE = /^(?:\/[^\s]*|https?:\/\/[^\s]+)$/i;

const href = z
  .string()
  .trim()
  .max(2048)
  .regex(SAFE_HREF, "Use a site path (/pricing) or a full http(s) URL");

const optionalHref = z.union([z.literal(""), href]);
const optionalImage = z.union([
  z.literal(""),
  z
    .string()
    .trim()
    .max(2048)
    .regex(SAFE_IMAGE, "Use a site path or a full http(s) URL"),
]);

const requiredText = z.string().trim().min(1, "Required").max(200);
const optionalShortText = z.string().trim().max(200);
const optionalLongText = z.string().trim().max(2000);

export const pageCreateSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase single segment, e.g. pricing or about-us",
    ),
  title: requiredText,
  navLabel: z.string().trim().max(120),
  locale: z.enum(["en", "ne"]),
});

export type PageCreateValues = z.infer<typeof pageCreateSchema>;

const heroSchema = z.object({
  id: z.string(),
  type: z.literal("hero"),
  heading: requiredText,
  subheading: optionalLongText,
  ctaLabel: optionalShortText,
  ctaHref: optionalHref,
  secondaryCtaLabel: optionalShortText,
  secondaryCtaHref: optionalHref,
  imageUrl: optionalImage,
});

const featuresSchema = z.object({
  id: z.string(),
  type: z.literal("features"),
  heading: optionalShortText,
  subheading: optionalLongText,
  items: z
    .array(
      z.object({
        title: requiredText,
        body: z.string().trim().min(1, "Required").max(2000),
        icon: z.string().trim().max(64),
      }),
    )
    .min(1, "At least one item")
    .max(12),
});

const richTextSchema = z.object({
  id: z.string(),
  type: z.literal("richText"),
  heading: optionalShortText,
  markdown: z.string().trim().min(1, "Required").max(20_000),
});

const faqSchema = z.object({
  id: z.string(),
  type: z.literal("faq"),
  heading: optionalShortText,
  items: z
    .array(
      z.object({
        question: requiredText,
        answer: z.string().trim().min(1, "Required").max(2000),
      }),
    )
    .min(1, "At least one item")
    .max(30),
});

const ctaSchema = z.object({
  id: z.string(),
  type: z.literal("cta"),
  heading: requiredText,
  body: optionalLongText,
  buttonLabel: requiredText,
  buttonHref: href,
});

const pricingSchema = z.object({
  id: z.string(),
  type: z.literal("pricing"),
  heading: optionalShortText,
  subheading: optionalLongText,
  sector: z.string().trim().max(32),
  ctaLabel: optionalShortText,
  ctaHref: optionalHref,
});

export const blockFormSchema = z.discriminatedUnion("type", [
  heroSchema,
  featuresSchema,
  richTextSchema,
  faqSchema,
  ctaSchema,
  pricingSchema,
]);

export type BlockFormValues = z.infer<typeof blockFormSchema>;

export const translationFormSchema = z.object({
  title: requiredText,
  navLabel: z.string().trim().max(120),
  seoTitle: z.string().trim().max(160),
  seoDescription: z.string().trim().max(320),
  ogImageUrl: optionalImage,
  noIndex: z.boolean(),
  blocks: z.array(blockFormSchema).max(50),
});

export type TranslationFormValues = z.infer<typeof translationFormSchema>;

const navLinkSchema = z.object({
  id: z.string(),
  label: requiredText,
  href,
  external: z.boolean(),
});

export const navigationFormSchema = z.object({
  tagline: optionalShortText,
  copyright: optionalShortText,
  header: z.array(navLinkSchema).max(20),
  footer: z
    .array(
      z.object({
        id: z.string(),
        label: requiredText,
        links: z.array(navLinkSchema).max(20),
      }),
    )
    .max(6),
});

export type NavigationFormValues = z.infer<typeof navigationFormSchema>;

function omitEmpty<T extends Record<string, unknown>>(input: T) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([, value]) => value !== "" && value !== undefined,
    ),
  );
}

export function toBlockPayload(
  block: BlockFormValues,
): Record<string, unknown> {
  switch (block.type) {
    case "features":
      return {
        ...omitEmpty({
          id: block.id,
          type: block.type,
          heading: block.heading,
          subheading: block.subheading,
        }),
        items: block.items.map((item) => omitEmpty(item)),
      };
    case "faq":
      return {
        ...omitEmpty({
          id: block.id,
          type: block.type,
          heading: block.heading,
        }),
        items: block.items.map((item) => omitEmpty(item)),
      };
    default:
      return omitEmpty(block);
  }
}

export function toTranslationPayload(values: TranslationFormValues) {
  return {
    title: values.title,
    navLabel: values.navLabel || undefined,
    seo: omitEmpty({
      title: values.seoTitle,
      description: values.seoDescription,
      ogImageUrl: values.ogImageUrl,
      noIndex: values.noIndex || undefined,
    }),
    blocks: values.blocks.map(toBlockPayload),
  };
}

export function toNavigationPayload(values: NavigationFormValues) {
  return {
    tagline: values.tagline || undefined,
    copyright: values.copyright || undefined,
    header: values.header.map((link) =>
      omitEmpty({ ...link, external: link.external || undefined }),
    ),
    footer: values.footer.map((group) => ({
      id: group.id,
      label: group.label,
      links: group.links.map((link) =>
        omitEmpty({ ...link, external: link.external || undefined }),
      ),
    })),
  };
}

export function toBlockFormValues(block: ContentBlock): BlockFormValues {
  switch (block.type) {
    case "hero":
      return {
        id: block.id,
        type: "hero",
        heading: block.heading,
        subheading: block.subheading ?? "",
        ctaLabel: block.ctaLabel ?? "",
        ctaHref: block.ctaHref ?? "",
        secondaryCtaLabel: block.secondaryCtaLabel ?? "",
        secondaryCtaHref: block.secondaryCtaHref ?? "",
        imageUrl: block.imageUrl ?? "",
      };
    case "features":
      return {
        id: block.id,
        type: "features",
        heading: block.heading ?? "",
        subheading: block.subheading ?? "",
        items: block.items.map((item) => ({
          title: item.title,
          body: item.body,
          icon: item.icon ?? "",
        })),
      };
    case "richText":
      return {
        id: block.id,
        type: "richText",
        heading: block.heading ?? "",
        markdown: block.markdown,
      };
    case "faq":
      return {
        id: block.id,
        type: "faq",
        heading: block.heading ?? "",
        items: block.items.map((item) => ({
          question: item.question,
          answer: item.answer,
        })),
      };
    case "cta":
      return {
        id: block.id,
        type: "cta",
        heading: block.heading,
        body: block.body ?? "",
        buttonLabel: block.buttonLabel,
        buttonHref: block.buttonHref,
      };
    case "pricing":
      return {
        id: block.id,
        type: "pricing",
        heading: block.heading ?? "",
        subheading: block.subheading ?? "",
        sector: block.sector ?? "",
        ctaLabel: block.ctaLabel ?? "",
        ctaHref: block.ctaHref ?? "",
      };
  }
}

export function toTranslationFormValues(
  translation: ContentPageTranslation | undefined,
  fallbackTitle: string,
): TranslationFormValues {
  return {
    title: translation?.title ?? fallbackTitle,
    navLabel: translation?.navLabel ?? "",
    seoTitle: translation?.seo.title ?? "",
    seoDescription: translation?.seo.description ?? "",
    ogImageUrl: translation?.seo.ogImageUrl ?? "",
    noIndex: translation?.seo.noIndex ?? false,
    blocks: (translation?.blocks ?? []).map(toBlockFormValues),
  };
}

export function toNavigationFormValues(
  navigation: ContentNavigation | undefined,
): NavigationFormValues {
  return {
    tagline: navigation?.tagline ?? "",
    copyright: navigation?.copyright ?? "",
    header: (navigation?.header ?? []).map((link) => ({
      id: link.id,
      label: link.label,
      href: link.href,
      external: link.external ?? false,
    })),
    footer: (navigation?.footer ?? []).map((group) => ({
      id: group.id,
      label: group.label,
      links: group.links.map((link) => ({
        id: link.id,
        label: link.label,
        href: link.href,
        external: link.external ?? false,
      })),
    })),
  };
}
