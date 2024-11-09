let song;
let fft;
let playButton;

function preload() {
    song = loadSound('diewithasmile.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fft = new p5.FFT(0.8, 1024); // Adjust smoothing and bins for finer control
    
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
    
    // Add ambient light
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
    
    // Visualize frequency spectrum with spheres
    for (let i = 0; i < spectrum.length; i++) {
        let angle = map(i, 0, spectrum.length, 0, TWO_PI);
        let radius = map(spectrum[i], 0, 255, 100, 500);
        
        let x = radius * cos(angle);
        let y = radius * sin(angle);
        let z = map(spectrum[i], 0, 255, -200, 200);
        
        push();
        translate(x, y, z);
        let col = map(spectrum[i], 0, 255, 0, 255);
        ambientMaterial(col, 255 - col, 150);
        sphere(10 + spectrum[i] * 0.05); // Size varies with amplitude
        pop();
    }
    
    // Visualize waveform with a dynamic shape
    beginShape();
    stroke(255);
    noFill();
    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, -width / 2, width / 2);
        let y = map(waveform[i], -1, 1, -height / 2, height / 2);
        vertex(x, y, 0);
    }
    endShape();
    
    // Add a central object that responds to mid frequencies
    push();
    let midSize = map(midEnergy, 0, 255, 50, 300);
    ambientMaterial(150, 100, 255);
    box(midSize);
    pop();
    
    // Add particles or small shapes that react to treble frequencies
    for (let i = 0; i < 100; i++) {
        push();
        let rx = random(-width / 2, width / 2);
        let ry = random(-height / 2, height / 2);
        let rz = random(-500, 500);
        translate(rx, ry, rz);
        let size = map(trebleEnergy, 0, 255, 2, 20);
        ambientMaterial(255, 255, 0);
        sphere(size);
        pop();
    }
}
