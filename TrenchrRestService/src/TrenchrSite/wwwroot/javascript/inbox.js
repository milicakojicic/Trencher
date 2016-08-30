var focus = 0,
    blur = 0;

$( document ).ready(function() {

    //kada se krene pisati poruka omogucava se pritisak dugmeta dok postoji text u textarea
    $('#poruka').bind('input propertychange', function () {

        document.getElementById("posaljiPoruku").disabled = true;
        document.getElementById("posaljiPoruku").style.opacity = 0.5;
        document.getElementById("poruka").placeholder = " ";

        if (this.value.length) {
            document.getElementById("posaljiPoruku").disabled = false;
            document.getElementById("posaljiPoruku").style.opacity = 1;
        }
    });

});

$( "#pretraziOsobe" )
    //fja u kojoj treba za izabranu osobu prikazati dosadasnji chat sa njom
    .focusout(function() {
        console.log("Ljubica");
    });

//dodavanje mogucnost da se salje poruka na ENTER
var poruka = document.getElementById("poruka");
poruka.addEventListener("keydown", function (e) {
    if (e.keyCode === 13 && !e.shiftKey) {
        if(!e.shiftKey){
            posalji(e);
        }
    }
});

//dodati zahtev za upisivanje nove poruke u bazu
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