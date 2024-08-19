let angle = 0; 
let x_translate_value = 50

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(255, 255, 255);
  orbitControl();


  noStroke();

  

  let y = sin(angle) * 100;
  let x = cos(angle) * x_translate_value; // horizontal movmenet
  angle += 0.05; 

  for (let i=0; i<600;i++){
    let t = frameCount*0.05;
    let r = sin(t+i*0.01)*120;
    let g = sin(t+i*0.01)*100;
    let b = sin(t+i*0.01)*100;

    fill(r, g, b);

  }
  

  push();
  translate(x, y, 0);
  
  if(y==100){
    translate(x_translate_value,0,0)
  }else{
    translate(-x_translate_value,0,0)
  }
  box(300, 300, 200); 
  pop();

}