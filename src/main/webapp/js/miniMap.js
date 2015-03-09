define(["settings"], function(settings) {

  return function(mapLayout) {
    var normaliser =  Math.ceil(mapLayout.length/2);
    var pointCanvas = document.createElement('canvas');
    pointCanvas.setAttribute('height',200);
    pointCanvas.setAttribute('width',200);
    var blockWidth = Math.floor(200 / mapLayout.length);
    var blockHeight = Math.floor(200 /mapLayout[0].length);
    var pointContext = pointCanvas.getContext('2d');
    this.create = function() {


      var canvas = document.createElement('canvas');
      canvas.setAttribute('height',200);
      canvas.setAttribute('width',200);
      var context = canvas.getContext('2d');

      context.beginPath();


      mapLayout.forEach(function(row,rowIndex) {
        row.forEach(function(cell, cellIndex) {
          if (cell === 1) {
            context.rect(blockWidth* cellIndex, blockHeight * rowIndex, blockWidth, blockHeight);
            context.fillStyle = 'yellow';
            context.fill();
            context.stroke();
          } 
        });
      });


      return canvas.toDataURL("image/png");
    };

    this.createPosition = function(position) {

      xIndex = Math.floor(position.x / settings.UNITSIZE) + normaliser;
      yIndex = Math.floor(position.z / settings.UNITSIZE) + normaliser;
      pointContext.beginPath();
      pointContext.rect(blockWidth* yIndex, blockHeight* xIndex, blockWidth, blockHeight);
      pointContext.fillStyle = 'orange';
      pointContext.fill();
      pointContext.stroke();
      return pointCanvas.toDataURL("image/png");
    };

  };

});