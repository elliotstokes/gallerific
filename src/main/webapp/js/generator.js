define([], function() {

  function maze(x,y) {
    var n=x*y-1,
        j = 0;
    if (n<0) {alert("illegal maze dimensions");return;}
    var horiz =[], 
        verti =[], 
        here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
        path = [here],
        unvisited = [];

    for (j= 0; j<y+1; j++) verti[j]= [];
    for (j= 0; j<x+1; j++) horiz[j]= [];

    for (j = 0; j<x+2; j++) {
      unvisited[j] = [];
      for (var k= 0; k<y+1; k++)
        unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
    }
    while (0<n) {
      var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
          [here[0]-1, here[1]], [here[0],here[1]-1]];
      var neighbors = [];
      for (j = 0; j < 4; j++)
        if (unvisited[potential[j][0]+1][potential[j][1]+1])
          neighbors.push(potential[j]);
      if (neighbors.length) {
        n = n-1;
        next= neighbors[Math.floor(Math.random()*neighbors.length)];
        unvisited[next[0]+1][next[1]+1]= false;
        if (next[0] == here[0])
          horiz[next[0]][(next[1]+here[1]-1)/2]= true;
        else 
          verti[(next[0]+here[0]-1)/2][next[1]]= true;
        path.push(here = next);
      } else 
        here = path.pop();
    }
    return {x: x, y: y, horiz: horiz, verti: verti};
  }
 
  function output(m) {
    var maze= [],
        k = 0;
    for (var j= 0; j<m.x*2+1; j++) {
      var line= [];
      if (0 === j%2) {
        for (k=0; k<m.y*2+1; k++)
          if (0 === k%2) 
            line[k]= 1;
          else
            if (j>0 && m.verti[j/2-1][Math.floor(k/2)])
              line[k]= 0;
            else
              line[k]= 1;
      } else {
        for (k=0; k<m.y*2+1; k++)
          if (0 === k%2)
            if (k>0 && m.horiz[(j-1)/2][k/2-1])
              line[k]= 0;
            else
              line[k]= 1;
          else
            line[k]= 0;
      }

      maze.push(line);
    }
    return maze;
  }

  function convert(m) {

  }


  return {
    generate: function() {
      return output(maze(10,10));
    }
  };

});