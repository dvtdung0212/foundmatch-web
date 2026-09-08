import { NextResponse, type NextRequest } from "next/server";

// This file belongs under src/ so Next.js discovers it beside src/app.

const ACCESS_COOKIE = "foundmatch_web_access";
const REFRESH_COOKIE = "foundmatch_web_refresh";
const PROTECTED_ROUTES = [
  "/profile",
  "/reports/create",
  "/reports/new",
  "/claims",
  "/workspace",
  "/admin",
];

export async function middleware(request: NextRequest) {
  const loginRoute = request.nextUrl.pathname === "/login";
  const protectedRoute = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );
  let response = NextResponse.next({ request });
  let hasAccess = request.cookies.has(ACCESS_COOKIE);

  if (!hasAccess && request.cookies.has(REFRESH_COOKIE)) {
    const refreshed = await refreshSession(request);
    if (refreshed) {
      const accessToken = readSetCookieValue(refreshed, ACCESS_COOKIE);
      if (accessToken) {
        request.cookies.set(ACCESS_COOKIE, accessToken);
        hasAccess = true;
      }
      response = NextResponse.next({ request });
      for (const cookie of getSetCookieHeaders(refreshed.headers)) {
        response.headers.append("set-cookie", cookie);
      }
    } else {
      response.cookies.set(ACCESS_COOKIE, "", {
        expires: new Date(0),
        path: "/",
      });
      response.cookies.set(REFRESH_COOKIE, "", {
        expires: new Date(0),
        path: "/",
      });
    }
  }

  if (protectedRoute && !hasAccess) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    const redirectResponse = NextResponse.redirect(url);
    for (const cookie of getSetCookieHeaders(response.headers)) {
      redirectResponse.headers.append("set-cookie", cookie);
    }
    return redirectResponse;
  }

  if (loginRoute && hasAccess) {
    if (await hasValidSession(request)) {
      return redirectHome(request, response.headers);
    }

    if (request.cookies.has(REFRESH_COOKIE)) {
      const refreshed = await refreshSession(request);
      if (refreshed) {
        return redirectHome(request, refreshed.headers);
      }
    }

    response.cookies.set(ACCESS_COOKIE, "", {
      expires: new Date(0),
      path: "/",
    });
    response.cookies.set(REFRESH_COOKIE, "", {
      expires: new Date(0),
      path: "/",
    });
  }

  return response;
}

function redirectHome(request: NextRequest, headers: Headers): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  const response = NextResponse.redirect(url);
  for (const cookie of getSetCookieHeaders(headers)) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/public/users/me`, {
      cache: "no-store",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        "x-foundmatch-client": "web",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function refreshSession(request: NextRequest): Promise<Response | null> {
  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/public/web-auth/refresh`,
      {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
          "x-foundmatch-client": "web",
        },
        method: "POST",
      },
    );
    return response.ok ? response : null;
  } catch {
    return null;
  }
}

function getBackendUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.WEB_BACKEND_PROXY_TARGET ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
}

function getSetCookieHeaders(headers: Headers): string[] {
  const enhanced = headers as Headers & { getSetCookie?: () => string[] };
  const values = enhanced.getSetCookie?.();
  if (values?.length) return values;
  const combined = headers.get("set-cookie");
  return combined ? combined.split(/,(?=\s*[^;,=\s]+=[^;,]+)/) : [];
}

function readSetCookieValue(response: Response, name: string): string | null {
  for (const header of getSetCookieHeaders(response.headers)) {
    const match = new RegExp(`(?:^|\\s)${name}=([^;]+)`).exec(header);
    if (match?.[1]) return decodeURIComponent(match[1]);
  }
  return null;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
