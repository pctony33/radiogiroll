/* ----------------------------------------------
 * Fichier  : main.js
 * Rôle     : gère la logique de l'application
 *            Radio Giroll sous PhoneGap/Cordova.
 * ----------------------------------------------*/

// Indique si le flux est actuellement joué (0 = arrêté)
play = 0;

// URL du flux Radio Giroll
flux = "http://stream.giroll.org:8000/radio-hd.mp3";

// Callback appelé à chaque succès lors de la lecture
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// Callback appelé lorsqu'une erreur survient
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

/* Force l'ouverture du navigateur hors application */

function loadURL(url){ 
    navigator.app.loadUrl(url, { openExternal:true }); 
}

/* Annule le history.back(); sur le bouton Back */

// L'application est prête : on met en place les handlers
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Capture le bouton "Back" pour quitter l'app
    document.addEventListener("backbutton", onBackKeyDown, false);

    // Zone "ON AIR" masquée au lancement
    $('#onair').hide();

    // Gestion du clic sur le bouton d'écoute
    $("#listenRadioButton").click("click tap", function(){
        if(play == 0) {
            play = -1;
            $.mobile.showPageLoadingMsg();
            $('#'+this.id).hide();
            radio = new Media(flux, onSuccess, onError);
            radio.play();
            var mediaTimer = setInterval(function() {
                radio.getCurrentPosition(
                    function(position) {
                        if (position > 1) {
                            play = 1;
                            $.mobile.hidePageLoadingMsg();
                            $('#listenRadioButton .ui-btn-text').text('Stop !');
                            $('#listenRadioButton').show();
                            $('#onair').show();
                            clearInterval(mediaTimer);
                        }
                    },
                    function(e) {
                    }
                );
            }, 1000);
        } else if(play == 1) {
            play = 0;
            $('#'+this.id+' .ui-btn-text').text('Ecouter la radio !');
            $(this).removeClass("ui-btn-active");
            $('#onair').hide();
            radio.stop();
        }
    });

    // Récupération de la liste des podcasts depuis le serveur
    $.ajax({
          url: "http://live.stream.giroll.org/mobile.php",
          cache: false
        }).done(function( html ) {
          $("#podcastslist").append(html);
        });
}
 
// Ferme l'application lors de l'appui sur "Back"
function onBackKeyDown()
{
    navigator.app.exitApp();
}
