import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";

const STATE_COOKIE = "mp_oauth_state";
const AUTH_URL = "https://auth.mercadopago.com.ar/authorization";

export async function GET() {
  const isValid = await validateSession();
  if (!isValid) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clientId = process.env.MP_CLIENT_ID;
  const redirectUri = process.env.MP_OAUTH_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error:
          "MercadoPago no está configurado en el servidor. Falta MP_CLIENT_ID o MP_OAUTH_REDIRECT_URI.",
      },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("platform_id", "mp");
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", redirectUri);

  return NextResponse.redirect(url.toString());
}
