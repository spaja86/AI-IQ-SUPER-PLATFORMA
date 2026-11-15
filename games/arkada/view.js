const get=id=>document.getElementById(id);
const select=get("choose");
for (const [id,title,mode,genre] of Arcade.catalog) {
    const option=document.createElement("option");
    option.value=id;
    option.textContent=title+" · "+genre;
    select.append(option);
}
const canvas=get("illustration");
const ctx=canvas.getContext("2d");
const reduction=window.matchMedia("(prefers-reduced-motion: reduce)");
let sceneFrame=0;
const palettes={
    plan:["#264c45","#a5aa71","#edd18b"],
    quiz:["#2e3765","#777bc8","#ffe098"],
    drive:["#233352","#7199a6","#ffbc78"],
    tactic:["#343945","#899276","#edab74"],
    story:["#332d53","#805977","#ffc489"],
    aim:["#204a4d","#54a396","#ffcf89"]
};
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function shape(points,color){
    ctx.beginPath();
    for(const [i,[x,y]] of points.entries()) i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    ctx.closePath();ctx.fillStyle=color;ctx.fill();
}
function disk(x,y,r,color){
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
}
function seeded(text){
    let value=0;
    for(const char of text) value=(Math.imul(value,31)+char.codePointAt(0))>>>0;
    return value;
}
function drawScene(game,step,alpha) {
    if(!ctx)return;
    const [id,,mode]=game.spec;
    const [base,middle,light]=palettes[mode];
    const seed=seeded(id);
    const gradient=ctx.createLinearGradient(0,0,0,480);
    gradient.addColorStop(0,base);gradient.addColorStop(1,middle);
    rect(0,0,960,480,gradient);
    for(let i=0;i<40;i++) disk((seed%97+i*137)%960,(seed%43+i*53)%240,i%4===0?2:1,"#ffffff36");
    disk(750+seed%98,104,48,light);
    shape([[0,300],[160,166],[340,297],[510,166],[660,280],[825,177],[960,264],[960,480],[0,480]],base);
    const shade="#142636";
    if(mode==="plan"){
        for(let i=0;i<11;i++){
            const h=36+((seed+i*43)%108);
            rect(360+i*44,319-h,34,h,i%2?middle:shade);
            rect(367+i*44,329-h,7,10,light);
        }
    } else if(mode==="drive"){
        shape([[607,225],[690,225],[960,480],[340,480]],shade);
        for(let i=0;i<6;i++){const y=242+i*i*8;rect(647-i*2,y,6+i*4,5+i*3,light);}
        const lane=step?.mark??1;
        const x=495+lane*145+20*(1-alpha);
        rect(x,353,80,35,light);rect(x+14,335,49,23,middle);
        disk(x+14,390,11,shade);disk(x+67,390,11,shade);
    } else if(mode==="aim"){
        for(let i=0;i<9;i++){
            const x=523+(i%3)*97,y=104+Math.floor(i/3)*87;
            disk(x,y,33,i===step?.mark?light:shade);
            disk(x,y,22,middle);disk(x,y,9,i===step?.mark?light:base);
        }
    } else if(mode==="tactic"){
        for(let i=0;i<5;i++){
            const x=472+i*78,y=314-(i%2)*54;
            shape([[x,y],[x+28,y-16],[x+56,y],[x+56,y+29],[x+28,y+45],[x,y+29]],i===(game.turn%5)?light:middle);
            rect(x+12,y+7,30,14,shade);rect(x+27,y+3,24,5,shade);
        }
    } else if(mode==="quiz"){
        for(let i=0;i<3;i++){
            const x=516+i*94;
            rect(x,165+(i%2)*30,64,115,i===game.turn%3?light:middle);
            for(let j=0;j<4;j++)rect(x+10,180+(i%2)*30+j*15,35-j*3,4,base);
        }
    } else {
        for(let i=0;i<9;i++){
            const x=440+i*55,h=42+((seed+i*31)%122);
            rect(x,355-h,9,h,shade);
            shape([[x-26,355-h+40],[x+5,355-h-44],[x+36,355-h+40]],i%3?shade:middle);
        }
        disk(660,317,25,light);
    }
    const overlay=ctx.createLinearGradient(0,260,0,480);
    overlay.addColorStop(0,"#111c2000");overlay.addColorStop(1,"#111c20f0");
    rect(0,260,960,220,overlay);
    if(alpha<1) rect(0,0,960,480,"rgba(16,24,30,"+((1-alpha)*.36)+")");
}
function animateScene(game,step){
    cancelAnimationFrame(sceneFrame);
    if(!ctx||reduction.matches){drawScene(game,step,1);return;}
    drawScene(game,step,0);
    const start=performance.now();
    function next(now){
        const alpha=Math.min(1,(now-start)/260);
        drawScene(game,step,alpha);
        if(alpha<1)sceneFrame=requestAnimationFrame(next);
    }
    sceneFrame=requestAnimationFrame(next);
}

let game;
function start(id) {
    game=Arcade.create(id);
    select.value=id;
    render();
}
function render() {
    get("title").textContent=game.spec[1];
    get("genre").textContent=game.spec[3];
    const max=game.spec[2]==="plan"?8:game.spec[4].length;
    const progress=get("progress");
    progress.max=max;
    progress.value=game.phase==="won"?max:game.turn;
    const actions=get("actions");
    actions.replaceChildren();
    get("score").textContent="Potez "+game.turn+" · Rezultat "+game.score+
        (game.spec[2]==="plan" ? " · Rizik "+game.risk+"/8" : "");
    if (game.phase!=="play") {
        animateScene(game,null);
        get("prompt").textContent=game.phase==="won"?"Izazov završen!":"Izazov nije uspeo. Pokušaj ponovo.";
        return;
    }
    const step=Arcade.prompt(game);
    animateScene(game,step);
    get("prompt").textContent=step.text;
    actions.classList.toggle("grid",game.spec[2]==="aim");
    step.choices.forEach((label,i)=>{
        const button=document.createElement("button");
        button.textContent=label;
        if (step.mark===i) {
            button.classList.add("active");
            button.setAttribute("aria-label",label+" · označeno");
        }
        button.onclick=()=>{Arcade.move(game,i);render();};
        actions.append(button);
    });
}
get("random").onclick=()=>start(Arcade.random(game.spec[0]));
get("restart").onclick=()=>start(game.spec[0]);
select.onchange=()=>start(select.value);
start(Arcade.random());


