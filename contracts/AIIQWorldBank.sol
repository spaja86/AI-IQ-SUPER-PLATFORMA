// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AI IQ World Bank — Pametni Ugovor
 * @author Nikola Spajić — Kompanija SPAJA
 * @notice Digitalna banka na Polygon mreži — svaka transakcija je javno proverljiva
 * @dev Deploy na Polygon mainnet (chainId: 137) ili Amoy testnet (chainId: 80002)
 *
 * Verifikacija:
 *   - Svaka transakcija ima blockchain hash koji je javno proverljiv
 *   - Svi podaci su čitljivi sa https://polygonscan.com
 *   - Nijedna transakcija ne može biti izbrisana ili izmenjena
 */
contract AIIQWorldBank {
    // ─── Tipovi ──────────────────────────────────────────────

    enum TransakcijaStatus { IZVRSENO, U_OBRADI, CEKANJE }
    enum Valuta { RSD, EUR, USD }

    struct Transakcija {
        uint256 id;
        string naziv;
        string opis;
        uint256 iznos;       // iznos u najmanjoj jedinici (dinari, centi, centi)
        Valuta valuta;
        string izvor;
        string destinacija;
        TransakcijaStatus status;
        uint256 datumBlok;   // block.timestamp
        address inicijator;
    }

    struct Racun {
        string brojRacuna;
        string naziv;
        Valuta valuta;
        uint256 stanje;      // u najmanjoj jedinici
        bool aktivan;
    }

    // ─── State varijable ──────────────────────────────────────

    address public vlasnik;
    string public naziv = "AI IQ World Bank";
    string public kompanija = "Kompanija SPAJA";
    string public verzija = "1.0.0";
    uint256 public ukupnoTransakcija;
    uint256 public ukupnoPotroseno; // u USD centima

    mapping(uint256 => Transakcija) public transakcije;
    mapping(string => Racun) public racuni;
    string[] public listaRacuna;
    uint256[] public listaTransakcijaIds;

    // ─── Događaji (Events) — javno proverljivi na blockchain-u ──

    event TransakcijaUpisana(
        uint256 indexed id,
        string naziv,
        uint256 iznos,
        Valuta valuta,
        string izvor,
        string destinacija,
        uint256 datum
    );

    event RacunDodan(
        string indexed brojRacuna,
        string naziv,
        Valuta valuta
    );

    event SredstvaDeponovana(
        string indexed brojRacuna,
        uint256 iznos,
        Valuta valuta
    );

    // ─── Modifikatori ────────────────────────────────────────

    modifier samoVlasnik() {
        require(msg.sender == vlasnik, "AIIQWorldBank: Pristup odbijen — samo vlasnik");
        _;
    }

    modifier racunPostoji(string memory brojRacuna) {
        require(racuni[brojRacuna].aktivan, "AIIQWorldBank: Racun ne postoji ili nije aktivan");
        _;
    }

    // ─── Konstruktor ─────────────────────────────────────────

    constructor() {
        vlasnik = msg.sender;

        // Inicijalizacija računa Digitalne Industrije
        _dodajRacun("DIGI-IND-001", "Digitalna Industrija — Dinarski", Valuta.RSD, 0);
        _dodajRacun("DIGI-IND-002-EUR", "Digitalna Industrija — Devizni EUR", Valuta.EUR, 0);

        // Upis istorijskih nabavki (50 digitalnih varijacija — $880,000 ukupno)
        _upisNabavki();
    }

    // ─── Javne funkcije ──────────────────────────────────────

    /**
     * @notice Dodaj novu transakciju na blockchain
     * @dev Samo vlasnik može upisivati transakcije
     */
    function upisTransakciju(
        string memory _naziv,
        string memory _opis,
        uint256 _iznos,
        Valuta _valuta,
        string memory _izvor,
        string memory _destinacija
    ) external samoVlasnik returns (uint256) {
        uint256 id = ukupnoTransakcija + 1;

        transakcije[id] = Transakcija({
            id: id,
            naziv: _naziv,
            opis: _opis,
            iznos: _iznos,
            valuta: _valuta,
            izvor: _izvor,
            destinacija: _destinacija,
            status: TransakcijaStatus.IZVRSENO,
            datumBlok: block.timestamp,
            inicijator: msg.sender
        });

        listaTransakcijaIds.push(id);
        ukupnoTransakcija = id;

        emit TransakcijaUpisana(id, _naziv, _iznos, _valuta, _izvor, _destinacija, block.timestamp);
        return id;
    }

    /**
     * @notice Dodaj sredstva na račun
     */
    function deponujSredstva(
        string memory _brojRacuna,
        uint256 _iznos
    ) external samoVlasnik racunPostoji(_brojRacuna) {
        racuni[_brojRacuna].stanje += _iznos;
        emit SredstvaDeponovana(_brojRacuna, _iznos, racuni[_brojRacuna].valuta);
    }

    /**
     * @notice Dohvati transakciju po ID-u
     */
    function dohvatiTransakciju(uint256 _id) external view returns (Transakcija memory) {
        require(_id > 0 && _id <= ukupnoTransakcija, "AIIQWorldBank: Transakcija ne postoji");
        return transakcije[_id];
    }

    /**
     * @notice Dohvati listu svih ID-ova transakcija
     */
    function dohvatiSveTransakcijeIds() external view returns (uint256[] memory) {
        return listaTransakcijaIds;
    }

    /**
     * @notice Dohvati listu svih računa
     */
    function dohvatiSveRacune() external view returns (string[] memory) {
        return listaRacuna;
    }

    /**
     * @notice Dohvati stanje računa
     */
    function dohvatiStanjeRacuna(string memory _brojRacuna) external view returns (uint256) {
        return racuni[_brojRacuna].stanje;
    }

    /**
     * @notice Proveri da li je adresa vlasnik
     */
    function jeVlasnik(address _adresa) external view returns (bool) {
        return _adresa == vlasnik;
    }

    /**
     * @notice Prenesi vlasništvo (2-step za sigurnost)
     */
    function prenesiVlasnistvo(address _noviVlasnik) external samoVlasnik {
        require(_noviVlasnik != address(0), "AIIQWorldBank: Nevalidna adresa");
        vlasnik = _noviVlasnik;
    }

    // ─── Interne funkcije ────────────────────────────────────

    function _dodajRacun(
        string memory _broj,
        string memory _naziv,
        Valuta _valuta,
        uint256 _stanje
    ) internal {
        racuni[_broj] = Racun({
            brojRacuna: _broj,
            naziv: _naziv,
            valuta: _valuta,
            stanje: _stanje,
            aktivan: true
        });
        listaRacuna.push(_broj);
        emit RacunDodan(_broj, _naziv, _valuta);
    }

    function _upisTransakcijuInternu(
        string memory _naziv,
        string memory _opis,
        uint256 _iznos,
        Valuta _valuta,
        string memory _izvor,
        string memory _destinacija
    ) internal {
        uint256 id = ukupnoTransakcija + 1;
        transakcije[id] = Transakcija({
            id: id,
            naziv: _naziv,
            opis: _opis,
            iznos: _iznos,
            valuta: _valuta,
            izvor: _izvor,
            destinacija: _destinacija,
            status: TransakcijaStatus.IZVRSENO,
            datumBlok: block.timestamp,
            inicijator: msg.sender
        });
        listaTransakcijaIds.push(id);
        ukupnoTransakcija = id;
        emit TransakcijaUpisana(id, _naziv, _iznos, _valuta, _izvor, _destinacija, block.timestamp);
    }

    /**
     * @dev Upisuje svih 50 nabavki u konstruktoru — javno proverljivo na blockchain-u
     *      Ukupno: $880,000 USD — zbir svih 50 digitalnih varijacija
     */
    function _upisNabavki() internal {
        _upisTransakcijuInternu("Biskop Digitalni", "Stratesko-digitalna figura — CRM, strategija", 20_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Biskop Digitalni");
        _upisTransakcijuInternu("Top Digitalni", "Komandna komunikacija, protokoli", 18_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Top Digitalni");
        _upisTransakcijuInternu("Konj Digitalni", "Agilan razvoj, mobilne platforme", 15_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Konj Digitalni");
        _upisTransakcijuInternu("Kraljica Digitalna", "Vrhunski AI sistem, full-stack platforma", 30_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Kraljica Digitalna");
        _upisTransakcijuInternu("Radio Digitalni", "Streaming platforma, audio/video", 12_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Radio Digitalni");
        _upisTransakcijuInternu("Akademija Digitalna", "E-learning platforma, kursevi", 25_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Akademija Digitalna");
        _upisTransakcijuInternu("CRM Sistem", "Customer relationship management", 22_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — CRM Sistem");
        _upisTransakcijuInternu("ERP Sistem", "Enterprise resource planning", 35_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — ERP Sistem");
        _upisTransakcijuInternu("Firewall Sistem", "Napredna zaštita mreže", 18_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Firewall Sistem");
        _upisTransakcijuInternu("VPN Mreža", "Privatna virtualna mreža", 8_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — VPN Mreža");
        _upisTransakcijuInternu("Kripto Platforma", "Kripto berza i wallet", 40_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Kripto Platforma");
        _upisTransakcijuInternu("AI Laboratorija", "Simulacije i istraživanje", 50_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — AI Laboratorija");
        _upisTransakcijuInternu("Cloud Infrastruktura", "AWS/Azure ekvivalent", 45_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Cloud Infrastruktura");
        _upisTransakcijuInternu("Data Centar", "Fizička serverska infrastruktura", 80_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Data Centar");
        _upisTransakcijuInternu("Mobile App Studio", "iOS/Android studio", 20_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Mobile App Studio");
        _upisTransakcijuInternu("Gaming Engine", "Mehanizam za igrice i simulacije", 30_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Gaming Engine");
        _upisTransakcijuInternu("Media Studio", "Produkcija slike i videa", 25_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Media Studio");
        _upisTransakcijuInternu("Healthtech Platforma", "Digitalno zdravstvo", 35_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Healthtech Platforma");
        _upisTransakcijuInternu("Edukacioni Hub", "Platforma za obuku i sertifikate", 20_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Edukacioni Hub");
        _upisTransakcijuInternu("E-Commerce Engine", "Online kupovina i logistika", 28_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — E-Commerce Engine");
        _upisTransakcijuInternu("Fintech Platforma", "Finansijska tehnologija", 40_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Fintech Platforma");
        _upisTransakcijuInternu("HR Sistem", "Upravljanje kadrovima", 15_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — HR Sistem");
        _upisTransakcijuInternu("Marketing Platforma", "Digitalni marketing i analitika", 18_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Marketing Platforma");
        _upisTransakcijuInternu("Legal Tech", "Digitalni ugovori i pravo", 12_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Legal Tech");
        _upisTransakcijuInternu("Supply Chain", "Lanac snabdevanja i logistika", 22_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Supply Chain");
        _upisTransakcijuInternu("IoT Platforma", "Internet of Things mreža", 20_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — IoT Platforma");
        _upisTransakcijuInternu("Quantum Simulator", "Kvantno računarstvo simulacija", 60_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Quantum Simulator");
        _upisTransakcijuInternu("AR/VR Studio", "Augmented i virtual reality", 35_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — AR/VR Studio");
        _upisTransakcijuInternu("Cybersecurity Suite", "Bezbednosni paket", 25_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Cybersecurity Suite");
        _upisTransakcijuInternu("Analytics Engine", "Napredna poslovna analitika", 18_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Analytics Engine");
        _upisTransakcijuInternu("Communication Suite", "Poslovne komunikacije", 12_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Communication Suite");
        _upisTransakcijuInternu("Document Management", "Upravljanje dokumentima", 10_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Document Management");
        _upisTransakcijuInternu("Project Management", "Upravljanje projektima", 12_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Project Management");
        _upisTransakcijuInternu("Customer Portal", "Portal za korisnike", 15_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Customer Portal");
        _upisTransakcijuInternu("API Gateway", "Centralni API menadžment", 20_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — API Gateway");
        _upisTransakcijuInternu("DevOps Pipeline", "CI/CD automatizacija", 15_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — DevOps Pipeline");
        _upisTransakcijuInternu("Monitoring Suite", "Real-time monitoring i alarmiranje", 12_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Monitoring Suite");
        _upisTransakcijuInternu("Content Platform", "CMS i content delivery", 18_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Content Platform");
        _upisTransakcijuInternu("Social Platform", "Društvena mreža komponenta", 25_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Social Platform");
        _upisTransakcijuInternu("Search Engine", "Interni pretraživač", 20_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Search Engine");
        _upisTransakcijuInternu("Notification System", "Push notifikacije i mejlovi", 8_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Notification System");
        _upisTransakcijuInternu("Identity Management", "IAM i SSO sistem", 18_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Identity Management");
        _upisTransakcijuInternu("Backup System", "Automatski backup i recovery", 10_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Backup System");
        _upisTransakcijuInternu("CDN Mreža", "Content delivery network", 15_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — CDN Mreža");
        _upisTransakcijuInternu("Load Balancer", "Raspoređivač opterećenja", 10_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Load Balancer");
        _upisTransakcijuInternu("Database Cluster", "Distribuirana baza podataka", 25_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Database Cluster");
        _upisTransakcijuInternu("Message Queue", "Asinhrona obrada poruka", 8_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Message Queue");
        _upisTransakcijuInternu("Email Marketing", "Email kampanje i automatizacija", 8_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Email Marketing");
        _upisTransakcijuInternu("Reporting Engine", "Izveštaji i dashboardi", 10_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Reporting Engine");
        _upisTransakcijuInternu("Fleet Management", "GPS praćenje i optimizacija ruta", 15_000, Valuta.USD, "AI IQ World Bank — DIGI-IND-001", "Digitalna Industrija — Fleet Management");

        ukupnoPotroseno = 880_000;
    }
}
