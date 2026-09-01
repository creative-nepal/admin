import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";
import { USER_FILTER_VALUES, USER_SEARCH_FIELDS } from "./constants";

export const usersSearchParams = {
  search: parseAsString.withDefault(""),
  searchField: parseAsStringEnum([...USER_SEARCH_FIELDS]).withDefault("email"),
  filter: parseAsStringEnum([...USER_FILTER_VALUES]).withDefault("all"),
  sortBy: parseAsStringEnum(["name", "email", "createdAt"]).withDefault(
    "createdAt",
  ),
  sortDirection: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  pageIndex: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};
