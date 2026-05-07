# Billing Error Budget Policy

- SLO: webhook success rate >= 99.5%
- SLO: audit write p99 < 500ms
- SLO: checkout p99 < 3000ms

## Budget Window

- Window: 30 days
- Error budget burn warning: 50%
- Error budget burn critical: 80%

## Enforcement

- Ako je burn > 80%, freeze novih billing feature rollout-a
- Dozvoljene su samo stabilizacione i security promene
- Kill-switch i read-only mod moraju biti spremni pre svakog rollout-a
