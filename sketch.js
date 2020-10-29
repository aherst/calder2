"use strict"

let canvas = Object();

function setup() {
  canvas = createCanvas(windowWidth/2,windowHeight/2);
  canvas.center();

  if (!("centerOrigin" in canvas)) canvas.centerOrigin = function ()  {
    translate((windowWidth - width) / 2, (windowHeight - height) / 2);
  }

  if (!("composition" in canvas)) canvas.composition = new Composition();

  rectMode(CENTER);

}

function draw() {
  canvas.background('pink');
  canvas.centerOrigin();
  //noFill();
  rect(0,0,canvas.composition.width,canvas.composition.height);

  canvas.composition.spaces.push(new Space());

  // draw the contents of the spaces
  for (let i = 0; i < canvas.composition.spaces.length; i++) {
    ellipse(canvas.composition.spaces[i].center.x,canvas.composition.spaces[i].center.y,canvas.composition.spaces[i].radius)
  }

  //  noLoop();
}
