//id studenta koji treba da se prikaze
var id_korisnika = 600;
var id_konverzacije = 0;
var id_grupe = 0;
var notifikacija = false;

function procitaj() {
    if (notifikacija == true)
        window.location = '/inbox.html?konv=' + id_konverzacije;
    else
        window.location = '/group.html?grp=' + id_grupe;
}

$(document).ready(function(){

    //pravljenje konekcije na server
    var connection = $.hubConnection('http://localhost:12345/signalr', { useDefaultPath: false });
    HubProxy = connection.createHubProxy('trenchrhub');

    //signali koje klijent prima
    HubProxy.on('newMessage', function (tekst, posiljalac_id, posiljalacIme, id_konv) {
        if (posiljalac_id != id_korisnika) {
            document.getElementById("notifikacijaHeader").innerHTML = "NOVA PORUKA";
            document.getElementById("notifikacijaPosiljalac").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
            document.getElementById("notifikacijaTekst").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
            id_konverzacije = id_konv;
            document.getElementById("notifikacija").style = "visibility: visible;";
            notifikacija = true;
        }
    });

    HubProxy.on('newPost', function (tipPosta, tekst, id_kursa, posiljalac_id, posiljalacIme) {
        if (posiljalac_id != id_korisnika) {
            document.getElementById("notifikacijaHeader").innerHTML = tipPosta.toUpperCase();
            document.getElementById("notifikacijaPosiljalac").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
            document.getElementById("notifikacijaTekst").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
            id_grupe = id_kursa;
            document.getElementById("notifikacija").style = "visibility: visible;";
            notifikacija = false;
        }
    });

    //konektovanje na server
    connection.start({ jsonp: true })
        .done(function () { console.log("SignalR connected"); })
        .fail(function () { console.log("SignalR connection failed"); });

    //svi kursevi studenta kojima on pripada, da bi se prikazao search
    $.ajax({
        url: 'http://localhost:12345/studenti/' + id_korisnika + '/kursevi',
        type:'GET',
        dataType: 'json',
        success: function( json ) {
            $.each(json, function(i, value) {
                $('#grupe').append($('<option>').attr('value', value.Name + " " + value.Year).attr('id', value.ID));
            });

            var pretraga_grupa = document.getElementById('fixed-header-drawer-exp');
            var trazi_grupe = document.getElementById('grupe');
            var attr;

            pretraga_grupa.addEventListener("keyup", function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();

                    if (pretraga_grupa.value.length != 0) {

                        for (var i = 0; i < trazi_grupe.options.length; i++) {
                            attr = trazi_grupe.options[i];

                            if (attr.value == pretraga_grupa.value)
                                id_grupe = attr.id;

                            console.log(id_grupe);
                        }

                        pretraga_grupa.value = '';
                        notifikacija = false;
                        procitaj();
                    }
                }
            }, false);
        }
    });

    $.get("http://localhost:12345/studenti/" + id_korisnika, function (data) {
        var student = JSON.parse(data);
        var div = document.getElementById("divProfil");
        var divPic = document.getElementById("profile");

        var headerSlika = document.getElementById("korisnik");

        //dodavanje slike studenta
        if(student.PicturePath == "")
            headerSlika.innerHTML += '<img src="images/default.png" class="demo-avatar">';
        else 
            headerSlika.innerHTML += '<img src="'+ student.PicturePath +'"  class="demo-avatar">';

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

        if (student.PicturePath == "")
            divPic.innerHTML += '<img src="images/default.png" class="profilePicture">';
        else
            divPic.innerHTML += '<img src="' + student.PicturePath + '" class="profilePicture">';
    });

    $('#save').click(function() {
        var name = document.getElementById("name").value;
        document.getElementById("name").disabled = true;
        document.getElementById("name").style = "color: darkgray;";
        var surname = document.getElementById("surname").value;
        document.getElementById("surname").disabled = true;
        document.getElementById("surname").style = "color: darkgray;";
        var index = document.getElementById("index").value;
        document.getElementById("index").disabled = true;
        document.getElementById("index").style = "color: darkgray;";
        var email = document.getElementById("email").value;
        document.getElementById("email").disabled = true;
        document.getElementById("email").style = "color: darkgray;";
        var faculty = document.getElementById("faculty").value;
        document.getElementById("faculty").disabled = true;
        document.getElementById("faculty").style = "color: darkgray;";
        var university = document.getElementById("university").value;
        document.getElementById("university").disabled = true;
        document.getElementById("university").style = "color: darkgray;";
        var course = document.getElementById("course").value;
        document.getElementById("course").disabled = true;
        document.getElementById("course").style = "color: darkgray;";
        var year = parseInt(document.getElementById("year").value);
        document.getElementById("year").disabled = true;
        document.getElementById("year").style = "color: darkgray;";

        $.ajax({
            type: 'PUT',
            url: 'http://localhost:12345/korisnici/' + id_korisnika,
            data: JSON.stringify( {
                "ime" : name,
                "prezime" : surname,
                "generacija" : year,
                "indeks" : index,
                "email": email
            }),
            contentType: "application/json; charset=utf-8"
        });

        document.getElementById("edit").style.display = "inline";
        document.getElementById("save").style.display = "none";
        document.getElementById("reset").style.display = "none";
    });

    $('#reset').click(function() {
        $.get("http://localhost:12345/studenti/" + id_korisnika, function (data) {

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
    document.getElementById("name").style = "color: black;";
    document.getElementById("surname").disabled = false;
    document.getElementById("surname").style = "color: black;";
    document.getElementById("index").disabled = false;
    document.getElementById("index").style = "color: black;";
    document.getElementById("email").disabled = false;
    document.getElementById("email").style = "color: black;";
    document.getElementById("faculty").disabled = false;
    document.getElementById("faculty").style = "color: black;";
    document.getElementById("university").disabled = false;
    document.getElementById("university").style = "color: black;";
    document.getElementById("course").disabled = false;
    document.getElementById("course").style = "color: black;";
    document.getElementById("year").disabled = false;
    document.getElementById("year").style = "color: black;";

    document.getElementById("edit").style.display="none";
    document.getElementById("save").style.display="inline";
    document.getElementById("reset").style.display="inline";
    document.getElementById("name").focus();
}
