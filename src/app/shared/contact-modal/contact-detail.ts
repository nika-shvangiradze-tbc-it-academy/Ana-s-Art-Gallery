/** Single source for contact modal + Buy / Contact triggers (digits only after wa.me/). */
export const CONTACT_EMAIL = 'tamarkajaia308@gmail.com';

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** E.164 digits without leading + — for https://wa.me/995XXXXXXXXX */
export const CONTACT_WHATSAPP_E164_DIGITS = '995574067141';

export const CONTACT_WHATSAPP_URL = `https://wa.me/${CONTACT_WHATSAPP_E164_DIGITS}`;

export const CONTACT_PHONE_DISPLAY = '+995 574 06 71 41';

/** Compact E.164 for clipboard (spaces removed). */
export const CONTACT_PHONE_CLIPBOARD = `+${CONTACT_WHATSAPP_E164_DIGITS}`;
