const sanitizePhone = (value: string): string => value.replace(/\D/g, "");

const rawWhatsAppPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
const rawContactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? rawWhatsAppPhone;

const normalizedWhatsAppPhone = sanitizePhone(rawWhatsAppPhone || rawContactPhone);
const normalizedContactPhone = sanitizePhone(rawContactPhone);

export const CONTACT_PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY ?? rawContactPhone;

export const CONTACT_PHONE_TEL = normalizedContactPhone
  ? `+${normalizedContactPhone}`
  : "";

export const WHATSAPP_PHONE = normalizedWhatsAppPhone;

export const buildWhatsAppUrl = (message: string): string => {
  if (!WHATSAPP_PHONE) return "#";
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};
