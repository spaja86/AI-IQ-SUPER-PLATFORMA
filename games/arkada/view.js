const get=id=>document.getElementById(id);
const select=get("choose");
for (const [id,title,mode,genre] of Arcade.catalog) {
    const option=document.createElement("option");
    option.value=id;
    option.textContent=title+" · "+genre;
    select.append(option);
}
let game;
function start(id) {
    game=Arcade.create(id);
    select.value=id;
    render();
}
function render() {
    get("title").textContent=game.spec[1];
    const actions=get("actions");
    actions.replaceChildren();
    get("score").textContent="Potez "+game.turn+" · Rezultat "+game.score+
        (game.spec[2]==="plan" ? " · Rizik "+game.risk+"/8" : "");
    if (game.phase!=="play") {
        get("prompt").textContent=game.phase==="won"?"Izazov završen!":"Izazov nije uspeo. Pokušaj ponovo.";
        return;
    }
    const step=Arcade.prompt(game);
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

