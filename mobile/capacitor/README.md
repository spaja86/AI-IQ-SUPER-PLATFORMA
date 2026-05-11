# Wallet Native Wrapper (Android/iOS)

Ovaj folder predstavlja početni scaffold za native distribuciju poslovnog novčanika.

## Release lane-ovi

- `dev` — lokalni debug buildovi
- `beta` — TestFlight / Play Closed Testing
- `production` — staged rollout po regionima

## Sledeći koraci

1. Dodati iOS i Android projekte kroz Capacitor CLI u ovom folderu.
2. Podesiti signing/provisioning profile po lane-u.
3. Uskladiti store metadata, privacy declarations i camera/payment permissione.

4. Za build web sloja koristiti statički output (`out`) kompatibilan sa native wrapper-om.
