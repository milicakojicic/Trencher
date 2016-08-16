var brPolja = 3;
var ime = "#opcija" + brPolja;
var arr = [];

$( document ).ready(function() {

    $('#groupPost').bind('input propertychange', function() {

        document.getElementById("publish").disabled = true;
        document.getElementById("publish").style.opacity = 0.5;
        document.getElementById("groupPost").placeholder = " ";

        if(this.value.length){
            document.getElementById("publish").disabled = false;
            document.getElementById("publish").style.opacity = 1;

        }
    });

});

var imp = 0;
var rez = 0;
var glas= 0;
var mat = 0;


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

function objaviPost() {

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

        glasanje+= '<ul class="demo-list-icon mdl-list">';

        for(var i = 1; i <= brPolja; i++) {
            if(document.getElementById("opcija" + i) != null){

                glasanje +=
                    '<li class="mdl-list__item"> '+
                    '    <span class="mdl-list__item-primary-content glas"> '+
                            document.getElementById("opcija" + i).value +
                            '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox2"> '+
                            '<input type="checkbox" id="checkbox2" class="mdl-checkbox__input"> ' +
                            '</label>' +
                    '   </span> '+
                    '</li>';
            }

            document.getElementById("opcija" + i).value = "";
        }

        glasanje += '</ul>';
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

