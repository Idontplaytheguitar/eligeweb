import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { prisma } from "./prisma";
import { decrypt, encrypt } from "./crypto";

const OAUTH_TOKEN_URL = "https://api.mercadopago.com/oauth/token";
const REFRESH_BUFFER_MS = 10 * 60 * 1000; // refresh 10 min before expiry

export class MercadoPagoNotConnectedError extends Error {
  constructor() {
    super("MercadoPago no está conectado. La dueña debe conectar su cuenta desde el panel.");
    this.name = "MercadoPagoNotConnectedError";
  }
}

async function getSellerAccessToken(): Promise<string> {
  const cfg = await prisma.adminConfig.findUnique({ where: { id: "main" } });
  if (!cfg?.mpAccessToken || !cfg?.mpRefreshToken) {
    throw new MercadoPagoNotConnectedError();
  }

  const needsRefresh =
    cfg.mpTokenExpiresAt && cfg.mpTokenExpiresAt.getTime() - Date.now() < REFRESH_BUFFER_MS;

  if (needsRefresh) {
    try {
      const refreshToken = decrypt(cfg.mpRefreshToken);
      const res = await fetch(OAUTH_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: process.env.MP_CLIENT_ID ?? "",
          client_secret: process.env.MP_CLIENT_SECRET ?? "",
          refresh_token: refreshToken,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          access_token: string;
          refresh_token: string;
          expires_in: number;
          public_key?: string;
          user_id?: number | string;
          live_mode?: boolean;
        };
        await prisma.adminConfig.update({
          where: { id: "main" },
          data: {
            mpAccessToken: encrypt(data.access_token),
            mpRefreshToken: encrypt(data.refresh_token),
            mpTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
            mpPublicKey: data.public_key ?? cfg.mpPublicKey,
            mpLiveMode: data.live_mode ?? cfg.mpLiveMode,
          },
        });
        return data.access_token;
      }
      console.error("MP token refresh failed", res.status, await res.text());
    } catch (err) {
      console.error("MP token refresh error", err);
    }
  }

  return decrypt(cfg.mpAccessToken);
}

async function getSellerClient(): Promise<MercadoPagoConfig> {
  const token = await getSellerAccessToken();
  return new MercadoPagoConfig({ accessToken: token });
}

export interface CreatePreferenceParams {
  workshopId: string;
  workshopTitle: string;
  price: number; // stored in cents
  buyerEmail: string;
  buyerName: string;
}

export async function createPreference({
  workshopId,
  workshopTitle,
  price,
  buyerEmail,
  buyerName,
}: CreatePreferenceParams) {
  const client = await getSellerClient();
  const preference = new Preference(client);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const preferenceData = await preference.create({
    body: {
      items: [
        {
          id: workshopId,
          title: workshopTitle,
          quantity: 1,
          unit_price: price / 100,
          currency_id: "ARS",
        },
      ],
      payer: {
        email: buyerEmail,
        name: buyerName,
      },
      back_urls: {
        success: `${appUrl}/talleres/success`,
        failure: `${appUrl}/talleres`,
        pending: `${appUrl}/talleres`,
      },
      auto_return: "approved",
      notification_url: `${appUrl}/api/checkout/webhook`,
      external_reference: workshopId,
      statement_descriptor: "ELIGE Talleres",
    },
  });

  return preferenceData;
}

export async function getPayment(paymentId: string) {
  const client = await getSellerClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

export async function isMercadoPagoConnected(): Promise<boolean> {
  const cfg = await prisma.adminConfig.findUnique({ where: { id: "main" } });
  return !!(cfg?.mpAccessToken && cfg?.mpRefreshToken);
}

export interface MercadoPagoConnectionInfo {
  connected: boolean;
  accountEmail?: string | null;
  accountNickname?: string | null;
  connectedAt?: Date | null;
  liveMode?: boolean;
}

export async function getMercadoPagoConnectionInfo(): Promise<MercadoPagoConnectionInfo> {
  const cfg = await prisma.adminConfig.findUnique({ where: { id: "main" } });
  if (!cfg?.mpAccessToken) return { connected: false };
  return {
    connected: true,
    accountEmail: cfg.mpAccountEmail,
    accountNickname: cfg.mpAccountNickname,
    connectedAt: cfg.mpConnectedAt,
    liveMode: cfg.mpLiveMode,
  };
}
