let cloudLocations, gridLocations;
let tSNEimages = [];
let tSNEmode;
let closestImage, closestDistance, winner;
let xRows = 40;
let yRows = 25;
let cWidth = 1000;
let cHeight = (cWidth/xRows)*yRows
let datasetSize = 1000
let picScale = 7
let xMarg = 5;
let yMarg = 5;

let femaleNums = [1, 4, 345, 688, 29, 234, 889, 657, 104, 10, 40, 245, 678, 39, 244, 829, 757, 114];
let selected;
let okToDrawWinner = false;

function preload() {
	cloudLocations = loadJSON('assets/cloudLocations.json');
	gridLocations = loadTable('assets/gridLocations.csv');
	sourceCode = loadFont("assets/SourceCodePro-Regular.ttf")
}

function setup() {
	var canvas = createCanvas(cWidth, cHeight);
	canvas.parent('tSNEp5');
	colorMode(HSL, 100)
	textFont(sourceCode)
	tSNEmode = "grid"
	selected = "female"
	getImages();
}

function getImages(){
	for (let i = 0; i < datasetSize; i++){
		let location, x, y, isFemale;

		location = cloudLocations[i]

		// get different locations depending on mode
		if (tSNEmode == "cloud") {
			x = Math.floor(map(location.point[0], 0, 1, 0, width))
			y = Math.floor(map(location.point[1], 0, 1, 0, height))
		}
		else if (tSNEmode == "grid") {
			x = map(gridLocations.get(i, 0), 0, xRows, 0, width)
			y = map(gridLocations.get(i, 1), 0, yRows, 0, height)
		}
		else {
			console.log("tSNE mode not set!")
		}

	    // get path to image file and its number
	    let filename = (location.path)
	    let num = int(filename.slice(0, 6))
	    
	    // check if we're within the maximum number of images we want to show
	    // (if we're only showing some of them)
	    if (num < datasetSize){
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
	okToDrawWinner = true;
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
		let w = img.width/picScale
		let h = img.height/picScale
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
	if (okToDrawWinner){
		drawWinner(winner)
	}
}

// draw tooltip for closest image to mouse
function drawWinner(winner){
	let x = winner[0]
	let y = winner[1]
	let img = winner[3]
	let w = winner[3].width
	let h = winner[3].height
	let winnerXOffset = w/picScale
	let winnerYOffset = h/picScale
	let textboxY = y + h + winnerYOffset

	// big image
	image(img, x + winnerXOffset, y + winnerYOffset, w, h)

	// outline for main (smaller) image
	stroke(5, 98, 50)

	// white text box
	fill(100)
	noStroke()
	rect(x + winnerXOffset, textboxY, w, h/3)

	// text
	fill(0)
	textAlign(LEFT, TOP)
	text("Image #" + str(winner[2]), x + winnerXOffset + xMarg, textboxY + yMarg)
	text("Female = " + str(winner[4]), x + winnerXOffset + xMarg, textboxY + yMarg*4);

	// colorful outline
	noFill();
	stroke(5, 98, 50)
	strokeWeight(3)
	rect(x, y, winnerXOffset, winnerYOffset) // for main (smaller) img
	rect(x + winnerXOffset, y + winnerYOffset, w, 4*h/3) // for entire tooltip
}

function drawTooltip(){

}