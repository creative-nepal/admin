"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmailField } from "@/components/form/email-field";
import { Form } from "@/components/form/form";
import { PasswordField } from "@/components/form/password-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/features/i18n/hooks/use-translation";
import { authClient } from "@/lib/auth-client";
import { type LoginInput, loginSchema } from "../schemas";

export function LoginView() {
  const { t } = useTranslation();

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(values: LoginInput) {
    setError(null);
    setPending(true);

    const { error: signInError } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    setPending(false);

    if (signInError) {
      setError(signInError.message ?? "Unable to sign in");
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("ui.auth.signInTitle")}</CardTitle>
          <CardDescription>{t("ui.auth.signInSubtitleAdmin")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            schema={loginSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <EmailField name="email" label={t("ui.field.email")} />
            <PasswordField name="password" label={t("ui.field.password")} />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
