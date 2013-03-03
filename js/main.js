play = 0;

$(document).ready(function(){

$('#onair').hide();

$("#listenRadioButton").click("click tap", function(){
    if(play == 0) {
        play = -1;
        $.mobile.showPageLoadingMsg();
        $('#'+this.id).hide();
        $('#choicequality').hide();
        radio = new Media("http://oxyradio.net:8000/"+$('input[name=quality]:checked').val()+".mp3", onSuccess, onError);
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
        $('#choicequality').show();
        $('#onair').hide();
        radio.stop();
    }
    });

});

function onSuccess() {
}

function onError(error) {
}

function loadURL(url){ 
    navigator.app.loadUrl(url, { openExternal:true }); 
} 

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}
 
function onBackKeyDown()
{
    navigator.app.exitApp();
}