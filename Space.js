function Space() {
  this.center = {
    x: 0,
    y: 0,
  };
  this.radius = 0;

  this.center = pickCenter();
  //  if (moreSpaces == true) {
  this.radius = pickRadius(this.center);
  //  }

  function pickCenter() {
    let numTries = 0;
    let center = pickPoint();

    // does this point lie in another space in the composition?
    for (let i = 0; i < canvas.composition.length; i++) {
      while (dist(center.x, center.y, spaces[i].center.x, spaces[i].center.y) <= spaces[i].radius && numTries < maxTries) {
        numTries++;
        (numTries >= maxTries) ? moreSpaces = false : center = pickPoint();
        i = 0;
      }
    }
    return(center);
  }

  function pickPoint() {
    return {
      x: int(random(-canvas.composition.width/2, canvas.composition.width/2)),
      y: int(random(-canvas.composition.height/2, canvas.composition.height/2)),
    };
  }

  function pickRadius(center) {
    console.log(center);
    let maxRadius = (canvas.compositionwidth < canvas.compositionheight) ? canvas.compositionwidth/2 : canvas.compositionheight/2;
    let radius = 0;

    // does the space extend beyond the edge of a mat?
    while( withinMat(center, radius) ) {
      radius++;
      // does the space encroach on another space?
      for (let i = 0; i < spaces.length; i++) {
        if ( encroaching(center, radius, spaces[i]) ) {
          return radius;
        };
      }
    }
    return radius;
  }

  function withinMat(center, radius) {
    if ((abs(center.x) + radius < int(canvas.compositionwidth/2)) && (abs(center.y) + radius < int(canvas.compositionheight/2) )) {
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
