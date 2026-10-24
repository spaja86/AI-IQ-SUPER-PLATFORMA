// Exclusive entries are barriers, not retries or exemptions from any budget.
export async function runScheduled(entries, concurrency, run, stopped = () => false) {
  let cursor = 0;
  while (!stopped() && cursor < entries.length) {
    if (entries[cursor].isolation === 'exclusive') {
      await run(entries[cursor++]);
      continue;
    }
    let end = cursor;
    while (end < entries.length && entries[end].isolation !== 'exclusive') end++;
    await Promise.all(Array.from({ length: Math.min(concurrency, end - cursor) }, async () => {
      while (!stopped() && cursor < end) await run(entries[cursor++]);
    }));
  }
}

export function processDeadline(timeoutMs, onTimeout) {
  let expired = false;
  const timer = setTimeout(() => { expired = true; onTimeout(); }, timeoutMs);
  return { get expired() { return expired; }, cancel: () => clearTimeout(timer) };
}
