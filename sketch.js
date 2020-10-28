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
  rect(0,0,canvas.composition.width,canvas.composition.height);

  canvas.composition.spaces.push(new Space());

//  noLoop();
}
