/// <reference path="../_P5JS-Project-Template-for-VSCode/TSDef/p5.global-mode.d.ts" />

"use strict"

let canvas = {};
let canvasGradient = {};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  //canvas = createCanvas(11 * 300, 8.5 * 300);
  canvas.width = canvas.width;

  // set some p5.js defaults
  rectMode(CENTER);
  imageMode(CENTER);
  frameRate(1);
  noStroke();
  colorMode(HSB);

  // add some methods to the base canvas object
  if (!("centerCanvas" in canvas)) {
    canvas.centerCanvas = function ()  {
      canvas.position(int((windowWidth - canvas.width) / 2), int((windowHeight - canvas.height) / 2));
    }
  } else {
    console.log('centerCanvas already exists');
  }

  if (!("centerOrigin" in canvas)) {
    canvas.centerOrigin = function ()  {
      translate(int(canvas.width / 2), int(canvas.height / 2));
    }
  } else {
    console.log('centerOrigin already exists');
  }

  // add the composition object to the canvas
  if (!("composition" in canvas)) {
    canvas.composition = new Composition();
    canvas.composition.palette = new Palette();
  } else {
    console.log('composition already exists');
  }

  canvasGradient = createGraphics(canvas.width * 2, canvas.height * 2);
  updateCanvasGradient();
}

function draw() {
  canvas.centerCanvas();
  canvas.centerOrigin();

  // try to add another space object to the spaces array
  canvas.composition.spaces.push(new Space());
  // Space() pushes a null onto the end of spaces[] if we can't place another space
  if (canvas.composition.spaces[canvas.composition.spaces.length - 1].center != null) {
    updateSizeBuckets();
    updateColors();
    updateOutlineVertices();
    updateInlineVertices();
    updateLines();
    background(canvas.composition.palette.backgroundColor);
    drawCanvasGradient();
    //drawGradient();
    //drawCircularGradient();
    //drawLines();
    drawOutlineVertices();
    drawInlineVertices();
  } else {
    noLoop();
    //saveCanvas(canvas, canvas.composition.name + ".png");
    canvas.composition = new Composition();
    canvas.composition.palette = new Palette();
  }
}

function updateCanvasGradient() {
  canvasGradient.ellipseMode(RADIUS);

  canvasGradient.push();
  //canvasGradient.translate(random(canvas.width),random(canvas.height));
  canvasGradient.translate(canvasGradient.width/2,canvasGradient.height/2);

  colorMode(RGB);
  let backgroundColor;

  // we want the radius to describe a circle that enscribes canvasGradient
  let radius = int(dist(0,0,canvasGradient.width/2,canvasGradient.height/2));
  // start drawing circles from the outside in going from black to color to white in the centre
  for (let i = radius; i >= 0; i--) {
    if (i > radius/2) {
      backgroundColor = lerpColor(color('black'), color(canvas.composition.palette.backgroundColor), 1 -(abs(radius/2 - i) / (radius/2) ) );
    } else {
      backgroundColor = lerpColor(color('white'), color(canvas.composition.palette.backgroundColor), 1 -(abs(radius/2 - i) / (radius/2) ) );
    }
    canvasGradient.stroke(backgroundColor);
    canvasGradient.fill(backgroundColor);
    canvasGradient.ellipse(0, 0, i, i);
  }
  colorMode(HSB);
  canvasGradient.pop();
}

function drawCanvasGradient() {
  // find the centre of the largest space
  let x = 0;
  let y = 0;
  let radius = 1;

  canvas.composition.spaces.forEach(function (space) {
    if (space.radius > radius) {
      x = space.center.x;
      y = space.center.y;
      radius = space.radius;
    }
  });


  // centre the gradient behind the largest space
  push();
  //translate(random(-canvas.width/2,canvas.width/2),random(-canvas.height/2,canvas.height/2));
  translate(x,y);
  image(canvasGradient, 0, 0);
  pop();
}

function drawCircularGradient() {
  push();
  //translate(-canvas.width/2,-canvas.height/2);
  colorMode(RGB);
  let backgroundColor;
  let radius = int(dist(0,0,canvas.width/2,canvas.height/2));
  for (let i = radius; i >= 0; i--) {
    if (i <= radius) {
      backgroundColor = lerpColor(color(canvas.composition.palette.backgroundColor), color(255,255,255), (radius - i) / radius );
    } else {
      backgroundColor = lerpColor(color(255,255,255), color(canvas.composition.palette.backgroundColor), abs(1 - ( i / (radius / 2 ) ) ) );
    }
    stroke(backgroundColor);
    //noFill();
    fill(backgroundColor);
    ellipse(0, 0, i, i);
  }
  colorMode(HSB);
  pop();
  noStroke();
}

