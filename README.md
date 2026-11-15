# SPAJA Igre

Tri porodične avanture i SPAJA Arkada sa 30 novih kratkih igara. U games/arkada/index.html radi izbor igre i dugme Nasumična igra. Otvori games/sarasister/index.html, games/nikolabroher/index.html ili games/spajicfemily/index.html za lokalno igranje.

## Zajednički server

Potreban je Node.js 22 ili noviji.

    node --test hub.test.mjs arcade.test.mjs
    node start.mjs

Lokalni katalog je na http://127.0.0.1:3000, a MCP na http://127.0.0.1:3000/mcp. Na hostingu koji zahteva mrežno vezivanje podesi HOST=0.0.0.0 i PORT prema hostu. Ako MCP klijent šalje Origin, podesi MCP_ALLOWED_ORIGIN na očekivanu vrednost. HTTP TLS treba da obezbedi hosting ili reverzni proksi.

## ChatGPT

[Zvanično uputstvo za povezivanje i testiranje](https://developers.openai.com/plugins/deploy/connect-chatgpt)

Poveži javni HTTPS MCP endpoint ili podržani razvojni tunel. U stvarnom razgovoru zasebno pokreni „Pokreni SARAsister“, „Pokreni NikolaBroher“ i „Pokreni SPAJIĆfemily“. Proveri kretanje, borbu i izradu u prve dve igre. U porodičnoj igri proveri radionicu, gradnju i slojeve ambijenta. Lokalni test proverava otkrivanje, poziv i odgovarajući prikaz preko MCP-a za svaku igru.

## Priprema za katalog

[Zvanično uputstvo za podnošenje i objavu](https://developers.openai.com/plugins/deploy/submission)

Skripta make-plugin.ps1 u PowerShell-u 7 prima stvarni HTTPS endpoint preko parametra -McpUrl i pravi distributivni ZIP sa plugin.json i mcp.json. ZIP koji sadrži ovaj README je izvorni paket i ima zajednički server za hosting. Za javnu prijavu pripremi verifikovan identitet izdavača, potvrdu domena, zvanične adrese i demo iz stvarnog ChatGPT razgovora prema zahtevima portala.



## BONG BEN

    . .\bong-ben.ps1
    reaperall.returntoreaperall.makesolutiontoworkonchatgpt.returntoreaperall.goplaygame

GoPlay poziva završnu proveru, ponavlja testove iz raspakovanog ZIP-a i otvara Arkadu. Parametar -NoLaunch služi za proveru bez otvaranja pregledača. U ChatGPT-u dodati alat je „Pokreni SPAJA Arkada“.

## Metapodaci za početni OpenAI pregled

Datoteka plugin.json sadrži pet pozitivnih i tri negativna slučaja za jedan zajednički MCP server. Osnovni tekst kataloga je na engleskom, a prevod na srpskom je u publication.translations pod sr-Latn-RS. Beleške o izdanju su u publication, informacije o kupovinama u review.

Skripta make-plugin.ps1 kombinuje plugin.json i mcp.json kada joj se prosledi stvarni javni HTTPS MCP URL. Uvezeni slučajevi menjaju se u izvornom manifestu i zatim se ZIP ponovo učitava. Demo snimak i preostale adrese za prijavu unose se kada budu dostupni. Poverljivi podaci za pristup recenzenta unose se kroz bezbedni obrazac, ukoliko su potrebni.

[OpenAI uputstvo za podnošenje](https://developers.openai.com/plugins/deploy/submission)

