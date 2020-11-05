feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
};

play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraOptions.value
      }
    };
    startStream(updatedConstraints);
  }
};

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};
//足した
const pauseStream = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/webp');
  screenshotImage.classList.remove('d-none');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;
//11/2にココまで足した
const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  screenshot.classList.remove('d-none');
  streamStarted = true;
};

getCameraSelection();

function captureWebcam() {
  //var canvas    = document.createElement("canvas"); //変更箇所
  var context   = canvas.getContext('2d');
  canvas.width  = video.width;
  canvas.height = video.height;

  context.drawImage(video, 0, 0, video.width, video.height);
  tensor_image = preprocessImage(canvas);

  return tensor_image;
}

function preprocessImage(image){
  let tensor = tf.fromPixels(image).resizeNearestNeighbor([100,100]).toFloat();
  let offset = tf.scalar(255);
  return tensor.div(offset).expandDims();
}

let model;
async function loadModel() {
model=await tf.loadModel(`http://localhost:8080/sign_language_vgg16/model.json`)
};

const CLASSES = {0:'zero', 1:'one', 2:'two', 3:'three', 4:'four',5:'five', 6:'six', 7:'seven', 8:'eight', 9:'nine'}
async function predict(){
  let tensor = captureWebcam();

  let prediction = await model.predict(tensor).data();
  let results = Array.from(prediction)
              .map(function(p,i){
  return {
      probability: p,
      className: CLASSES[i]
  };
  }).sort(function(a,b){
      return b.probability-a.probability;
  }).slice(0,5);

  results.forEach(function(p){
      console.log(p.className,p.probability.toFixed(6))
  });
}

setInterval(predict, 1000/10);