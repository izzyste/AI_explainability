var img;
var frame;
var state;
var frameC;
var gridSize;
var grid =[];

function setup(){
    gridSize = 24;
    var canvas = createCanvas(400, 400);
    canvas.parent('p5js');
    background(255,255,255,100);
    img = loadImage("example.jpg")
    for(let i=0; i < gridSize; i++){
        grid.push([])
        for(let j=0; j < gridSize; j++){
         grid[i].push(0)
        }
      }
  }


function draw(){
    image(img,0,0,400,400)

    if(state == undefined){
        if(frame){
            if(frame == "woman"){
                var c = color ('#3BA4D6')
            } else {
                var c = color('#F5A623')
            }
        drawFrame(c,frame)
        } 
    } else if (state == "draw"){

        drawFrame(frameC,frame)
        for(let i=0; i < gridSize; i++){
            for(let j=0; j < gridSize; j++){
                var n = grid[i][j]
                if(n === 1){
                    fill(255,50,50,100);
                    noStroke();
                    var s = width/gridSize
                    var y = i*s 
                    var x = j*s
                    rect(x,y,s,s)
                  }
            }
          }
    }

}

function mouseDragged(){

    if(state == "draw"){
        for(let i=0; i < gridSize; i++){
            for(let j=0; j < gridSize; j++){
                var s = width/gridSize
                var y = i*s 
                var x = j*s
                if ((j*s < mouseX) && (mouseX < s*(j+1)) && (i*s < mouseY) && (mouseY < s*(i+1))){
                    grid[i][j] = 1;
                }
    
            }
        }

    }
   
}
    

function typestuff(t){

    var tag1 = "<span class =" +t + ">"  
    var tag2 = "</span>"

    document.getElementById("typed2").innerHTML = ""

    var options = {
        strings: ['Hopefully that’s not hard.So,what makes you think this is a ' +tag1+t+tag2+"?"],
        typeSpeed: 20,
        backSpeed: 30,
        loop: false,
        }
    var typed2 = new Typed("#typed2", options);
}

function drawFrame(c,t) {
    noFill();
    stroke(c);
    strokeWeight(10);
    rect(0,0,400,400)
    fill(c)
    rect(0,0,100,40)
    fill(255);
    textAlign(CENTER);
    textSize(24)
    
    text(t,50,30)

}

function buttonHover(x,y){
    if(state == undefined){
        if(x == 'woman'){
            frame = "woman"
            y.style.backgroundColor = "#3BA4D6"
        } else {
            frame = 'man'
            y.style.backgroundColor = "#F5A623"
        }
    }



}

function buttonNormal(x){
    if(state == undefined){
        frame = null;
        x.style.backgroundColor = 'transparent';

    }

}

function selection(x,y){

    var all = document.getElementsByClassName("button");
    for (var i = 0; i < all.length; i++) {
        all[i].style.backgroundColor = 'transparent';

      }
    y.style.borderWidth = "2px"
    state = "draw"
    frame = x
    if(x == 'woman'){
        frameC = color("#3BA4D6")
        y.style.backgroundColor = "#3BA4D6"
    } else {
        frameC = color('#F5A623')
        y.style.backgroundColor = "#F5A623"
    }

    typestuff(x)



}




 