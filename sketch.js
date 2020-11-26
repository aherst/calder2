"use strict"

let canvas = {};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  //canvas = createCanvas(11 * 300, 8.5 * 300);

  // add some methods to the base canvas object
  if (!("centerCanvas" in canvas)) {
    canvas.centerCanvas = function ()  {
      canvas.position((windowWidth - canvas.width) / 2, (windowHeight - canvas.height) / 2);
    }
  } else {
    console.log('centerCanvas already exists');
  }

  if (!("centerOrigin" in canvas)) {
    canvas.centerOrigin = function ()  {
      translate(canvas.width / 2, canvas.height / 2);
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

  // set some p5.js defaults
  rectMode(CENTER);
  ellipseMode(RADIUS);
  frameRate(1);
  noStroke();
}

function draw() {
  canvas.centerCanvas();
  canvas.centerOrigin();

  // try to add another space to the composition
  // returns center == null if we can't place another space
  canvas.composition.spaces.push(new Space());
  if (canvas.composition.spaces[canvas.composition.spaces.length - 1].center != null) {
    background('white');
    updateSizeBuckets();
    updateColors();
    updateOutlineVertices();
    updateInlineVertices();
    drawOutlineVertices();
    drawInlineVertices();
  } else {
    saveCanvas(canvas, canvas.composition.name + ".png");
    noLoop();
    canvas.composition = new Composition();
  }
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
  });

}

function drawOutlineVertices() {
  canvas.composition.spaces.forEach(function (space) {
    fill(space.color);
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
    space.color = canvas.composition.palette.chooseColor(space.sizeBucket);
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
