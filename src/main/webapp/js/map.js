/**
 * Handles the generation of the map, walls and floors
 **/

 define([
  'THREE',
  'settings'
  ], function(THREE, settings) {
  var mapLayout = [ // 1  2  3  4  5  6  7  8  9
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 1
   [1, 0, 1, 0, 2, 1, 1, 1, 0, 1,], // 2
   [1, 0, 1, 0, 0, 0, 0, 1, 0, 1,], // 3
   [1, 0, 1, 0, 1, 0, 0, 1, 0, 1,], // 4
   [1, 0, 1, 0, 2, 0, 0, 1, 0, 1,], // 5
   [1, 0, 1, 0, 1, 0, 0, 1, 0, 1,], // 6
   [1, 0, 1, 0, 1, 1, 0, 1, 0, 1,], // 7
   [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 8
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
   ], mapW = mapLayout.length, mapH = mapLayout[0].length;
  
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
      var units = mapW,
          obstacles = [];
      textures[0].wrapS = textures[1].wrapS =  textures[2].wrapS =  THREE.RepeatWrapping;
      textures[0].wrapT = textures[1].wrapT =  textures[2].wrapT =  THREE.RepeatWrapping;
      textures[0].repeat.set(2*units,2*units);
      textures[2].repeat.set(2*units,2*units);
      textures[1].repeat.set(1,2);

      var floor = new THREE.Mesh(
        new THREE.BoxGeometry(units * settings.UNITSIZE, 10, units * settings.UNITSIZE),
        new THREE.MeshPhongMaterial( { map:textures[0] , shininess: 70 } )
      );


      var ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(units * settings.UNITSIZE, 10, units * settings.UNITSIZE),
        new THREE.MeshPhongMaterial( { map:textures[2] , shininess: 30 } )
      );

      ceiling.position.y = settings.WALLHEIGHT;

      var cube = new THREE.CubeGeometry(settings.UNITSIZE, settings.WALLHEIGHT, settings.UNITSIZE);
      var materials = [
        new THREE.MeshLambertMaterial({map:textures[1]})
      ];

      var pictureGeometry = new THREE.CubeGeometry(100, 100, 5);
      
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

        obstacles.push(floor);
        scene.add(floor);
        scene.add(ceiling);
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var totalGeom = new THREE.Geometry();
        var lightsGeom = new THREE.Geometry();
        var imageIndex = 0;
        for (var i = 0; i < mapW; i++) {
          for (var j = 0, m = mapLayout[i].length; j < m; j++) {
            if (mapLayout[i][j]) {
              var wall = new THREE.Mesh(cube, null);
              wall.position.x = (i - units/2) * settings.UNITSIZE;
              wall.position.y = settings.WALLHEIGHT/2;
              wall.position.z = (j - units/2) * settings.UNITSIZE;
              wall.updateMatrix();
              totalGeom.merge( wall.geometry, wall.matrix );
            
            } else {

              var x = (i - units/2) * settings.UNITSIZE;
              var z = (j - units/2) * settings.UNITSIZE;
              if ((j+i)%2 ===0) {
                var geometry = new THREE.SphereGeometry( 5, 32, 32 );
                var sphere = new THREE.Mesh( geometry, null );

                sphere.position.set(x,280,z);
                sphere.updateMatrix();
                lightsGeom.merge(sphere.geometry, sphere.matrix);

                var light = new THREE.PointLight( 0xffffff, 6, 370 );
                light.position.set( x, 280, z );
                scene.add( light );
              }
              var previous = j-1;
              var next = j+1;
              var picture = null;
              var offset = (settings.UNITSIZE /2) + 2;
              
        
              if (mapLayout[i][previous]) {
                picture = new THREE.Mesh(pictureGeometry,new THREE.MeshLambertMaterial({map:galleryTextures[imageIndex % galleryTextures.length]}));
                picture.position.set(x, 120, z-offset);
                scene.add(picture);
                imageIndex++;
              }
              if (mapLayout[i][next]) {
                picture = new THREE.Mesh(pictureGeometry,new THREE.MeshLambertMaterial({map:galleryTextures[imageIndex % galleryTextures.length]}));
                picture.position.set(x, 120, z+offset);
                scene.add(picture);
                imageIndex++;
              }
            }
          }
        }
        var walls = new THREE.Mesh(totalGeom,materials[0]);
        scene.add(walls);
        obstacles.push(walls);
        var spheres = new THREE.Mesh(lightsGeom, material);
        scene.add(spheres);
        scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0004);
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