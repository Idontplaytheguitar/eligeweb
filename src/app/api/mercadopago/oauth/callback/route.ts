import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";

const STATE_COOKIE = "mp_oauth_state";
const TOKEN_URL = "https://api.mercadopago.com/oauth/token";

function redirectToConfig(appUrl: string, params: Record<string, string>) {
  const url = new URL(`${appUrl}/admin/configuracion`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.hash = "mercadopago";
  return NextResponse.redirect(url.toString());
}

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const isValid = await validateSession();
  if (!isValid) {
    return redirectToConfig(appUrl, { mp_error: "unauthorized" });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return redirectToConfig(appUrl, { mp_error: "invalid_state" });
  }

  const clientId = process.env.MP_CLIENT_ID;
  const clientSecret = process.env.MP_CLIENT_SECRET;
  const redirectUri = process.env.MP_OAUTH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    return redirectToConfig(appUrl, { mp_error: "server_misconfig" });
  }

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("MP token exchange failed", res.status, text);
      return redirectToConfig(appUrl, { mp_error: "token_exchange_failed" });
    }

    const data = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      public_key?: string;
      user_id?: number | string;
      live_mode?: boolean;
    };

    let accountEmail: string | null = null;
    let accountNickname: string | null = null;
    try {
      const userRes = await fetch("https://api.mercadopago.com/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (userRes.ok) {
        const u = (await userRes.json()) as { email?: string; nickname?: string };
        accountEmail = u.email ?? null;
        accountNickname = u.nickname ?? null;
      }
    } catch (e) {
      console.warn("Could not fetch MP /users/me", e);
    }

    await prisma.adminConfig.upsert({
      where: { id: "main" },
      update: {
        mpUserId: data.user_id ? String(data.user_id) : null,
        mpAccessToken: encrypt(data.access_token),
        mpRefreshToken: encrypt(data.refresh_token),
        mpPublicKey: data.public_key ?? null,
        mpTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
        mpConnectedAt: new Date(),
        mpAccountEmail: accountEmail,
        mpAccountNickname: accountNickname,
        mpLiveMode: data.live_mode ?? true,
      },
      create: {
        id: "main",
        mpUserId: data.user_id ? String(data.user_id) : null,
        mpAccessToken: encrypt(data.access_token),
        mpRefreshToken: encrypt(data.refresh_token),
        mpPublicKey: data.public_key ?? null,
        mpTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
        mpConnectedAt: new Date(),
        mpAccountEmail: accountEmail,
        mpAccountNickname: accountNickname,
        mpLiveMode: data.live_mode ?? true,
      },
    });

    return redirectToConfig(appUrl, { mp_ok: "1" });
  } catch (err) {
    console.error("MP OAuth callback error", err);
    return redirectToConfig(appUrl, { mp_error: "unexpected" });
  }
}
