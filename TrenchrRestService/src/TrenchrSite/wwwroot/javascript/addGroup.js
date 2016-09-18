
/**
 * Created by milica on 8/15/2016.
 */
//pravljenje konekcije na server
var connection = $.hubConnection('http://localhost:12345/signalr', { useDefaultPath: false });
HubProxy = connection.createHubProxy('trenchrhub');

//signali koje klijent prima
HubProxy.on('newMessage', function (tekst, posiljalac_id, posiljalacIme, id_konv) {
    //if (posiljalac_id != id_korisnika) {
        document.getElementById("posiljalacPoruke").innerHTML = "<span style='color: teal;'>Posiljalac: </span>" + posiljalacIme;
        document.getElementById("tekstPoruke").innerHTML = "<span style='color: teal;'>Poruka: </span>" + tekst;
        id_konverzacije = id_konv;
        document.getElementById("notifikacija").style = "visibility: visible;";
    //}
});

//konektovanje na server
connection.start({ jsonp: true })
    .done(function () { console.log("SignalR connected"); })
    .fail(function () { console.log("SignalR connection failed"); });

function procitajPoruku() {
    window.location = '/inbox.html';
}

function MaterialSelect(element) {
    'use strict';

    this.element_ = element;
    this.maxRows = this.Constant_.NO_MAX_ROWS;
    // Initialize instance.
    this.init();
}

MaterialSelect.prototype.Constant_ = {
    NO_MAX_ROWS: -1,
    MAX_ROWS_ATTRIBUTE: 'maxrows'
};

MaterialSelect.prototype.CssClasses_ = {
    LABEL: 'mdl-textfield__label',
    INPUT: 'mdl-select__input',
    IS_DIRTY: 'is-dirty',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_INVALID: 'is-invalid',
    IS_UPGRADED: 'is-upgraded'
};

MaterialSelect.prototype.onKeyDown_ = function(event) {
    'use strict';

    var currentRowCount = event.target.value.split('\n').length;
    if (event.keyCode === 13) {
        if (currentRowCount >= this.maxRows) {
            event.preventDefault();
        }
    }
};

MaterialSelect.prototype.onFocus_ = function(event) {
    'use strict';

    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};

MaterialSelect.prototype.onBlur_ = function(event) {
    'use strict';

    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};

MaterialSelect.prototype.updateClasses_ = function() {
    'use strict';
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
};

MaterialSelect.prototype.checkDisabled = function() {
    'use strict';
    if (this.input_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};

MaterialSelect.prototype.checkValidity = function() {
    'use strict';
    if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
    }
};

MaterialSelect.prototype.checkDirty = function() {
    'use strict';
    if (this.input_.value && this.input_.value.length > 0) {
        this.element_.classList.add(this.CssClasses_.IS_DIRTY);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }
};

MaterialSelect.prototype.disable = function() {
    'use strict';

    this.input_.disabled = true;
    this.updateClasses_();
};

MaterialSelect.prototype.enable = function() {
    'use strict';

    this.input_.disabled = false;
    this.updateClasses_();
};

MaterialSelect.prototype.change = function(value) {
    'use strict';

    if (value) {
        this.input_.value = value;
    }
    this.updateClasses_();
};

MaterialSelect.prototype.init = function() {
    'use strict';

    if (this.element_) {
        this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
        this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

        if (this.input_) {
            if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
                this.maxRows = parseInt(this.input_.getAttribute(
                    this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
                if (isNaN(this.maxRows)) {
                    this.maxRows = this.Constant_.NO_MAX_ROWS;
                }
            }

            this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
            this.boundFocusHandler = this.onFocus_.bind(this);
            this.boundBlurHandler = this.onBlur_.bind(this);
            this.input_.addEventListener('input', this.boundUpdateClassesHandler);
            this.input_.addEventListener('focus', this.boundFocusHandler);
            this.input_.addEventListener('blur', this.boundBlurHandler);

            if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
                // TODO: This should handle pasting multi line text.
                // Currently doesn't.
                this.boundKeyDownHandler = this.onKeyDown_.bind(this);
                this.input_.addEventListener('keydown', this.boundKeyDownHandler);
            }

            this.updateClasses_();
            this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        }
    }
};

MaterialSelect.prototype.mdlDowngrade_ = function() {
    'use strict';
    this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
    this.input_.removeEventListener('focus', this.boundFocusHandler);
    this.input_.removeEventListener('blur', this.boundBlurHandler);
    if (this.boundKeyDownHandler) {
        this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
    }
};

// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSelect,
    classAsString: 'MaterialSelect',
    cssClass: 'mdl-js-select',
    widget: true
});


$.ajax({
    url:'http://localhost:12345/kursevi_neodrzani',
    type:'GET',
    dataType: 'json',
    success: function( json ) {
        $('#naziv_predmeta').append('<option value=""></option>');
        $.each(json, function(i, value) {
            var id = value.ID + "," + value.Espb + "," + value.Name;
            $('#naziv_predmeta').append('<option value="'+id+'">'+value.Name+ ", " + value.Faculty + ", " + value.Module + '</option>');
        });
    }
});



function unesi_predmet() {

    arr = [];

    var naziv = document.getElementById("naziv_predmeta").value;
    arr.push(naziv);

    var nivo = document.getElementById("nivo").value;
    arr.push(nivo);

    var tip = document.getElementById("tip").value;
    arr.push(tip);

    var godina = document.getElementById("skolska_godina").value;
    arr.push(godina);


    //ako nisu odabrana sva polja
    for (var i =0; i<arr.length; i++) {
        if (arr[i] == "") {
            alert("Niste odabrali sva polja");
            document.getElementById("forma").reset();
            return;
        }

    }


    console.log(document.getElementById("naziv_predmeta").value);
    console.log(document.getElementById("nivo").value);
    console.log(document.getElementById("tip").value);
    console.log(document.getElementById("skolska_godina").value);

    //ajax poziv za unos nove grupe
    //da bismo dobili naziv nove grupe

    var res = naziv.split(",");
    console.log(res[0]);
    console.log(res[1]);

    var id_kursa = res[0];
    var espb = res[1];
    var name = res[2];

    $.ajax({
        'type': 'post',
        'async': false,
        'url': 'http://localhost:12345/kursevi/novi_kurs',
        'data': JSON.stringify({
            "Name" : name,
            "Espb": espb,
            "Type" : tip,
            "Level" : nivo,
            "Year": godina,
            "CourseID": id_kursa
        }),
        'contentType': "application/json; charset=utf-8",
        success: function(kurs) {

            window.alert("Uspesan unos kursa");
        }
    });

}
