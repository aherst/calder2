"use strict"

let canvas = Object();

function setup() {
  canvas = createCanvas(windowWidth/2,windowHeight/2);

  // add properties and methods to the canvas object
  if (!("center" in canvas)) canvas.center = function ()  {
    canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  }

  if (!("centerOrigin" in canvas)) canvas.centerOrigin = function ()  {
    translate((windowWidth - width) / 2, (windowHeight - height) / 2);
  }
  if (!("composition" in canvas)) canvas.composition = new Composition();

  canvas.center();

  rectMode(CENTER);

}

function draw() {
  canvas.background('pink');
  canvas.centerOrigin();
  rect(0,0,canvas.composition.width,canvas.composition.height);

  canvas.composition.spaces.push(new Space());

  noLoop();
}
