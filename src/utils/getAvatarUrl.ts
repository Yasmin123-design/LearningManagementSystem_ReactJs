const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Facebook-style default avatar (blue silhouette)
const DEFAULT_AVATAR =
  "https://static.xx.fbcdn.net/rsrc.php/v4/yo/r/UlIqmHJn-SK.gif";

/**
 * Returns a resolved avatar URL.
 * - If the avatar is already an absolute URL (e.g. OAuth providers), use it as-is.
 * - If it's a relative path (uploaded locally), prepend the API base URL.
 * - If there is no avatar, return the Facebook-style default.
 */
export function getAvatarUrl(avatar?: string | null): string {
  if (!avatar) return DEFAULT_AVATAR;
  if (avatar.startsWith("http")) return avatar;
  return `${BASE_URL}${avatar}`;
}
