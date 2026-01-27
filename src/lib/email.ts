import nodemailer from "nodemailer";

const FROM_EMAIL = process.env.SMTP_USER || "contacto@estudioelige.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "contacto@estudioelige.com";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP not configured");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port || "465"),
    secure: true,
    auth: { user, pass },
  });
}

export interface ContactEmailParams {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  area?: string;
  message: string;
}

export async function sendContactEmail(params: ContactEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("SMTP not configured, skipping contact email");
    return;
  }

  const { name, email, phone, whatsapp, area, message } = params;

  try {
    await transporter.sendMail({
      from: `"ELIGE - Estudio Legal" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `📩 Nueva consulta de ${name}${area ? ` - ${area}` : ""}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 24px; text-align: center; }
            .header h1 { margin: 0; color: white; font-size: 20px; }
            .content { padding: 24px; }
            .detail { margin-bottom: 16px; }
            .detail-label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .detail-value { color: #1e293b; font-weight: 500; margin-top: 4px; font-size: 16px; }
            .message-box { background: #f1f5f9; border-radius: 8px; padding: 16px; margin-top: 20px; }
            .message-box h3 { margin: 0 0 12px 0; color: #1e3a5f; font-size: 14px; }
            .message-box p { margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap; }
            .footer { text-align: center; padding: 16px; color: #64748b; font-size: 12px; background: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📩 Nueva Consulta desde la Web</h1>
            </div>
            <div class="content">
              <div class="detail">
                <div class="detail-label">Nombre</div>
                <div class="detail-value">${name}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Email</div>
                <div class="detail-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              ${phone ? `
                <div class="detail">
                  <div class="detail-label">Teléfono</div>
                  <div class="detail-value"><a href="tel:${phone}">${phone}</a></div>
                </div>
              ` : ""}
              ${whatsapp ? `
                <div class="detail">
                  <div class="detail-label">WhatsApp</div>
                  <div class="detail-value"><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}">${whatsapp}</a></div>
                </div>
              ` : ""}
              ${area ? `
                <div class="detail">
                  <div class="detail-label">Área de consulta</div>
                  <div class="detail-value">${area}</div>
                </div>
              ` : ""}
              <div class="message-box">
                <h3>Mensaje</h3>
                <p>${message.replace(/\n/g, "<br>")}</p>
              </div>
            </div>
            <div class="footer">
              ELIGE - Estudio Legal Integral García Eldik
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
}

export interface PurchaseEmailParams {
  to: string;
  name: string;
  workshopTitle: string;
  downloadUrl: string;
}

export async function sendPurchaseEmail(params: PurchaseEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("SMTP not configured, skipping purchase email");
    return;
  }

  const { to, name, workshopTitle, downloadUrl } = params;

  try {
    await transporter.sendMail({
      from: `"ELIGE - Estudio Legal" <${FROM_EMAIL}>`,
      to,
      subject: `✅ Tu compra de "${workshopTitle}" está lista`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #059669, #10b981); padding: 32px; text-align: center; }
            .header h1 { margin: 0; color: white; font-size: 24px; }
            .content { padding: 32px; }
            .workshop-card { background: #f1f5f9; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center; }
            .workshop-card h3 { color: #1e3a5f; margin: 0 0 8px 0; font-size: 18px; }
            .download-link { display: inline-block; background: linear-gradient(135deg, #1e3a5f, #2563eb); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; margin-top: 20px; }
            .footer { text-align: center; padding: 24px; color: #64748b; font-size: 14px; background: #f8fafc; }
            .note { background: #fef3c7; border-radius: 8px; padding: 12px 16px; margin-top: 20px; font-size: 14px; color: #92400e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por tu compra!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Tu pago fue procesado correctamente. Ya podés acceder al material del taller.</p>
              
              <div class="workshop-card">
                <h3>${workshopTitle}</h3>
                <a href="${downloadUrl}" class="download-link">
                  📥 Acceder al material
                </a>
              </div>
              
              <div class="note">
                ⏰ Este enlace expira en 7 días. Guardá el material en un lugar seguro.
              </div>
              
              <p style="margin-top: 24px;">Si tenés alguna consulta, no dudes en contactarnos.</p>
              <p><strong>ELIGE - Estudio Legal</strong></p>
            </div>
            <div class="footer">
              ELIGE - Estudio Legal Integral García Eldik
            </div>
          </div>
        </body>
        </html>
      `,
    });

    await transporter.sendMail({
      from: `"ELIGE - Estudio Legal" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `💰 Nueva venta: ${workshopTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #059669, #10b981); padding: 24px; text-align: center; }
            .header h1 { margin: 0; color: white; font-size: 20px; }
            .content { padding: 24px; }
            .detail { margin-bottom: 12px; }
            .detail-label { color: #64748b; font-size: 14px; }
            .detail-value { color: #1e293b; font-weight: 500; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Nueva Venta de Taller</h1>
            </div>
            <div class="content">
              <div class="detail">
                <div class="detail-label">Taller</div>
                <div class="detail-value">${workshopTitle}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Comprador</div>
                <div class="detail-value">${name}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Email</div>
                <div class="detail-value"><a href="mailto:${to}">${to}</a></div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error sending purchase email:", error);
    throw error;
  }
}

export async function sendOTPEmail(to: string, otp: string) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("SMTP not configured, OTP:", otp);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"ELIGE - Estudio Legal" <${FROM_EMAIL}>`,
      to,
      subject: `🔐 Tu código de verificación: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
            .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 24px; }
            .header h1 { margin: 0; color: white; font-size: 20px; }
            .content { padding: 32px; }
            .otp-code { background: #f1f5f9; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 12px; color: #1e3a5f; margin: 20px 0; }
            .footer { color: #64748b; font-size: 14px; padding: 0 24px 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Código de Verificación</h1>
            </div>
            <div class="content">
              <p>Tu código de verificación es:</p>
              <div class="otp-code">${otp}</div>
              <p class="footer">Este código expira en 10 minutos.<br>Si no solicitaste este código, ignorá este email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
}

export interface BookingConfirmationParams {
  to: string;
  name: string;
  date: string;
  time: string;
  meetLink?: string;
}

export async function sendBookingConfirmation(params: BookingConfirmationParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("SMTP not configured, skipping booking confirmation");
    return;
  }

  const { to, name, date, time, meetLink } = params;
  const dateObj = new Date(date + "T12:00:00");
  const formattedDate = dateObj.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    await transporter.sendMail({
      from: `"ELIGE - Estudio Legal" <${FROM_EMAIL}>`,
      to,
      subject: `📅 Consulta agendada - ${formattedDate} a las ${time}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 32px; text-align: center; }
            .header h1 { margin: 0; color: white; font-size: 24px; }
            .content { padding: 32px; }
            .meeting-card { background: #f1f5f9; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center; }
            .meeting-card h3 { color: #1e3a5f; margin: 0 0 8px 0; font-size: 18px; }
            .meeting-card p { color: #64748b; margin: 4px 0; }
            .meet-link { display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; margin-top: 16px; }
            .footer { text-align: center; padding: 24px; color: #64748b; font-size: 14px; background: #f8fafc; }
            .note { background: #dbeafe; border-radius: 8px; padding: 12px 16px; margin-top: 20px; font-size: 14px; color: #1e40af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 ¡Consulta Agendada!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${name}</strong>,</p>
              <p>Tu consulta fue agendada correctamente. Te esperamos en la fecha y hora indicadas.</p>
              
              <div class="meeting-card">
                <h3>Detalles de la reunión</h3>
                <p><strong>${formattedDate}</strong></p>
                <p><strong>${time} hs</strong> (Argentina)</p>
                ${meetLink ? `
                  <a href="${meetLink}" class="meet-link">
                    🎥 Unirse a Google Meet
                  </a>
                ` : ""}
              </div>
              
              ${meetLink ? `
                <div class="note">
                  💡 Guardá este email. El link de la videollamada es: <a href="${meetLink}">${meetLink}</a>
                </div>
              ` : `
                <div class="note">
                  💡 Te contactaremos para confirmar los detalles de la reunión.
                </div>
              `}
              
              <p style="margin-top: 24px;">Si necesitás reprogramar, respondé a este email.</p>
              <p><strong>ELIGE - Estudio Legal</strong></p>
            </div>
            <div class="footer">
              ELIGE - Estudio Legal Integral García Eldik
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error sending booking confirmation:", error);
    throw error;
  }
}

export interface BookingNotificationParams {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  notes?: string;
}

export async function sendBookingNotification(params: BookingNotificationParams) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log("SMTP not configured, skipping booking notification");
    return;
  }

  const { name, email, phone, date, time, notes } = params;
  const dateObj = new Date(date + "T12:00:00");
  const formattedDate = dateObj.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  try {
    await transporter.sendMail({
      from: `"ELIGE - Estudio Legal" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `📅 Nueva consulta agendada - ${name} - ${formattedDate} ${time}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 24px; text-align: center; }
            .header h1 { margin: 0; color: white; font-size: 20px; }
            .content { padding: 24px; }
            .detail { margin-bottom: 16px; }
            .detail-label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .detail-value { color: #1e293b; font-weight: 500; margin-top: 4px; font-size: 16px; }
            .notes-box { background: #f1f5f9; border-radius: 8px; padding: 16px; margin-top: 20px; }
            .notes-box h3 { margin: 0 0 12px 0; color: #1e3a5f; font-size: 14px; }
            .notes-box p { margin: 0; color: #334155; line-height: 1.6; }
            .footer { text-align: center; padding: 16px; color: #64748b; font-size: 12px; background: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Nueva Consulta Agendada</h1>
            </div>
            <div class="content">
              <div class="detail">
                <div class="detail-label">Cliente</div>
                <div class="detail-value">${name}</div>
              </div>
              <div class="detail">
                <div class="detail-label">Fecha y hora</div>
                <div class="detail-value">${formattedDate} - ${time} hs</div>
              </div>
              <div class="detail">
                <div class="detail-label">Email</div>
                <div class="detail-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              ${phone ? `
                <div class="detail">
                  <div class="detail-label">Teléfono</div>
                  <div class="detail-value"><a href="tel:${phone}">${phone}</a></div>
                </div>
              ` : ""}
              ${notes ? `
                <div class="notes-box">
                  <h3>Notas del cliente</h3>
                  <p>${notes.replace(/\n/g, "<br>")}</p>
                </div>
              ` : ""}
            </div>
            <div class="footer">
              ELIGE - Estudio Legal Integral García Eldik
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error sending booking notification:", error);
    throw error;
  }
}
