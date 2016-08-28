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
var id_grupe = 820;
var id_korisnika = 825;

$( document ).ready(function() {

    var parametar = getQueryParams(document.location.search);
    var idGrupe = parametar.id;

    //ajax poziv za info o predmetu
    $.get("http://localhost:12345/kursevi/" + id_grupe, function(data) {

        var kurs = JSON.parse(data);
        console.log(kurs);

        document.getElementById("ime_grupe").innerText += kurs.Name + " "+ kurs.Year;

    });

    //kada se krene pisati post
    $('#groupPost').bind('input propertychange', function() {

        document.getElementById("publish").disabled = true;
        document.getElementById("publish").style.opacity = 0.5;
        document.getElementById("groupPost").placeholder = " ";

        if(this.value.length){
            document.getElementById("publish").disabled = false;
            document.getElementById("publish").style.opacity = 1;

        }
    });

    $('#koment').bind('input propertychange', function() {

        document.getElementById("koment").placeholder = " ";

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
                'url': 'http://localhost:12345/postovi/materijali',
                'data': JSON.stringify({
                    "KursID": id_grupe,
                    "Caption": "Test", //obrisati
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
                'url': 'http://localhost:12345/postovi/rezultati',
                'data': JSON.stringify({
                    "KursID": id_grupe,
                    "Caption": "Test", //obrisati
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
                if(document.getElementById("opcija" + i) != null){
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
                    'url': 'http://localhost:12345/postovi/glasanje',
                    'data': JSON.stringify({
                        "KursID": id_grupe,
                        "Caption": "Test", //obrisati
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
                    'async' : false,
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
            //AJAX za unos obavestenja
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
        $.get("http://localhost:12345/postovi/" + id_grupe, function(data){

            var postovi = JSON.parse(data);
            //div gde se prikazuju postovi
            var div = document.getElementById("groupPosts");

            //prolazi se kroz sve postove
            for(var i = 0; i < postovi.length; i++){

                var id_posta = postovi[i].ID;

                console.log("ID_posta 1 " + id_posta);

                //pravljenje id za html elemente
                var autor = "autor" + id_posta;
                var tipovi = "tipovi" + id_posta;

                div.innerHTML += '<div class="tip">' +
                    '<span id=' + autor + '>'+
                        // ubacivanje autora
                    '</span>' +
                    '<div class="mdl-grid tipovi" id=' + tipovi + '>' +
                        //ovde idu tagovi
                    '</div>' +
                    '</div>'+
                    '<div class="objava" id='+ id_posta +'>' +
                    postovi[i].Text + id_posta +
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield komentar">'+
                    '<textarea class="mdl-textfield__input" type="text" rows="5" id="koment"></textarea>'+
                    '<label class="mdl-textfield__label" for="koment">Napišite komentar...</label>'+
                    '</div>';


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

                    console.log("ID_posta 2 " + id_posta);

                    //vrati opcije i stavi ga u pravi post
                    $.ajax({
                        'type': 'get',
                        'url': 'http://localhost:12345/postovi/' + id_posta + '/opcije',
                        'async': false,
                        'success' : function(data) {
                            var glasanje = JSON.parse(data);

                            console.log("ID_posta 3 " + id_posta);

                            for(var l = 0; l < glasanje.length; l++){
                                document.getElementById(id_posta).innerHTML += '' +
                                    '<div class="mdl-grid glas_ceo">' +
                                    '<div class="mdl-cell mdl-cell--10-col opcija">' +
                                    glasanje[l].Text +
                                    '</div>' +
                                    '<div class="mdl-cell mdl-cell--1-col">' +
                                    '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox2"> '+
                                    '<input type="checkbox" id="checkbox2" class="mdl-checkbox__input"> ' +
                                    '</label>' +
                                    '</div>'+
                                    '<div class="mdl-cell mdl-cell--1-col glas">' +
                                    glasanje[l].BrojGlasova +
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

        });

    }); //KRAJ PRITISKA NA DUGME

    //GET za sve postove na odredjenoj grupi
    $.get("http://localhost:12345/postovi/" + id_grupe, function(data){

        var postovi = JSON.parse(data);
        //div gde se prikazuju postovi
        var div = document.getElementById("groupPosts");

        //prolazi se kroz sve postove
        for(var i = 0; i < postovi.length; i++){

            var id_posta = postovi[i].ID;

            //pravljenje id za html elemente
            var autor = "autor" + id_posta;
            var tipovi = "tipovi" + id_posta;

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
                             '<div class="mdl-textfield mdl-js-textfield komentar">'+
                                 '<textarea class="mdl-textfield__input" type="text" rows="5" id="koment"></textarea>'+
                                 '<label class="mdl-textfield__label" for="koment">Napišite komentar...</label>'+
                             '</div>';


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
                    'success' : function(data) {
                        var glasanje = JSON.parse(data);

                        for(var l = 0; l < glasanje.length; l++){
                            document.getElementById(id_posta).innerHTML += '' +
                                '<div class="mdl-grid glas_ceo">' +
                                '<div class="mdl-cell mdl-cell--10-col opcija">' +
                                glasanje[l].Text +
                                '</div>' +
                                '<div class="mdl-cell mdl-cell--1-col">' +
                                '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox2"> '+
                                '<input type="checkbox" id="checkbox2" class="mdl-checkbox__input"> ' +
                                '</label>' +
                                '</div>'+
                                '<div class="mdl-cell mdl-cell--1-col glas">' +
                                glasanje[l].BrojGlasova +
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

    });

});

//uzimanje argumenata iz url-a
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

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
        document.getElementById("rezultati").innerHTML += ' <label for="files_results" class="btn">Dodajte rezultate</label>' +
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
