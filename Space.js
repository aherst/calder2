function Space() {
  this.center = {
    x: 0,
    y: 0,
  };
  this.radius = 0;

  this.center = pickCenter();
  if (moreSpaces == true) {
    this.radius = pickRadius(this.center);
  }

  function pickCenter() {
    let numTries = 0;
    let center = pickPoint();

    // does this point lie in another space in the composition?
    for (let i = 0; i < spaces.length; i++) {
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
      x: int(random(-mat.width/2, mat.width/2)),
      y: int(random(-mat.height/2, mat.height/2)),
    };
  }


}
