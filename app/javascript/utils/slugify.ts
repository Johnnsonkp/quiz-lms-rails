export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric
    .replace(/\s+/g, '-')         // replace spaces with -
    .replace(/-+/g, '-');         // collapse multiple -
}