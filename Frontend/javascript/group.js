var brPolja = 3;
var ime = "#opcija" + brPolja;
var arr = [];
//testirati na predmetu Automatsko rezonovanje
var id_grupe = 760;
var id_korisnika = 781;
var k = 0;

$( document ).ready(function() {

    //ajax poziv za info o predmetu

    $.get("http://localhost:12345/kursevi/" + id_grupe, function(data) {

        var kurs = JSON.parse(data);
        console.log(kurs);

        document.getElementById("ime_grupe").innerText += kurs.Name;

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


    var parametar = getQueryParams(document.location.search);
    var idGrupe = parametar.id;
    console.log(idGrupe);
    //napisati GET zahtev za podatke o grupi za taj idGrupe

    //napisati POST za insert u bazu



    //OBJAVA POST-a
    $('#publish').click(function() {
        k++;
        var prosli = document.getElementById("groupPosts").innerHTML;
        //vrednost textarea
        var text = document.getElementById("groupPost").value;
        var objava = "";
        var glasanje = "";
        var tip = "";
        var ind = "0";
        var dt = new Date();
        var utcDate = dt.toUTCString();

        var ime_korisnika = "";
        var prezime_korisnika = "";
        var slika = "";
        var a = "slika";
        var res_slika = a.concat(k.toString());

        arr = [];
        document.getElementById("publish").disabled = true;
        document.getElementById("publish").style.opacity = 0.5;
        document.getElementById("groupPost").value = "";


        //gornji deo, slika i tagovi
        objava += '<div class="tip">' +
                    '<span id= '+res_slika+'>'+
                    '</span>' +
                    '<div class="mdl-grid tipovi" id="tipovi">' +
                        //ovde idu tagovi
                    '</div>' +
                  '</div>';


        if(glas != 0){

            glasanje+= "<br>";


            for(var i = 1; i <= brPolja; i++) {
                if(document.getElementById("opcija" + i) != null){

                    glasanje += '<div class="mdl-grid glas_ceo">' +

                        '<div class="mdl-cell mdl-cell--10-col opcija">' +
                        document.getElementById("opcija" + i).value +
                        '</div>' +
                        '<div class="mdl-cell mdl-cell--1-col">' +
                        '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox2"> '+
                        '<input type="checkbox" id="checkbox2" class="mdl-checkbox__input"> ' +
                        '</label>' +
                        '</div>'+
                        '<div class="mdl-cell mdl-cell--1-col glas">' +
                        '2+' +
                        '</div>' +
                        '</div>';
                }

                document.getElementById("opcija" + i).value = "";
            }

            document.getElementById("poll").style.display = "none";

        }



        document.getElementById("groupPosts").innerHTML = objava +
            '<div class="objava"> ' +
            text + glasanje +  '</div>' + '<div class="mdl-textfield mdl-js-textfield komentar">'+
            '<textarea class="mdl-textfield__input" type="text" rows="5" id="koment1"></textarea>'+
            '<label class="mdl-textfield__label" for="koment1">Napišite komentar...</label>'+
            '</div>'+
            prosli;


          $.get("http://localhost:12345/korisnici/" + id_korisnika, function(data) {

            var korisnik = JSON.parse(data);
            console.log(korisnik);

            ime_korisnika = korisnik.Name; console.log(ime_korisnika);
            prezime_korisnika = korisnik.Surname; console.log(prezime_korisnika);
            slika = korisnik.PicturePath; console.log(slika);

            if(slika == ""){
              document.getElementById(res_slika).innerHTML += '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;">';
              document.getElementById(res_slika).innerHTML += ime_korisnika + " " + prezime_korisnika;
            }
            else {
              document.getElementById(res_slika).innerHTML += '<img src="'+ slika +'"  class="demo-avatar" style="margin-right: 10px;">';
              document.getElementById(res_slika).innerHTML += ime_korisnika + " " + prezime_korisnika;
            }

        });




        if(imp != 0){
            document.getElementById("tipovi").innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Vazno</span></div>';
            ind = "1";
        }

        if(mat != 0){
            document.getElementById("tipovi").innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center"> Materijali</span></div>';
            tip = "mat";
        }

        else if(rez != 0){
            document.getElementById("tipovi").innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Rezultati</span></div>';
            tip = "rez";
        }

        else if (glas != 0) {
            document.getElementById("tipovi").innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Glasanje</span></div>';
            tip = "glas";
        }

        else
            tip = "obav";

        console.log(objava);
        console.log(text);


        //dodavanje opcija za glasanje u objavu nakon teksta

        imp = 0;
        mat = 0;
        rez = 0;
        glas = 0;
        document.getElementById("results").style.border = "0px solid teal";
        document.getElementById("materials").style.border = "0px solid teal";
        document.getElementById("vote").style.border = "0px solid teal";
        document.getElementById("important").style.border = "0px solid teal";
        document.getElementById("groupPost").placeholder = "Napisite post...";


        //ajax poziv za insert u bazu

        $.ajax({
            type: 'post',
            url: 'http://localhost:12345/postovi/obavestenja',
            data: JSON.stringify( {
                "KursID" : id_grupe,
                "Caption" : "Test", //obrisati
                "Type" : tip, //imam
                "Text" : text,
                "Important" : ind, //imam
                "Time": utcDate, // var seconds = new Date().getTime() / 1000; ako cuvamo kao int
                "UserId" : id_korisnika
            }),
            contentType: "application/json; charset=utf-8"
        });


    });


    //GET za sve postove na odredjenoj grupi
    $.get("http://localhost:12345/postovi/" + id_grupe, function(data){

        console.log(data);

        var postovi = JSON.parse(data);
        var div = document.getElementById("groupPosts");

        //prolazi se kroz sve postove
        for(var i = 0; i < postovi.length; i++){

            var str1 = "post";
            var res = str1.concat(i.toString());

            var str2 = "author";
            var res1 = str2.concat(i.toString());



            div.innerHTML += '<div class="tip">' +
                                 '<span id=' + res1+ '>'+
                                 '</span>' +
                                 '<div class="mdl-grid tipovi" id=' + res + '>' +
                                    //ovde idu tagovi
                                 '</div>' +
                             '</div>'+
                             '<div class="objava">' +
                                 postovi[i].Text +
                             '</div>'+
                             '<div class="mdl-textfield mdl-js-textfield komentar">'+
                                 '<textarea class="mdl-textfield__input" type="text" rows="5" id="koment"></textarea>'+
                                 '<label class="mdl-textfield__label" for="koment">Napišite komentar...</label>'+
                             '</div>';


            if (postovi[i].Important === "1") {
                document.getElementById(res).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Vazno</span></div>';
            }

            if (postovi[i].Type === "mat") {
                document.getElementById(res).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Materijali</span></div>';
            }


            else if (postovi[i].Type === "rez") {
                document.getElementById(res).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Rezultati</span></div>';
            }

            else if (postovi[i].Type === "glas") {
                document.getElementById(res).innerHTML += '<div class="mdl-cell mdl-cell--3-col tipPosta"> <span class="center">Glasanje</span></div>';
            }


            //profil slika
            if(postovi[i].PicturePath == ""){
                document.getElementById(res1).innerHTML += '<img src="images/default.png" class="demo-avatar" style="margin-right: 10px;">';
                document.getElementById(res1).innerHTML += postovi[i].AuthorInfo;
            }
            else {
                document.getElementById(res1).innerHTML += '<img src="'+ postovi[i].PicturePath +'"  class="demo-avatar" style="margin-right: 10px;">';
                document.getElementById(res1).innerHTML += postovi[i].AuthorInfo;
            }

        }

    });

});

var imp = 0;
var rez = 0;
var glas= 0;
var mat = 0;

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

function dodajRezultati() {
    if(rez == 0) {
        document.getElementById("results").style.border = "1px solid teal";
        rez = 1;

        document.getElementById("rezultati").style.display = "block";
        document.getElementById("rezultati").innerHTML += ' <label for="files_results" class="btn">Dodajte rezultate</label>' +
            '<input id="files_results" style="visibility:hidden;" type="file">';
    }
    else {
        document.getElementById("results").style.border = "0px solid teal";
        rez = 0;

        document.getElementById("rezultati").style.display = "none";
        document.getElementById("rezultati").innerHTML = "";
    }

}

function dodajGlasanje() {
    if(glas == 0) {
        document.getElementById("vote").style.border = "1px solid teal";
        document.getElementById("poll").style.display = "block";
        glas = 1;
    }
    else {
        document.getElementById("vote").style.border = "0px solid teal";
        document.getElementById("poll").style.display = "none";
        glas = 0;
    }



    console.log(arr);


}

function dodajMaterijali() {
    if(mat == 0) {
        document.getElementById("materials").style.border = "1px solid teal";
        mat = 1;

        document.getElementById("materijali").style.display = "block";
        document.getElementById("materijali").innerHTML += ' <label for="files" class="btn">Dodajte materijale</label>' +
           '<input id="files" style="visibility:hidden;" type="file">';

    }
    else {
        document.getElementById("materials").style.border = "0px solid teal";
        mat = 0;
        document.getElementById("materijali").style.display = "none";
        document.getElementById("materijali").innerHTML = "";
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

function prokaziProfil(id) {

    console.log(id);
}