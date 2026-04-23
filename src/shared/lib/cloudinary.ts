/**
 * Request a smaller variant of a remote image to save bandwidth and avoid
 * the upstream host's per-IP rate limits. Covers:
 *   - Cloudinary (`res.cloudinary.com/.../image/upload/...`)
 *     → insert `w_{width},q_auto,f_auto/` after `/image/upload/`.
 *   - Google Drive thumbnails (`drive.google.com/thumbnail?id=...&sz=sXXXX`)
 *     → rewrite `sz` to `s{width}`. s4000 on a 160px tile wastes ~100×
 *       bandwidth and hits Drive's 429 rate limit fast.
 *
 * Non-matching URLs are returned unchanged so future hosts keep working.
 */
export const optimizeImageUrl = (url: string | null | undefined, width = 400): string => {
  if (!url) return '';

  // Google Drive /thumbnail endpoint — swap sz param
  if (url.includes('drive.google.com/thumbnail')) {
    if (/[?&]sz=/.test(url)) {
      return url.replace(/([?&]sz=)s?\d+/, `$1s${width}`);
    }
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}sz=s${width}`;
  }

  // Cloudinary secure_url — inject transformations after /image/upload/
  if (url.includes('res.cloudinary.com')) {
    const marker = '/image/upload/';
    const idx = url.indexOf(marker);
    if (idx === -1) return url;

    const head = url.slice(0, idx + marker.length);
    const tail = url.slice(idx + marker.length);

    // Skip if a transformation segment is already present
    if (/^[a-z]+_[^/]+/.test(tail) && !tail.startsWith('v')) return url;

    return `${head}w_${width},q_auto,f_auto/${tail}`;
  }

  return url;
};

/**
 * Backward-compatible alias. Kept until all call sites are migrated.
 * @deprecated Use `optimizeImageUrl` instead.
 */
export const optimizeCloudinaryUrl = optimizeImageUrl;
