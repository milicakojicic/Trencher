var brPolja = 3;
var ime = "#opcija" + brPolja;
var arr = [];

$( document ).ready(function() {

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


    var parametar = getQueryParams(document.location.search);
    var idGrupe = parametar.id;
    console.log(idGrupe);
    //napisati GET zahtev za podatke o grupi za taj idGrupe

    //napisati POST za insert u bazu
    $('#publish').click(function() {
        var prosli = document.getElementById("groupPosts").innerHTML;
        var text = document.getElementById("groupPost").value;
        var objava = "";
        var glasanje = "";
        arr = [];
        document.getElementById("publish").disabled = true;
        document.getElementById("publish").style.opacity = 0.5;
        document.getElementById("groupPost").value = "";

        objava += '<div class="tip">';

        if(imp != 0){
            objava += 'Važno ';
        }

        if(mat != 0){
            objava += 'Materijali  ';
        }

        if(rez != 0){
            objava += 'Rezultati  ';
        }

        if(glas != 0){
            objava += 'Glasanje ';

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

        objava +=  ' </div>';
        document.getElementById("groupPosts").innerHTML = objava +
            '<div class="objava" style="border: 1px solid teal;"> ' +
            text + glasanje +  '</div>' + prosli;

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
    });




    var id_grupe = 598;
    //GET za sve postove na odredjenoj grupi
    $.get("http://localhost:12345/postovi/" + id_grupe, function(data){

        console.log(data);

        var postovi = JSON.parse(data);
        var div = document.getElementById("groupPosts");

        //prolazi se kroz sve postove
        for(var i = 0; i < postovi.length; i++){

            var str1 = "post";
            var res = str1.concat(i.toString());

            div.innerHTML += '<div class="tip">' +
                                 '<span>  <img src="images/default.png" class="demo-avatar"> Ljubica Peleksic' +
                                 '</span>' +
                                 '<div class="naslov_posta">' + postovi[i].Caption + '</div>' +
                             '</div>'+
                             '<div class="objava">' +
                                '<div class="mdl-grid tipovi" id=' + res + '>' +
                                '</div>' +
                                postovi[i].Text +
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