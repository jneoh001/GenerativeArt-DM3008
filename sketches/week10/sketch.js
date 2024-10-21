
let x,y 
let movementMultiplier = 35

function setup() {
    createCanvas(windowWidth, windowHeight);


    // Centers circle dynamically
    x = windowWidth / 2;
    y = windowHeight/ 2;


}

function mouseHandler( ){

    // TOP LEFT 
    if (mouseX <  (windowWidth / 2) && mouseY > (windowHeight / 2)) {
        fill(255, 0, 0); // Red
    }
    // BOTTOM LEFT
    else if (mouseX <  (windowWidth / 2) && mouseY < (windowHeight / 2)) {
        fill(255, 155, 0); 
    }

    // TOP RIGHT
    else if (mouseX >  (windowWidth / 2) && mouseY > (windowHeight / 2)) {
        fill(0, 255, 0); // Green
    }
    // BOTTOM RIGHT
    else if (mouseX >  (windowWidth / 2) && mouseY < (windowHeight / 2)) {
        fill(123, 123, 0); 
    }


    
}

function keyHandler(keyCode) {
    if (keyCode == UP_ARROW) {
        y -= movementMultiplier; // Move up
    }
    if (keyCode == DOWN_ARROW) {
        y += movementMultiplier; // Move down
    }
    if (keyCode == LEFT_ARROW) {
        x -= movementMultiplier; // Move left
    }
    if (keyCode == RIGHT_ARROW) {
        x += movementMultiplier; // Move right
    }
}


function draw() {



    if (keyIsPressed) {
        keyHandler(keyCode);
    }

    mouseHandler()

    background(255, 150, 30,0);


    for( i = 0; i< 10 ; i++ ){
        circle(x,y,70)
        rect(x+i, y-i, 70)
        triangle(x-i,y+i,70)
    }
    
}