
//id studenta koji treba da se prikaze
var id = 1248 ;


$(document).ready(function(){


    //svi kursevi studenta kojima on pripada, da bi se prikaza
    $.ajax({
        url:'http://localhost:12345/studenti/' + id + '/kursevi',
        type:'GET',
        dataType: 'json',
        success: function( json ) {
            $.each(json, function(i, value) {
                $('#grupe').append($('<option>').attr('value', value.Name + " " + value.Year));
            });
        }
    });

    $.get("http://localhost:12345/studenti/" + id, function(data){

        var student = JSON.parse(data);
        var div = document.getElementById("divProfil");
        var divPic = document.getElementById("profile");

        var headerSlika = document.getElementById("korisnik");

        //dodavanje slike studenta
        if(student.PicturePath == ""){
            headerSlika.innerHTML += '<img src="images/default.png" class="demo-avatar">'
        }
        else {
            headerSlika.innerHTML += '<img src="'+ student.PicturePath +'"  class="demo-avatar">';
        }


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
                            '    <input class="mdl-textfield__input" id="index" type="text" value="'+ student.Index+'" disabled>'+
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
                            '    <input class="mdl-textfield__input" id="course" type="text" value="'+ student.Module+'" disabled> '+
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

    //NAPISATI PUT POZIV ZA UNOS KORISNIKA U BAZU
    $('#save').click(function() {
        var name = document.getElementById("name").value;
        var surname = document.getElementById("surname").value;
        var index = document.getElementById("index").value;
        var email = document.getElementById("email").value;
        var faculty = document.getElementById("faculty").value;
        var university = document.getElementById("university").value;
        var course = document.getElementById("course").value;
        var year = parseInt(document.getElementById("year").value);

        $.ajax({
            type: 'put',
            url: 'http://localhost:12345/korisnici/' + id,
            data: JSON.stringify( {
                "ime" : name,
                "prezime" : surname,
                "generacija" : year,
                "indeks" : index,
                "email" : email
            }),
            contentType: "application/json; charset=utf-8"
        });

    });

    $('#reset').click(function() {

        $.get("http://localhost:12345/studenti/" + id, function(data){

            var student = JSON.parse(data);
            var div = document.getElementById("divProfil");
            var divPic = document.getElementById("profile");

            document.getElementById("name").value = student.Name;
            document.getElementById("surname").value = student.Surname;
            document.getElementById("index").value = student.Index;
            document.getElementById("faculty").value = student.Faculty;
            document.getElementById("email").value = student.Email;
            document.getElementById("course").value = student.Module;
            document.getElementById("year").value = student.Year;
            document.getElementById("university").value = student.University;

        });


    });

});

function izmeniProfil() {

    document.getElementById("name").disabled = false;
    document.getElementById("surname").disabled = false;
    document.getElementById("index").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("faculty").disabled = false;
    document.getElementById("university").disabled = false;
    document.getElementById("course").disabled = false;
    document.getElementById("year").disabled = false;

    document.getElementById("edit").style.display="none";
    document.getElementById("save").style.display="inline";
    document.getElementById("reset").style.display="inline";

    document.getElementById("name").focus();

}


