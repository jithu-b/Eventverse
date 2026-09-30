// Display-only fake registration numbers for old events. Delete this file (and the edits in eventApi.ts) to undo.
const hash = (s: string) =>
  Math.abs([...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0));

export function fakeCount(id: string, totalSpots: number): number {
  const max = Math.min(50, totalSpots); // never above 50 or the event's capacity
  const min = Math.min(15, max);
  return min + (hash(id) % (max - min + 1)); // 15 to 50
}
