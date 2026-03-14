export function optimizeImage(url, { width, quality = "auto", format = "auto" } = {}) {
  if (!url || !url.includes("cloudinary.com")) return url;
  const w = width ? `w_${width},` : "";
  return url.replace("/upload/", `/upload/${w}q_${quality},f_${format}/`);
}
