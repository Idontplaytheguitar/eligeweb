import crypto from "crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const raw = process.env.MP_TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "MP_TOKEN_ENCRYPTION_KEY no está configurada. Generala con: openssl rand -hex 32"
    );
  }
  const key = Buffer.from(raw, "hex");
  if (key.length !== 32) {
    throw new Error("MP_TOKEN_ENCRYPTION_KEY debe ser 32 bytes en hex (64 caracteres)");
  }
  return key;
}

export function encrypt(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), enc.toString("hex")].join(":");
}

export function decrypt(payload: string): string {
  const parts = payload.split(":");
  if (parts.length !== 3) throw new Error("Payload cifrado inválido");
  const [ivHex, tagHex, encHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const enc = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}
