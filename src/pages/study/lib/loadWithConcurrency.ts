export async function loadWithConcurrency<T>(
  items: T[],
  load: (item: T) => Promise<void>,
  concurrency: number,
): Promise<void> {
  if (items.length === 0) return

  let nextIndex = 0
  const workerCount = Math.min(Math.max(concurrency, 1), items.length)

  const worker = async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex]
      nextIndex += 1

      if (item !== undefined) {
        await load(item)
      }
    }
  }

  await Promise.all(
    Array.from({ length: workerCount }, () => worker()),
  )
}
