import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

function getBackendBase(): string {
  const raw = process.env.API_URL?.trim() || "http://localhost:3001";
  return raw.replace(/\/$/, "");
}

/** Bind the Nest session cookie to the Vercel host (same-origin browser traffic). */
function adaptSetCookie(cookie: string, secure: boolean): string {
  let next = cookie
    .replace(/;\s*Domain=[^;]*/gi, "")
    .replace(/;\s*SameSite=[^;]*/gi, "")
    .replace(/;\s*Secure/gi, "");

  next += "; SameSite=Lax";
  if (secure) {
    next += "; Secure";
  }
  return next;
}

function collectSetCookies(upstream: Headers): string[] {
  if (typeof upstream.getSetCookie === "function") {
    const cookies = upstream.getSetCookie();
    if (cookies.length > 0) return cookies;
  }

  const single = upstream.get("set-cookie");
  return single ? [single] : [];
}

async function proxy(request: NextRequest, path: string[]) {
  const backend = getBackendBase();
  const targetPath = path.join("/");
  const url = `${backend}/api/${targetPath}${request.nextUrl.search}`;
  const secure = request.nextUrl.protocol === "https:";

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, init);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upstream request failed";
    return NextResponse.json(
      {
        message: `API proxy could not reach ${backend}: ${message}`,
      },
      { status: 502 }
    );
  }

  const body = await upstream.arrayBuffer();
  const response = new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });

  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "set-cookie") return;
    if (HOP_BY_HOP.has(lower)) return;
    response.headers.set(key, value);
  });

  for (const cookie of collectSetCookies(upstream.headers)) {
    response.headers.append("Set-Cookie", adaptSetCookie(cookie, secure));
  }

  return response;
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function OPTIONS(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}
