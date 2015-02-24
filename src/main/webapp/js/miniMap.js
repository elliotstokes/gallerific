define([], function() {

  return {
    create: function(mapLayout) {


      var canvas = document.createElement('canvas');
      canvas.setAttribute('height',200);
      canvas.setAttribute('width',200);
      var context = canvas.getContext('2d');

      context.beginPath();
      var blockWidth = Math.floor(200 / mapLayout.length);
      var blockHeight = Math.floor(200 /mapLayout[0].length);

      mapLayout.forEach(function(row,rowIndex) {
        row.forEach(function(cell, cellIndex) {
          if (cell === 1) {
            context.rect(blockWidth* cellIndex, blockHeight* rowIndex, blockWidth, blockHeight);
            context.fillStyle = 'yellow';
            context.fill();
            context.stroke();
          } 


        });
      });


      return canvas.toDataURL("image/png");
    }
  };

});