import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

export const contentSearchParams = {
  status: parseAsStringEnum(["draft", "published", "archived"]),
  search: parseAsString.withDefault(""),
  sortBy: parseAsStringEnum([
    "slug",
    "status",
    "publishedAt",
    "updatedAt",
    "createdAt",
  ]).withDefault("updatedAt"),
  sortDirection: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};
