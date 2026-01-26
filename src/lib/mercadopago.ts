import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

export const preference = new Preference(client);
export const payment = new Payment(client);

export interface CreatePreferenceParams {
  workshopId: string;
  workshopTitle: string;
  price: number;
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
  const paymentData = await payment.get({ id: paymentId });
  return paymentData;
}
