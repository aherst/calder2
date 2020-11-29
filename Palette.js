"use strict"

colorMode(HSB);

function Palette() {
  this.primary = color(int(random(360)),100,100);

  this.complementary = {
    plus180: color((hue(this.primary) + 180) % 360, 100, 100),
  }

  this.triadic = {
    plus120: color((hue(this.primary) + 120) % 360, 50, 75),
    minus120: color(360 - (hue(this.primary) - 120) % 360, 50, 75),
  }

  this.splitComplementary = {
    plus150: color((hue(this.primary) + 150) % 360, 100, 75),
    minus150: color(360 - (hue(this.primary) - 150) % 360, 100, 75),
  }

  let tetradicSaturation = int(random(25,75));
  this.tetradic = {
    plus120: color((hue(this.primary) + 120) % 360, tetradicSaturation, 50),
    plus180: color((hue(this.primary) + 180) % 360, tetradicSaturation, 50),
    minus60: color(360 - (hue(this.primary) - 60) % tetradicSaturation, 100, 50),
  }

  this.square = {
    plus90: color((hue(this.primary) + 90) % 360, 100, 25),
    plus180: color((hue(this.primary) + 180) % 360, 100, 25),
    minus90: color(360 - (hue(this.primary) - 90) % 360, 100, 25),
  }

  let analagousSaturation = int(random(0,50));
  this.analagous = {
    plus60: color((hue(this.primary) + 60) % 360, analagousSaturation, 100),
    plus30: color((hue(this.primary) + 30) % 360, analagousSaturation, 100),
    minus30: color(360 - (hue(this.primary) - 30) % 360, analagousSaturation, 100),
    minus60: color(360 - (hue(this.primary) - 60) % 360, analagousSaturation, 100),
  }

  switch ( int(random(1,5) )) {
    case 1:
    this.backgroundColor = this.analagous.plus60;
    break;
    case 2:
    this.backgroundColor =  this.analagous.plus30;
    break;
    case 3:
    this.backgroundColor =  this.analagous.minus30;
    break;
    case 4:
    this.backgroundColor =  this.analagous.minus60;
    break;
  }

  this.chooseFill = function (sizeBucket) {
    switch (8 - sizeBucket) {
      case 1:
      return this.primary;
      break;
      case 2:
      return this.complementary.plus180;
      break;
      case 3:
      switch ( int(random(1,3) )) {
        case 1:
        return this.triadic.plus120;
        break;
        case 2:
        return this.triadic.minus120;
        break;
      }
      break;
      case 4:
      switch ( int(random(1,3) )) {
        case 1:
        return this.splitComplementary.plus150;
        break;
        case 2:
        return this.splitComplementary.minus150;
        break;
      }
      break;
      case 5:
      switch ( int(random(1,4) )) {
        case 1:
        return this.tetradic.plus120;
        break;
        case 2:
        return this.tetradic.plus180;
        break;
        case 3:
        return this.tetradic.minus60;
        break;
      }
      break;
      case 6:
      switch ( int(random(1,4) )) {
        case 1:
        return this.square.plus90;
        break;
        case 2:
        return this.square.plus180;
        break;
        case 3:
        return this.square.minus90;
        break;
      }
      break;
      case 7:
      switch ( int(random(1,5) )) {
        case 1:
        return this.analagous.plus60;
        break;
        case 2:
        return this.analagous.plus30;
        break;
        case 3:
        return this.analagous.minus30;
        break;
        case 4:
        return this.analagous.minus60;
        break;
      }
      break;
    }
  }
}
