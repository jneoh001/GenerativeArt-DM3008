let song;
let fft;
let playButton;
let colorOffset = 0; // Variable to control color over time

function preload() {
    song = loadSound('diewithasmile.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fft = new p5.FFT(0.8, 1024); // Adjusted smoothing and bins
    
    // Create a button to start the audio
    playButton = createButton('Play');
    playButton.position(10, 10);
    playButton.mousePressed(startAudio);
}

function startAudio() {
    song.setVolume(0.7);
    song.loop(); // Loop the song
    playButton.hide(); // Hide the button after starting the audio
}

function draw() {
    background(0);
    orbitControl();
    
    // Update the color offset over time
    colorOffset += 0.5;
    
    // Add ambient and point lights for better 3D effect
    ambientLight(50);
    pointLight(255, 255, 255, 0, 0, 500);
    
    let spectrum = fft.analyze();
    let waveform = fft.waveform();
    
    // Analyze specific frequency bands
    let bassEnergy = fft.getEnergy("bass");
    let midEnergy = fft.getEnergy("mid");
    let trebleEnergy = fft.getEnergy("treble");
    
    // Rotate the entire scene based on bass energy
    rotateY(frameCount * 0.005 + bassEnergy * 0.0005);
    
    // Visualize frequency spectrum with spheres and dynamic colors
    for (let i = 0; i < spectrum.length; i++) {
        let angle = map(i, 0, spectrum.length, 0, TWO_PI);
        let radius = map(spectrum[i], 0, 255, 100, 500);
        
        let x = radius * cos(angle);
        let y = radius * sin(angle);
        let z = map(spectrum[i], 0, 255, -200, 200);
        
        push();
        translate(x, y, z);
        
        // Dynamic color based on spectrum value and time
        let hue = (colorOffset + map(spectrum[i], 0, 255, 0, 360)) % 360;
        colorMode(HSB, 360, 100, 100);
        let col = color(hue, 80, 100);
        ambientMaterial(col);
        
        sphere(10 + spectrum[i] * 0.05); // Size varies with amplitude
        pop();
    }
    
    // Visualize waveform with a dynamic color line
    beginShape();
    noFill();
    strokeWeight(2);
    colorMode(HSB, 360, 100, 100);
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, -width / 2, width / 2);
        let y = map(waveform[i], -1, 1, -height / 4, height / 4);
        let hue = (colorOffset + map(waveform[i], -1, 1, 0, 360)) % 360;
        stroke(hue, 100, 100);
        vertex(x, y, 0);
    }
    endShape();
    
    // Add a central object that responds to mid frequencies with dynamic color
    push();
    let midSize = map(midEnergy, 0, 255, 50, 300);
    let midHue = (colorOffset + map(midEnergy, 0, 255, 0, 360)) % 360;
    colorMode(HSB, 360, 100, 100);
    ambientMaterial(midHue, 80, 100);
    box(midSize);
    pop();
    
    // Add particles that react to treble frequencies with dynamic colors
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
