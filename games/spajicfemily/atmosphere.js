const Atmosphere = (() => {
    const stages = [
        ["#9dd2bf","#f5ce7e","#e1d6a5"], ["#86b6c1","#edb96e","#c8d9b0"],
        ["#8eafd6","#e9c392","#daddb4"], ["#aab8d7","#ffd59c","#e3bab0"],
        ["#9bafd5","#ffd28b","#f0d5aa"]
    ];
    const count = 1200;
    const layers = ["cer","scantei","ceata"];
    const size = 'xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"';
    const round = x => x.toFixed(3);

    function layer(stage,index,type) {
        const [sky,light,mist] = stages[stage];
        const t = index / (count - 1);
        const drift = 35 * Math.sin(t * Math.PI * 2 + stage * .6);
        if (type === "cer") {
            const x = 740 + 104 * t;
            return `<ellipse cx="${round(x)}" cy="85" rx="104" ry="46" fill="${sky}" opacity=".14"/><circle cx="${round(x)}" cy="85" r="46" fill="${light}" opacity=".18"/>`;
        }
        if (type === "scantei") {
            return Array.from({length:7}, (_,i) => {
                const x = 85 + i*115 + 27*Math.sin(t*12+i*1.9);
                const y = 390 - i*13 + 19*Math.cos(t*10+i);
                return `<circle cx="${round(x)}" cy="${round(y)}" r="${i%3+1}" fill="${light}" opacity=".58"/>`;
            }).join("");
        }
        return `<path d="M0 476 Q${round(280+drift)} ${round(405+25*t)} 560 491 T960 469 V540 H0Z" fill="${mist}" opacity=".12"/><ellipse cx="${round(105+drift)}" cy="420" rx="190" ry="40" fill="${mist}" opacity=".09"/>`;
    }

    function image(stage,index,type) {
        return `<svg ${size}>${layer(stage,index,type)}</svg>`;
    }

    function composite(stage,index) {
        return `<svg ${size}>${layers.map(type => layer(stage,index,type)).join("")}</svg>`;
    }

    function transition(progress) {
        const milliseconds = Math.max(0, Math.min(18_000_000,progress));
        const group = Math.floor(milliseconds / 15_000);
        const next = Math.min(count-1,group);
        if (group === 0) return {previous:0,next:0,mix:1};
        return {previous:next === group ? next-1 : next,next,
            mix:next === group ? Math.min(1,(milliseconds % 15_000)/1000) : 1};
    }

    return { count, layers, image, composite, transition };
})();
if (typeof module !== "undefined") module.exports = Atmosphere;

