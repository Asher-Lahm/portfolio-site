//Welcome! Press space to start generating some new computer friends!
let patternSquares1;
let patternSquares2;
let patternArray = [];
let firstClick = false;
let displayMode = false;
let friendArray = [];
let timer = 0;
let animationTimer = 0;
let transitionTimer = 0;
let menuScale = 1;
let scroll = 0;
let currentFriendNumber;
let menuMargin = 0;
let buttonSize = 0;
let scrollButtonAmount = 0;
let menuButtonSize = 0;


function preload() {
  imaginaryGadgets = loadSound("imaginaryGadgets.mp3");
}

//A class that holds multiple 2d arrays, where the indices align with each grid space in a pattern and the values align with the functions stored in the "array" field. The gap is the gap between each grid space. Frequency and amplitude fields control the strength and speed of the waves of each pattern.
class Pattern {
  constructor(x, y, sizeX, sizeY, rows, columns, colors, gap, array, amplitudeX, frequencyX, amplitudeY, frequencyY) {
    let gridSquares = [];
    let gridColors = [];
    let gridRotations = [];
    let gridGaps = [];
    for(let i = 0; i < rows; i++) {
      let rowSquares = []
      let rowColors = [];
      let rowRotations = [];
      let rowGaps = [];
      for(let j = 0; j < columns; j++) {
        //Each grid space has a random function to call, a random rotation, color, and gap size.
        rowSquares.push(int(random(2, array.length)))
        rowColors.push(colors)
        rowRotations.push(int(random(0, 4)))
        rowGaps.push(gap)
      }
      gridSquares.push(rowSquares);
      gridColors.push(rowColors);
      gridRotations.push(rowRotations);
      gridGaps.push(rowGaps);
    }
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.squares = gridSquares;
    this.colors = gridColors;
    this.rotations = gridRotations;
    this.gaps = gridGaps;
    this.array = array;
    this.amplitudeX = amplitudeX;
    this.frequencyX = frequencyX;
    this.amplitudeY = amplitudeY;
    this.frequencyY = frequencyY;
  }
  drawPattern() {
    let squareHeight = this.sizeY/this.squares.length - 0.00001;
    for(let i = 0; i < int(this.sizeY/squareHeight); i++) {
      let squareWidth = this.sizeX/this.squares[i].length - 0.00001;
      for(let j = 0; j < int(this.sizeX/squareWidth); j++) {
        let y = this.y - (this.amplitudeY / 2) + squareHeight * i + this.amplitudeY * sin(((timer + (i + j) * (this.frequencyY / 4)) / this.frequencyY));
        let x = this.x - (this.amplitudeX / 2) + squareWidth * j + this.amplitudeX * cos(((timer + (i + j) * (this.frequencyX / 4)) / this.frequencyX));
        this.array[this.squares[i][j]](x, y, squareWidth, squareHeight, this.rotations[i][j] * PI/2, this.colors[i][j], this.gaps[i][j]);
      }
    }
  }
  //Draws a very simplified version of the pattern, only using the pattern's boundaries and colors. No individual grid pieces or movement.
  drawPatternSimple() {
    stroke(this.colors[0][0]);
    strokeWeight(40);
    noFill();
    rect(this.x - 180, this.y - 180, this.sizeX, this.sizeY)
  }
}

//A class that holds an array of patterns along with its position and size. It has two methods, one for drawing itself and one for drawing a simplified version of itself.
class Friend {
  constructor(x, y, size, patterns) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.patterns = patterns;
  }
  drawFriend() {
    push();
    translate(this.x, this.y);
    scale(this.size);
    for (let i = 0; i < this.patterns.length; i++) {
      this.patterns[i].drawPattern();
    }
    pop();
  }
  drawFriendSimple() {
    push();
    translate(this.x, this.y);
    scale(0.25);
    fill(90);
    noStroke();
    for (let i = 0; i < this.patterns.length; i++) {
      this.patterns[i].drawPatternSimple();
    }
    pop();
  }
}

//Scales the values in a color by a scalar.
function colorScalar(colorIn, scalar) {
  let r = red(colorIn) * scalar;
  let g = green(colorIn) * scalar;
  let b = blue(colorIn) * scalar;
  return color(r, g, b)
}

