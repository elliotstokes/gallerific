define([], function() {

  var api = function(clientId) {

    var baseUrl = "https://api.instagram.com/v1/";


    this.getPopularImages = function(callback) {

      var generatedFunction = 'jsonp'+Math.round(Math.random()*1000001);
      window[generatedFunction] = function(data) {
        var photos = [];
        data.data.forEach(function(item) {
          if (item.type==='image') {
            photos.push(item.images['standard_resolution'].url);
          }
        });
        callback(photos);
        delete window[generatedFunction];
      };

      var url = baseUrl + "media/popular?client_id=" + clientId + "&callback=" + generatedFunction; 
      console.log(url);
      var script = document.createElement('script');
      script.src = url;

      document.getElementsByTagName('head')[0].appendChild(script);

    };

  };

  return api;

});