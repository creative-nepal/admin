import { NextResponse } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";

function safeSlug(value: string | null): string {
  return value && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : "";
}

export async function GET(request: Request): Promise<NextResponse> {
  const cookieHeader = request.headers.get("cookie") ?? "";

  if (!cookieHeader.includes(`${SESSION_COOKIE}=`)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const webUrl = process.env.WEB_URL ?? "http://localhost:3000";
  const secret = process.env.CONTENT_PREVIEW_SECRET;

  if (!secret) {
    return new NextResponse(
      "Preview is not configured: set CONTENT_PREVIEW_SECRET on the admin app and the API.",
      { status: 501 },
    );
  }

  const slug = safeSlug(new URL(request.url).searchParams.get("slug"));
  const target = new URL("/api/preview", webUrl);
  target.searchParams.set("secret", secret);
  target.searchParams.set("slug", slug);

  return NextResponse.redirect(target);
}
