/**
 * Created by Ljubica on 8.8.2016.
 */

function izmeniProfil() {

    document.getElementById("name").disabled = false;
    document.getElementById("surname").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("date").disabled = false;
    document.getElementById("city").disabled = false;
    document.getElementById("faculty").disabled = false;

    document.getElementById("edit").style.display="none";
    document.getElementById("save").style.display="inline";
    document.getElementById("resetuj").style.display="inline";

    document.getElementById("name").focus();

}

//funkcija koja vraca formu na podatke iz baze
function resetujFormu() {

}