var focus = 0,
    blur = 0;
var id_konverzacije
var id_korisnika = logedInUserID;
var id_grupe = 0;
var notifikacija = null;

var HubProxy;

//header za autorizaciju
var headers = {};

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function osveziPoruke() {
    $.get("http://localhost:12345/konverzacije/" + id_konverzacije, function (data) {

        var poruke = JSON.parse(data);
        var div = document.getElementById("poruke");
        var i;
        div.innerHTML = "";

        for (i = poruke.length-1; i >= 0; i--) {
            if (poruke[i].UserID == id_korisnika)
                div.innerHTML +='<div class="mdl-grid divZaPoruku">' +
                                     '<div class="mdl-cell mdl-cell--6-col"></div>' +
                                     '<div class="mdl-cell mdl-cell--6-col">' +
                                         '<div class="pojedinacnaPorukaDiv">' +
                                             '<span class="pojedinacnaPorukaMoja">' + poruke[i].Text + '</span>' +
                                         '</div>' +
                                     '</div>' +
                                 '</div>';
            else
                div.innerHTML +='<div class="mdl-grid divZaPoruku">' +
                                     '<div class="mdl-cell mdl-cell--6-col"></div>' +
                                        '<div class="pojedinacnaPorukaDiv">' +
                                             '<span class="pojedinacnaPorukaTudja">' + poruke[i].Text + '</span>' +
                                         '</div>' +
                                     '</div>' +
                                     '<div class="mdl-cell mdl-cell--6-col">' +
                                 '</div>';
        }
    });

    var div = document.getElementById("poruke");
    div.scrollTop = div.scrollHeight;
}

function procitaj() {
    if (notifikacija == true)
        window.location = '/inbox.html?konv=' + id_konverzacije;
    else if (notifikacija == false)
        window.location = '/group.html?grp=' + id_grupe;
}

$(document).ready(function() {

    var cookie = document.cookie.split(' ');
    headers['Authorization'] = 'Bearer ' + cookie[0];
    logedInUserID = cookie[1];

    $('#posaljiPoruku').click(function () {
        //cuvanje nove poruke u bazi
        $.ajax({
            'type': 'post',
            'url': 'http://localhost:12345/konverzacije/' + id_konverzacije + '/poruke',
            'contentType': 'application/json; charset=utf-8',
            'headers': headers,
            'data': JSON.stringify({
                "UserID": id_korisnika,
                "Text": document.getElementById("poruka").value,
                "Time": new Date().toLocaleString(),
                "ConversationID": id_konverzacije
            }),
            success: function () {
                osveziPoruke();
            }
        });
    });

    if (getParameterByName('konv') == null)
    {
        document.getElementById('poruke').hidden = true;
        document.getElementById('porukaDiv').hidden = true;
        document.getElementById('posaljiPoruku').hidden = true;
        document.getElementById('poruka').hidden = true;
        document.getElementById('message').hidden = true;
    }
    else
    {
        document.getElementById('poruke').hidden = false;
        document.getElementById('porukaDiv').hidden = false;
        document.getElementById('posaljiPoruku').hidden = false;
        document.getElementById('poruka').hidden = false;
        document.getElementById('message').hidden = false;
        id_konverzacije = getParameterByName('konv');
        osveziPoruke();
    }

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

        var headerSlika = document.getElementById("korisnik");

        //dodavanje slike studenta
        if (student.PicturePath == "")
            headerSlika.innerHTML = '<img src="images/default.png" class="demo-avatar">';
        else
            headerSlika.innerHTML = '<img src="' + student.PicturePath + '"  class="demo-avatar">';

        var spanUser = document.getElementById("korisnik");
        spanUser.innerHTML += student.Name + " " + student.Surname;
        var spanMail = document.getElementById("mail");
        spanMail.innerHTML = "";
        spanMail.innerText += student.Email;
    });

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

    //svi kursevi studenta kojima on pripada, da bi se prikazali
    $.ajax({
        url: 'http://localhost:12345/studenti/' + id_korisnika + '/kursevi',
        type: 'GET',
        headers: headers,
        dataType: 'json',
        success: function (json) {
            var trazi_grupe = document.getElementById('trazi_grupe');
            trazi_grupe.innerHTML = "";

            $.each(json, function (i, value) {
                $('#trazi_grupe').append($('<option>').attr('value', value.Name + " " + value.Year).attr('id', value.ID));
            });

            var pretraga_grupa = document.getElementById('fixed-header-drawer-exp');
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
    });

    var studenti = [];
    var state = "";

    $.ajax({
        url: "http://localhost:12345/studenti",
        type: "GET",
        headers: headers,
        async: false,
        success: function (data) {

            var osobe = JSON.parse(data);

            for (var i = 0; i < osobe.length; i++) {

                var a = {};
                a.id = osobe[i].ID;
                a.text = [osobe[i].Name + " " + osobe[i].Surname, osobe[i].PicturePath];

                studenti.push(a);
            }
        }
    });

     $(".js-example-data-array").select2({
         data: studenti,
         minimumResultsForSearch: -1,
         placeholder: function(){
             $(this).data('placeholder');
         }
     });

    $(function(){
        $(".js-example-data-array").select2({

            templateResult: function (data) {
                var str = data.text;
                var res = str.split(",");

                return $('<span>').html(data).append('<img src="' + res[1] + '"  style="height:20px; width: 20px; margin-right: 20px;">').append(res[0]);
            }, // Format funkcija za izabrani item
            escapeMarkup: function(m) {
                return m;
            }
        });
    });

    //fja koja se pokrece kada je izabrana osoba
    $('.js-example-data-array').on("select2:selecting", function (e) {
        var test = '';
        id_korisnika_2 = e.params.args.data.id;
        $.ajax({
            url: 'http://localhost:12345/korisnici/' + id_korisnika + '/konverzacije/' + id_korisnika_2,
            type: 'GET',
            headers: headers,
            dataType: 'json',
            success: function (result) {
                id_konverzacije = result;
                notifikacija = true;
                procitaj(); 
            }
        });
    });

    //fja u kojoj treba za izabranu osobu prikazati dosadasnji chat sa njom
    $("#pretraziOsobe")
        .focusout(function () {
            console.log("Ljubica");
        });

    //dodavanje mogucnost da se salje poruka na ENTER
    var poruka = document.getElementById("poruka");
    poruka.addEventListener("keydown", function (e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            if (!e.shiftKey) {
                posalji();
            }
        }
    });
});
