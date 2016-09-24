//id studenta ciji je profil
var id_korisnika = 600;
var id_konverzacije = 0;
var id_grupe = 0;
var notifikacija = false;

function pogledajGrupu(idGrupe) {
    url = "group.html";
    window.location.href = url + "?id=" + idGrupe;
}

function procitaj() {
    if (notifikacija == true)
        window.location = '/inbox.html?konv=' + id_konverzacije;
    else
        window.location = '/group.html?grp=' + id_grupe;
}

$(document).ready(function() {

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

    //GET za sve grupe koje korisnik prati
    //svi kursevi studenta kojima on pripada, da bi se prikazao u search-u
    $.ajax({
        url: 'http://localhost:12345/studenti/' + id_korisnika + '/kursevi',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            $.each(json, function (i, value) {
                $('#trazi_grupe').append($('<option>').attr('value', value.Name + " " + value.Year));
            });

            //div gde se prikazuju grupe
            var div = document.getElementById("mojeGrupe");

            //prolazi se kroz sve grupe
            for (var i = 0; i < json.length; i++) {

                var name = json[i].Name;
                var year = json[i].Year;

                div.innerHTML += '<div class="mdl-list__item grupe" id="grupa">' +
                                    '<span class="mdl-list__item-primary-content"> ' +
                                    '<i class="material-icons mdl-list__item-avatar">school</i> ' +
                                    '<a href="group.html" id="grupa">' + name + '  ' + year + '</a> ' +
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
                    postovi[i].Text + id_posta +
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
                            console.log("Ovo je id textarea na koju sam kliknula: " + id);
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
                            console.log(komentarVrednost[i].Text);

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
                                console.log("Id opcije:" + id_checkbox);
                                console.log(id_posta);

                                var brGlasova = "brGlasova" + glasanje[l].ID;

                                document.getElementById(id_posta).innerHTML += '' +
                                    '<div class="mdl-grid glas_ceo">' +
                                    '<div class="mdl-cell mdl-cell--10-col opcija">' +
                                    glasanje[l].Text +
                                    '</div>' +
                                    '<div class="mdl-cell mdl-cell--1-col">' + id_checkbox +
                                    '<input type="checkbox" id=' + id_checkbox + ' class="mdl-checkbox__input " onclick="povecajBrojGlasova(this.id)"> ' +
                                    '</div>' +
                                    '<div class="mdl-cell mdl-cell--1-col glas" id=' + brGlasova + '>' +
                                    glasanje[l].BrojGlasova +
                                    '</div>' +
                                    '</div>';
                            }
                        }
                    });
                }

                //profil slika za autora posta
                if (postovi[i].PicturePath == "") {
                    document.getElementById(autor).innerHTML += '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;">';
                    document.getElementById(autor).innerHTML += postovi[i].AuthorInfo;
                }
                else {
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

    //ajax za update
    $.ajax({
        type: 'put',
        async: false,
        url: 'http://localhost:12345/opcije/' + res[0],
        contentType: "application/json; charset=utf-8"
    });


    $.ajax({
        url:'http://localhost:12345/postovi/' + res[1] + '/opcije/' + res[0],
        type:'GET',
        async: false,
        dataType: 'json',
        success: function( data ) {
            console.log(data);
            document.getElementById("brGlasova" + res[0]).innerHTML = data[0].BrojGlasova;
        }
    });
}
