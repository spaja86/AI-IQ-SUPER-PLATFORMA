// Summaries intentionally exclude IPs, ports, SDP, ICE URLs and credentials.
export function candidateSummary(sdp = '') {
  const result = { total: 0, host: 0, srflx: 0, relay: 0, prflx: 0, other: 0 };
  for (const line of sdp.split(/\r?\n/)) {
    if (!line.startsWith('a=candidate:')) continue;
    result.total++;
    const type = /\styp\s+(host|srflx|relay|prflx)\b/.exec(line)?.[1] || 'other';
    result[type]++;
  }
  return result;
}
export function connectionSummary(pc, dc) {
  return {
    connection: pc?.connectionState || 'closed',
    ice: pc?.iceConnectionState || 'closed',
    gathering: pc?.iceGatheringState || 'new',
    channel: dc?.readyState || 'absent',
    candidates: candidateSummary(pc?.localDescription?.sdp),
  };
}
