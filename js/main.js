/* Init */

play = 0;
flux = "http://stream.giroll.org:8000/radio-hd.mp3";

function onSuccess() {
}

function onError(error) {
}

/* Force l'ouverture du naviguateur hors application */

function loadURL(url){ 
    navigator.app.loadUrl(url, { openExternal:true }); 
}

/* Annule le history.back(); sur le bouton Back */

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);

    $('#onair').hide();
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

	$.ajax({
	  url: "http://live.stream.giroll.org/mobile.php",
	  cache: false
	}).done(function( html ) {
	  $("#podcastslist").append(html);
	});
}
 
function onBackKeyDown()
{
    navigator.app.exitApp();
}
