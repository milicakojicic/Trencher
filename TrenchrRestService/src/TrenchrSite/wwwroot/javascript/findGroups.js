//testirati na predmetu Automatsko rezonovanje
var id_korisnika = logedInUserID;

var kurseviOsobe = "";
var kurseviSvi = "";
//niz u kome se cuva ID svake grupe koju korisnik prati
var id_grupa = [];
var id_konverzacije = 0;
var id_grupe = 0;
var notifikacija = false;

//header za autorizaciju
var headers = {};

function procitaj() {
    if (notifikacija == true)
        window.location = '/inbox.html?konv=' + id_konverzacije;
    else
        window.location = '/group.html?grp=' + id_grupe;
}

$(document).ready(function(){

    var cookie = document.cookie.split(' ');
    headers['Authorization'] = 'Bearer ' + cookie[0];
    logedInUserID = cookie[1];

    //pravljenje konekcije na server
    var connection = $.hubConnection('http://localhost:12345/signalr', { useDefaultPath: false });
    HubProxy = connection.createHubProxy('trenchrhub');

    //signali koje klijent prima
    HubProxy.on('newMessage', function (tekst, posiljalac_id, posiljalacIme, id_konv) {
        if (posiljalac_id != id_korisnika) {
            document.getElementById("notifikacijaHeader").innerHTML = "NOVA PORUKA";
            document.getElementById("notifikacijaPosiljalac").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
            document.getElementById("notifikacijaTekst").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
            id_konverzacije = id_konv;
            document.getElementById("notifikacija").style = "visibility: visible;";
            notifikacija = true;
        }
    });

    HubProxy.on('newPost', function (tipPosta, tekst, id_kursa, posiljalac_id, posiljalacIme) {
        if (posiljalac_id != id_korisnika) {
        document.getElementById("notifikacijaHeader").innerHTML = tipPosta.toUpperCase();
        document.getElementById("notifikacijaPosiljalac").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
        document.getElementById("notifikacijaTekst").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
        id_grupe = id_kursa;
        document.getElementById("notifikacija").style = "visibility: visible;";
        notifikacija = false;
        }
    });

    //konektovanje na server
    connection.start({ jsonp: true })
        .done(function () { console.log("SignalR connected"); })
        .fail(function () { console.log("SignalR connection failed"); });

    //GET za informacije o korisniku
    $.get("http://localhost:12345/studenti/" + id_korisnika, function (data) {
        var student = JSON.parse(data);
        var div = document.getElementById("divProfil");
        var divPic = document.getElementById("profile");

        var headerSlika = document.getElementById("korisnik");

        //dodavanje slike studenta
        if (student.PicturePath == "")
            headerSlika.innerHTML += '<img src="images/default.png" class="demo-avatar">';
        else
            headerSlika.innerHTML += '<img src="' + student.PicturePath + '"  class="demo-avatar">';

        var spanUser = document.getElementById("korisnik");
        spanUser.innerHTML += student.Name + " " + student.Surname;
        var spanMail = document.getElementById("mail");
        spanMail.innerText += student.Email;
    });

    //uzimanje podataka o svim kursevima
    kurseviSvi = $.parseJSON(
        $.ajax({
            'async': false,
            'type': "GET",
            'headers': headers,
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
            'headers': headers,
            'dataType': 'json',
            'global': false,
            'url': "http://localhost:12345/studenti/" + id_korisnika + "/kursevi",
            success: function( json ) {
                $.each(json, function(i, value) {
                    $('#trazi_grupe').append($('<option>').attr('value', value.Name + " " + value.Year).attr('id', value.ID));
                });

                var pretraga_grupa = document.getElementById('fixed-header-drawer-exp');
                var trazi_grupe = document.getElementById('trazi_grupe');
                var attr;

                pretraga_grupa.addEventListener("keyup", function (event) {
                    if (event.keyCode == 13) {
                        event.preventDefault();

                        if (pretraga_grupa.value.length != 0) {

                            for (var i = 0; i < trazi_grupe.options.length; i++) {
                                attr = trazi_grupe.options[i];

                                if (attr.value == pretraga_grupa.value)
                                    id_grupe = attr.id;
                            }

                            pretraga_grupa.value = '';
                            notifikacija = false;
                            procitaj();
                        }
                    }
                }, false);
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
            'mdl-button--accent join pridruzi" value="Pridružen" id="' + kurseviOsobe[i].ID + 'g"> ' +
            '</div> ';

    }
    //prikazivanje kurseva koje ne prati ulogovana osoba sa dugmetom PRIDRUZI SE
    for(var i = 0; i < kurseviSvi.length; i++){

        var ind = 0;

        for(var j=0; j < id_grupa.length; j ++){
            if (kurseviSvi[i].ID == id_grupa[j])
                ind = 1;
        }

        if(ind == 0){
            div.innerHTML += '<div class="mdl-list__item predmeti"> '+
                '<span class="mdl-list__item-primary-content"> '+
                '<i class="material-icons mdl-list__item-avatar">school</i> '+
                '<span>' + kurseviSvi[i].Name + '  ' + kurseviSvi[i].Year + '</span> '+
                '</span> '+
                '<input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect '+
                'mdl-button--accent join pridruzi" value="Pridruži se" id="' + kurseviSvi[i].ID + 'g"> ' +
                '</div> ';
        }
    }

    $('.pridruzi').click(function() {

        idGrupe = this.id;
        idGrupe = idGrupe.substring(0, idGrupe.length-1)

        //ako korisnik nije trazio da se pridruzi grupi, zahtev se salje
        if (document.getElementById(idGrupe + 'g').value == "Pridruži se") {
            $.ajax({
                type: 'post',
                url: 'http://localhost:12345/kursevi/prijava',
                headers: headers,
                data: JSON.stringify({
                    "ID_korisnika": id_korisnika,
                    "ID_grupe": idGrupe
                }),
                contentType: "application/json; charset=utf-8"
            });
            document.getElementById(idGrupe + 'g').value = "Pridružen";
        }
        //ako korisnik zeli da se odjavi iz grupe
        else {
            $.ajax({
                type: 'post',
                url: 'http://localhost:12345/kursevi/odjava',
                headers: headers,
                data: JSON.stringify({
                    "ID_korisnika": id_korisnika,
                    "ID_grupe": idGrupe
                }),
                contentType: "application/json; charset=utf-8"
            });
            document.getElementById(idGrupe + 'g').value = "Pridruži se";
        }
    });
});

