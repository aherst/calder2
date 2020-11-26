function Palette(spaces) {
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

  let tetradicSaturation = random(25,100);
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

  let analagousSaturation = random(25,100);
  this.analagous = {
    plus60: color((hue(this.primary) + 60) % 360, analagousSaturation, 100),
    plus30: color((hue(this.primary) + 30) % 360, analagousSaturation, 100),
    minus30: color(360 - (hue(this.primary) - 30) % 360, analagousSaturation, 100),
    minus60: color(360 - (hue(this.primary) - 60) % 360, analagousSaturation, 100),
  }

}
