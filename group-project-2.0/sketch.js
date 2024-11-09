let song;
let fft;
let playButton;

// Hyperparameters//
let sceneRotationalFactor = 0.05;
let colorOffset = 0; 

let smoothedBass = 0;
let smoothedMid = 0;
let smoothedTreble = 0;
let BASS_NOISE_GATE = 20;  // Higher threshold for bass
let MID_NOISE_GATE = 20;
let TREBLE_NOISE_GATE = 3;
let BASS_SMOOTHING_FACTOR = 1; // Higher = more smoothing (0-1)
let MID_SMOOTHING_FACTOR = 0.8; // Higher = more smoothing (0-1)
let TREBLE_SMOOTHING_FACTOR = 1; // Higher = more smoothing (0-1)

let rawBassGainFactor = 0.6;
let rawTrebleGainFactor = 1.5;
////

// Flags 
rotateScene = false;




function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
}



function draw() {


    ////////////////////////////////////////////////////////////////////////////////////////
    ///// AUDIO INPUT PROCESSING / CLEANING
    ////////////////////////////////////////////////////////////////////////////////////////
    background(0, 0.88);
    orbitControl();
    // ambientLight(50);
    // pointLight(255, 255, 255, 0, 0, 500);
    
    
    let spectrum = fft.analyze();
    let waveform = fft.waveform();
    

    let rawBass = fft.getEnergy("bass");
    let rawMid = fft.getEnergy("mid"); 
    let rawTreble = fft.getEnergy("highMid"); // should be  Treble but highmid values seem to make nicer visuals. 
    
 
    // Treble and Bass Modifications ( Gains )
    rawTreble = rawTreble * rawTrebleGainFactor;
    rawTreble = constrain(rawTreble, 0, 255);
    rawBass = rawBass * rawBassGainFactor;
    rawBass = constrain(rawBass, 0, 255); 
    
    // Exponential scaling to reduce sensitivity
    rawBass = pow(rawBass/255, 2) * 255;
    rawMid = pow(rawMid/255, 2) * 255;
    rawTreble = pow(rawTreble/255, 2) * 255;
    
    // Smoothing
    smoothedBass = lerp(smoothedBass, rawBass, BASS_SMOOTHING_FACTOR); // SMOOTH BATH MORE AGGRESIVELY
    smoothedMid = lerp(smoothedMid, rawMid, MID_SMOOTHING_FACTOR);
    smoothedTreble = lerp(smoothedTreble, rawTreble, TREBLE_SMOOTHING_FACTOR);
    
    // Apply noise gate. REMEMBER NOISE GATE MUST BE AFTER ALL GAINS / ADJUSTMENTS TO THE VALUES
    smoothedBass = smoothedBass < BASS_NOISE_GATE ? 0 : smoothedBass;
    smoothedMid = smoothedMid < MID_NOISE_GATE ? 0 : smoothedMid;
    smoothedTreble = smoothedTreble < TREBLE_NOISE_GATE ? 0 : smoothedTreble;


    let bassEnergy = smoothedBass;
    let midEnergy = smoothedMid;
    let trebleEnergy = smoothedTreble;


    bassEnergy = Math.round(bassEnergy);
    midEnergy = Math.round(midEnergy);
    trebleEnergy = Math.round(trebleEnergy);

    if (frameCount % 60 == 0){
        console.log(bassEnergy, midEnergy, trebleEnergy);
    }

    // Rotate the entire scene based on bass energy
    if (rotateScene) {
        rotateY(   sceneRotationalFactor * ( frameCount * 0.005 + bassEnergy * 0.0005 )   );
    }
    
    

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
        colorMode(HSB);
        stroke(
            hue, 
            hue, 
            hue,
        );
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
        

        let x = map(i, 0, waveform.length, -width / 2, width / 2);
        let y = map(waveform[i], -1, 1, -height / 4, height / 4);
        let hue = (colorOffset + map(waveform[i], -1, 1, 0, 360)) % 360;
        stroke(hue, 100, 100);

        // originalvertex position
        // vertex(x, y, 0);
        
    }
    endShape();
    
    

    
    
    /////////////////////////
    /// Box in the center
    /////////////////////////
    push();

   

        // Map mid energy to a wider range for more dramatic size changes
        let midSize = map(midEnergy, 0, 255, 20, 400);
        
        // Create different sizes for width, height, depth using different frequency bands
        let boxWidth = map(bassEnergy, 0, 255, 50, 300);
        let boxHeight = map(midEnergy, 0, 255, 50, 300);
        let boxDepth = map(trebleEnergy, 0, 255, 50, 300);
        
        // Dynamic color based on energy
        let midHue = (colorOffset + map(midEnergy, 0, 255, 0, 360)) % 360;
        colorMode(HSB, 360, 100, 100);
        
        // Make saturation and brightness respond to audio
        let saturation = map(bassEnergy, 0, 255, 40, 100);
        let brightness = map(trebleEnergy, 0, 255, 60, 100);
        ambientMaterial(midHue, saturation, brightness);
        // Draw box w different dimensions
        box(boxWidth, boxHeight, boxDepth);
   
    pop();
    

    /////////////////////////
    /// LONG LINE VERTEX 
    /////////////////////////
    push();
    colorMode(HSB, 360, 100, 100);
    

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
    for (let i = 0; i < 3; i++) {
        push();
        let rx = random(-width / 2, width / 2);
        let ry = random(-height / 2, height / 2);
        let rz = random(-500, 500);
        translate(rx, ry, rz);
        let size = map(trebleEnergy, 0, 255, 2, 20);
        
        let trebleHue = (colorOffset + map(trebleEnergy, 0, 255, 0, 360)) % 360;
        colorMode(HSB);
        stroke(
            trebleHue, 
            trebleHue, 
            trebleHue
        );
        ambientMaterial(trebleHue, 100, 100);
        
        sphere(size);
        pop();
    }





    /////////////////////////
    //// Audio Responsive Triangle
    /////////////////////////
    push();
        translate(600, -windowHeight/3, -500); 
        rotateX(frameCount * 0.01 + bassEnergy * 0.01);
        rotateY(frameCount * 0.01 + midEnergy * 0.01);
    
        let orbitRadius = 200;
        let orbitX = cos(frameCount * 0.02) * orbitRadius;
        let orbitZ = sin(frameCount * 0.02) * orbitRadius;
        translate(orbitX, 0, orbitZ);
 
        let triSize = map(bassEnergy + midEnergy + trebleEnergy, 0, 255*3, 50, 200);
        let depth = map(bassEnergy, 0, 255, 20, 100);
        

        colorMode(HSB);

        fill(midEnergy*2, bassEnergy, trebleEnergy*2);
        stroke(midEnergy+150, midEnergy+20, midEnergy+20);
        strokeWeight(2);
        
        // Front face
        beginShape();
        vertex(0, -triSize, depth/2);          // Top front
        vertex(-triSize, triSize, depth/2);     // Bottom left front
        vertex(triSize, triSize, depth/2);      // Bottom right front
        endShape(CLOSE);
        
        // Back face
        beginShape();
        vertex(0, -triSize, -depth/2);         // Top back
        vertex(-triSize, triSize, -depth/2);    // Bottom left back
        vertex(triSize, triSize, -depth/2);     // Bottom right back
        endShape(CLOSE);
        
        // Connect faces
        beginShape();
        vertex(0, -triSize, depth/2);          // Top front
        vertex(0, -triSize, -depth/2);         // Top back
        vertex(-triSize, triSize, -depth/2);    // Bottom left back
        vertex(-triSize, triSize, depth/2);     // Bottom left front
        endShape(CLOSE);
        
        beginShape();
        vertex(0, -triSize, depth/2);          // Top front
        vertex(0, -triSize, -depth/2);         // Top back
        vertex(triSize, triSize, -depth/2);     // Bottom right back
        vertex(triSize, triSize, depth/2);      // Bottom right front
        endShape(CLOSE);
        
        // Bottom face
        beginShape();
        vertex(-triSize, triSize, depth/2);     // Bottom left front
        vertex(triSize, triSize, depth/2);      // Bottom right front
        vertex(triSize, triSize, -depth/2);     // Bottom right back
        vertex(-triSize, triSize, -depth/2);    // Bottom left back
        endShape(CLOSE);
    pop();

    ////// Audio-Reactive Cube Grid
    push();
        translate(0, 0, 10);
        rotateY(frameCount * 0.01);
        
        let gridSize = midEnergy % 5;
        let spacing = 50;
        
        for(let x = -gridSize; x <= gridSize; x++) {
            for(let y = -gridSize; y <= gridSize; y++) {
                for(let z = -gridSize; z <= gridSize; z++) {
                    push();
                    translate(x * spacing, y * spacing, z * spacing);
                    
                    // Scale based on distance from center
                    let dist = sqrt(x*x + y*y + z*z);
                    let scale = map(sin(frameCount * 0.05 + dist), -1, 1, 0.5, 1);
                    scale *= map(bassEnergy, 0, 255, 0.5, 1.5);
                    
                    // Color based on position
                    let hue = (colorOffset + dist * 30) % 360;
                    colorMode(HSB);
                    // fill(hue, 0, 0);
                    
                    box(10 * scale);
                    pop();
                }
            }
        }
    pop();

    
}
