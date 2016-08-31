//id studenta ciji je profil
var id_korisnika = 1249;

function pogledajGrupu(idGrupe) {
    url = "group.html";
    window.location.href = url + "?id=" + idGrupe;
}

$(document).ready(function() {

    //GET za sve grupe koje korisnik prati
    $.get("http://localhost:12345/studenti/" + id_korisnika + "/kursevi", function(data){

        var kursevi = JSON.parse(data);
        var div = document.getElementById("mojeGrupe");

        div.innerHTML += '<div class="demo-list-action mdl-list ">';

        for(var i = 0; i < kursevi.length; i++){

            div.innerHTML += '<div class="mdl-list__item predmeti" onclick="pogledajGrupu(this.id)" id="'+ kursevi[i].ID +'"> '+
                                '<span class="mdl-list__item-primary-content"> '+
                                '<i class="material-icons mdl-list__item-avatar">school</i> '+
                                '<span>' + kursevi[i].Name + " " +kursevi[i].Year +'</span> '+
                                '</span> '+
                            '</div>';

        }

        div.innerHTML += '</div>';

    });

    //svi kursevi studenta kojima on pripada, da bi se prikazao u search-u
    $.ajax({
        url:'http://localhost:12345/studenti/' + id_korisnika + '/kursevi',
        type:'GET',
        dataType: 'json',
        success: function( json ) {
            $.each(json, function(i, value) {
                $('#trazi_grupe').append($('<option>').attr('value', value.Name + " " + value.Year));
            });
        }
    });

    //GET za sve postove koji su u grupama koje korisnik prati
    $.get("http://localhost:12345/studenti/" + id_korisnika + '/kursevi/postovi', function(data){
        //svi postovi koji treba da se prikazu
        var postovi = JSON.parse(data);

        //div gde se prikazuju postovi
        var div = document.getElementById("postoviGrupe");

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