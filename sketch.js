let shapeSize = 25;
let shapeSizeIncrementor = 2;
let isStroke = true;


function setup(){
    createCanvas(windowWidth,windowHeight);
    background(255,255,255);
}



function draw(){

    
    // MousePressed Code for random colors shapes.
    if( mouseIsPressed == true){
        let r = random(0, 125);
        let g = random(0, 125);
        let b = random(0, 125);

        fill(r,g,b);
    }


    // Controls Code
    if(keyIsPressed && keyCode == UP_ARROW){
        shapeSize += shapeSizeIncrementor;
    }
    if(keyIsPressed && keyCode == DOWN_ARROW){
        shapeSize -= shapeSizeIncrementor;
    }
    if(keyIsPressed && keyCode == LEFT_ARROW){
        rotate(1);
    }

    if(keyIsPressed && keyCode==ENTER){
        if(isStroke){
            noStroke();
        }
        else{
            stroke(0);
        }

        isStroke = !isStroke;
    }

    if(keyIsPressed && key=='e'){
        
    }

    
    ellipse(mouseX, mouseY, shapeSize, 50);
    square(mouseX, mouseY, shapeSize);
    
    line(mouseX, mouseY, mouseX+50, mouseY+50);
}

