//testirati na predmetu Automatsko rezonovanje
var id_korisnika = 600;

var kurseviOsobe = "";
var kurseviSvi = "";
//niz u kome se cuva ID svake grupe koju korisnik prati
var id_grupa = [];
var id_konverzacije = 0;
var id_grupe = 0;
var notifikacija = false;

function procitaj() {
    if (notifikacija == true)
        window.location = '/inbox.html?konv=' + id_konverzacije;
    else
        window.location = '/group.html?grp=' + id_grupe;
}

$(document).ready(function(){

    //pravljenje konekcije na server
    var connection = $.hubConnection('http://localhost:12345/signalr', { useDefaultPath: false });
    HubProxy = connection.createHubProxy('trenchrhub');

    //signali koje klijent prima
    HubProxy.on('newMessage', function (tekst, posiljalac_id, posiljalacIme, id_konv) {
        //if (posiljalac_id != id_korisnika) {
            document.getElementById("notifikacijaHeader").innerHTML = "NOVA PORUKA";
            document.getElementById("notifikacijaPosiljalac").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
            document.getElementById("notifikacijaTekst").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
            id_konverzacije = id_konv;
            document.getElementById("notifikacija").style = "visibility: visible;";
            notifikacija = true;
        //}
    });

    HubProxy.on('newPost', function (tipPosta, tekst, id_kursa, posiljalac_id, posiljalacIme) {
        //if (posiljalac_id != id_korisnika) {
        document.getElementById("notifikacijaHeader").innerHTML = tipPosta.toUpperCase();
        document.getElementById("notifikacijaPosiljalac").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
        document.getElementById("notifikacijaTekst").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
        id_grupe = id_kursa;
        document.getElementById("notifikacija").style = "visibility: visible;";
        notifikacija = false;
        //}
    });

    //konektovanje na server
    connection.start({ jsonp: true })
        .done(function () { console.log("SignalR connected"); })
        .fail(function () { console.log("SignalR connection failed"); });

    //uzimanje podataka o svim kursevima
    kurseviSvi = $.parseJSON(
        $.ajax({
            'async': false,
            'type': "GET",
            'dataType': 'json',
            'global': false,
            'url': "http://localhost:12345/kursevi",
            success: function( json ) {
                $.each(json, function(i, value) {
                    $('#sve_grupe').append($('<option>').attr('value', value.Name + " " + value.Year));
                });
            }
        }).responseText);

     //uzimanje podataka o kursevima prijaveljene osobe
     kurseviOsobe = $.parseJSON(
        $.ajax({
            'async': false,
            'type': "GET",
            'dataType': 'json',
            'global': false,
            'url': "http://localhost:12345/studenti/"+id_korisnika+"/kursevi",
            success: function( json ) {
                $.each(json, function(i, value) {
                    $('#trazi_grupe').append($('<option>').attr('value', value.Name + " " + value.Year));
                });
            }
        }).responseText);

    //div u kome treba da se prikazu kursevi
    var div = document.getElementById("sveGrupe");

    //prikazivanje kurseva koje prati ulogovana osoba sa dugmetom PRIDRUZEN
    for(var i = 0; i < kurseviOsobe.length; i++){

        id_grupa.push(kurseviOsobe[i].ID);

        div.innerHTML += '<div class="mdl-list__item predmeti"> '+
            '<span class="mdl-list__item-primary-content"> '+
            '<i class="material-icons mdl-list__item-avatar">school</i> '+
            '<span>' + kurseviOsobe[i].Name + '  ' + kurseviOsobe[i].Year + '</span> '+
            '</span> '+
            '<input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect '+
            'mdl-button--accent join" value="Pridružen" id="' + kurseviOsobe[i].ID + '" disabled> '+
            '</div> ';

    }
    //prikazivanje kurseva koje ne prati ulogovana osoba sa dugmetom PRIDRUZI SE
    for(var i = 0; i < kurseviSvi.length; i++){

        var ind = 0;

        for(var j=0; j < id_grupa.length; j ++){
            if(kurseviSvi[i].ID == id_grupa[j]){
                ind = 1;
            }
        }

        if(ind == 0){
            div.innerHTML += '<div class="mdl-list__item predmeti"> '+
                '<span class="mdl-list__item-primary-content"> '+
                '<i class="material-icons mdl-list__item-avatar">school</i> '+
                '<span>' + kurseviSvi[i].Name + '  ' + kurseviSvi[i].Year + '</span> '+
                '</span> '+
                '<input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect '+
                'mdl-button--accent join pridruzi" value="Pridruzi se" id="' + kurseviSvi[i].ID + '"> '+
                '</div> ';
        }
    }

    $('.pridruzi').click(function() {

        idGrupe = this.id;

        console.log(idGrupe + " " + id_korisnika);

        //ako je korisnik vec trazio da se pridruzi grupi, zahtev se ne salje
        if(!document.getElementById(idGrupe).value == "Pridruzi se"){
            console.log(document.getElementById(idGrupe).value);
        }
        //ako korisnik nije trazio da se pridruzi grupi, zahtev se salje
        else {
            //ajax poziv za pridruzivanje korisnika grupi
            document.getElementById(idGrupe).value = "Pridružen";
        }

        $.ajax({
            type: 'post',
            url: 'http://localhost:12345/kursevi/prijavljivanje',
            data: JSON.stringify( {
                "ID_korisnika" : id_korisnika,
                "ID_grupe" : idGrupe
            }),
            contentType: "application/json; charset=utf-8"
        });
    });
});

