var poruka = document.getElementById("poruka");
poruka.addEventListener("keydown", function (e) {
    if (e.keyCode === 13 && !e.shiftKey) {
        if(!e.shiftKey){
            posalji(e);
        }

    }
});



function posalji(e) {
    var div = document.getElementById("poruke");

    div.innerHTML += '<div class="mdl-grid divZaPoruku"> ' +
    '<div class="mdl-cell mdl-cell--6-col"> ' +
    '</div> ' +
    '<div class="mdl-cell mdl-cell--6-col"> ' +
    '<div class="pojedinacnaPorukaDiv "> ' +
    '<span class="pojedinacnaPorukaMoja">' + poruka.value +'</span> ' +
    '</div> ' +
    '</div> ' +
    '</div> ';

    div.scrollTop = div.scrollHeight;
    poruka.value = "";
    poruka.placeholder = "Napisi poruku...";

}