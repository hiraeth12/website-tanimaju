export function slugify(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}
