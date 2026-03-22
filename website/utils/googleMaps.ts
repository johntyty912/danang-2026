export function getGoogleMapsUrl(address: string, name: string): string {
  const query = encodeURIComponent(`${name} ${address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
