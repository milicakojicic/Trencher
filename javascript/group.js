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
    }
    else {
        document.getElementById("results").style.border = "0px solid teal";
        rez = 0;
    }

}

function dodajGlasanje() {
    if(glas == 0) {
        document.getElementById("vote").style.border = "1px solid teal";
        glas = 1;
    }
    else {
        document.getElementById("vote").style.border = "0px solid teal";
        glas = 0;
    }

    //document.getElementById("poll").style.display = "block";
    //document.getElementById("poll").innerHTML = "";

    console.log(arr);


}

function dodajMaterijali() {
    if(mat == 0) {
        document.getElementById("materials").style.border = "1px solid teal";
        mat = 1;
    }
    else {
        document.getElementById("materials").style.border = "0px solid teal";
        mat = 0;
    }
}

function objaviPost() {

    var prosli = document.getElementById("groupPosts").innerHTML;
    var text = document.getElementById("groupPost").value;
    var objava = "";
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
    }

    objava +=  ' </div>';
    document.getElementById("groupPosts").innerHTML = objava +
        '<div class="objava" style="border: 1px solid teal;"> ' +
        text +  '</div>' + prosli;

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

function poslednjaOpcija() {
    arr = [];
    var ind = 0;

    //u petlji gledamo koja su polja popunjena i cuvamo njihove vrednosti u nizu arr
    for(var i = 1; i <= brPolja-1; i++){
        var promenljiva = "opcija" + i;

        if(document.getElementById(promenljiva) != null) {
            if (!document.getElementById(promenljiva).value.length) {
                ind = 1;
            }

            arr.push(document.getElementById(promenljiva).value);
        }
    }

    //ako su sva polja popunjena,dodajemo novo polje
    if(ind == 0){
        document.getElementById("opcija").focus();

        brPolja++;

        var promenljiva = "opcija" + brPolja;
        document.getElementById("poll").innerHTML +=  '<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable ' +
            'mdl-textfield--floating-label mdl-textfield--align-left"> ' +
            '<label class="mdl-button mdl-js-button mdl-button--icon" ' +
            'for="opcija3"> ' +
            '<i class="material-icons">add</i> ' +
            '</label> ' +
        '<input class="mdl-textfield__input" type="text" name="sample" ' +
        'id="opcija3" placeholder="dodaj opciju" style="margin-left: 50px" onclick="poslednjaOpcija()"> ' +
        '</div> ';

        console.log(arr);

        for(var i = 1; i <= brPolja-2; i++){
            var promenljiva = "opcija" + i;

            console.log(promenljiva + " " + arr[i-1]);
            document.getElementById(promenljiva).value = arr[i-1];

        }


    }

}

