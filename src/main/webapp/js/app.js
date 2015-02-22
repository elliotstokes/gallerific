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
    'FirstPersonControls',
    'EffectComposer',
    'FilmPass',
    'RenderPass',
    'CopyShader'
  ], function(settings, Map, Collision, Instagram, THREE, Stats, generator) {

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
    var mapLayout = generator.generate();
    var map = new Map(mapLayout);


    instagram.getPopularImages(function(media) {

    	// create a WebGL renderer, camera
    	// and a scene
    	var renderer = new THREE.WebGLRenderer();
      var camera = new THREE.PerspectiveCamera(60, settings.ASPECT, 1, 3500); // Field Of Viw, aspect ratio, near, far

      camera.position.y = settings.UNITSIZE * 0.4; // Raise the camera off the ground
      //set the camera to be in the top left
      camera.position.x = 50;
      camera.position.z = 50;

      scene.add(camera); // Add the camera to the scene
      
  	   
      var controls = new THREE.FirstPersonControls( camera );
      controls.movementSpeed = 400;
      controls.lookSpeed = 0.125;
      controls.lookVertical = false;

      // start the renderer
      renderer.setClearColor( 0xbfd1e5 );
      renderer.setSize(settings.WIDTH, settings.HEIGHT);
      var rtParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: true };
      var effectComposer = new THREE.EffectComposer( renderer, new THREE.WebGLRenderTarget( settings.WIDTH, settings.HEIGHT, rtParameters ) );
      effectComposer.setSize( settings.WIDTH, settings.HEIGHT );
      var effectFilm = new THREE.FilmPass( 0.35, 0.025, 648, false );
      renderPass = new THREE.RenderPass( scene, camera );
      effectComposer.addPass(renderPass);
      effectComposer.addPass(effectFilm);
      var copyPass = new THREE.ShaderPass( THREE.CopyShader);
      effectComposer.addPass(copyPass);
      copyPass.renderToScreen = true;
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
        effectComposer.render(0.01);
      }

      map.create(scene, media);
      collider = new Collision(map.obstacles);
      animate();
    });
  });

})();