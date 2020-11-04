"use strict"

let canvas = Object();

function setup() {
  canvas = createCanvas(windowWidth/2,windowHeight/2);
  canvas.center();

  if (!("centerOrigin" in canvas)) canvas.centerOrigin = function ()  {
    translate((windowWidth - width) / 2, (windowHeight - height) / 2);
  }

  if (!("composition" in canvas)) canvas.composition = new Composition();
  canvas.composition.spaces.push(new Space());

  rectMode(CENTER);
  ellipseMode(RADIUS);

}

function draw() {
  canvas.background('pink');
  canvas.centerOrigin();
  //noFill();
  rect(0,0,canvas.composition.width,canvas.composition.height);

  // try to add another space to the composition
  if (canvas.composition.spaces[canvas.composition.spaces.length - 1].center != null) {
    canvas.composition.spaces.push(new Space());
    canvas.composition.spaces.sizeBucket = updateSizeBuckets();
  } else {
    //save(canvas, canvas.composition.name + ".png");
    reinitializeComposition();
    redraw();
  }

  // draw the shapes in each space
  for (let i = 0; i < canvas.composition.spaces.length - 1; i++) {
    ellipse(canvas.composition.spaces[i].center.x,canvas.composition.spaces[i].center.y,canvas.composition.spaces[i].radius)
  }

  frameRate(1);
  //  noLoop();
}

function reinitializeComposition() {
  canvas.composition = new Composition();
  canvas.composition.name = "calder2_" + year() + month() + day() + hour() + minute() + second();;
  canvas.composition.spaces.push(new Space());


  // moreSpaces = true;
  // palette = new Palette();
  // backgroundColor = palette.analagous.plus60;
  // background(backgroundColor);
}

function updateSizeBuckets() {
  let largestSpace = largestRadius();
  let smallestSpace = smallestRadius();

  for (let i = 0; i < canvas.composition.spaces.length; i++) {
    let radius = canvas.composition.spaces[i].radius;
    canvas.composition.spaces[i].prevSizeBucket = canvas.composition.spaces[i].sizeBucket;
    canvas.composition.spaces[i].sizeBucket = int(map(radius, smallestSpace, largestSpace, 1, 7, true));
  }

  function smallestRadius() {
    let smallestSpace = largestSpace - 1;
    for (let i = 0; i < canvas.composition.spaces.length; i++) {
      canvas.composition.spaces[i].radius < smallestSpace ? smallestSpace = canvas.composition.spaces[i].radius : smallestSpace = smallestSpace;
    }
    return smallestSpace;
  }

  function largestRadius() {
    let largestSpace = 1;
    for (let i = 0; i < canvas.composition.spaces.length; i++) {
      canvas.composition.spaces[i].radius > largestSpace ? largestSpace = canvas.composition.spaces[i].radius : largestSpace = largestSpace;
    }
    return largestSpace;
  }
}
