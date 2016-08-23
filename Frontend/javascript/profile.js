/**
 * Created by Ljubica on 8.8.2016.
 */
//id studenta koji treba da se prikaze
var id = 450;

$(document).ready(function(){
    //dodati GET zahteve za fakultet i smer

    $.get("http://localhost:12345/studenti/" + id, function(data){

        var student = JSON.parse(data);
        var div = document.getElementById("divProfil");
        var divPic = document.getElementById("profile");


        var spanUser = document.getElementById("korisnik");
        spanUser.innerHTML += student.Name + " " + student.Surname;


        var spanMail = document.getElementById("mail");
        spanMail.innerText += student.Email;



        div.innerHTML +=    '<label class="profileLabel">Ime '+
                                '<input class="mdl-textfield__input" id="name" type="text" value="' + student.Name + '" disabled autofocus '+
                                    'onfocus="this.value = this.value;"> '+
                            '</label> '+
                            '<label class="profileLabel">Prezime '+
                            '    <input class="mdl-textfield__input" id="surname" type="text" value="'+ student.Surname +'" disabled>'+
                            '</label>'+
                            '<label class="profileLabel">Indeks'+
                            '    <input class="mdl-textfield__input" id="city" type="text" value="'+ student.Index+'" disabled>'+
                            '</label>'+
                            '<label class="profileLabel">Email '+
                            '    <input class="mdl-textfield__input" id="email" type="text" value="'+ student.Email+'" disabled> '+
                            '</label> '+
                            '<label class="profileLabel">Fakultet '+
                            '    <input class="mdl-textfield__input" id="faculty" type="text" value="'+ student.Faculty+'" disabled> '+
                            '</label>'+
                            '<label class="profileLabel">Univerzitet '+
                            '    <input class="mdl-textfield__input" id="university" type="text" value="'+ student.University+'" disabled> '+
                            '</label>'+
                            '<label class="profileLabel">Smer '+
                            '    <input class="mdl-textfield__input" id="smer" type="text" value="'+ student.Module+'" disabled> '+
                            '</label> '+
                            '<label class="profileLabel">Godina upisa '+
                            '<input class="mdl-textfield__input" id="year" type="text" value="'+ student.Year+'" disabled> '+
                            '</label> ';

        if(student.PicturePath == ""){
            divPic.innerHTML += '<img src="images/default.png" class="profilePicture">'

        }
        else {
            //PROVERITI DA LI JE DOBRO
            divPic.innerHTML += '<img src="'+ student.PicturePath +'" class="profilePicture">'
        }


    });

});

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