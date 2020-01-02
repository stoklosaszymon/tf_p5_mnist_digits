const express = require('express')
const app = express()
const port = 3000
const fs = require("fs");
const cors = require('cors')
const pixelValues = [];

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/data', (req, res) => {
       res.send( pixelValues );
   });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  readData();
});


function readData() {
   var dataFileBuffer = fs.readFileSync('./train-images.idx3-ubyte', () => {console.log("loaded")});
   var labelFileBuffer = fs.readFileSync('./train-labels.idx1-ubyte');

    for (var image = 0; image <= 59999; image++) { 
    var pixels = [];

    for (var x = 0; x <= 27; x++) {
        for (var y = 0; y <= 27; y++) {
            pixels.push(dataFileBuffer[(image * 28 * 28) + (x + (y * 28)) + 15]);
        }
    }

    var imageData  = {};
    imageData[JSON.stringify(labelFileBuffer[image + 8])] = pixels;

    pixelValues.push(imageData);
    }

    console.log('data loaded');
}

