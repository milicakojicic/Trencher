$(document).ready(function(){
    $.get("http://localhost:12345/kursevi", function(data){

        var kursevi = JSON.parse(data);
        var div = document.getElementById("sveGrupe");

        for(var i = 0; i < kursevi.length; i++){


            div.innerHTML += '<div class="mdl-list__item predmeti"> '+
                                '<span class="mdl-list__item-primary-content"> '+
                                    '<i class="material-icons mdl-list__item-avatar">school</i> '+
                                    '<span>' + kursevi[i].Name + '  ' + kursevi[i].Year + '</span> '+
                                '</span> '+
                                '<input type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect '+
                                'mdl-button--accent join" value="Pridruzi se" onclick="pridruziSeGrupi(this.id)" id="' + kursevi[i].ID + '"> '+
                            '</div> ';

        }

    });

});

function pridruziSeGrupi(idGrupe) {

    //ako je korisnik vec trazio da se pridruzi grupi, zahtev se ne salje
    if(!document.getElementById(idGrupe).value == "Pridruzi se"){
        console.log(document.getElementById(idGrupe).value);
    }
    //ako korisnik nije trazio da se pridruzi grupi, zahtev se salje
    else {
        //ajax poziv za pridruzivanje korisnika grupi
        document.getElementById(idGrupe).value = "Pridružen";
    }

}