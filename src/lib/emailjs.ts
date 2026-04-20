import emailjs from '@emailjs/browser';

/**
 * EmailJS configuration.
 * Replace these placeholders with your EmailJS dashboard values.
 * Public Key, Service ID and Template ID are all client-side safe.
 *
 * Template should accept these variables:
 *   - to_email
 *   - to_name
 *   - from_name
 *   - amount
 *   - currency
 *   - reference_number
 *   - transfer_type
 *   - date
 *   - description
 */
export const EMAILJS_CONFIG = {
  serviceId: 'service_ph4sg6t',
  templateId: 'template_3v576it',
  publicKey: 'SNDj7psNHtngwd6PS',
};

let initialized = false;
const ensureInit = () => {
  if (!initialized && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    initialized = true;
  }
};

export interface RecipientNotificationParams {
  to_email: string;
  to_name: string;
  from_name: string;
  amount: string;
  currency?: string;
  reference_number: string;
  transfer_type: string;
  date: string;
  description?: string;
}

export async function sendRecipientNotification(params: RecipientNotificationParams) {
  if (
    EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' ||
    EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY'
  ) {
    console.warn('[EmailJS] Skipping send — credentials not configured.');
    return { skipped: true };
  }
  ensureInit();
  return emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params as any);
}