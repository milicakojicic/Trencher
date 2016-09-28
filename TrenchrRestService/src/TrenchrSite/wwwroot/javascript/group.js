var brPolja = 3;
var ime = "#opcija" + brPolja;
var arr = [];
var imp = 0;
var rez = 0;
var glas= 0;
var mat = 0;
//niz opcija
var opcije_za_glasanje = [];

//testirati na predmetu Automatsko rezonovanje
var id_grupe = 0;
var id_korisnika = logedInUserID;
var id_konverzacije = 0;
var notifikacija = false;

//header za autorizaciju
var headers = {};

function procitaj() {
    if (notifikacija == true)
        window.location = '/inbox.html?konv=' + id_konverzacije;
    else
        window.location = '/group.html?grp=' + id_grupe;
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function () {

    if (user && user.access_token) {
        headers['Authorization'] = 'Bearer ' + user.access_token;
    }

    id_grupe = getParameterByName('grp');

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

    $('#groupPost').bind('input propertychange', function () {

        document.getElementById("publish").disabled = true;
        document.getElementById("publish").style.opacity = 0.5;
        document.getElementById("groupPost").placeholder = " ";

        if (this.value.length) {
            document.getElementById("publish").disabled = false;
            document.getElementById("publish").style.opacity = 1;
        }
    });

    //var parametar = getQueryParams(document.location.search);
    //var idGrupe = parametar.id;

    //ajax poziv za info o predmetu
    $.get("http://localhost:12345/kursevi/" + id_grupe, function (data) {

        var kurs = JSON.parse(data);

        document.getElementById("ime_grupe").innerText += kurs.Name + " " + kurs.Year;
    });

    //svi kursevi studenta kojima on pripada, da bi se prikazao u search-u
    $.ajax({
        url: 'http://localhost:12345/studenti/' + id_korisnika + '/kursevi',
        type: 'GET',
        headers: headers,
        dataType: 'json',
        success: function (json) {
            $.each(json, function (i, value) {
                $('#grupe').append($('<option>').attr('value', value.Name + " " + value.Year).attr('id', value.ID));
            });

            var pretraga_grupa = document.getElementById('fixed-header-drawer-exp');
            var trazi_grupe = document.getElementById('grupe');
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

    //OBJAVA POST-a
    $('#publish').click(function() {

        //vrednost textarea
        var text = document.getElementById("groupPost").value;
        var tip = "";
        var ind = "0";
        var seconds = new Date().getTime() / 1000;
        arr = [];
        var path = "";

        document.getElementById("publish").disabled = true;
        document.getElementById("publish").style.opacity = 0.5;
        document.getElementById("groupPost").value = "";

        if(imp != 0){
            ind = "1";
        }

        if(mat != 0){
            tip = "mat";
            //AJAX za unos materijala
            $.ajax({
                'type': 'post',
                'async': false,
                'headers': headers,
                'url': 'http://localhost:12345/postovi/materijali',
                'data': JSON.stringify({
                    "CourseID": id_grupe,
                    "Type": tip, //imam
                    "Text": text,
                    "Important": ind, //imam
                    "Time": seconds,
                    "UserId": id_korisnika,
                    "Path" : path
                }),
                'contentType': "application/json; charset=utf-8"
            });
        }

        else if(rez != 0){
            tip = "rez";
            //AJAX za unos rezultata
            $.ajax({
                'type': 'post',
                'async': false,
                'headers': headers,
                'url': 'http://localhost:12345/postovi/rezultati',
                'data': JSON.stringify({
                    "CourseID": id_grupe,
                    "Type": tip, //imam
                    "Text": text,
                    "Important": ind, //imam
                    "Time": seconds,
                    "UserId": id_korisnika,
                    "Path" : path
                }),
                'contentType': "application/json; charset=utf-8"
            });
        }

        else if (glas != 0) {
            tip = "glas";

            //uzimanje unetih opcija glasanja
            for(var i = 1; i <= brPolja; i++) {
                //da ne bismo prikazivali prazne opcije
                if(document.getElementById("opcija" + i).value != ''){
                    opcije_za_glasanje.push( document.getElementById("opcija" + i).value);
                }
                //ciscenje opcija za sl glasanje
                document.getElementById("opcija" + i).value = "";
            }
            //sklanjanje opcija za glasanje
            document.getElementById("poll").style.display = "none";

            //ajax poziv za insert u bazu i vracanje id-a unetog posta
            var odgovor = $.parseJSON(
                $.ajax({
                    'type': 'post',
                    'async': false,
                    'headers': headers,
                    'url': 'http://localhost:12345/postovi/glasanje',
                    'data': JSON.stringify({
                        "CourseID": id_grupe,
                        "Type": tip, //imam
                        "Text": text,
                        "Important": ind, //imam
                        "Time": seconds,
                        "UserId": id_korisnika
                    }),
                    'contentType': "application/json; charset=utf-8"
                }).responseText);

            for (var brojac = 0; brojac < opcije_za_glasanje.length; brojac++) {
                //pridruzivanje opcije postu
                $.ajax({
                    'type': 'post',
                    'async': false,
                    'headers': headers,
                    'url': 'http://localhost:12345/postovi/glasanje/opcija',
                    'data': JSON.stringify({
                        "ParentID": odgovor,
                        "Text":  opcije_za_glasanje[brojac]
                    }),
                    'contentType': "application/json; charset=utf-8"
                });
            }

            //brisanje niza za opcije
            opcije_za_glasanje = [];
        }

        else {
            tip = "obav";

            $.ajax({
                'type': 'post',
                'async': false,
                'headers': headers,
                'url': 'http://localhost:12345/postovi/obavestenja',
                'data': JSON.stringify({
                    "CourseID": id_grupe,
                    "Type": tip, //imam
                    "Text": text,
                    "Important": ind, //imam
                    "Time": seconds,
                    "UserId": id_korisnika
                }),
                'contentType': "application/json; charset=utf-8"
            });
        }

        //resetovanje indikatore za vrstu posta i sklanjanje bordera i opcija za postove
        imp = 0;
        mat = 0;
        rez = 0;
        glas = 0;
        document.getElementById("results").style.border = "0px solid teal";
        document.getElementById("materials").style.border = "0px solid teal";
        document.getElementById("vote").style.border = "0px solid teal";
        document.getElementById("important").style.border = "0px solid teal";
        document.getElementById("groupPost").placeholder = "Napisite post...";

        document.getElementById("rezultati").style.display = "none";
        document.getElementById("materijali").style.display = "none";

        document.getElementById("vote").disabled = false;
        document.getElementById("materials").disabled = false;
        document.getElementById("results").disabled = false;


        //brisanje sadrzaja strane i ucitavanje postova sa unetim postom
        document.getElementById("groupPosts").innerHTML = "";

        //GET za sve postove sortirane po vremenu objave

       //location.reload();

        //izmedju

    }); //KRAJ PRITISKA NA DUGME

    //GET za sve postove na odredjenoj grupi
    $.ajax({
        url: 'http://localhost:12345/postovi/' + id_grupe,
        type:'GET',
        dataType: 'json',
        headers: headers,
        async: false,
        success: function(postovi) {

            //div gde se prikazuju postovi
            var div = document.getElementById("groupPosts");

            //prolazi se kroz sve postove
            for(var i = 0; i < postovi.length; i++){

                var id_posta = postovi[i].ID;

                //pravljenje id za html elemente
                var autor = "autor_" + id_posta;
                var tipovi = "tipovi_" + id_posta;
                var komentar = "komentari_" + id_posta;
                var komentar_tekst = "kom_" + id_posta;

                div.innerHTML += '<div class="tip">' +
                    '<span id=' + autor + '>'+
                        // ubacivanje autora
                    '</span>' +
                    '<div class="mdl-grid tipovi" id=' + tipovi + '>' +
                        //ovde idu tagovi
                    '</div>' +
                    '</div>'+
                    '<div class="objava" id='+ id_posta +'>' +
                    postovi[i].Text + 
                    '</div>' +
                    '<div id = ' + komentar + '>' +
                        //ovde idu svi redom komentari
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield komentarDiv">'+
                    '<textarea class="mdl-textfield__input" type="text" rows="5" id=' + komentar_tekst + '  placeholder="Napišite komentar...." style="width: 30%; margin-inside: 20px;"></textarea>'+
                    ''+
                    '</div>';

                $("#" + komentar).css({"background-color": "whitesmoke"});
                $(".komentarDiv").css({"background-color": "whitesmoke", "margin-bottom":"20px", "width":"100%"});
                $("#" + komentar_tekst).css({"background-color": "whitesmoke", "display":"block", "width":"100%"});


                $('body').on('input onpropertychange', '#' + komentar_tekst, function() {
                    //document.getElementById(komentar_tekst).setAttribute("placeholder", "");
                });

                $('body').on('keydown', '#' + komentar_tekst, function(e) {
                    if (e.keyCode === 13 && !e.shiftKey) {
                        if (!e.shiftKey) {

                            var id = e.target.id;
                            var res = id.split("_");

                            var vrednost = $(this).val();

                            var promenljiva_za_objavu_komentara = "komentari_" + res[1];
                            var seconds = new Date().getTime() / 1000;

                            var id_unetog_komentara = $.parseJSON(
                                $.ajax({
                                    'type': 'post',
                                    'async': false,
                                    'headers': headers,
                                    'url': 'http://localhost:12345/postovi/komentari',
                                    'data': JSON.stringify({
                                        "ParentID": res[1], //id_post-a
                                        "UserID": id_korisnika, //imam
                                        "Text": vrednost,
                                        "Time": seconds
                                    }),
                                    'contentType': "application/json; charset=utf-8",
                                    success: function(komentarVrednost) {
                                    }
                                }).responseText);

                            //ajax poziv za bas taj komentar koji je unet

                            $.ajax({
                                url:'http://localhost:12345/postovi/' + res[1] + '/komentari/' + id_unetog_komentara,
                                type:'GET',
                                dataType: 'json',
                                headers: headers,
                                async: false,
                                success: function(komentarVrednost) {

                                    if(komentarVrednost[0].PicturePath == ""){
                                            document.getElementById(promenljiva_za_objavu_komentara).innerHTML += '<div><span>' +
                                                '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
                                                komentarVrednost[0].AuthorInfo + " " + komentarVrednost[0].Text +
                                                '</span>' +
                                                '</div>';
                                        }
                                    else {
                                            document.getElementById(promenljiva_za_objavu_komentara).innerHTML += '<div><span>' +
                                                '<img src="'+ komentarVrednost[0].PicturePath +'" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
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
                    url:'http://localhost:12345/postovi/' + id_posta + '/komentari',
                    type:'GET',
                    dataType: 'json',
                    async: false,
                    headers: headers,
                    success: function(komentarVrednost) {

                        for(var i = 0; i < komentarVrednost.length; i++) {

                            var koment= i;

                            if(komentarVrednost[i].PicturePath == ""){
                                document.getElementById(komentar).innerHTML += '<div><span id='+ koment +'>' +
                                    '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
                                    komentarVrednost[i].AuthorInfo + " " + komentarVrednost[i].Text +
                                    '</span>' +
                                    '</div>';
                            }
                            else {
                                document.getElementById(komentar).innerHTML += '<div><span id='+ koment +'>' +
                                    '<img src="'+ komentarVrednost[i].PicturePath +'" class="demo-avatar" style="margin-right: 10px;margin-left: 20px; margin-bottom: 10px">' +
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
                        'headers': headers,
                        'success' : function(data) {
                            var glasanje = JSON.parse(data);

                            for(var l = 0; l < glasanje.length; l++){

                                var id_checkbox = glasanje[l].ID + "_" + id_posta;

                                var brGlasova = "brGlasova" + glasanje[l].ID;

                                document.getElementById(id_posta).innerHTML += '' +
                                    '<div class="mdl-grid glas_ceo">' +
                                    '<div class="mdl-cell mdl-cell--10-col opcija">' +
                                        glasanje[l].Text +
                                    '</div>' +
                                    '<div class="mdl-cell mdl-cell--1-col">' +
                                    '<input type="checkbox" id='+id_checkbox+' class="mdl-checkbox__input " onclick="povecajBrojGlasova(this.id)"> ' +
                                    '</div>'+
                                    '<div class="mdl-cell mdl-cell--1-col glas" id='+brGlasova+'>' +
                                        glasanje[l].VotesCount +
                                    '</div>' +
                                    '</div>';
                            }
                        }
                    });
                }

                //profil slika za autora posta
                if(postovi[i].PicturePath == ""){
                    document.getElementById(autor).innerHTML += '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;">';
                    document.getElementById(autor).innerHTML += postovi[i].AuthorInfo;
                }
                else {
                    document.getElementById(autor).innerHTML += '<img src="'+ postovi[i].PicturePath +'"  class="demo-avatar" style="margin-right: 10px;">';
                    document.getElementById(autor).innerHTML += postovi[i].AuthorInfo;
                }
            }
        }
    });
});

//stavljanje bordera oko prikaza VAZNO
function dodajVazno() {
    if(imp == 0) {
        document.getElementById("important").style.border = "1px solid teal";
        imp = 1;
    }
    else {
        document.getElementById("important").style.border = "0px solid teal";
        imp = 0;
    }
}

//stavljanje bordera oko prikaza REZULTATI i dugmeta za UPLOAD
function dodajRezultati() {
    if(rez == 0) {
        document.getElementById("results").style.border = "1px solid teal";
        rez = 1;

        document.getElementById("rezultati").style.display = "block";
        document.getElementById("rezultati").innerHTML += ' <label for="files_results" class="btn" onclick="uploadFile()">Dodajte rezultate</label>' +
            '<input id="files_results" style="visibility:hidden;" type="file">';

        document.getElementById("vote").disabled = true;
        document.getElementById("materials").disabled = true;
    }
    else {
        document.getElementById("results").style.border = "0px solid teal";
        rez = 0;

        document.getElementById("rezultati").style.display = "none";
        document.getElementById("rezultati").innerHTML = "";

        document.getElementById("vote").disabled = false;
        document.getElementById("materials").disabled = false;
    }
}

//stavljanje bordera oko prikaza GLASANJE
function dodajGlasanje() {
    if(glas == 0) {
        document.getElementById("vote").style.border = "1px solid teal";
        document.getElementById("poll").style.display = "block";
        glas = 1;

        document.getElementById("results").disabled = true;
        document.getElementById("materials").disabled = true;
    }
    else {
        document.getElementById("vote").style.border = "0px solid teal";
        document.getElementById("poll").style.display = "none";
        glas = 0;

        document.getElementById("results").disabled = false;
        document.getElementById("materials").disabled = false;
    }
}

//stavljanje bordera oko prikaza MATERIJALI i dugmeta za UPLOAD
function dodajMaterijali() {
    if(mat == 0) {
        document.getElementById("materials").style.border = "1px solid teal";
        mat = 1;

        document.getElementById("materijali").style.display = "block";
        document.getElementById("materijali").innerHTML += ' <label for="files" class="btn">Dodajte materijale</label>' +
            '<input id="files" style="visibility:hidden;" type="file">';

        document.getElementById("vote").disabled = true;
        document.getElementById("results").disabled = true;

    }
    else {
        document.getElementById("materials").style.border = "0px solid teal";
        mat = 0;
        document.getElementById("materijali").style.display = "none";
        document.getElementById("materijali").innerHTML = "";

        document.getElementById("vote").disabled = false;
        document.getElementById("results").disabled = false;

    }
}

//funkcija za dodavanje nove opcije za glasanje
function poslednjaOpcija() {
    arr = [];

    //cuvanje unesenih vrednosti
    for(var i = 1; i <= brPolja; i++) {

        if(document.getElementById("opcija" + i) != null){
            arr.push(document.getElementById("opcija" + i).value);
        }
    }

    brPolja++;

    //dodavanje novog polje
    var promenljiva = "opcija" + brPolja;
    document.getElementById("opcije").innerHTML +=  '<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable ' +
        'mdl-textfield--floating-label mdl-textfield--align-left"> ' +
        '<label class="mdl-button mdl-js-button mdl-button--icon" ' +
        'for="opcija' + brPolja +
        '"> <i class="material-icons">lens</i> ' +
        '</label> ' +
    '<input class="mdl-textfield__input" type="text" name="sample" id="opcija' + brPolja +
    '" placeholder="dodaj opciju" style="margin-left: 50px"> ' +
    '</div> ';

    glasanje = document.getElementById("opcije").innerHTML;

    //promenljive iz niza se stavljaju u inpute
    for(var i = 1; i <= brPolja-1; i++) {
        if(document.getElementById("opcija" + i) != null){
            document.getElementById("opcija" + i).value = arr[i-1];
        }
    }
}

function povecajBrojGlasova(id) {

    //id_opcije razmak id_posta
    var res = id.split("_");

    if (document.getElementById(id).checked == true)
    {
        //ajax za update
        $.ajax({
            type: 'PUT',
            headers: headers,
            async: false,
            url: 'http://localhost:12345/opcije/' + res[0] + '/*',
            contentType: "application/json; charset=utf-8"
        });
    }
    else
    {
        //ajax za update
        $.ajax({
            type: 'PUT',
            headers: headers,
            async: false,
            url: 'http://localhost:12345/opcije/' + res[0] + '/-',
            contentType: "application/json; charset=utf-8"
        });
    }
        
    $.ajax({
        url:'http://localhost:12345/postovi/' + res[1] + '/opcije/' + res[0],
        type: 'GET',
        headers: headers,
        async: false,
        dataType: 'json',
        success: function( data ) {
            document.getElementById("brGlasova" + res[0]).innerHTML = data[0].VotesCount;
        }
    });
}

function uploadFile() {

}
