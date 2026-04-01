# Shared — Zajednički Resursi

Ovaj folder sadrži deljene komponente i stilove koji se koriste u svim platformama unutar monorepa.

## Sadržaj

### `styles/`

| Fajl | Opis |
|------|------|
| `variables.css` | Globalne CSS varijable (boje, fontovi, razmaci) |
| `platform-base.css` | Bazni stilovi za sve platforme |

### `components/`

| Fajl | Opis |
|------|------|
| `navigation.html` | HTML snippet za navigaciju između platformi |

## Korišćenje

### CSS varijable

```html
<link rel="stylesheet" href="../../shared/styles/variables.css" />
<link rel="stylesheet" href="../../shared/styles/platform-base.css" />
```

### Navigacija

Uključi `navigation.html` snippet direktno u HTML ili koristi JavaScript fetch za dinamičko učitavanje:

```js
fetch('../../shared/components/navigation.html')
  .then(r => r.text())
  .then(html => {
    document.querySelector('#nav-placeholder').innerHTML = html;
  });
```

## Dodavanje novih resursa

1. Dodaj novi CSS fajl u `styles/` ili HTML/JS komponentu u `components/`
2. Ažuriraj ovaj README
3. Koristi resurs u relevantnim platformama
