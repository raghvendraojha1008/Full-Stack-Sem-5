// A JWT looks like HEADER.PAYLOAD.SIGNATURE (three base64 chunks joined by dots).
// This function decodes just the PAYLOAD part so we can show students what's
// actually inside a real Firebase-issued token (userId, expiry, etc).
// This is for DISPLAY ONLY - it does not verify the signature. Real
// verification always happens on a trusted backend server.

export function decodeJwtPayload(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    // JWTs use base64url, so we normalize it before atob() can decode it.
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch (err) {
    return null;
  }
}
