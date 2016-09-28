//id studenta ciji je profil
var id_korisnika = logedInUserID;
var id_konverzacije = 0;
var id_grupe = 0;
var notifikacija = false;

function procitaj() {
    if (notifikacija == true)
        window.location = '/inbox.html?konv=' + id_konverzacije;
    else
        window.location = '/group.html?grp=' + id_grupe;
}

$(document).ready(function() {

    var headers = {};
    if (user && user.access_token) {
        headers['Authorization'] = 'Bearer ' + user.access_token;
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
            headerSlika.innerHTML += '<img src="images/default.png" class="demo-avatar">';
        else
            headerSlika.innerHTML += '<img src="' + student.PicturePath + '"  class="demo-avatar">';

        var spanUser = document.getElementById("korisnik");
        spanUser.innerHTML += student.Name + " " + student.Surname;
        var spanMail = document.getElementById("mail");
        spanMail.innerText += student.Email;
    });


    //GET za sve grupe koje korisnik prati
    $.ajax({
        url: 'http://localhost:12345/studenti/' + id_korisnika + '/kursevi',
        type: 'GET',
        dataType: 'json',
        headers: headers,
        success: function (json) {
            $.each(json, function (i, value) {
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

                            console.log(id_grupe);
                        }

                        pretraga_grupa.value = '';
                        notifikacija = false;
                        procitaj();
                    }
                }
            }, false);

            //div gde se prikazuju grupe
            var div = document.getElementById("mojeGrupe");

            //prolazi se kroz sve grupe
            for (var i = 0; i < json.length; i++) {

                var name = json[i].Name;
                var year = json[i].Year;
                var url = "group.html?grp=" + json[i].ID;

                div.innerHTML += '<div class="mdl-list__item grupe" id="grupa">' +
                                    '<span class="mdl-list__item-primary-content"> ' +
                                    '<i class="material-icons mdl-list__item-avatar">school</i> ' +
                                    '<a href=\'' + url + '\' id="grupa">' + name + '  ' + year + '</a> ' +
                                    '</span> ' +
                                 '</div>';
            }

            div.innerHTML += '</div>';
        }
    });

    //GET za sve postove koji su u grupama koje korisnik prati
    $.ajax({
        url: 'http://localhost:12345/studenti/' + id_korisnika + '/kursevi/postovi',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (postovi) {

            //div gde se prikazuju postovi
            var div = document.getElementById("postoviGrupe");

            //prolazi se kroz sve postove
            for (var i = 0; i < postovi.length; i++) {

                var id_posta = postovi[i].ID;

                //pravljenje id za html elemente
                var autor = "autor_" + id_posta;
                var tipovi = "tipovi_" + id_posta;
                var komentar = "komentari_" + id_posta;
                var komentar_tekst = "kom_" + id_posta;

                div.innerHTML += '<div class="tip">' +
                    '<span id=' + autor + '>' +
                        // ubacivanje autora
                    '</span>' +
                    '<div class="mdl-grid tipovi" id=' + tipovi + '>' +
                        //ovde idu tagovi
                    '</div>' +
                    '</div>' +
                    '<div class="objava" id=' + id_posta + '>' +
                    postovi[i].Text +
                    '</div>' +
                    '<div id = ' + komentar + '>' +
                        //ovde idu svi redom komentari
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield komentarDiv">' +
                    '<textarea class="mdl-textfield__input" type="text" rows="5" id=' + komentar_tekst + '  placeholder="Napišite komentar...." style="margin-inside: 20px"></textarea>' +
                    '' +
                    '</div>';

                $("#" + komentar).css({"background-color": "whitesmoke"});
                $(".komentarDiv").css({"background-color": "whitesmoke", "margin-bottom": "20px", "width": "100%"});
                $("#" + komentar_tekst).css({
                    "background-color": "whitesmoke",
                    "display": "block",
                    "width": "100%"
                });

                $('body').on('input onpropertychange', '#' + komentar_tekst, function () {
                    console.log("mic");
                    //document.getElementById(komentar_tekst).setAttribute("placeholder", "");
                });

                $('body').on('keydown', '#' + komentar_tekst, function (e) {
                    if (e.keyCode === 13 && !e.shiftKey) {
                        if (!e.shiftKey) {

                            var id = e.target.id;
                            var res = id.split("_");

                            var vrednost = $(this).val();

                            var promenljiva_za_objavu_komentara = "komentari_" + res[1];
                            console.log(promenljiva_za_objavu_komentara);
                            console.log(vrednost);
                            var seconds = new Date().getTime() / 1000;

                            var id_unetog_komentara = $.parseJSON(
                                $.ajax({
                                    'type': 'post',
                                    'async': false,
                                    'url': 'http://localhost:12345/postovi/komentari',
                                    'data': JSON.stringify({
                                        "ParentID": res[1], //id_post-a
                                        "UserID": id_korisnika, //imam
                                        "Text": vrednost,
                                        "Time": seconds
                                    }),
                                    'contentType': "application/json; charset=utf-8",
                                    success: function (komentarVrednost) {
                                    }
                                }).responseText);

                            //id unetog komentara
                            console.log("Uneo sam post:" + id_unetog_komentara);

                            //ajax poziv za bas taj komentar koji je unet
                            $.ajax({
                                url: 'http://localhost:12345/postovi/' + res[1] + '/komentari/' + id_unetog_komentara,
                                type: 'GET',
                                dataType: 'json',
                                async: false,
                                success: function (komentarVrednost) {

                                    console.log("U ajaxu bre");
                                    console.log(komentarVrednost);

                                    if (komentarVrednost[0].PicturePath == "") {
                                        document.getElementById(promenljiva_za_objavu_komentara).innerHTML += '<div><span>' +
                                            '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
                                            komentarVrednost[0].AuthorInfo + " " + komentarVrednost[0].Text +
                                            '</span>' +
                                            '</div>';
                                    }
                                    else {
                                        document.getElementById(promenljiva_za_objavu_komentara).innerHTML += '<div><span>' +
                                            '<img src="' + komentarVrednost[0].PicturePath + '" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
                                            komentarVrednost[0].AuthorInfo + " " + komentarVrednost[0].Text +
                                            '</span>' +
                                            '</div>';
                                    }
                                }
                            });
                        }

                        document.getElementById("komentari_" + res[1]).focus();
                        document.getElementById("kom_" + res[1]).value = "";
                        document.getElementById("kom_" + res[1]).setAttribute("placeholder", "Napisite komentar");
                    }
                });

                $.ajax({
                    url: 'http://localhost:12345/postovi/' + id_posta + '/komentari',
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function (komentarVrednost) {

                        for (var i = 0; i < komentarVrednost.length; i++) {

                            var koment = i;

                            if (komentarVrednost[i].PicturePath == "") {
                                document.getElementById(komentar).innerHTML += '<div><span id=' + koment + '>' +
                                    '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
                                    komentarVrednost[i].AuthorInfo + " " + komentarVrednost[i].Text +
                                    '</span>' +
                                    '</div>';
                            }
                            else {
                                document.getElementById(komentar).innerHTML += '<div><span id=' + koment + '>' +
                                    '<img src="' + komentarVrednost[i].PicturePath + '" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
                                    komentarVrednost[i].AuthorInfo + " " + komentarVrednost[i].Text +
                                    '</span>' +
                                    '</div>';
                            }
                        }
                    }
                });

                if (postovi[i].Important === "1") {
                    document.getElementById(tipovi).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Vazno</span></div>';
                }

                if (postovi[i].Type === "mat") {
                    document.getElementById(tipovi).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Materijali</span></div>';
                }

                else if (postovi[i].Type === "rez") {
                    document.getElementById(tipovi).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Rezultati</span></div>';
                }

                else if (postovi[i].Type === "glas") {

                    document.getElementById(tipovi).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Glasanje</span></div>';

                    //vrati opcije i stavi ga u pravi post
                    $.ajax({
                        'type': 'get',
                        'url': 'http://localhost:12345/postovi/' + id_posta + '/opcije',
                        'async': false,
                        'success': function (data) {
                            var glasanje = JSON.parse(data);

                            for (var l = 0; l < glasanje.length; l++) {

                                var id_checkbox = glasanje[l].ID + "_" + id_posta;

                                var brGlasova = "brGlasova" + glasanje[l].ID;

                                document.getElementById(id_posta).innerHTML += '' +
                                    '<div class="mdl-grid glas_ceo">' +
                                    '<div class="mdl-cell mdl-cell--10-col opcija">' +
                                        glasanje[l].Text +
                                    '</div>' +
                                    '<div class="mdl-cell mdl-cell--1-col">' +
                                    '<input type="checkbox" id=' + id_checkbox + ' class="mdl-checkbox__input " onclick="povecajBrojGlasova(this.id)"> ' +
                                    '</div>' +
                                    '<div class="mdl-cell mdl-cell--1-col glas" id=' + brGlasova + '>' +
                                        glasanje[l].VotesCount +
                                    '</div>' +
                                    '</div>';
                            }
                        }
                    });
                }

                //profil slika za autora posta
                if (postovi[i].PicturePath == "") {
                    document.getElementById(autor).innerHTML += "<span style='font-size: 30px;'>" + postovi[i].Caption + "</span> <br /> <br />"
                    document.getElementById(autor).innerHTML += '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;">';
                    document.getElementById(autor).innerHTML += postovi[i].AuthorInfo;
                }
                else {
                    document.getElementById(autor).innerHTML += "<span style='font-size: 30px;'>" + postovi[i].Caption + "</span> <br /> <br />"
                    document.getElementById(autor).innerHTML += '<img src="' + postovi[i].PicturePath + '"  class="demo-avatar" style="margin-right: 10px;">';
                    document.getElementById(autor).innerHTML += postovi[i].AuthorInfo;
                }
            }
        }
    });
});

function povecajBrojGlasova(id) {

    //vraca bas taj id opcije
    console.log("U fji: " + id);

    //id_opcije razmak id_posta
    var res = id.split("_");

    console.log("Id opcije:" + res[0]);
    console.log("Id posta: " + res[1]);

    if (document.getElementById(id).checked == true) {
        //ajax za update
        $.ajax({
            type: 'PUT',
            async: false,
            url: 'http://localhost:12345/opcije/' + res[0] + '/*',
            contentType: "application/json; charset=utf-8"
        });
    }
    else {
        //ajax za update
        $.ajax({
            type: 'PUT',
            async: false,
            url: 'http://localhost:12345/opcije/' + res[0] + '/-',
            contentType: "application/json; charset=utf-8"
        });
    }

    $.ajax({
        url:'http://localhost:12345/postovi/' + res[1] + '/opcije/' + res[0],
        type:'GET',
        async: false,
        dataType: 'json',
        success: function( data ) {
            console.log(data);
            document.getElementById("brGlasova" + res[0]).innerHTML = data[0].VotesCount;
        }
    });
}
