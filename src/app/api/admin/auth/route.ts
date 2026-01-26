import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
  setSessionCookie,
  clearSessionCookie,
  getSessionToken,
  createOTP,
  verifyOTP,
  setAdminPassword,
} from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, password, otp, newPassword } = body;

    if (action === "check") {
      const isValid = await validateSession();
      return NextResponse.json({ authenticated: isValid });
    }

    if (action === "login") {
      if (!password) {
        return NextResponse.json(
          { error: "Contraseña requerida" },
          { status: 400 }
        );
      }

      const isValid = await verifyPassword(password);

      if (!isValid) {
        return NextResponse.json(
          { error: "Contraseña incorrecta" },
          { status: 401 }
        );
      }

      const token = await createSession();
      await setSessionCookie(token);

      return NextResponse.json({ success: true });
    }

    if (action === "logout") {
      const token = await getSessionToken();
      if (token) {
        await deleteSession(token);
      }
      await clearSessionCookie();
      return NextResponse.json({ success: true });
    }

    if (action === "request_otp") {
      const isAuthenticated = await validateSession();
      if (!isAuthenticated) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        return NextResponse.json(
          { error: "Email de admin no configurado" },
          { status: 400 }
        );
      }

      const otpCode = await createOTP(adminEmail);

      try {
        await sendOTPEmail(adminEmail, otpCode);
      } catch {
        console.log("SMTP not configured, OTP:", otpCode);
      }

      const maskedEmail = adminEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3");
      return NextResponse.json({ success: true, email: maskedEmail });
    }

    if (action === "change_password") {
      const isAuthenticated = await validateSession();
      if (!isAuthenticated) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        return NextResponse.json(
          { error: "Email de admin no configurado" },
          { status: 400 }
        );
      }

      const isValidOTP = await verifyOTP(adminEmail, otp);
      if (!isValidOTP) {
        return NextResponse.json(
          { error: "Código inválido o expirado" },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 6 caracteres" },
          { status: 400 }
        );
      }

      const success = await setAdminPassword(newPassword);
      if (!success) {
        return NextResponse.json(
          { error: "Error al guardar la contraseña" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
