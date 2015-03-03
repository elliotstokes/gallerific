/**
 * Contains all the settings for the app
 **/

  define(['json!/api/settings'], function(serverSettings) {
    var height = window.innerHeight/2,
        width = window.innerWidth/2,
        aspect = width / height;
        
    settings = {
      PROXY : serverSettings.proxy,
      PROXYPARAM: serverSettings.proxyParam,
      WIDTH :width ,
      HEIGHT : height,
      UNITSIZE : 250,
      VIEW_ANGLE : 45,
      ASPECT : aspect,
      NEAR : 0.1,
      FAR : 10000,
      WALLHEIGHT : 290
    };


    return settings;

 });