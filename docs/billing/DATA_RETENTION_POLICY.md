# Billing Data Retention Policy

- `stripe_webhook_events`: 90 dana
- `webhook_dead_letter`: replayed zapisi 30 dana
- `financial_audit_log`: 180 dana u primary tabeli, istorija u archive tabeli
- `financial_audit_log_archive`: 5 godina (regulatorni trag)

## PII pravila

- Audit metadata mora biti maskiran pre upisa.
- Zabranjen upis punih payment instrumenata u audit log.
