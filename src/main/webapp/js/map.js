/**
 * Handles the generation of the map, walls and floors
 **/

 define([
  'THREE',
  'settings',
  'text!shaders/fragment.shader',
  'text!shaders/vertex.shader',
  'SubdivisionModifier'
  ], function(THREE, settings, fragmentShader, vertexShader) {

    

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
    var map = function(mapLayout, camera) {
      var mapW = mapLayout.length, 
          mapH = mapLayout[0].length,
          units = Math.max(mapW, mapH),
          obstacles = [],
          pictures = [],
          glows=[];

      var customMaterial = new THREE.ShaderMaterial({
        uniforms: { 
          "c":   { type: "f", value: 0.05 },
          "p":   { type: "f", value: 4.5 },
          glowColor: { type: "c", value: new THREE.Color(0xff0000) },
          viewVector: { type: "v3", value: camera.position}
        },
        vertexShader:   vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      textures[0].wrapS = textures[1].wrapS =  textures[2].wrapS =   THREE.RepeatWrapping;
      textures[0].wrapT = textures[1].wrapT =  textures[2].wrapT =   THREE.RepeatWrapping;
      textures[0].repeat.set(2,2);
      textures[2].repeat.set(2,2);
      textures[1].repeat.set(1,2);

      var cube = new THREE.BoxGeometry(settings.UNITSIZE, settings.WALLHEIGHT, settings.UNITSIZE);
      var tile = new THREE.BoxGeometry(settings.UNITSIZE, 10, settings.UNITSIZE);
      var materials = [
        new THREE.MeshLambertMaterial({map:textures[1] }),
        new THREE.MeshLambertMaterial({map:textures[0]}),
        new THREE.MeshPhongMaterial({map:textures[2]})

      ];

      var pictureGeometry = new THREE.BoxGeometry(100, 100, 10);
      var pictureGeometryZ = new THREE.BoxGeometry(10, 100, 100);

      /**
       * Consructs the map
       **/
      this.create = function(scene, photos, mugshot) {

        THREE.ImageUtils.crossOrigin = '';
        var galleryTextures = [];

        photos.forEach(function(photo) {
          galleryTextures.push(THREE.ImageUtils.loadTexture(settings.PROXY + '?u=' + photo.url));
        });
        
        if (mugshot) {
          var texture = new THREE.Texture( mugshot );
          texture.needsUpdate = true;
          galleryTextures.push(texture);
        }


        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var walllGeom = new THREE.Geometry();
        var floorGeom = new THREE.Geometry();
        var lightsGeom = new THREE.Geometry();
        var imageIndex = 0;

        var addPicture = function(pictureGeometry,xOffset, zOffset) {
          var picture = new THREE.Mesh(pictureGeometry,new THREE.MeshBasicMaterial({map:galleryTextures[imageIndex]}));
          picture.position.set(x -xOffset, 120, z-zOffset);
          picture.name = imageIndex; 
          scene.add(picture);
          pictures.push(picture);
          imageIndex = (imageIndex+1) % galleryTextures.length;
          var glowGeometry = picture.geometry.clone();
          var modifier = new THREE.SubdivisionModifier( 1 );
          modifier.modify( glowGeometry ); 
          var pictureGlow = new THREE.Mesh(picture.geometry.clone() , customMaterial.clone() );
          pictureGlow.position.set(picture.position.x,picture.position.y,picture.position.z);
          pictureGlow.scale.multiplyScalar(1.5);
          picture.userData.glow = pictureGlow;
          scene.add( pictureGlow );
          pictureGlow.visible = false;
          glows.push(pictureGlow);
        };

        for (var i = 0; i < mapW; i++) {
          for (var j = 0, m = mapLayout[i].length; j < m; j++) {
            if (mapLayout[i][j]===1) {
              var wall = new THREE.Mesh(cube, null);
              wall.position.x = (i - units/2) * settings.UNITSIZE;
              wall.position.y = settings.WALLHEIGHT/2;
              wall.position.z = (j - units/2) * settings.UNITSIZE;
              wall.updateMatrix();
              walllGeom.merge( wall.geometry, wall.matrix );
            } else {
              var floorTile = new THREE.Mesh(tile, null);
              floorTile.position.x = (i - units/2) * settings.UNITSIZE;
              floorTile.position.z = (j - units/2) * settings.UNITSIZE;
              floorTile.updateMatrix();
              floorGeom.merge( floorTile.geometry, floorTile.matrix );

              var x = (i - units/2) * settings.UNITSIZE;
              var z = (j - units/2) * settings.UNITSIZE;
              if ((j+i)%4 ===0) {
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
              //var picture = null;
              var offset = (settings.UNITSIZE /2) + 2;
              
              if (mapLayout[i][previous] && (j+i)%2 ===0) {
                addPicture(pictureGeometry,0, offset);
              }
              if (mapLayout[i][next] && (j+i)%2 ===0) {
                addPicture(pictureGeometry,0, offset*-1);
              }

               if (mapLayout[i-1][j] && (j+i)%2 ===0) {
                addPicture(pictureGeometryZ,offset,0);
              }
              if (mapLayout[i+1][j] && (j+i)%2 ===0) {
                addPicture(pictureGeometryZ,offset*-1, 0);
              }


            }
          }
        }


        var walls = new THREE.Mesh(walllGeom,materials[0]);
        scene.add(walls);
        obstacles.push(walls);
        var spheres = new THREE.Mesh(lightsGeom, material);
        scene.add(spheres);

        var floor = new THREE.Mesh(floorGeom,materials[1]);
        var ceilingGeom = floorGeom.clone();
        

        var ceiling = new THREE.Mesh(ceilingGeom,materials[2]);
        ceiling.position.y =  settings.WALLHEIGHT;
        scene.add(ceiling);
        scene.add(floor);

        scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0004);

        
        var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add(ambientLight);
      };

      /**
       * Gets all the stuff that has been drawn
       **/
      this.__defineGetter__("obstacles", function() {
        return obstacles;
      });

      this.__defineGetter__("pictures", function() {
        return pictures;
      });

      this.__defineGetter__('glows', function() {
        return glows;
      });
    };
    
    return map;
 });