"use strict"

// is it possible to have only one global variable for the global object?
let canvas = Object();

function setup() {
  canvas = createCanvas(windowWidth/2,windowHeight/2);
  canvas.background('grey');

  console.log("composition" in canvas);
  canvas.composition = new Composition();
  if ("composition" in canvas)
  console.log(canvas.composition.name);
}

function draw() {
}