function drawGradient() {
  push();
  translate(-canvas.width/2,-canvas.height/2);
  colorMode(RGB);
  let backgroundColor;
  for (let i = 0; i <= canvas.height; i++) {
    if (i < canvas.height) {
      backgroundColor = lerpColor(color(canvas.composition.palette.backgroundColor), color(255,255,255), (i / (canvas.height) ) );
    } else {
      backgroundColor = lerpColor(color(canvas.composition.palette.backgroundColor), color(0,0,0), abs(1 - (i / (canvas.height / 2) ) ) );
    }
    stroke(backgroundColor);
    line(0,i,canvas.width,i);
  }
  colorMode(HSB);
  pop();
  noStroke();
}

function updateLines() {

}

function drawLines() {
  canvas.composition.spaces.forEach(function (space) {
    if (space.sizeBucket < 2) {
      push();
      translate(space.center.x,space.center.y);
      //    translate(space.inlineVertices[0].x, space.inlineVertices[0].y);
      noFill();
      stroke(space.color);
      for (let i = 0; i <= 360; i+= random(40)) {
        strokeWeight(random(space.radius/5));
        line(
          cos(radians(i)) * random(space.radius * space.sizeBucket),
          sin(radians(i)) * random(space.radius * space.sizeBucket),
          cos(radians(i)) * random(space.radius,space.radius * space.sizeBucket *2),
          sin(radians(i)) * random(space.radius,space.radius * space.sizeBucket *2));
        }
        noStroke();
        pop();
      }
    });
  }

  function updateInlineVertices() {
    // add the vertices for the inline of shape for the new space
    let lastSpace = canvas.composition.spaces.length - 1;
    let outlineWidth = 0.1;
    // we need a deep copy of the array so use JSON methods
    canvas.composition.spaces[lastSpace].inlineVertices =  JSON.parse(JSON.stringify(canvas.composition.spaces[lastSpace].outlineVertices));
    canvas.composition.spaces[lastSpace].inlineVertices.forEach(function (inlineVertex) {
      inlineVertex.x = inlineVertex.x - (inlineVertex.x * outlineWidth);
      inlineVertex.y = inlineVertex.y - (inlineVertex.y * outlineWidth);
    });

    canvas.composition.spaces.forEach(function (space) {
      if (space.sizeBucket != space.prevSizeBucket ) {
        space.inlineVertices = JSON.parse(JSON.stringify(space.outlineVertices));
        space.inlineVertices.forEach(function (inlineVertex) {
          inlineVertex.x = inlineVertex.x - (inlineVertex.x * outlineWidth);
          inlineVertex.y = inlineVertex.y - (inlineVertex.y * outlineWidth);
        });
      }
    });
  }

  function drawInlineVertices() {
    canvas.composition.spaces.forEach(function (space) {
      if (space.sizeBucket > 2) {
        push();
        translate(space.center.x, space.center.y);
        fill(space.color);
        beginShape();
        space.inlineVertices.forEach(function (inlineVertex) {
          curveVertex(inlineVertex.x, inlineVertex.y);
        });
        for (let i = 0; i < 3; i++) {
          curveVertex(space.inlineVertices[i].x, space.inlineVertices[i].y);
        }
        endShape();
        pop();
      }
    });
  }

  function drawOutlineVertices() {
    canvas.composition.spaces.forEach(function (space) {
      if (space.sizeBucket > 2) {
        fill('black');
      } else {
        fill(space.color);
      }
        // draw the shape in the space
        push();
        translate(space.center.x, space.center.y);
        beginShape();
        space.outlineVertices.forEach(function (outlineVertex) {
          curveVertex(outlineVertex.x, outlineVertex.y);
        });
        for (let i = 0; i < 3; i++) {
          curveVertex(space.outlineVertices[i].x, space.outlineVertices[i].y);
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
      let outlineVertices = [ ];
      let numVertices = space.sizeBucket + 3;
      for (let i = 0; i < numVertices; i++) {
        outlineVertices[i] = {
          x: (cos(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices)))),
          y:  (sin(radians(random(i * 360/numVertices, i * 360/numVertices + 180/numVertices))))
        };

        let radiusMultiplier = random(space.radius/(2 * space.sizeBucket), space.radius);
        outlineVertices[i].x = outlineVertices[i].x * radiusMultiplier;
        outlineVertices[i].y = outlineVertices[i].y * radiusMultiplier;
      }
      return outlineVertices;
    }
  }

  function updateColors() {
    canvas.composition.spaces.forEach(function (space) {
      space.color = canvas.composition.palette.chooseFill(space.sizeBucket);
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
