# Runbook — Billing DB Partial Outage

1. Aktivirati `billing-read-only-mode`.
2. Potvrditi da webhook handler i dalje prihvata i karantiniše sumnjive evente.
3. Proveriti `webhook_dead_letter` rast i `poison` flagove.
4. Odložiti replay dok DB write latency ne padne ispod SLO.
5. Posle oporavka: replay samo uz 4-eyes approval.
