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
const boxFaces=[
    [[0,3,2,1],.60],[[4,5,6,7],1],[[0,1,5,4],.76],
    [[3,7,6,2],.89],[[1,2,6,5],.67],[[0,4,7,3],.82]
];
function shade(color,factor){
    const value=parseInt(color.slice(1),16);
    return "rgb("+[16,8,0].map(shift=>Math.round(((value>>shift)&255)*factor)).join(",")+")";
}
function box(x,y,z,w,h,d,color){
    const vertices=[[x,y,z],[x+w,y,z],[x+w,y,z+d],[x,y,z+d],
        [x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]];
    return boxFaces.map(([indices,light])=>[indices.map(index=>vertices[index]),shade(color,light)]);
}
function ring(x,y,z,r,thickness,color){
    const faces=[];
    for(let i=0;i<24;i++){
        const a=i*Math.PI/12,b=(i+1)*Math.PI/12;
        const at=(angle,radius,depth)=>[x+Math.cos(angle)*radius,y+Math.sin(angle)*radius,z+depth];
        faces.push([[at(a,r,0),at(b,r,0),at(b,r-thickness,0),at(a,r-thickness,0)],color]);
        faces.push([[at(a,r,0),at(b,r,0),at(b,r,8),at(a,r,8)],shade(color,.55)]);
    }
    return faces;
}
function stageMesh(mode,game,step,alpha,light,middle,seed){
    const geometry=[];
    const add=(...args)=>geometry.push(...box(...args));
    if(mode==="plan"){
        for(let i=0;i<7;i++){
            const x=(i%4)*54-100,z=Math.floor(i/4)*58-20,h=36+((seed+i*33)%78);
            add(x,0,z,39,h,39,i%2?middle:light);
            add(x+6,h,z+6,27,6,27,light);
        }
    } else if(mode==="drive"){
        add(-118,-6,-54,236,6,108,"#2e4054");
        for(let i=0;i<6;i++)add(-112+i*39,0,-2,16,1,4,"#dfbd80");
        const x=-40+((step?.mark??1)-1)*47+25*(1-alpha);
        for(const dx of [6,51]) for(const z of [-22,15])add(x+dx,0,z,11,12,12,"#152433");
        add(x,10,-20,68,15,43,light);add(x+20,25,-15,31,14,33,middle);
        add(x+53,18,-16,13,4,7,"#fff1d4");
    } else if(mode==="aim"){
        for(let i=0;i<9;i++){
            const x=(i%3)*58-58,y=112-Math.floor(i/3)*49;
            const color=i===step?.mark?light:middle;
            geometry.push(...ring(x,y,-10,19,7,color),...ring(x,y,-10,8,7,color));
        }
        add(-105,0,-2,210,5,10,middle);
    } else if(mode==="tactic"){
        for(let i=0;i<5;i++){
            const x=(i%3)*64-95,z=Math.floor(i/3)*60-28;
            const active=i===game.turn%5,color=active?light:middle;
            const y=active?8*Math.sin(alpha*Math.PI):0;
            add(x,y,z,51,8,36,"#1b2938");add(x+4,y+8,z+4,43,12,28,color);
            add(x+13,y+20,z+10,24,12,19,color);add(x+31,y+24,z+17,29,5,5,color);
        }
    } else if(mode==="quiz"){
        for(let i=0;i<3;i++){
            const x=i*61-90,h=87+(i===game.turn%3?12*Math.sin(alpha*Math.PI):0);
            add(x,0,0,47,h,12,i===game.turn%3?light:middle);
            for(let j=0;j<4;j++)add(x+8,h-18-j*12,-2,26-j*3,3,2,"#353d68");
        }
    } else {
        for(let i=0;i<8;i++){
            const x=(i%4)*58-109,z=Math.floor(i/4)*72-22,h=30+(seed+i*27)%62;
            add(x,0,z,10,h,10,"#3b3050");add(x-13,h-8,z-13,36,19,36,middle);
            add(x-7,h+11,z-7,24,19,24,i===game.turn%8?light:middle);
        }
    }
    return geometry;
}
function drawMesh(mode,game,step,alpha,light,middle,seed){
    const yaw=(mode==="aim"||mode==="quiz" ? .12 : .44)+(1-alpha)*.55;
    const tilt=.33,sy=Math.sin(yaw),cy=Math.cos(yaw),st=Math.sin(tilt),ct=Math.cos(tilt);
    const projected=stageMesh(mode,game,step,alpha,light,middle,seed).map(([vertices,color])=>{
        const points=vertices.map(([x,y,z])=>{
            const horizontal=x*cy-z*sy;
            const direction=x*sy+z*cy;
            const vertical=y*ct+direction*st;
            const depth=y*st-direction*ct;
            const scale=410/(360+depth);
            return [666+horizontal*scale,340-vertical*scale,depth];
        });
        return {points,color,depth:points.reduce((sum,point)=>sum+point[2],0)/points.length};
    });
    projected.sort((a,b)=>b.depth-a.depth);
    for(const {points,color} of projected)shape(points,color);
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
    drawMesh(mode,game,step,alpha,light,middle,seed);
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
        const alpha=Math.min(1,(now-start)/720);
        drawScene(game,step,1-(1-alpha)**3);
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