//Adds two colors.
function addColors(color1, color2) {
  let r = red(color1) + red(color2);
  let g = green(color1) + green(color2);
  let b = blue(color1) + blue(color2);
  return color(r, g, b);
}

//All functions ending in "Grid" draw a tile of the grid when called.
function triangleGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  triangle(rightX, topY, rightX, bottomY, leftX, bottomY);
  pop();
}

function triCornerGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  triangle(rightX, -sizeY/6, rightX, bottomY, -sizeX/6, bottomY);
  triangle(leftX, sizeY/6, leftX, topY, sizeX/6, topY);
  pop();
}

function diagGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  beginShape();
  vertex(leftX, topY);
  vertex(leftX + sizeX/3, topY);
  vertex(rightX, bottomY - sizeY/3);
  vertex(rightX, bottomY);
  vertex(rightX - sizeX/3, bottomY);
  vertex(leftX, topY + sizeY/3);
  vertex(leftX, topY);
  endShape();
  pop();
}

function emptyGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  
}

function semiCircleGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  arc(0, bottomY, sizeX - (2 * gap * sizeX), sizeY - (2 * gap * sizeY), PI, 0);
  pop();
}

function hollowSquareGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  beginShape();
  vertex(leftX, topY);
  vertex(leftX, bottomY);
  vertex(rightX, bottomY);
  vertex(rightX, topY);
  vertex(leftX, topY);
  beginContour();
  vertex(leftX + sizeX/6, topY + sizeY/6);
  vertex(rightX - sizeX/6, topY + sizeY/6);
  vertex(rightX - sizeX/6, bottomY - sizeY/6);
  vertex(leftX + sizeX/6, bottomY - sizeY/6);
  vertex(leftX + sizeX/6, topY + sizeY/6);
  endContour();
  endShape();
  pop();
}

function squareGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  fill(colors)
  beginShape();
  vertex(leftX + sizeX/6, topY + sizeY/6);
  vertex(rightX - sizeX/6, topY + sizeY/6);
  vertex(rightX - sizeX/6, bottomY - sizeY/6);
  vertex(leftX + sizeX/6, bottomY - sizeY/6);
  vertex(leftX + sizeX/6, topY + sizeY/6);
  endShape();
  pop();
}

function fullGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  noStroke();
  fill(colors);
  rect(leftX, topY, sizeX - (2 * gap * sizeX), sizeY - (2 * gap * sizeY));
  pop();
}

function fullCircleGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  push();
  translate(x + sizeX/2, y + sizeY/2);
  noStroke();
  fill(colors);
  ellipse(0, 0, sizeX - 2 * gap, sizeY - 2 * gap)
  pop();
}

function outlineCircleGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let strokeWidth = min(sizeX, sizeY) / 4;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  stroke(colors);
  strokeWeight(strokeWidth);
  noFill();
  ellipse(0, 0, (sizeX - 2 * gap) - strokeWidth, (sizeY - 2 * gap) - strokeWidth);
  pop();
}

function twoCircleHalvesGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  arc(0, bottomY, sizeX - (2 * gap * sizeX), sizeY - (2 * gap * sizeY), PI, 0);
  arc(0, topY, sizeX - (2 * gap * sizeX), sizeY - (2 * gap * sizeY), 0, PI);
  pop();
}

function diagGridFull(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  beginShape();
  vertex(leftX, topY);
  vertex(leftX + sizeX/3, topY);
  vertex(rightX, bottomY - sizeY/3);
  vertex(rightX, bottomY);
  vertex(rightX - sizeX/3, bottomY);
  vertex(leftX, topY + sizeY/3);
  vertex(leftX, topY);
  endShape();
  triangle(leftX, bottomY, leftX, bottomY - sizeY/3, leftX + sizeX/3, bottomY);
  triangle(rightX, topY, rightX, topY + sizeY/3, rightX - sizeX/3, topY);
  pop();
}

function thinVerticalGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  let thickX = sizeX / 20;
  noStroke();
  fill(colors);
  rect(-thickX, topY, thickX * 2, sizeY);
  pop();
}

function thinHorizontalGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  let thickY = sizeY / 20;
  noStroke();
  fill(colors);
  rect(leftX, -thickY, sizeX, thickY * 2);
  pop();
}

function thickVerticalGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  let thickX = sizeX / 10;
  noStroke();
  fill(colors);
  rect(-thickX, topY, thickX * 2, sizeY);
  pop();
}

function thickHorizontalGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  let thickY = sizeY / 10;
  noStroke();
  fill(colors);
  rect(leftX, -thickY, sizeX, thickY * 2);
  pop();
}

function thinGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  let thickX = sizeX / 20;
  let thickY = sizeY / 20;
  noStroke();
  fill(colors);
  rect(-thickX, topY, thickX * 2, sizeY);
  rect(leftX, -thickY, sizeX, thickY * 2);
  pop();
}

function thickGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  let thickX = sizeX / 10;
  let thickY = sizeY / 10;
  noStroke();
  fill(colors);
  rect(-thickX, topY, thickX * 2, sizeY);
  rect(leftX, -thickY, sizeX, thickY * 2);
  pop();
}

function spikeGrid(x, y, sizeX, sizeY, rotation, colors, gap) {
  let leftX = sizeX * gap - sizeX/2;
  let rightX = sizeX/2 - sizeX * gap;
  let topY = sizeY * gap - sizeY/2;
  let bottomY = sizeY/2 - sizeY * gap;
  push();
  translate(x + sizeX/2, y + sizeY/2);
  rotate(rotation);
  if (rotation == PI/2 || rotation == 3 * PI/2) {
    scale(sizeY/sizeX, sizeX/sizeY);
  }
  noStroke();
  fill(colors);
  triangle(leftX, bottomY, rightX, bottomY, 0, topY);
  pop();
}

//Functions beginning with "alter" take in a pattern and replace grid spaces in a pattern and replace them with another kind of grid space, usually an empty grid space. Most function arrays begin with an empty grid space, so pass in "0" to replace the spaces with empty.

