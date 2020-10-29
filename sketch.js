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

  console.log(canvas.composition.spaces[canvas.composition.spaces.length - 1].center)
  if (canvas.composition.spaces[canvas.composition.spaces.length - 1].center != null) {
    canvas.composition.spaces.push(new Space());
  }

  for (let i = 0; i < canvas.composition.spaces.length - 1; i++) {
    ellipse(canvas.composition.spaces[i].center.x,canvas.composition.spaces[i].center.y,canvas.composition.spaces[i].radius)
  }

  //  noLoop();
}
