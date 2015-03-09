define([], function() {

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);


  var video = document.querySelector('#mugshot'),
  webcamStream = null;

  return {
    getMugshot: function(callback) {
      var existingShot = window.sessionStorage.getItem("mugshot");
      if (existingShot) {
        var image = new Image();
        image.src = existingShot;
        return callback(image);
      }

      video.width = 640;
      video.height = 640;
      mugButton = document.querySelector('#generate-mugshot');
      if (navigator.getMedia) {
        navigator.getMedia(
          {
            video: true,
            audio: false
          },
          function(stream) {
            if (navigator.mozGetUserMedia) {
              video.mozSrcObject = stream;
            } else {
              var vendorURL = window.URL || window.webkitURL;
              video.src = vendorURL.createObjectURL(stream);
            }
            video.play();
            webcamStream = stream;
          },
          function(err) {
            console.log("An error occured! " + err);
          }
        );

        mugButton.addEventListener('click', function(ev){
          var canvas = document.createElement("canvas");
          canvas.width = video.width;
          canvas.height = video.height;
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          var data = canvas.toDataURL('image/png');
          window.sessionStorage.setItem("mugshot", data);
          webcamStream.stop();
          var image = new Image();
          image.src = data;
          callback(image);
          ev.preventDefault();
        }, false
        );
      } else {
        //no support for getmedia
        callback(null);
      }
    }
  };

});