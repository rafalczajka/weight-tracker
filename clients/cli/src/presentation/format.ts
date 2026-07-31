export function formatLabel(value: string): string {
  const words = value
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replaceAll('-', ' ');

  return words.charAt(0).toUpperCase() + words.slice(1);
}
