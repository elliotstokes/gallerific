(function() {

  require.config({
    paths: {
      'THREE': 'lib/threejs/build/three.min',
      'FirstPersonControls': 'lib/FirstPersonControls/THREE.FirstPersonControls',
      'stats': 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r11/Stats.min',
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
      }
    }
  });

  require([
    'settings',
		'map',
    'collision',
    'instagram',
    'THREE',
    'stats',
    'FirstPersonControls'
  ], function(settings, Map, Collision, Instagram, THREE, Stats) {

    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );

    var scene = new THREE.Scene();
    var collider;
    var instagram = new Instagram('7e86b13292f34aa0b0115cbe18aba06b');
    var map = new Map();


    instagram.getPopularImages(function(media) {

    	// create a WebGL renderer, camera
    	// and a scene
    	var renderer = new THREE.WebGLRenderer();
      var camera = new THREE.PerspectiveCamera(60, settings.ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far

      camera.position.y = settings.UNITSIZE * 0.4; // Raise the camera off the ground

      scene.add(camera); // Add the camera to the scene
      
  	   
      var controls = new THREE.FirstPersonControls( camera );
      controls.movementSpeed = 200;
      controls.lookSpeed = 0.075;
      controls.lookVertical = false;

      // start the renderer
      renderer.setSize(settings.WIDTH, settings.HEIGHT);

      // attach the render-supplied DOM element
      document.getElementById('container').appendChild(renderer.domElement);



      function animate() {
        collider.hit(camera.position, controls);
        stats.begin();
        // render tahe 3D scene
        render();
        stats.end();
        // relaunch the 'timer' 
        requestAnimationFrame( animate );
      }


      // ## Render the 3D Scene
      function render() {
        // actually display the scene in the Dom element
        renderer.render( scene, camera);
      }

      map.create(scene, media);
      collider = new Collision(map.obstacles);
      animate();
    });
  });

})();