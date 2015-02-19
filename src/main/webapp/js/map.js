/**
 * Handles the generation of the map, walls and floors
 **/

 define([
  'THREE',
  'settings',
  'generator'
  ], function(THREE, settings, generator) {


    var mapLayout = generator.generate(),
        mapW = mapLayout.length, 
        mapH = mapLayout[0].length;

    var textures = [
      THREE.ImageUtils.loadTexture( 'images/textures/floor.jpg' ),
      THREE.ImageUtils.loadTexture( 'images/textures/bricks.jpeg' ),
      THREE.ImageUtils.loadTexture( 'images/textures/ceiling.jpg' )
    ];


    /**
     * Contstucts an instance of the map
     * @class
     * @classdesc Generates and manages the map
     **/
    var map = function() {
      var units = Math.max(mapW, mapH),
          obstacles = [];
      textures[0].wrapS = textures[1].wrapS =  textures[2].wrapS =  THREE.RepeatWrapping;
      textures[0].wrapT = textures[1].wrapT =  textures[2].wrapT =  THREE.RepeatWrapping;
      textures[0].repeat.set(2*units,2*units);
      textures[2].repeat.set(2*units,2*units);
      textures[1].repeat.set(1,2);


      var floor = new THREE.Mesh(
        new THREE.BoxGeometry(units * settings.UNITSIZE, 10, units * settings.UNITSIZE),
        new THREE.MeshPhongMaterial({map:textures[0], shading: THREE.NoShading})
      );


      var ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(units * settings.UNITSIZE, 10, units * settings.UNITSIZE),
         new THREE.MeshPhongMaterial({map:textures[2],shading: THREE.NoShading})
      );

      ceiling.position.y = settings.WALLHEIGHT;

      var cube = new THREE.BoxGeometry(settings.UNITSIZE, settings.WALLHEIGHT, settings.UNITSIZE);
      var materials = [
        new THREE.MeshLambertMaterial({map:textures[1]})
      ];

      var pictureGeometry = new THREE.BoxGeometry(100, 100, 5);
      var pictureGeometryZ = new THREE.BoxGeometry(5, 100, 100);
      
      function addChair(scene) {
        var loader = new THREE.JSONLoader(); // init the loader util

        // init loading
        loader.load('models/chair.json', function (geometry) {
        // create a new material
  
          // create a mesh with models geometry and material
          var mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({map:textures[1]})
          );

          scene.add(mesh);
        });
      }

      /**
       * Consructs the map
       **/
      this.create = function(scene, photos) {

        //addChair(scene);

        THREE.ImageUtils.crossOrigin = '';
        var galleryTextures = [];

        photos.forEach(function(photo) {
          galleryTextures.push(THREE.ImageUtils.loadTexture(settings.PROXY + '?u=' + photo));
        });

        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var totalGeom = new THREE.Geometry();
        var lightsGeom = new THREE.Geometry();
        var imageIndex = 0;
        for (var i = 0; i < mapW; i++) {
          for (var j = 0, m = mapLayout[i].length; j < m; j++) {
            if (mapLayout[i][j]===1) {
              var wall = new THREE.Mesh(cube, null);
              wall.position.x = (i - units/2) * settings.UNITSIZE;
              wall.position.y = settings.WALLHEIGHT/2;
              wall.position.z = (j - units/2) * settings.UNITSIZE;
              wall.updateMatrix();
              totalGeom.merge( wall.geometry, wall.matrix );
            } else {

              var x = (i - units/2) * settings.UNITSIZE;
              var z = (j - units/2) * settings.UNITSIZE;
              if ((j+i)%5 ===0) {
                var geometry = new THREE.SphereGeometry( 5, 32, 32 );
                var sphere = new THREE.Mesh( geometry, null );

                sphere.position.set(x,280,z);
                sphere.updateMatrix();
                lightsGeom.merge(sphere.geometry, sphere.matrix);

                var light = new THREE.PointLight( 0xffffff, 2, 600 );
                light.position.set( x, 280, z );
                scene.add( light );
              }
              var previous = j-1;
              var next = j+1;
              var picture = null;
              var offset = (settings.UNITSIZE /2) + 2;
              
        
              if (mapLayout[i][previous] && (j+i)%2 ===0) {
                picture = new THREE.Mesh(pictureGeometry,new THREE.MeshBasicMaterial({map:galleryTextures[imageIndex % galleryTextures.length]}));
                picture.position.set(x, 120, z-offset);
                scene.add(picture);
                imageIndex++;
              }
              if (mapLayout[i][next] && (j+i)%2 ===0) {
                picture = new THREE.Mesh(pictureGeometry,new THREE.MeshBasicMaterial({map:galleryTextures[imageIndex % galleryTextures.length]}));
                picture.position.set(x, 120, z+offset);
                scene.add(picture);
                imageIndex++;
              }

               if (mapLayout[i-1][j] && (j+i)%2 ===0) {
                picture = new THREE.Mesh(pictureGeometryZ,new THREE.MeshBasicMaterial({map:galleryTextures[imageIndex % galleryTextures.length]}));
                picture.position.set(x - offset, 120, z);
                scene.add(picture);
                imageIndex++;
              }
              if (mapLayout[i+1][j] && (j+i)%2 ===0) {
                picture = new THREE.Mesh(pictureGeometryZ,new THREE.MeshBasicMaterial({map:galleryTextures[imageIndex % galleryTextures.length]}));
                picture.position.set(x + offset, 120, z);
                scene.add(picture);
                imageIndex++;
              }


            }
          }
        }
        //totalGeom.geometry.computeBoundingSphere();
        var walls = new THREE.Mesh(totalGeom,materials[0]);
        scene.add(walls);
        obstacles.push(walls);
        var spheres = new THREE.Mesh(lightsGeom, material);
        scene.add(spheres);
        scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0004);
        obstacles.push(floor);
        scene.add(floor);
        scene.add(ceiling);

        
        var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add(ambientLight);
      };

      /**
       * Gets all the stuff that has been drawn
       **/
      this.__defineGetter__("obstacles", function() {
        return obstacles;
      });
    };
    
    return map;
 });