"use strict"

function Composition() {
  this.name = "calder2_" + year() + month() + day() + hour() + minute() + second();

  this.paperWidth = 8.5;
  this.paperHeight = 11;
  this.mattedWidth = 7.5;
  this.mattedHeight = 9.5;

  this.width = canvas.width * this.mattedWidth/this.paperWidth;
  this.height = canvas.height * this.mattedHeight/this.paperHeight;

  this.spaces = [];
}
