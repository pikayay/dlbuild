/**
 * URL slug from the in-game display name (`hero.name`), not `class_name` or numeric id.
 * Example: "Infernus" → `infernus`
 */
export function heroDisplayNameToSlug(displayName: string): string {
  return displayName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function heroDetailHref(displayName: string): string {
  return `/deadlock/heroes/${heroDisplayNameToSlug(displayName)}`
}
