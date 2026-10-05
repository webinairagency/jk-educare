// WhatsApp messages the admin can send to students from the admin page. Pure helpers.

export type MsgLang = "both" | "ta" | "en";
export const LOGIN_URL = "https://www.jkeducareservices.com/login";
export const HELP_PHONE = "98424 63437";

/** "Link your Google account" message with the roll number, code and step-by-step instructions. */
export function linkMessage(p: { name: string; regNo: string; code: string; lang: MsgLang }): string {
  const en = [
    `Hello ${p.name}, this is JK Edu-Care Services (JK Sir's free +2 online classes).`,
    "",
    "Your class portal login:",
    `Roll number: ${p.regNo}`,
    `Access code: ${p.code} (works only once)`,
    "",
    "Please do these steps (takes 1 minute):",
    `1. Open ${LOGIN_URL} in Chrome`,
    '2. Tap "Sign in with Google" and choose your Gmail account',
    '3. Type your roll number and access code, then tap "Link my account"',
    '4. Your dashboard opens. Tap the red LIVE card to join the class.',
    "",
    `Use the same Gmail every time. Need help? WhatsApp ${HELP_PHONE}.`,
  ].join("\n");

  const ta = [
    `வணக்கம் ${p.name}, இது JK Edu-Care Services (JK சாரின் இலவச +2 ஆன்லைன் வகுப்புகள்).`,
    "",
    "உங்கள் வகுப்பு போர்ட்டல் விவரங்கள்:",
    `பதிவு எண்: ${p.regNo}`,
    `குறியீடு: ${p.code} (ஒருமுறை மட்டும் பயன்படுத்தலாம்)`,
    "",
    "இவற்றைச் செய்யுங்கள் (1 நிமிடம்):",
    `1. ${LOGIN_URL} ஐ Chrome-இல் திறக்கவும்`,
    '2. "Sign in with Google" தட்டி உங்கள் Gmail-ஐத் தேர்ந்தெடுக்கவும்',
    '3. பதிவு எண்ணையும் குறியீட்டையும் உள்ளிட்டு "Link my account" தட்டவும்',
    '4. உங்கள் dashboard திறக்கும். வகுப்பில் சேர சிவப்பு "நேரலையில்" அட்டையைத் தட்டவும்.',
    "",
    `ஒவ்வொரு முறையும் அதே Gmail-ஐப் பயன்படுத்தவும். உதவிக்கு: ${HELP_PHONE}`,
  ].join("\n");

  if (p.lang === "en") return en;
  if (p.lang === "ta") return ta;

  // English + Tamil together: each step in both languages, so the message stays short
  return [
    `Hello ${p.name} 🙏 வணக்கம்!`,
    "JK Edu-Care Services – free +2 online classes.",
    "",
    `Roll number / பதிவு எண்: ${p.regNo}`,
    `Access code / குறியீடு: ${p.code} (works once / ஒருமுறை)`,
    "",
    "Do these steps / இவற்றைச் செய்யுங்கள் (1 min):",
    "1. Open in Chrome / Chrome-இல் திறக்கவும்:",
    LOGIN_URL,
    '2. Tap "Sign in with Google", choose your Gmail',
    '   "Sign in with Google" தட்டி Gmail-ஐத் தேர்ந்தெடுக்கவும்',
    '3. Enter roll number + code, tap "Link my account"',
    '   பதிவு எண், குறியீடு உள்ளிட்டு "Link my account" தட்டவும்',
    '4. Dashboard opens: tap the red LIVE card to join the class',
    '   Dashboard திறக்கும்: சிவப்பு "நேரலையில்" அட்டையைத் தட்டவும்',
    "",
    "Use the same Gmail every time / ஒவ்வொரு முறையும் அதே Gmail.",
    `Help / உதவி: ${HELP_PHONE}`,
  ].join("\n");
}

/** Digits for a wa.me link: a 10-digit Indian mobile gets 91 in front. "" if it is not a usable number. */
export function waNumber(raw: string): string {
  const d = (raw || "").replace(/[^0-9]/g, "");
  if (d.length === 10) return "91" + d;
  if (d.length === 12 && d.startsWith("91")) return d;
  if (d.length === 11 && d.startsWith("0")) return "91" + d.slice(1);
  return "";
}

export function whatsappUrl(phone: string, text: string): string {
  const n = waNumber(phone);
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : "";
}
