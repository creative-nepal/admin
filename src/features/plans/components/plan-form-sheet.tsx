"use client";

import { toast } from "sonner";
import { Form } from "@/components/form/form";
import { NumberField } from "@/components/form/number-field";
import { SelectField } from "@/components/form/select-field";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { useSectorOptions } from "@/features/sectors/hooks/use-sectors";
import { useCreatePlan, useUpdatePlan } from "../mutations";
import { type PlanFormValues, planFormSchema } from "../schemas";
import { billingCycleOptions, type Plan } from "../types";

interface PlanFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: Plan;
}

export function PlanFormSheet({
  open,
  onOpenChange,
  plan,
}: PlanFormSheetProps) {
  const { t } = useTranslation();
  const sectorOptions = useSectorOptions();

  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const isEdit = Boolean(plan);

  const defaultValues: PlanFormValues = {
    sector: plan?.sector ?? "mart",
    key: plan?.key ?? "",
    name: plan?.name ?? "",
    price: plan ? plan.priceCents / 100 : 0,
    currency: plan?.currency ?? "NPR",
    billingCycle: plan?.billingCycle ?? "monthly",
    maxStaff: (plan?.featureFlags.maxStaff as number | undefined) ?? 5,
    maxProducts: (plan?.featureFlags.maxProducts as number | undefined) ?? 500,
  };

  async function handleSubmit(values: PlanFormValues) {
    const payload = {
      name: values.name,
      priceCents: Math.round(values.price * 100),
      currency: values.currency,
      billingCycle: values.billingCycle,
      featureFlags: {
        maxStaff: values.maxStaff,
        maxProducts: values.maxProducts,
      },
    };

    try {
      if (plan) {
        await updatePlan.mutateAsync({ planId: plan.id, ...payload });
        toast.success(t("ui.admin.plans.updated"));
      } else {
        await createPlan.mutateAsync({
          sector: values.sector,
          key: values.key,
          ...payload,
        });
        toast.success(t("ui.admin.plans.created"));
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save plan",
      );
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit plan" : "New plan"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Sector and key are immutable — they identify existing subscriptions."
              : "Plans are a global catalog, scoped to one sector."}
          </SheetDescription>
        </SheetHeader>
        <Form
          key={plan?.id ?? "new"}
          schema={planFormSchema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2"
        >
          {!isEdit && (
            <>
              <SelectField
                name="sector"
                label={t("ui.field.sector")}
                options={sectorOptions}
              />
              <TextField
                name="key"
                label={t("ui.admin.plans.key")}
                description={t("ui.admin.plans.keyHint")}
                placeholder="mart-pro"
              />
            </>
          )}
          <TextField
            name="name"
            label={t("ui.field.name")}
            placeholder="Mart Pro"
          />
          <NumberField
            name="price"
            label={t("ui.field.price")}
            description={t("ui.admin.plans.priceHint")}
            step="0.01"
          />
          <TextField
            name="currency"
            label={t("ui.field.currency")}
            placeholder="NPR"
          />
          <SelectField
            name="billingCycle"
            label={t("ui.admin.plans.billingCycle")}
            options={billingCycleOptions(t)}
          />
          <NumberField
            name="maxStaff"
            label={t("ui.admin.plans.maxStaff")}
            description={t("ui.admin.plans.maxStaffHint")}
          />
          <NumberField
            name="maxProducts"
            label={t("ui.admin.plans.maxProducts")}
          />
          <SheetFooter className="px-0">
            <Button type="submit">
              {isEdit ? "Save changes" : "Create plan"}
            </Button>
          </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
