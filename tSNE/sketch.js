let cloudLocations, gridLocations;
let tSNEimages = [];
let tSNEmode;
let closestImage, closestDistance, winner;

let femaleNums = [1, 4, 345, 688, 29, 234, 889, 657, 104];
let selected;

function preload() {
  cloudLocations = loadJSON('assets/cloudLocations.json');
  gridLocations = loadTable('assets/gridLocations.csv');
}

function setup() {
  var canvas = createCanvas(1000, 700);
  canvas.parent('tSNEp5');
  colorMode(HSL, 100)
  tSNEmode = "grid"
  selected = "female"
  getImages();
}

function getImages(){
  let max = 1000
  for (let i = 0; i < max; i++){
    let location, x, y, isFemale;

	location = cloudLocations[i]

	// get different locations depending on mode
	if (tSNEmode == "cloud") {
    	x = Math.floor(map(location.point[0], 0, 1, 0, width))
    	y = Math.floor(map(location.point[1], 0, 1, 0, height))
    }
    else if (tSNEmode == "grid") {
    	x = map(gridLocations.get(i, 0), 0, 40, 0, width)
    	y = map(gridLocations.get(i, 1), 0, 25, 0, height)
    }
    else {
    	console.log("tSNE mode not set!")
    }

    // get path to image file and its number
    let filename = (location.path)
    let num = int(filename.slice(0, 6))
    
    // check if we're within the maximum number of images in directory
    // (if we're only showing some of them)
    if (num < max){
      let path = "sample/" + str(filename)
      let img = loadImage(path)

      // is this image on the females list?
      if (femaleNums.includes(num)){
      	isFemale = true;
      }
      else{
      	isFemale = false;
      }

      tSNEimages.push([x, y, num, img, isFemale])
    }

  }
}

// stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
function distance(x1, y1, x2, y2){
	var a = x1 - x2;
	var b = y1 - y2;
	var c = Math.sqrt( a*a + b*b );
	return c;
}

function draw() {
  closestImage = 0
  closestDistance = 1000
  winner = []

  for (let i = 0; i < tSNEimages.length; i++){
  	let curr = tSNEimages[i]
    let x = curr[0]
    let y = curr[1]
    let num = curr[2]
    let img = curr[3]
    let isFemale = curr[4]
    let w = img.width/7
    let h = img.height/7
    image(img, x, y, w, h)

    // calculate distance from the mouse
    let currDistance = distance(mouseX, mouseY, x + w/2, y + h/2)
    if (currDistance < closestDistance){
    	closestDistance = currDistance
    	closestImage = num
    }
    if (closestImage == num){
    	winner = curr
    }

    // if in females list and mode is female, draw overlay
    if (isFemale && selected == "female") {
    	noStroke();
    	fill(13, 70, 70, 80)
    	rect(x, y, w, h)
    }
  }
  drawWinner(winner)
}

// draw tooltip for closest image to mouse
function drawWinner(winner){
  let winnerX = winner[0]
  let winnerY = winner[1]
  let winnerImg = winner[3]
  let winnerW = winner[3].width/2
  let winnerH = winner[3].height/2
  let winnerXOffset = winnerX + winnerW/5
  let winnerYOffset = winnerY + winnerH + winnerH/5

  image(winnerImg, winnerXOffset, winnerYOffset - winnerH, winnerW, winnerH)

  noFill();
  stroke(5, 98, 50)
  strokeWeight(3)
  rect(winnerX, winnerY, winnerW/4, winnerH/4)
  rect(winnerXOffset, winnerYOffset - winnerH, winnerW, 3*winnerH/2)

  fill(100)
  rect(winnerXOffset, winnerYOffset, winnerW, winnerH/2)

  fill(0)
  noStroke()
  textAlign(LEFT, TOP)
  text("Image #" + str(winner[2]), winnerXOffset+4, winnerYOffset+5)
  text("Female = " + str(winner[4]), winnerXOffset+4, winnerYOffset + 20);
}