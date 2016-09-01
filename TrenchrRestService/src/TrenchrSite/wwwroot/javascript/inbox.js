var focus = 0,
    blur = 0;
var id_korisnika = 1249;

$( document ).ready(function() {

    //kada se krene pisati poruka omogucava se pritisak dugmeta dok postoji text u textarea
    $('#poruka').bind('input propertychange', function () {

        document.getElementById("posaljiPoruku").disabled = true;
        document.getElementById("posaljiPoruku").style.opacity = 0.5;
        document.getElementById("poruka").placeholder = " ";

        if (this.value.length) {
            document.getElementById("posaljiPoruku").disabled = false;
            document.getElementById("posaljiPoruku").style.opacity = 1;
        }
    });

    //svi kursevi studenta kojima on pripada, da bi se prikaza
    $.ajax({
        url: 'http://localhost:12345/studenti/' + id_korisnika + '/kursevi',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            $.each(json, function (i, value) {
                $('#trazi_grupe').append($('<option>').attr('value', value.Name + " " + value.Year));
            });
        }
    });


    var studenti = [];


    var state = "";

    $.ajax({
        url: "http://localhost:12345/studenti",
        type: "get",
        async: false,
        success: function (data) {

            var osobe = JSON.parse(data);

            for (var i = 0; i < osobe.length; i++) {

                var a = {};
                a.id = osobe[i].ID;
                a.text = [osobe[i].Name + " " + osobe[i].Surname, osobe[i].PicturePath];

                studenti.push(a);

            }
        }
    });


    console.log(studenti);

     $(".js-example-data-array").select2({
        data: studenti,
         minimumResultsForSearch: -1,
         placeholder: function(){
             $(this).data('placeholder');
         }
     });


    $(function(){

        $(".js-example-data-array").select2({

            templateResult: function(data){

                var str = data.text;
                var res = str.split(",");

                return $('<span>').html(data).append('<img src="'+ res[1]+ '"  style="height:20px; width: 20px; margin-right: 20px;">').append(res[0]);
            }       ,     // Specify format function for selected item
            escapeMarkup: function(m) {
                return m;
            }
        });
    });



    $("#pretraziOsobe")
    //fja u kojoj treba za izabranu osobu prikazati dosadasnji chat sa njom
        .focusout(function () {
            console.log("Ljubica");
        });

//dodavanje mogucnost da se salje poruka na ENTER
    var poruka = document.getElementById("poruka");
    poruka.addEventListener("keydown", function (e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            if (!e.shiftKey) {
                posalji(e);
            }
        }
    });

//dodati zahtev za upisivanje nove poruke u bazu
    function posalji(e) {
        var div = document.getElementById("poruke");

        div.innerHTML += '<div class="mdl-grid divZaPoruku"> ' +
            '<div class="mdl-cell mdl-cell--6-col"> ' +
            '</div> ' +
            '<div class="mdl-cell mdl-cell--6-col"> ' +
            '<div class="pojedinacnaPorukaDiv "> ' +
            '<span class="pojedinacnaPorukaMoja">' + poruka.value + '</span> ' +
            '</div> ' +
            '</div> ' +
            '</div> ';

        div.scrollTop = div.scrollHeight;
        poruka.value = "";
        poruka.placeholder = "Napisi poruku...";

    }
});


