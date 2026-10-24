import toast from 'react-hot-toast';

export interface ShareOptions {
  title: string;
  text?: string;
  url?: string;
  phone?: string;
}

/**
 * Normalizes phone numbers for WhatsApp link generation.
 * If 10 digits, prepends country code 91 (India).
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/**
 * Opens WhatsApp with pre-filled message and optional destination number.
 */
export function shareToWhatsApp({ title, text, url, phone }: ShareOptions): void {
  const parts: string[] = [];
  if (title) parts.push(`*${title}*`);
  if (text) parts.push(text);
  if (url) parts.push(`\n🔗 ${url}`);

  const message = parts.join('\n\n');
  const encoded = encodeURIComponent(message);
  const cleanPhone = cleanPhoneNumber(phone);

  const waUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;

  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Uses Web Share API on supported devices (Android / iOS / supported desktop browsers)
 * with graceful fallback to copying link.
 */
export async function shareNative({ title, text, url }: ShareOptions): Promise<boolean> {
  const shareData: ShareData = {
    title,
    text: text || title,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
  };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        copyToClipboard(shareData.url || shareData.text || '', 'Link copied to clipboard!');
      }
      return false;
    }
  }

  // Fallback
  copyToClipboard(shareData.url || shareData.text || '', 'Link copied to clipboard!');
  return false;
}

/**
 * Copies text to clipboard with toast notification.
 */
export async function copyToClipboard(text: string, successMessage = 'Copied to clipboard!'): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast.success(successMessage);
    return true;
  } catch {
    toast.error('Could not copy to clipboard');
    return false;
  }
}

/**
 * Opens email client with pre-filled subject and body.
 */
export function shareToEmail({ subject, body }: { subject: string; body: string }): void {
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}
