"use strict"

let canvas = Object();

function setup() {
  canvas = createCanvas(windowWidth/2,windowHeight/2);
  canvas.center();

  // add some methods to the base canvas object
  if (!("centerOrigin" in canvas)) canvas.centerOrigin = function ()  {
    translate((windowWidth - width) / 2, (windowHeight - height) / 2);
  }
  if (!("composition" in canvas)) canvas.composition = new Composition();

  // initialize the first space
  //canvas.composition.spaces.push(new Space());
  //canvas.composition.spaces[0].prevSizeBucket = null;
  //canvas.composition.spaces[0].sizeBucket = 7;


  // set some p5.js defaults
  rectMode(CENTER);
  ellipseMode(RADIUS);
  canvas.background('grey');

}

function draw() {
  canvas.centerOrigin();
  fill('white');
  rect(0,0,canvas.composition.width,canvas.composition.height);

  // try to add another space to the composition
  canvas.composition.spaces.push(new Space());
  if (canvas.composition.spaces.length == 1) {
    canvas.composition.spaces[0].prevSizeBucket = null;
    canvas.composition.spaces[0].sizeBucket = 7;
  }

  if (canvas.composition.spaces[canvas.composition.spaces.length - 1].center != null) {
    updateSizeBuckets();
    updateColors();
    updateShapes();

  } else {
    //save(canvas, canvas.composition.name + ".png");
    reinitializeComposition();
    redraw();
  }

/*
  // draw a circle for each space
  for (let i = 0; i < canvas.composition.spaces.length - 1; i++) {
    fill(canvas.composition.spaces[i].color);
    ellipse(canvas.composition.spaces[i].center.x,canvas.composition.spaces[i].center.y,canvas.composition.spaces[i].radius)
  }
*/

  // draw a shape for each space
  drawOutlines();

  frameRate(1);
  //  noLoop();
}

function drawOutlines() {
  for (let j = 0; j < canvas.composition.spaces.length; j++) {
    fill(canvas.composition.spaces[j].color);
    beginShape();
    for (let i = 0; i < canvas.composition.spaces[j].outlineVertices.length; i++) {
      curveVertex(canvas.composition.spaces[j].outlineVertices[i][0], canvas.composition.spaces[j].outlineVertices[i][1]);
    }
    for (let i = 0; i < 3; i++) {
      curveVertex(canvas.composition.spaces[j].outlineVertices[i][0], canvas.composition.spaces[j].outlineVertices[i][1]);
    }
    endShape();
  }
}


function updateShapes() {
  canvas.composition.spaces[canvas.composition.spaces.length - 1].outlineVertices = calder(canvas.composition.spaces[canvas.composition.spaces.length - 1]);
  //canvas.composition.spaces[canvas.composition.spaces.length - 1].color = chooseFill(canvas.composition.spaces[canvas.composition.spaces.length - 1]);
  for (let i = 0; i < canvas.composition.spaces.length; i++) {
    if (canvas.composition.spaces[i].sizeBucket != canvas.composition.spaces[i].prevSizeBucket ) {
      canvas.composition.spaces[i].outlineVertices = calder(canvas.composition.spaces[i]);
      //    canvas.composition.spaces[i].color = chooseFill(canvas.composition.spaces[i]);
    }
  }

  function calder(space) {
    let outlineVertices = [];
    let numVertices = space.sizeBucket + 4;
    for (let i = 0; i < numVertices; i++) {
      let radiusXMultiplier = random(space.radius/(2 * space.sizeBucket), space.radius);
      let radiusYMultiplier = radiusXMultiplier;
      outlineVertices[i] = [ space.center.x + (cos(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices))) * radiusXMultiplier), space.center.y + (sin(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices))) * radiusYMultiplier) ]
    }
    return outlineVertices;
  }
}


function reinitializeComposition() {
  canvas.composition = new Composition();
  canvas.composition.name = "calder2_" + year() + month() + day() + hour() + minute() + second();;
  canvas.composition.spaces.push(new Space());
  canvas.composition.spaces[0].prevSizeBucket = null;
  canvas.composition.spaces[0].sizeBucket = 7;

  // moreSpaces = true;
  // palette = new Palette();
  // backgroundColor = palette.analagous.plus60;
  // background(backgroundColor);
}

function updateColors() {
  canvas.composition.spaces.forEach(function (space) {
    switch (space.sizeBucket) {
      case 1:
      space.color = color('red');
      break;
      case 2:
      space.color = color('green');
      break;
      case 3:
      space.color = color('blue');
      break;
      case 4:
      space.color = color('cyan');
      break;
      case 5:
      space.color = color('yellow');
      break;
      case 6:
      space.color = color('magenta');
      break;
      case 7:
      space.color = color('black');
      break;

    }
  });
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
