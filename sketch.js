let result = {  };
let imagesPrint = [];
let images = [];
let labels = [];
let model;
let canvas;

function preload() {
  result = loadJSON('http://localhost:3000/data');
}

function setup() { 
  canvas = createCanvas(28, 28);
  background(0);

  images = Object.entries(result).map( el => Object.values(el[1])[0] )
  images = images.map( el => el.map(num => num / 255) );
  labels = Object.entries(result).map( el => parseInt(Object.keys(el[1])[0]))

 // let tempdata = Object.entries(result);
 // for ( let i = 0; i < 60000; i++ ){
 //    images.push( Object.values(tempdata[i][1])[0]) 
 //    labels.push( Object.keys(tempdata[i][1])[0]) 
 // }
  //images = images.map( el => el.map(num => num / 255) );
  //tempdata = {};
  result = {};
 //console.log(labels);
 //console.log(images);
  //setImages();

  let xs = tf.tensor2d(images);
  let imageLabels = tf.tensor1d(labels, 'int32');

  let ys = tf.oneHot(imageLabels, 10);

  imageLabels.dispose();
  //ys.print();

  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 15,
    activation: 'sigmoid',
    inputDim: 784
  })

  let output = tf.layers.dense({
    units: 10,
    activation: 'softmax',
  })

  model.add(hidden);
  model.add(output);

  const lr = 3.0;
  const optimizer = tf.train.sgd(lr); 

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy'
  })
  

  train(xs, ys).then( results => {
     console.log(results);
  });

  loadCanvas();
}

function draw() {
   if (mouseIsPressed) {
    drawEllipse()
  }

}

function clasify(){
  let canvasPixels = loadCanvas();
  const xs = tf.tensor2d([
     [...canvasPixels]
     ]);

  let prediction = model.predict(xs);
  let index = prediction.argMax(1);
  index.print()
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
   clasify(); 
  } else if ( keyCode === RIGHT_ARROW ) {
    background(0);
  }
}
function drawEllipse(){
   fill(255);
   noStroke();
   ellipse( mouseX, mouseY, 3 );
}

function setImages() {
   for ( let imageIndex = 0; imageIndex < 1000; imageIndex++ ){
   let img = createImage(28, 28);
   img.loadPixels();
   let el = Object.values(result[imageIndex])[0];
   //let el = images[1];
   for (let i = 0; i < img.width; i++) {
     for (let j = 0; j < img.height; j++) {
	img.set( i, j, color(el[28 * i + j])); 
     }
   }
   img.updatePixels();
   imagesPrint.push(img);
  }
 }

async function train( xs, ys ) {
  const options = {
    epochs: 30,
    batchSize: 10,
    //validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      onTrainBegin: () => console.log('training started'),
      onBatchEnd: tf.nextFrame,
      onEpochEnd: (epoch, logs) => {
	console.log("Epoch: " + epoch); 
	console.log("Loss: " + logs.val_loss);
      }
    }
  }

  await model.fit(xs, ys, options);
}

function loadCanvas() {
   loadPixels();
   let pix = [];
   for( let i = 0; i < pixels.length; i+= 4 ){
        pix.push(pixels[i]); 
   }
   return pix;
}
