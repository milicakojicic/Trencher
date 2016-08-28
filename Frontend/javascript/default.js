//id studenta ciji je profil
var id_korisnika = 825;

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

    //GET za sve postove koji su u grupama koje korisnik prati


});