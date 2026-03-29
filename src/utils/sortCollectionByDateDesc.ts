export function sortCollectionByDateDesc<T extends { data: { date: Date } }>(
  items: T[],
) {
  return [...items].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
