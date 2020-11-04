function Space() {
  this.center = {x: 0, y: 0};
  this.radius = 0;

  this.center = pickCenter();
  if (this.center != null) {
    this.radius = pickRadius(this.center);
  }

  function pickCenter() {
    let numTries = 0;
    let maxTries = 2;
    let center = pickPoint();

    // does this point lie in another space in the composition?
    for (let i = 0; i < canvas.composition.spaces.length; i++) {
      while (dist(center.x, center.y, canvas.composition.spaces[i].center.x, canvas.composition.spaces[i].center.y) <= canvas.composition.spaces[i].radius) {
        console.log(numTries, maxTries)
      if (numTries == maxTries) {
          return null;
        } else {
          center = pickPoint();
          numTries++;
          i = 0
        }
      }
    }
    return center;

    function pickPoint() {
      return {
        x: int(random(-canvas.composition.width/2, canvas.composition.width/2)),
        y: int(random(-canvas.composition.height/2, canvas.composition.height/2)),
      };
    }
  }

  function pickRadius(center) {
    let radius = 0;
    let maxRadius = (canvas.composition.width < canvas.composition.height) ? canvas.composition.width/2 : canvas.composition.height/2;

    // does the space extend beyond the edge of a mat?
    while( inComposition(center) ) {
      radius++;
      // does the space encroach on another space?
      for (let i = 0; i < canvas.composition.spaces.length; i++) {
        if ( encroaching(center, radius, canvas.composition.spaces[i]) ) {
          return radius;
        };
      }
    }

    return radius;

    function inComposition(center) {
      if ((abs(center.x) + radius < int(canvas.composition.width/2)) && (abs(center.y) + radius < int(canvas.composition.height/2) )) {
        return true;
      }
    }

    function encroaching(center, radius, space) {
      let overlap = 1; // 1 = no overlap
      if (dist(center.x, center.y, space.center.x, space.center.y) < (radius + space.radius)/overlap) {
        return true;
      }
    }
  }
}
