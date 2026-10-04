import toast from 'react-hot-toast';

/**
 * Turns anything thrown by axios / fetch / the app into a sentence a person can
 * act on. Falls back to a caller-supplied default so the UI never shows a raw
 * status code or "[object Object]".
 */
export function readableError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) return fallback;

  // Axios: server-sent message wins, because our controllers throw meaningful text.
  const candidate = error as {
    response?: { data?: { message?: string; error?: string }; statusText?: string };
    data?: { message?: string };
    message?: string;
  };

  const fromBody = candidate.response?.data?.message ?? candidate.response?.data?.error;
  if (typeof fromBody === 'string' && fromBody.trim()) return fromBody.trim();

  const direct = candidate.data?.message ?? candidate.message;
  if (typeof direct === 'string' && direct.trim()) return direct.trim();

  if (error instanceof Error && error.message && error.message !== 'Network Error') {
    // Axios renders a bare "Request failed with status code 500" when the
    // server replies with a non-JSON error page. That tells the user nothing,
    // so spell out what we do know.
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status && /status code \d+/.test(error.message)) {
      return (
        `The server could not complete this request (HTTP ${status}). ` +
        'This is usually a server-side problem rather than anything you did - please try again, and check the backend logs if it keeps happening.'
      );
    }
    return error.message;
  }

  if (error instanceof Error && error.message === 'Network Error') {
    return 'Cannot reach the server. Check your connection and try again.';
  }

  return fallback;
}

/** Shows a readable error as a toast and still logs the original for debugging. */
export function notifyError(error: unknown, fallback?: string): void {
  console.error(error);
  toast.error(readableError(error, fallback));
}

/** Guard for actions that need a selected conversation. */
export function requireSelection(what: string): boolean {
  toast.error(what);
  return false;
}
