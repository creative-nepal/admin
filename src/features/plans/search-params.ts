import { parseAsInteger, parseAsStringEnum } from "nuqs";
import { SECTORS } from "@/features/businesses/types";

export const plansSearchParams = {
  sector: parseAsStringEnum([...SECTORS]),
  sortBy: parseAsStringEnum([
    "name",
    "sector",
    "priceCents",
    "isActive",
    "createdAt",
  ]).withDefault("priceCents"),
  sortDirection: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};
