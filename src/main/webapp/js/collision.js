define(['THREE'], function(THREE) {

  var clock = new THREE.Clock();

  var collisions = function(obstacles, pictures, pictureInfo, glows) {
    this.rays = [
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(-1, 0, 1)
    ];

    this.caster = new THREE.Raycaster();
    this.previousPosition = null;
    /**
     * Function that does the checking against the current location and the obstacles
     **/
    this.hit = function(currentPosition, controls) {
      var distance = 30,
          resetZ = false,
          resetX = false,
          delta = clock.getDelta(),
          reverse = delta * (controls.movementSpeed+5);
      
      controls.update(delta);
      for (i = 0; i < this.rays.length; i += 1) {
        // We reset the raycaster to this direction
        this.caster.set(currentPosition, this.rays[i]);
        // Test if we intersect with any obstacle mesh
        collisions = this.caster.intersectObjects(obstacles);
        // And disable that direction if we do
        if (collisions.length > 0 && collisions[0].distance <= distance) {
          // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
          if ((i === 0 || i === 1 || i === 7) && controls.moveForward) {
            controls.object.translateZ(reverse);
          } else if ((i === 3 || i === 4 || i === 5) && controls.moveBackward) {
            controls.object.translateZ(-reverse);
          }

          if ((i === 1 || i === 2 || i === 3) && controls.moveLeft) {
            controls.object.translateX(reverse);
          } else if ((i === 5 || i === 6 || i === 7) && controls.moveRight) {
            controls.object.translateX(-reverse);
          }
        }
      }

      
    };

var mouse = new THREE.Vector2();
    window.addEventListener( 'mousemove', function( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1 ;   

}, false );

    this.lookingAtPicture = function(camera) {
      this.caster.setFromCamera(mouse, camera); 
      collisions = this.caster.intersectObjects(pictures);
      if (collisions.length > 0 && collisions[0].distance <= 200) {
        var index = collisions[0].object.name;
        var glow = glows[index];
        glow.visible = true;
        glow.needsUpdate = true;
        
        if (index < pictureInfo.length) {
          console.log(pictureInfo[index].text);
        } else {
          console.log("your fat face");
        }
      }
    };
    
  };

  return collisions;

});