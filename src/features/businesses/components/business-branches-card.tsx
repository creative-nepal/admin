"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { businessBranchesQueryOptions } from "../queries";

export function BusinessBranchesCard({ businessId }: { businessId: string }) {
  const { t } = useTranslation();
  const { data } = useQuery(businessBranchesQueryOptions(businessId));

  const rows = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ui.admin.businesses.branchesTitle")}</CardTitle>
        <CardDescription>
          {t("ui.admin.businesses.branchesDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ui.field.name")}</TableHead>
              <TableHead>{t("ui.field.code")}</TableHead>
              <TableHead>{t("ui.field.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">
                  {branch.name}
                  {branch.isDefault && (
                    <Badge variant="outline" className="ml-2">
                      {t("ui.admin.businesses.defaultBranch")}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="tabular-nums">
                  {branch.code ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={branch.isActive ? "outline" : "secondary"}>
                    {t(
                      `common.status.${branch.isActive ? "active" : "closed"}`,
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
