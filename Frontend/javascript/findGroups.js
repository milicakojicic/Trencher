$(document).ready(function(){
    $.get("http://localhost:12345/kursevi", function(data){
        console.log(data);
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