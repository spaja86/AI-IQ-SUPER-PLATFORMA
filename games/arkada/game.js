const Arcade = (() => {
    const catalog = [["pijaca","Pijaca 06","plan","Ekonomija",14,25,"dinari",["Kupi na veliko","Prodaj na malo","Proveri zalihe"],[[2,1],[5,2],[1,0]]],["farma","Zelena farma","plan","Farma",12,26,"zalihe",["Sej","Prodaj rod","Odmori njivu"],[[3,1],[6,3],[1,0]]],["banka","Bankarski dan","plan","Banka",16,30,"likvidnost",["Odobri obezbeđen kredit","Naplati rate","Proveri dokumenta"],[[4,1],[5,2],[1,0]]],["drzava","Mala republika","plan","Vođenje države",15,29,"budžet",["Uloži u školu","Izvezi robu","Uradi reviziju"],[[4,1],[5,2],[1,0]]],["civilizacija","Prvi gradovi","plan","Civilizacija",13,28,"hrana",["Izgradi silos","Trguj","Sačuvaj rezervu"],[[4,1],[6,3],[2,0]]],["nauka","Naučni kviz","quiz","Kviz",[["Šta meri termometar?","Temperaturu","Brzinu"],["Šta je H₂O?","Voda","Kiseonik"],["Šta je 9 × 7?","63","54"]]],["laboratorija","Laboratorija svetlosti","quiz","Laboratorija",[["Šta prvo uradiš pre probe?","Pročitaš protokol","Preskočiš uputstvo"],["Koji predmet razlaže svetlost?","Prizma","Magnet"],["Šta beležiš posle probe?","Rezultat i uslove","Samo datum"]]],["svet","Kviz oko sveta","quiz","Geografija",[["Koji je najveći okean?","Tihi","Indijski"],["Koja je prestonica Srbije?","Beograd","Niš"],["Na kom kontinentu je Egipat pretežno?","Afrika","Evropa"]]],["skola","Školski izazov","quiz","Obrazovanje",[["Šta radiš kad zapneš?","Podeliš zadatak","Preskočiš sve"],["Koliko minuta ima u satu?","60","100"],["Kako proveriš rezultat?","Ponoviš postupak","Promeniš jedinicu nasumično"]]],["sport-kviz","Sportski komentator","quiz","Sport",[["Koliko igrača fudbalski tim ima na terenu na početku?","11","8"],["Čime se igra tenis?","Reketom","Palicom za golf"],["Koliko poena vredi slobodno bacanje u košarci?","1","3"]]],["automobil","Noćna vožnja","drive","Automobil",[1,2,1,0,1,2],"asfalt"],["kamion","Teretni put","drive","Kamion",[0,0,1,2,2,1,0],"put"],["voz","Brzi voz","drive","Voz",[1,1,2,2,1,0,0,1],"kolosek"],["helikopter","Helikopterska ruta","drive","Helikopter",[2,1,0,1,2,2,0,1],"vazdušni koridor"],["brod","Plima i kurs","drive","Brod",[0,2,2,1,0,2,1,1],"plovni put"],["oklop","Oklopna brigada","tactic","Oklopne jedinice",[["izviđač","štit"],["težak","manevar"],["štit","izviđač"],["težak","manevar"]]],["tenk","Tenkovska arena","tactic","Simulacija tenka",[["težak","manevar"],["izviđač","štit"],["težak","manevar"],["štit","izviđač"],["izviđač","štit"]]],["avion","Avionski duel","tactic","Simulacija aviona",[["štit","izviđač"],["izviđač","štit"],["težak","manevar"],["štit","izviđač"]]],["taktika","Taktički most","tactic","Strategija",[["štit","izviđač"],["težak","manevar"],["štit","izviđač"],["izviđač","štit"],["štit","izviđač"]]],["front","Severni front","tactic","Ratna igra",[["težak","manevar"],["težak","manevar"],["izviđač","štit"],["štit","izviđač"],["težak","manevar"]]],["rpg","RPG Šuma runa","story","RPG",[["Pređi brvno","Prati znakove","Gazi kroz virove"],["Kamen čuvar","Upotrebi runu","Ignoriši čuvara"],["Povratak","Ponesi mapu","Zaboravi put"]]],["stil","BARBIGIRL Modni studio","story","Modni studio",[["Revija na kiši","Odaberi kabanicu","Odaberi papirni sako"],["Treba uskladiti boje","Uporedi paletu","Ugasi svetla"],["Izlazak na pistu","Proveri obuću","Kreni u čarapama"]]],["zivot","LIFE GEJMS Jedan dan","story","Dnevna simulacija",[["Ispit ujutru","Ponovi gradivo","Ostani budan celu noć"],["Računi dospevaju","Napravi budžet","Zaboravi rok"],["Večera","Dogovori obroke","Preskoči kupovinu"]]],["horor","Horor Napuštena kuća","story","Horor",[["Mrak u predvorju","Upali lampu","Trči zatvorenih očiju"],["Škripa iza vrata","Oslušni i proveri izlaz","Baci ključ"],["Silazak","Prati izlazne oznake","Idi nasumično"]]],["apokalipsa","Apokalipsa Stanica 17","story","Apokalipsa",[["Nema struje","Proveri bateriju","Uključi praznu utičnicu"],["Voda je mutna","Filtriraj vodu","Popij odmah"],["Poziv za pomoć","Pošalji signal","Isključi radio"]]],["guntarget","GUN POWER IN TARGETS","aim","Arkada sa metama",[2,5,1,7,4,8,0]],["kosarka","Košarka Tri poena","aim","Košarka",[4,2,6,0,8,3,7]],["fudbal","Penal serija","aim","Fudbal",[0,8,4,2,6,1,7,3]],["strelicarstvo","Streličarstvo","aim","Streličarstvo",[3,7,2,8,5,0,4,1]],["hokej","Hokej Precizan udarac","aim","Hokej",[6,2,4,7,0,5,8,1,3]]];
    const options = {
        drive:["Levo","Sredina","Desno"], tactic:["Štit","Manevar","Izviđač"],
        aim:Array.from({length:9},(_,i)=>String(i+1))
    };
    const order = ["štit","manevar","izviđač"];
    function create(id) {
        const spec = catalog.find(entry => entry[0] === id);
        if (!spec) throw new Error("Nepoznata igra");
        return {spec,turn:0,score:spec[2]==="plan" ? spec[4] : 0,risk:0,phase:"play"};
    }
    function prompt(game) {
        const [, , mode, , a,b,c,d] = game.spec;
        const i = game.turn;
        if (mode === "plan") return {text:"Cilj: "+b+" · "+c+" / najviše 8 rizika",choices:d};
        if (mode === "quiz" || mode === "story") {
            const [text,right,wrong] = a[i];
            return {text,choices:i%2 ? [wrong,right] : [right,wrong]};
        }
        if (mode === "drive") return {text:"Sledeći "+b+": "+options.drive[a[i]].toLowerCase(),choices:options.drive,mark:a[i]};
        if (mode === "tactic") return {text:"Protivnik: "+a[i][0]+" · Štit za izviđača, manevar za teškog, izviđač za štit.",choices:options.tactic};
        return {text:"Pogodi označeno polje.",choices:options.aim,mark:a[i]};
    }
    function move(game,choice) {
        if (game.phase!=="play" || !Number.isInteger(choice) || choice<0 || choice>=prompt(game).choices.length) return false;
        const [, , mode, , a,b,c,d,e] = game.spec;
        const i = game.turn++;
        if (mode==="plan") {
            const [gain,risk] = e[choice];
            game.score+=gain;
            game.risk+=risk;
            if (game.risk>8) game.phase="lost";
            else if (game.score>=b) game.phase="won";
            else if (game.turn===8) game.phase="lost";
            return true;
        }
        const correct = mode==="quiz" || mode==="story" ? i%2
            : mode==="tactic" ? order.indexOf(a[i][1]) : a[i];
        if (choice===correct) game.score++;
        if (game.turn===a.length) game.phase=game.score>=Math.ceil(a.length*2/3)?"won":"lost";
        return true;
    }
    function random(exclude, sample=Math.random) {
        const choices=catalog.filter(game=>game[0]!==exclude);
        return choices[Math.floor(sample()*choices.length)][0];
    }
    return {catalog,create,prompt,move,random};
})();
if (typeof module!=="undefined") module.exports=Arcade;