function alterDiagStripes(pattern, replace) {
  for (let i = 0; i < pattern.squares.length; i++) {
    for (let j = 0; j < pattern.squares[0].length; j++) {
      if (int((i + j) / 3) % 2 == 0) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterDownLeftStairCase(pattern, replace) {
  for (let i = 0; i < pattern.squares.length; i++) {
    for (let j = 0; j < pattern.squares[0].length; j++) {
      if (i < j) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterUpRightStairCase(pattern, replace) {
  for (let i = 0; i < pattern.squares.length; i++) {
    for (let j = 0; j < pattern.squares[0].length; j++) {
      if (i > j) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterUpLeftStairCase(pattern, replace) {
  for (let i = 0; i < pattern.squares.length; i++) {
    for (let j = 0; j < pattern.squares[0].length; j++) {
      if (pattern.squares.length - i < pattern.squares[0].length - j) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterDownRightStairCase(pattern, replace) {
  for (let i = 0; i < pattern.squares.length; i++) {
    for (let j = 0; j < pattern.squares[0].length; j++) {
      if (pattern.squares.length - i > pattern.squares[0].length - j) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterFillMid(pattern, replace, chance) {
  for (let i = 0; i < pattern.squares.length; i++) {
    for (let j = 0; j < pattern.squares[0].length; j++) {
      let randomReplace = int(random(0, 100));
      if (i > 0 && j > 0 && i < pattern.squares.length - 1 && j < pattern.squares[0].length - 1 && randomReplace % chance == 0) {
        pattern.squares[i][j] = random(replace);
      }
    }
  }
  return pattern;
}

function alterDiamond(pattern, replace) {
  let iMax = pattern.squares.length - 1;
  let jMax = pattern.squares[0].length - 1;
  let midpoint = int(min(iMax, jMax) / 2);
  for (let i = 0; i < iMax + 1; i++) {
    for (let j = 0; j < jMax + 1; j++) {
      if (i + j < midpoint || (iMax - i) + (jMax - j) < midpoint || i + (jMax - j) < midpoint || (iMax - i) + j < midpoint) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterUpRight(pattern, replace) {
  let iMax = pattern.squares.length - 1;
  let jMax = pattern.squares[0].length - 1;
  let midpoint = int(min(iMax, jMax) / 2);
  for (let i = 0; i < iMax + 1; i++) {
    for (let j = 0; j < jMax + 1; j++) {
      if (i + j < midpoint || (iMax - i) + (jMax - j) < midpoint) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterDownLeft(pattern, replace) {
  let iMax = pattern.squares.length - 1;
  let jMax = pattern.squares[0].length - 1;
  let midpoint = int(min(iMax, jMax) / 2);
  for (let i = 0; i < iMax + 1; i++) {
    for (let j = 0; j < jMax + 1; j++) {
      if (i + (jMax - j) < midpoint || (iMax - i) + j < midpoint) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterRandomCorner(pattern, replace, corner) {
  let iMax = pattern.squares.length - 1;
  let jMax = pattern.squares[0].length - 1;
  let midpoint = int(min(iMax, jMax) / 2);
  if (corner === undefined) {
    corner = int(random(0, 4));
  }
  for (let i = 0; i < iMax + 1; i++) {
    for (let j = 0; j < jMax + 1; j++) {
      if (i + j < midpoint && corner == 0) {
        pattern.squares[i][j] = replace;
      } else if ((iMax - i) + (jMax - j) < midpoint && corner == 1) {
        pattern.squares[i][j] = replace;
      } else if (i + (jMax - j) < midpoint && corner == 2) {
        pattern.squares[i][j] = replace;
      } else if ((iMax - i) + j < midpoint && corner == 3) {
        pattern.squares[i][j] = replace;
      }
    }
  }
  return pattern;
}

function alterRotationsSame(pattern, replace) {
  let iMax = pattern.squares.length;
  let jMax = pattern.squares[0].length;
  for (let i = 0; i < iMax; i++) {
    for (let j = 0; j < jMax; j++) {
      pattern.rotations[i][j] = replace;
    }
  }
  return pattern;
}

//An function for generating color palettes. These palettes come in Complimentary, Tertiary, Analagous, and Monochrome with a few different variations of each as well. This function has no parameters, so you just have to call it and it spits out a nice color palette!
function setColors() {
  let paletteType = int(random(0, 100))
  let subType = int(random(0, 100))
  let colorList = [];
  let neg = 1;
  if (paletteType % 2 == 0) {
    neg = -1;
  }
  if (paletteType % 4 == 0) {
    let satVal = random(10, 50);
    if (subType % 2 == 0) {
      colorList.push("Complimentary Lighter");
      let color1 = [random(0, 360), 70, 90];
      colorList.push(color1);
      let color2 = setLighter(color1, 2);
      colorList.push(color2);
      let color3 = setLighter(color2, 2);
      colorList.push(color3);
      let color4 = [(color1[0] + 180) % 360, color1[1], color1[2]];
      colorList.push(color4);
      let color5 = setLighter(color4, 2);
      colorList.push(color5);
      let color6 = setLighter(color5, 2);
      colorList.push(color6);
      let color7 = [(color1[0] + 180) % 360, satVal, random(15, 30)];
      colorList.push(color7);
      let color8 = [color7[0], satVal, random(70, 90)];
      colorList.push(color8);
    } else {
      colorList.push("Complimentary Analagous");
      let color1 = [random(0, 360), 70, 90];
      colorList.push(color1);
      let color2 = setAnalagous(color1, neg * 16);
      colorList.push(color2);
      let color3 = setAnalagous(color2, neg * 16);
      colorList.push(color3);
      let color4 = [(color1[0] + 180) % 360, color1[1], color1[2]];
      colorList.push(color4);
      let color5 = setAnalagous(color4, neg * 16);
      colorList.push(color5);
      let color6 = setAnalagous(color5, neg * 16);
      colorList.push(color6);
      let color7 = [(color1[0] + 180) % 360, satVal, random(15, 30)];
      colorList.push(color7);
      let color8 = [color7[0], satVal, random(70, 90)];
      colorList.push(color8);
    }
  } else if (paletteType % 4 == 1) {
    let satVal = random(10, 50);
    if (subType % 2 == 0) {
      colorList.push("Tertiary Lighter");
      let color1 = [random(0, 360), 70, 90];
      colorList.push(color1);
      let color2 = setLighter(color1, 2);
      colorList.push(color2);
      let color3 = [(color1[0] + 180) % 360, color1[1], color1[2]];
      colorList.push(color3);
      let color4 = setLighter(color3, 2);
      colorList.push(color4);
      let color5 = [(color3[0] + 120) % 360, color3[1], color3[2]];
      colorList.push(color5);
      let color6 = setLighter(color5, 2);
      colorList.push(color6);
      let color7 = [(color1[0] + 120) % 360, satVal, random(15, 30)];
      colorList.push(color7);
      let color8 = [(color7[0] + 120) % 360, satVal, random(70, 90)];
      colorList.push(color8);
    } else {
      colorList.push("Tertiary Analagous");
      let color1 = [random(0, 360), 70, 90];
      colorList.push(color1);
      let color2 = setAnalagous(color1, neg * 16);
      colorList.push(color2);
      let color3 = [(color1[0] + 180) % 360, color1[1], color1[2]];
      colorList.push(color3);
      let color4 = setAnalagous(color3, neg * 16);
      colorList.push(color4);
      let color5 = [(color3[0] + 120) % 360, color3[1], color3[2]];
      colorList.push(color5);
      let color6 = setAnalagous(color5, neg * 16);
      colorList.push(color6);
      let color7 = [(color1[0] + 120) % 360, satVal, random(15, 30)];
      colorList.push(color7);
      let color8 = [(color7[0] + 120) % 360, satVal, random(70, 90)];
      colorList.push(color8);
    }
  } else if (paletteType % 4 == 2) {
    let satVal = random(10, 50);
    colorList.push("Analagous");
    let color1 = [random(0, 360), 70, 90];
    colorList.push(color1);
    let color2 = setAnalagous(color1, neg * 14);
    colorList.push(color2);
    let color3 = setAnalagous(color2, neg * 14);
    colorList.push(color3);
    let color4 = setAnalagous(color3, neg * 14);
    colorList.push(color4);
    let color5 = setAnalagous(color3, neg * 14);
    colorList.push(color5);
    let color6 = setAnalagous(color3, neg * 14);
    colorList.push(color6);
    let color7 = [color3[0], satVal, random(15, 30)];
    colorList.push(color7);
    let color8 = [color7[0], satVal, random(70, 90)];
    colorList.push(color8);
  } else if (paletteType % 4 == 3) {
    colorList.push("Monochrome");
    let satVal = random(0, 35);
    let color1 = [random(0, 360), 70, 90];
    colorList.push(color1);
    let color2 = [(color1[0] + 180) % 360, satVal, 10];
    colorList.push(color2);
    let color3 = [color2[0], satVal, 30];
    colorList.push(color3);
    let color4 = [color2[0], satVal, 70];
    colorList.push(color4);
    let color5 = [color2[0], satVal, 90];
    colorList.push(color5);
    let color6 = setAnalagous(color1, neg * 16);
    colorList.push(color6);
  }
 return colorList;
}

//setLighter() and setAnalagous() are functions called by setColors() to help with calculating new colors for color palettes.
function setLighter(colorArray, fraction) {
  let satDist = 100 - colorArray[1];
  let brightDist = 100 - colorArray[2];
  return [colorArray[0], colorArray[1] - satDist / fraction, colorArray[2] + brightDist / fraction]
}

function setAnalagous(colorArray, amount) {
  if (colorArray[0] > 290 || (colorArray[0] > 90 && colorArray[0] < 180)) {
    amount *= 1.5;
  }
  return [(360 + colorArray[0] + amount) % 360, colorArray[1], colorArray[2]];
}

//This function generates new friends! It generates a series of patterns, and then adds modifiers to give them each unique shapes and add some more visual interest. It returns an array of patterns which can then be added to a friend object.
function generateFriend() {
  //These arrays here hold many functions, which are then used by patterns to randomly generate shapes. All of these arrays begin with emptyGrid and fullGrid, which allows the patterns to be modified later by replacing sections with empties or solid squares.
  let allFunctionArray = [emptyGrid, fullGrid, triangleGrid, triCornerGrid, diagGrid, emptyGrid, emptyGrid, semiCircleGrid, hollowSquareGrid, squareGrid, fullGrid, fullGrid, fullCircleGrid, outlineCircleGrid, twoCircleHalvesGrid, diagGridFull, spikeGrid];
  let circleArray = [emptyGrid, fullGrid, semiCircleGrid, fullCircleGrid, outlineCircleGrid, twoCircleHalvesGrid, emptyGrid];
  let thinLinesArray = [emptyGrid, fullGrid, thinHorizontalGrid, thinHorizontalGrid, thinHorizontalGrid, emptyGrid];
  let thinGridArray = [emptyGrid, fullGrid, thinGrid];
  let thickGridArray = [emptyGrid, fullGrid, thickGrid];
  let coolSubArray = [emptyGrid, fullGrid, fullGrid, emptyGrid, hollowSquareGrid, triCornerGrid, diagGrid, squareGrid, outlineCircleGrid, semiCircleGrid];
  let squareArray = [emptyGrid, fullGrid, hollowSquareGrid, squareGrid]
  let basicArray = [emptyGrid, fullGrid, triangleGrid, triCornerGrid, diagGrid, emptyGrid, semiCircleGrid, hollowSquareGrid, squareGrid]
  let sharpArray = [emptyGrid, fullGrid, triangleGrid, triCornerGrid, emptyGrid, spikeGrid, squareGrid]
  let newPatternArray = [];
  let colorList = setColors();
  let randomSame = int(random(0, 100));
  let randomSize = int(random(0, 100));
  let backPatternAmount = int(random(7, 12));
  for (let i = 0; i < backPatternAmount; i++) {
    let randomBackgroundType = int(random(0, 100));
    let randomBackgroundSize = int(random(100, 600));
    let randomColor = int(random(2, colorList.length));
    let randomBGmove = int(random(0, 70));
    let randomBGsame = int(random(0, 100));
    let sizeBGX = random(5, 15);
    let sizeBGY = sizeBGX;
    if (randomBGsame % 6  == 0) {
    let sizeBGY = random(5, 15);
  }
    let posX = random(100, 700 - randomBackgroundSize);
    let posY = random(100, 700 - randomBackgroundSize);
    if (randomBGmove < 10 || randomBGmove > 40) {
      randomBGmove = 0;
    }
    randomBGmove /= 2;
    if (randomBackgroundType < 10) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, squareArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else if (randomBackgroundType < 20) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, sharpArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else if (randomBackgroundType < 30) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, thinGridArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else if (randomBackgroundType < 40) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, circleArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else if (randomBackgroundType < 50) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, thickGridArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else if (randomBackgroundType < 60) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, [emptyGrid, fullGrid, triangleGrid], randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(10, 30)));
      newPatternArray[newPatternArray.length - 1] = alterRotationsSame(newPatternArray[newPatternArray.length - 1], 0);
    } else if (randomBackgroundType < 70) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, [emptyGrid, fullGrid, diagGridFull], randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
      newPatternArray[newPatternArray.length - 1] = alterRotationsSame(newPatternArray[newPatternArray.length - 1], 0);
    } else if (randomBackgroundType < 80) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, basicArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else if (randomBackgroundType < 85) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, thinLinesArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else if (randomBackgroundType < 90) {
      newPatternArray.push(new Pattern(posX, posY, randomBackgroundSize, randomBackgroundSize, sizeBGX, sizeBGY, color(colorList[randomColor]), -0.005, coolSubArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    } else {
      newPatternArray.push(new Pattern(150, 150, randomBackgroundSize, randomBackgroundSize, 10, 10, color(colorList[randomColor]), -0.005, allFunctionArray, randomBGmove, randomBackgroundSize / random(5, 30), randomBGmove, randomBackgroundSize / random(5, 30)));
    }
  }
  let randomSameAlt = int(random(1, 6));
  let alteration = int(random(0, 100));
  for (let i = 1; i < backPatternAmount + 1; i++) {
    if (randomSameAlt != 3) {
      alteration = int(random(0, 100));
    }
    if (alteration < 30) {
      newPatternArray[newPatternArray.length - i] = alterRandomCorner(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 35) {
      newPatternArray[newPatternArray.length - i] = alterFillMid(newPatternArray[newPatternArray.length - i], 0, 1);
    } else if (alteration < 38) {
      newPatternArray[newPatternArray.length - i] = alterDownRightStairCase(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 41) {
      newPatternArray[newPatternArray.length - i] = alterDownLeftStairCase(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 44) {
      newPatternArray[newPatternArray.length - i] = alterUpRightStairCase(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 47) {
      newPatternArray[newPatternArray.length - i] = alterUpLeftStairCase(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 55) {
      newPatternArray[newPatternArray.length - i] = alterUpRight(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 50) {
      newPatternArray[newPatternArray.length - i] = alterDownLeft(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 70) {
      newPatternArray[newPatternArray.length - i] = alterDiamond(newPatternArray[newPatternArray.length - i], 0);
    } else if (alteration < 90) {
      newPatternArray[newPatternArray.length - i] = alterDiagStripes(newPatternArray[newPatternArray.length - i], 0);
    }
  }
  let sizeX;
  let sizeY;
  if (randomSize < 10) {
    sizeX = 2;
    sizeY = 2;
  } else if (randomSize < 50) {
    sizeX = 3;
    sizeY = 3;
  } else if (randomSize < 70) {
    sizeX = 4;
    sizeY = 4;
  } else if (randomSize < 80) {
    sizeX = 5;
    sizeY = 5;
  } else {
    sizeX = int(random(6, 10));
    sizeY = sizeX;
  }
  if (randomSame % 6  == 0 && sizeX != 2) {
    sizeX += int(random(- 1, - sizeX * 0.9))
  }
  newPatternArray.push(new Pattern(200, 200, 400, 400, sizeX, sizeY, color(colorList[1]), -0.005, allFunctionArray, 0, 1, 20, 100));
  if (sizeX > 2 && sizeY > 2) {
    newPatternArray[newPatternArray.length - 1] = alterFillMid(newPatternArray[newPatternArray.length - 1], [1, 2, 8], 3);
  }
  return newPatternArray;
}

function mouseClicked() {
  if (dist(mouseX, mouseY, width, height) < 150 && transitionTimer > 30 && firstClick) {
    displayMode = !displayMode;
  } else if (displayMode) {
    let posX = menuMargin;
    let posY = menuMargin;
    for(let i = 0; i < friendArray.length; i++) {
      if(mouseX > posX && mouseY > posY + scroll && mouseX < posX + buttonSize && mouseY < posY + buttonSize + scroll) {
        displayMode = false;
        currentFriendNumber = i;
        currentFriend = friendArray[currentFriendNumber];
      }
      posX += buttonSize;
      if (i % 4 == 3) {
        posY += buttonSize;
        posX = menuMargin;
      }
    }
  }
}

function keyPressed() {
  if (keyCode === 32) {
    let newPatternArray = generateFriend();
    friendArray.push(new Friend(0, 0, 1, newPatternArray));
    currentFriendNumber = friendArray.length - 1;
    currentFriend = friendArray[currentFriendNumber];
    if (!firstClick) {
      imaginaryGadgets.loop(0, 1, 0.3);
      firstClick = true;
    }
    displayMode = false;
  }
  if (keyCode === 40 && displayMode) {
    scroll -= scrollButtonAmount;
  } else if (keyCode === 38 && displayMode) {
    scroll += scrollButtonAmount;
  } else if (keyCode === 37 && !displayMode && currentFriendNumber > 0) {
    currentFriendNumber -= 1;
    currentFriend = friendArray[currentFriendNumber];
  } else if (keyCode === 39 && !displayMode && currentFriendNumber < friendArray.length - 1) {
    currentFriendNumber += 1;
    currentFriend = friendArray[currentFriendNumber];
  } else if (key === "m" && transitionTimer > 30 && firstClick) {
    displayMode = !displayMode;
  }
}

function preventSpaceScroll(e) {
  if (e.code === "Space") {
    e.preventDefault();
  }
}

function windowResized() {
  resizeCanvas(
    container.clientWidth,
    container.clientHeight
  );
  resizeThings();
}

function setup() {
  container = document.getElementById("p5-container");
  const canvas = createCanvas(container.clientWidth, container.clientHeight);
  colorMode(HSB);
  textAlign(CENTER);
  canvas.parent(container);
  canvas.elt.addEventListener("mouseenter", () => {
    window.addEventListener("keydown", preventSpaceScroll);
  });

  canvas.elt.addEventListener("mouseleave", () => {
    window.removeEventListener("keydown", preventSpaceScroll);
  });
  resizeThings();
}

function resizeThings() {
  menuMargin = width / 40;
  buttonSize = width / 4 - (menuMargin / 2);
  scrollButtonAmount = width / 8;
  menuButtonSize = width / 8;
  buttonTextSize = width / 27;
  shapeButtonPadding = width / 27;
}

function draw() {
  let instructions = "";
  timer++;
  transitionTimer++;
  background(220);
  noStroke();
  if (displayMode) {
    let posX = menuMargin * 2.5;
    let posY = menuMargin * 2.5;
    let rows = int(friendArray.length / 4) + 1;
    let maxScroll = - ((rows * menuButtonSize) - width - menuMargin * 1.5);
    if (maxScroll > 0) {
      maxScroll = 0;
    }
    
    if (scroll > 0) {
      scroll = 0;
    } else if (scroll < maxScroll) {
      scroll = maxScroll;
    }
    //This for loop here helps to navigate the menu. It keeps track of which friend your mouse is currently hovering over and highlights it.
    for(let i = 0; i < friendArray.length; i++) {
      push();
      translate(posX, posY);
      translate(0, scroll);
      if (mouseX > posX - shapeButtonPadding && mouseY > posY + scroll - shapeButtonPadding && mouseX < posX + buttonSize - shapeButtonPadding && mouseY < posY + buttonSize -shapeButtonPadding + scroll) {
        fill(90);
        noStroke();
        rect(-shapeButtonPadding, -shapeButtonPadding, buttonSize, buttonSize, 20);
      }
      friendArray[i].drawFriendSimple();
      pop();
      posX += buttonSize;
      if (i % 4 == 3) {
        posY += buttonSize;
        posX = menuMargin * 2.5;
      }
    }
    instructions += "(space) generate another friend   (m) back"
    if (friendArray.length >= 16) {
      instructions += "   (up/down) scroll";
    }
  } else if (firstClick) {
    currentFriend.drawFriend();
    instructions += "(space) generate another friend   (m) menu";
  } else {
    fill(20);
    noStroke();
    textFont("Courier", 30);
    text("All my friends live in my computer.", 400, 400);
    textSize(20);
    text("Come and meet them! :3", 400, 430);
    instructions += "(space) generate a friend";
  }
  if (firstClick) {
    if (dist(mouseX, mouseY, width, height) < 150) {
    animationTimer += 0.5;
    menuScale = 1 + sin(animationTimer) * (1/animationTimer) * 0.1;
    fill(90);
  } else {
    menuScale = 1;
    animationTimer = 0;
    fill(70);
  }
  let buttonText = "menu";
  if (displayMode) {
    buttonText = "back";
  }
  push();
  translate(width, height);
  scale(menuScale);
  ellipse(0, 0, 300);
  fill(10);
  textFont("Courier", buttonTextSize);
  text(buttonText, -70, -50);
  pop();
  }
  if (currentFriendNumber != 0 && firstClick && !displayMode) {
    instructions += "   (left) previous friend";
  }
  if (currentFriendNumber != friendArray.length - 1 && firstClick && !displayMode) {
    instructions += "   (right) next friend";
  }
  fill(100);
  rect(0, height - 20, width - 20, 20);
  fill(10);
  noStroke();
  textFont("Courier", 13);
  text(instructions, width / 2, height - 7);
}