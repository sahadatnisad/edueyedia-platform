/**
 * Fetches a file through the protected /files/download HTTP action (with the
 * signed-in user's bearer token) and saves it to the user's device.
 *
 * The URL is a single-use, 5-minute token minted server-side only after
 * entitlement was verified — see convex/fileActions.ts and convex/http.ts.
 */
export async function fetchAndSaveDownload(opts: {
  convexUrl: string;
  authToken: string | null;
  params: Record<string, string>;
  fallbackFilename: string;
}): Promise<void> {
  if (!opts.authToken) {
    throw new Error("Sign in again to download this file.");
  }
  const query = new URLSearchParams(opts.params).toString();
  const response = await fetch(
    `${opts.convexUrl}/files/download?${query}`,
    { headers: { Authorization: `Bearer ${opts.authToken}` } },
  );
  if (!response.ok) {
    let message = "This download could not be authorized.";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = opts.fallbackFilename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;
