# Runbook — Stripe Degraded Mode

1. Aktivirati `billing-kill-switch-checkout` i po potrebi `billing-read-only-mode`.
2. Proveriti `GET /api/billing-health` (alerts, webhook error rate, DLQ depth).
3. Pauzirati admin replay dok incident nije stabilizovan.
4. Pratiti DLQ aging i poison poruke.
5. Nakon stabilizacije: postepeno vratiti checkout preko canary flag-a.
