/**
 * Formats bee count for display, handling special case of -1 (too many bees)
 */
export function formatBeeCount(count: number): string {
  if (count === -1) {
    return 'Te veel om te tellen';
  }
  return count.toLocaleString('nl-BE');
}