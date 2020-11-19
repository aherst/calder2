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

  if (canvas.composition.spaces[canvas.composition.spaces.length - 1].center != null) {
    updateSizeBuckets();
    updateColors();
    updateOutlineVertices();
    drawOutlineVertices();
    updateInlineVertices();
    drawInlineVertices();
  } else {
    //save(canvas, canvas.composition.name + ".png");
    canvas.composition = new Composition();
  }

  frameRate(1);
  //  noLoop();
}

function updateInlineVertices() {
  // add the vertices for the inline of shape for the new space
  let lastSpace = canvas.composition.spaces.length - 1;
  canvas.composition.spaces[lastSpace].inlineVertices =  JSON.parse(JSON.stringify(canvas.composition.spaces[lastSpace].outlineVertices));
  canvas.composition.spaces[lastSpace].inlineVertices.forEach(function (inlineVertex) {
    inlineVertex[0] = inlineVertex[0] - (inlineVertex[0] / 2);
    inlineVertex[1] = inlineVertex[1] - (inlineVertex[1] / 2);
  });

  canvas.composition.spaces.forEach(function (space) {
    if (space.sizeBucket != space.prevSizeBucket ) {
      space.inlineVertices = JSON.parse(JSON.stringify(space.outlineVertices));
      space.inlineVertices.forEach(function (inlineVertex) {
        inlineVertex[0] = inlineVertex[0] - (inlineVertex[0] / 2);
        inlineVertex[1] = inlineVertex[1] - (inlineVertex[1] / 2);
      });
    }
  });
/*
  for (let i = 0; i < canvas.composition.spaces.length; i++) {
    if (canvas.composition.spaces[i].sizeBucket != canvas.composition.spaces[i].prevSizeBucket ) {
      for (let j = 0; j < canvas.composition.spaces[i].outlineVertices.length; j++) {
        canvas.composition.spaces[i].inlineVertices[j][0] = (canvas.composition.spaces[i].outlineVertices[j][0]) / 2;
        canvas.composition.spaces[i].inlineVertices[j][1] = (canvas.composition.spaces[i].outlineVertices[j][1]) / 2;
      }
    }
  }
  */
}

function drawInlineVertices() {
  canvas.composition.spaces.forEach(function (space) {
    noFill();
    ellipse(space.center.x, space.center.y,space.radius);
    fill(random(255),random(255),random(255));
    beginShape();
    space.inlineVertices.forEach(function (inlineVertex) {
      curveVertex(inlineVertex[0], inlineVertex[1]);
    });
    for (let i = 0; i < 3; i++) {
      curveVertex(space.inlineVertices[i][0], space.inlineVertices[i][1]);
    }
    endShape();
  });

}

function drawOutlineVertices() {
  canvas.composition.spaces.forEach(function (space) {
    noFill();
    ellipse(space.center.x, space.center.y,space.radius);
    fill(space.color);
    let radiusXMultiplier = random(space.radius/(2 * space.sizeBucket), space.radius);
    let radiusYMultiplier = radiusXMultiplier;
    push();
    translate(space.center.x, space.center.y);
    beginShape();
    space.outlineVertices.forEach(function (outlineVertex) {
      curveVertex(outlineVertex[0] * radiusXMultiplier, outlineVertex[1] * radiusYMultiplier);
    });
    for (let i = 0; i < 3; i++) {
      curveVertex(space.outlineVertices[i][0] * radiusXMultiplier, space.outlineVertices[i][1] * radiusYMultiplier);
    }
    endShape();
    pop();
  });
}

function updateOutlineVertices() {
  // add the vertices for the outline of the shape for the new space
  canvas.composition.spaces[canvas.composition.spaces.length - 1].outlineVertices = calder(canvas.composition.spaces[canvas.composition.spaces.length - 1]);
  //canvas.composition.spaces[canvas.composition.spaces.length - 1].color = chooseFill(canvas.composition.spaces[canvas.composition.spaces.length - 1]);

  // update the outlines of the existing spaces if they've been moved into a different sizeBucket
  canvas.composition.spaces.forEach(function (space) {
    if (space.sizeBucket != space.prevSizeBucket ) {
      space.outlineVertices = calder(space);
      //    space.color = chooseFill(space);
    }
  });

  function calder(space) {
    let outlineVertices = [];
    let numVertices = space.sizeBucket + 3;
    for (let i = 0; i < numVertices; i++) {
      //outlineVertices[i] = [ space.center.x + (cos(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices))) * radiusXMultiplier), space.center.y + (sin(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices))) * radiusYMultiplier) ]
      outlineVertices[i] = [ (cos(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices)))), (sin(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices)))) ]
    }
    return outlineVertices;
  }
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

  canvas.composition.spaces.forEach(function (space) {
    let radius = space.radius;
    space.prevSizeBucket = space.sizeBucket;
    space.sizeBucket = int(map(radius, smallestSpace, largestSpace, 1, 7, true));
  });

  function smallestRadius() {
    let smallestSpace = largestSpace - 1;
    canvas.composition.spaces.forEach(function (space) {
      space.radius < smallestSpace ? smallestSpace = space.radius : smallestSpace = smallestSpace;
    });
    return smallestSpace;
  }

  function largestRadius() {
    let largestSpace = 1;
    canvas.composition.spaces.forEach(function (space) {
      space.radius > largestSpace ? largestSpace = space.radius : largestSpace = largestSpace;
    });
    return largestSpace;
  }
}
