<img src="assets/nyancat.jpg" width="800" height="600">

# 📘 Implementation Methodology

Whilst trying to get the shapes to be as responsive as possible, we faced the issue that certain frequencies were being picked up at a higher sensitivty than others.  

```  console.log(bassEnergy, midEnergy, trebleEnergy); ```

<img src="assets/image.png" width="600" height="600">

We logged out the energy of each frequency and found that the bass was being picked up at a higher sensitivity than the mid and treble.


As such we decided to implement the following methods to address this

## Noise Gate

## Smoothing


#  🎼 Sound Compositions for the Shapes


## Box In Center

Its height, width and depth are mapped to the bass, mid and treble energy respectively.
```
        let boxWidth = map(bassEnergy, 0, 255, 50, 300);
        let boxHeight = map(midEnergy, 0, 255, 50, 300);
        let boxDepth = map(trebleEnergy, 0, 255, 50, 300);
```


# Torus 

# Line 





# Useful References


1. [FFT Energy Reference](https://editor.p5js.org/rios/sketches/IazTFSKSt)