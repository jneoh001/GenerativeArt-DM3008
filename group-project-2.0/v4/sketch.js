let song;
let fft;
let playButton;
let colorOffset = 0; 

// Hyperparameters//
let sceneRotationalFactor = 0.05;

////




function preload() {
    song = loadSound('diewithasmile.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    // fft = new p5.FFT(0.8, 1024); 
    // Create a button to start the audio
    // playButton = createButton('Play');
    // playButton.position(10, 10);
    // playButton.mousePressed(startAudio);


    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
}

function startAudio() {
    song.setVolume(0.7);
    song.loop(); // Loop the song
    playButton.hide(); // Hide the button after starting the audio
}

function draw() {
    background(0);
    orbitControl();
    
    
    colorOffset += 0.5;
    
    
    ambientLight(50);
    pointLight(255, 255, 255, 0, 0, 500);
    
    let spectrum = fft.analyze();
    let waveform = fft.waveform();
    
    // Analyze specific frequency bands
    let bassEnergy = fft.getEnergy("bass");
    let midEnergy = fft.getEnergy("mid");
    let trebleEnergy = fft.getEnergy("treble");
    
    // Rotate the entire scene based on bass energy
    rotateY(   sceneRotationalFactor * ( frameCount * 0.005 + bassEnergy * 0.0005 )   );
    
    

    /////////////////////////
    /// Math Equation for Torus Shape
    /////////////////////////
    for (let i = 0; i < spectrum.length; i++) {
        let angle = map(i, 0, spectrum.length, 0, TWO_PI);
        let radius = map(spectrum[i], 0, 255, 100, 400);
        
        let x = radius * cos(angle);
        let y = radius * sin(angle);
        let z = map(spectrum[i], 0, 255, -200, 200);
        // let z = sin(angle) * map(spectrum[i], 0, 255, 100, 300);
        
        push();
        translate(x, y, z);
        
        let hue = (colorOffset + map(spectrum[i], 0, 255, 0, 360)) % 360;
        colorMode(HSB, 360, 100, 100);
        let col = color(hue, 80, 100);
        ambientMaterial(col);
        
        sphere(10 + spectrum[i] * 0.05); 
        
        pop();
    }
    
    // rotateY(frameCount * 0.01); 
    // rotateX(frameCount * 0.005); 

    

    ///////////////
    //// ADJUSTS VISUALISATIONS ON WAVEFORMS
    //
    // KINDA CONTROLS LINE OF MIDDLE BOX AND THE WAVE LINE ACROSS THE SCENE 
    ///////////////


    beginShape();
    noFill();
    strokeWeight(2);
    colorMode(HSB, 360, 100, 100);
    for (let i = 0; i < waveform.length; i++) {
        
    
        // rotateY(frameCount * 0.0001);
        // rotateX(frameCount * 0.0001);
        

   

        let x = map(i, 0, waveform.length, -width / 2, width / 2);
        let y = map(waveform[i], -1, 1, -height / 4, height / 4);
        let hue = (colorOffset + map(waveform[i], -1, 1, 0, 360)) % 360;
        stroke(hue, 100, 100);

        // originalvertex position
        // vertex(x, y, 0);
        
    }
    endShape();
    
    
    // /////////////////////////
    /// Audio Responsive Circular Shapes
    // /////////////////////////
    // let numShapes = 60; // Number of shapes in the circle
    // let circleRadius = 300; // Radius of the circular arrangement
    
    
    // for (let i = 0; i < numShapes; i++) {
    //     let angle = map(i, 0, numShapes, 0, TWO_PI);
        
    //     // Calculate position in a circular layout
    //     let x = circleRadius * cos(angle);
    //     let y = circleRadius * sin(angle);
    //     let z = map(waveform[i % waveform.length], -1, 1, -100, 100); // Modulo to prevent overflow
        
    //     push();
    //     translate(x, y, z);
        
    //     // Map waveform data to size and color
    //     let size = map(abs(waveform[i % waveform.length]), 0, 1, 10, 50);
    //     let hue = (colorOffset + map(waveform[i % waveform.length], -1, 1, 0, 360)) % 360;
        
    //     colorMode(HSB, 360, 100, 100);
    //     ambientMaterial(hue, 80, 100);
        
    //     // Draw the sphere
    //     sphere(size);

    //     // triangle(size, size , size, size, size, size);
    //     pop();
    // }

    
    
    /////////////////////////
    /// Box in the center
    /////////////////////////
    push();
    let midSize = map(midEnergy, 0, 255, 50, 300);
    let midHue = (colorOffset + map(midEnergy, 0, 255, 0, 360)) % 360;
    colorMode(HSB, 360, 100, 100);
    ambientMaterial(midHue, 80, 100);
    box(midSize);
    pop();
    

    
    push();
    colorMode(HSB, 360, 100, 100);
    // Apply rotation before drawing the shape
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.02);
    rotateZ(frameCount * 0.005);
    ambientMaterial(midHue, 80, 100);

    beginShape();
    for (let i = 0; i < waveform.length; i++) {
        let line_x = map(i, 0, waveform.length, -width / 2, width / 2);
        let line_y = map(waveform[i], -1, 1, -height / 4, height / 4);
        vertex(line_x, line_y, 0);
    }
    endShape();
    pop();

    /////////////////////////
    /// Random Spheres in background 
    /////////////////////////
    for (let i = 0; i < 100; i++) {
        push();
        let rx = random(-width / 2, width / 2);
        let ry = random(-height / 2, height / 2);
        let rz = random(-500, 500);
        translate(rx, ry, rz);
        let size = map(trebleEnergy, 0, 255, 2, 20);
        
        let trebleHue = (colorOffset + map(trebleEnergy, 0, 255, 0, 360)) % 360;
        colorMode(HSB, 360, 100, 100);
        ambientMaterial(trebleHue, 100, 100);
        
        sphere(size);
        pop();
    }
}
