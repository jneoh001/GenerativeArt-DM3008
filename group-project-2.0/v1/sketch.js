let song;
let fft;
let playButton;

function preload() {
    // song = loadSound('howlscastle.mp3');
    song = loadSound('diewithasmile.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    fft = new p5.FFT();
    
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
    
    let spectrum = fft.analyze();
    console.log(spectrum); // For debugging
    
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, -width / 2, width / 2);
        let h = map(spectrum[i], 0, 255, 0, height); // Height based on amplitude
        let z = map(spectrum[i], 0, 255, -200, 200);

        // Dynamic color based on amplitude
        let col = map(spectrum[i], 0, 255, 100, 255); // Change color based on amplitude
        fill(col, 255 - col, 255); // Color gradient
        noStroke(); // No border for the boxes
        
        
        push(); 
        translate(x, -h / 2, z);
        box(10, h, 10); 
        pop(); 
    }
}
