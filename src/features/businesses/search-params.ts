import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";
import { BUSINESS_STATUSES, SECTORS } from "./types";

export const businessesSearchParams = {
  search: parseAsString.withDefault(""),
  sector: parseAsStringEnum([...SECTORS]),
  status: parseAsStringEnum([...BUSINESS_STATUSES]),
  sortBy: parseAsStringEnum([
    "legalName",
    "sector",
    "status",
    "createdAt",
  ]).withDefault("createdAt"),
  sortDirection: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};
