var focus = 0,
    blur = 0;
var id_konverzacije = 628, id_korisnika = 600;

var HubProxy;

function posaljiPoruku() {
    //cuvanje nove poruke u bazi
    $.ajax({
        'type': 'post',
        'async': false,
        'url': 'http://localhost:12345/konverzacije/' + id_konverzacije + '/poruke',
        'data': JSON.stringify({
            "UserID": id_korisnika,
            "Text": document.getElementById("poruka").value,
            "Time": new Date().toLocaleString(),
            "ConversationID": id_konverzacije
        }),
        'contentType': "application/json; charset=utf-8",
        success: function () {
            osveziPoruke();
        }
    });
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

function procitajPoruku() {
    window.location = '/inbox.html';
}

$(document).ready(function() {

    osveziPoruke();

    //pravljenje konekcije na server
    var connection = $.hubConnection('http://localhost:12345/signalr', { useDefaultPath: false });
    HubProxy = connection.createHubProxy('trenchrhub');

    //signali koje klijent prima
    HubProxy.on('newMessage', function (tekst, posiljalac_id, posiljalacIme, id_konv) {
        //if (posiljalac_id != id_korisnika) {
            document.getElementById("posiljalacPoruke").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
            document.getElementById("tekstPoruke").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
            id_konverzacije = id_konv;
            document.getElementById("notifikacija").style = "visibility: visible;";
        //}
    });

    //konektovanje na server
    connection.start({ jsonp: true })
        .done(function () { console.log("SignalR connected"); })
        .fail(function () { console.log("SignalR connection failed"); });

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
        dataType: 'json',
        success: function (json) {
            $.each(json, function (i, value) {
                $('#trazi_grupe').append($('<option>').attr('value', value.Name + " " + value.Year));
            });
        }
    });

    var studenti = [];
    var state = "";

    $.ajax({
        url: "http://localhost:12345/studenti",
        type: "get",
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

    console.log(studenti);

     $(".js-example-data-array").select2({
        data: studenti,
         minimumResultsForSearch: -1,
         placeholder: function(){
             $(this).data('placeholder');
         }
     });

    $(function(){

        $(".js-example-data-array").select2({

            templateResult: function(data){

                var str = data.text;
                var res = str.split(",");

                return $('<span>').html(data).append('<img src="'+ res[1]+ '"  style="height:20px; width: 20px; margin-right: 20px;">').append(res[0]);
            }       ,     // Specify format function for selected item
            escapeMarkup: function(m) {
                return m;
            }
        });
    });

    $("#pretraziOsobe")
    //fja u kojoj treba za izabranu osobu prikazati dosadasnji chat sa njom
        .focusout(function () {
            console.log("Ljubica");
        });

    //dodavanje mogucnost da se salje poruka na ENTER
    var poruka = document.getElementById("poruka");
    poruka.addEventListener("keydown", function (e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            if (!e.shiftKey) {
                posalji(e);
            }
        }
    });

    //dodati zahtev za upisivanje nove poruke u bazu
    function posalji(e) {
        var div = document.getElementById("poruke");

        //div.innerHTML += '<div class="mdl-grid divZaPoruku"> ' +
        //    '<div class="mdl-cell mdl-cell--6-col"> ' +
        //    '</div> ' +
        //    '<div class="mdl-cell mdl-cell--6-col"> ' +
        //    '<div class="pojedinacnaPorukaDiv "> ' +
        //    '<span class="pojedinacnaPorukaMoja">' + poruka.value + '</span> ' +
        //    '</div> ' +
        //    '</div> ' +
        //    '</div> ';

        //cuvanje poruke u bazi
        $.ajax({
            'type': 'get',
            'url': 'http://localhost:12345/postovi/' + id_posta + '/opcije',
            'async': false,
            'success': function (data) {
                var glasanje = JSON.parse(data);

                for (var l = 0; l < glasanje.length; l++) {
                    document.getElementById(id_posta).innerHTML += '' +
                        '<div class="mdl-grid glas_ceo">' +
                        '<div class="mdl-cell mdl-cell--10-col opcija">' +
                        glasanje[l].Text +
                        '</div>' +
                        '<div class="mdl-cell mdl-cell--1-col">' +
                        '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox2"> ' +
                        '<input type="checkbox" id="checkbox2" class="mdl-checkbox__input"> ' +
                        '</label>' +
                        '</div>' +
                        '<div class="mdl-cell mdl-cell--1-col glas">' +
                        glasanje[l].BrojGlasova +
                        '</div>' +
                        '</div>';
                }
            }
        });

        div.scrollTop = div.scrollHeight;
        poruka.value = "";
        poruka.placeholder = "Napisi poruku...";
    }
});
