var id_korisnika = 625;
var kurseviOsobe = "";
var kurseviSvi = "";

$(document).ready(function(){


    //uzimanje podataka o svim kursevima
    kurseviSvi = $.parseJSON(
        $.ajax({
            'async': false,
            'type': "GET",
            'dataType': 'json',
            'global': false,
            'url': "http://localhost:12345/kursevi"
        }).responseText);

    //MICI OVO JE ZA TEBE
    //uzimanje podataka o kursevima prijaveljene osobe
     kurseviOsobe = $.parseJSON(
        $.ajax({
            'async': false,
            'type': "GET",
            'dataType': 'json',
            'global': false,
            'url': "http://localhost:12345/studenti/625/kursevi"
        }).responseText);

    //div u kome treba da se prikazu kursevi
    var div = document.getElementById("sveGrupe");

    //prikazivanje kurseva koje prati ulogovana osoba sa dugmetom PRIDRUZEN
    for(var i = 0; i < kurseviOsobe.length; i++){

        div.innerHTML += '<div class="mdl-list__item predmeti"> '+
            '<span class="mdl-list__item-primary-content"> '+
            '<i class="material-icons mdl-list__item-avatar">school</i> '+
            '<span>' + kurseviOsobe[i].Name + '  ' + kurseviOsobe[i].Year + '</span> '+
            '</span> '+
            '<input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect '+
            'mdl-button--accent join" value="Pridružen" onclick="pridruziSeGrupi(this.id)" id="' + kurseviOsobe[i].ID + '"> '+
            '</div> ';

    }


});

function pridruziSeGrupi(idGrupe) {

    //ako je korisnik vec trazio da se pridruzi grupi, zahtev se ne salje
    if(!document.getElementById(idGrupe).value == "Pridruzi se"){
        console.log(document.getElementById(idGrupe).value);
    }
    //ako korisnik nije trazio da se pridruzi grupi, zahtev se salje
    else {
        //ajax poziv za pridruzivanje korisnika grupi
        document.getElementById(idGrupe).value = "Pridružen";
    }

}