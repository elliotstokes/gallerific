(function() {

  require.config({
    paths: {
      'THREE': 'lib/threejs/build/three.min',
      'FirstPersonControls': 'lib/FirstPersonControls/THREE.FirstPersonControls',
      'FilmGrain' : 'lib/FilmGrain/FilmShader',
      'FilmPass' : 'lib/FilmPass/FilmPass',
      'EffectComposer' : 'lib/EffectComposer/EffectComposer',
      'CopyShader': 'lib/CopyShader/CopyShader',
      'MaskPass': 'lib/MaskPass/MaskPass',
      'RenderPass': 'lib/RenderPass/RenderPass',
      'ShaderPass': 'lib/ShaderPass/ShaderPass',
      'stats': 'lib/stats/Stats.min',
      'text' : 'lib/text/text',
      'json': 'lib/requirejs-plugins/src/json'
    },
    shim: {
      THREE: {
          exports: 'THREE'
      },
      'stats': { exports: 'Stats' },
      FirstPersonControls: { 
      	deps: ['THREE'], 
      	exports: 'THREE' 
      },
      CopyShader : {
        deps: ['THREE'], 
        exports: 'THREE' 
      },
      ShaderPass : {
        deps: ['THREE'], 
        exports: 'THREE' 
      },
      RenderPass : {
        deps: ['THREE'], 
        exports: 'THREE' 
      },
      MaskPass : {
        deps: ['THREE'], 
        exports: 'THREE' 
      },
      EffectComposer: { 
        deps: ['THREE', 'CopyShader', 'ShaderPass','MaskPass'], 
        exports: 'THREE' 
      },
      FilmGrain: { 
        deps: ['THREE'], 
        exports: 'THREE' 
      },
      FilmPass: { 
        deps: ['THREE','FilmGrain'], 
        exports: 'THREE' 
      },
    }
  });

  require([
    'settings',
		'map',
    'collision',
    'instagram',
    'THREE',
    'stats',
    'generator',
    'postprocessing',
    "miniMap",
    "mugshot",
    'FirstPersonControls'
  ], function(settings, Map, Collision, Instagram, THREE, Stats, generator, postprocessing, miniMap, mugshot) {

    mugshot.getMugshot(function(mugshot) {

      document.getElementById('mugshot-creator').className = "hidden";
      document.getElementById('main-app').className = "";


    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';


    var collider;
    var instagram = new Instagram('7e86b13292f34aa0b0115cbe18aba06b');
    var mapLayout = generator.generate();
    var map = new Map(mapLayout);


    instagram.getPopularImages(function(media) {

    	// create a WebGL renderer, camera
    	// and a scene
      var scene = new THREE.Scene();
    	var renderer = new THREE.WebGLRenderer();
      var camera = new THREE.PerspectiveCamera(60, settings.ASPECT, 1, 3500); // Field Of Viw, aspect ratio, near, far
      var effects = postprocessing.create(renderer, scene, camera);

      renderer.setClearColor( 0xbfd1e5 );
      renderer.setSize(settings.WIDTH, settings.HEIGHT);

      camera.position.y = settings.UNITSIZE * 0.4; // Raise the camera off the ground
      camera.position.x = 50;
      camera.position.z = 50;

      scene.add(camera); // Add the camera to the scene
      
  	   
      var controls = new THREE.FirstPersonControls( camera );
      controls.movementSpeed = 400;
      controls.lookSpeed = 0.125;
      controls.lookVertical = false;      

      function animate() {
        collider.hit(camera.position, controls);
        stats.begin();
        renderer.render( scene, camera);
        effects.render(0.01);
        stats.end();
        requestAnimationFrame( animate );
      }


      var previewMapImage = miniMap.create(mapLayout);
      var image = new Image();
      image.src = previewMapImage;
      image.className = 'preview-map';
      document.getElementById("preview-map").appendChild(image);



      map.create(scene, media, mugshot);
      collider = new Collision(map.obstacles);
      document.body.appendChild( stats.domElement );
      document.getElementById('container').appendChild(renderer.domElement);
      document.getElementById("loader").className= "hidden";
      animate();
    });
    });
  });

})();