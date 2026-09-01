"use client";

import { Fragment } from "react";
import { SearchInput } from "@/components/composed/search-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { USER_SEARCH_FIELDS, userFilters } from "../constants";
import type { UserFilter, UserSearchField } from "../types";

interface UsersFiltersProps {
  search: string;
  searchField: UserSearchField;
  filter: UserFilter;
  onSearchChange: (search: string) => void;
  onSearchFieldChange: (searchField: UserSearchField) => void;
  onFilterChange: (filter: UserFilter) => void;
}

export function UsersFilters({
  search,
  searchField,
  filter,
  onSearchChange,
  onSearchFieldChange,
  onFilterChange,
}: UsersFiltersProps) {
  const { t } = useTranslation();
  const filters = userFilters(t);
  const ungroupedFilters = filters.filter((option) => !option.group);
  const filterGroups = [
    ...new Set(
      filters.flatMap((option) => (option.group ? [option.group] : [])),
    ),
  ].map((label) => ({
    label,
    options: filters.filter((option) => option.group === label),
  }));

  return (
    <>
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder={
          searchField === "name"
            ? "Search by name (case-sensitive)..."
            : "Search by email..."
        }
        className="max-w-sm"
        endAddon={
          <Select
            value={searchField}
            onValueChange={(value) =>
              onSearchFieldChange(value as UserSearchField)
            }
            items={USER_SEARCH_FIELDS.map((field) => ({
              value: field,
              label: field === "email" ? "Email" : "Name",
            }))}
          >
            <SelectTrigger
              className="h-6 w-auto gap-1 rounded-none border-0 bg-transparent px-1.5 py-0 text-xs whitespace-nowrap shadow-none outline-none hover:bg-transparent focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent dark:hover:bg-transparent [&_svg:not([class*='size-'])]:size-3.5"
              aria-label={t("ui.admin.users.searchField")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-0">
              {USER_SEARCH_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {field === "email" ? "Email" : "Name"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
      <Select
        value={filter}
        onValueChange={(value) => onFilterChange(value as UserFilter)}
        items={filters}
      >
        <SelectTrigger
          className="w-40"
          aria-label={t("ui.admin.users.filterUsers")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ungroupedFilters.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {filterGroups.map((group) => (
            <Fragment key={group.label}>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </Fragment>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
