const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo () {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      // need to convert live video to URL in order to feed into
      // video element
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error("Webcam denied", err);
    });
}

function paintToCanvas() {
  const width= video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // paint video to canvas every 16ms, 16ms based on trial and error
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // array like item, with R B G Alpha in sequence
    let pixels = ctx.getImageData(0, 0, width, height);
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // setting global alpha means that past images will linger
    // ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}


function takePhoto() {
  // play sound
  snap.currentTime = 0;
  snap.play();

  // take data from canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="So Handsome!" />`;
  strip.insertBefore(link, strip.firstChild);
}

// iterate in fours for RBGA
function redEffect (pixels) {
  for(let i =0; i < pixels.data.length; i+= 4) {
  pixels.data[i] = pixels.data[i + 0] + 100;//red
  pixels.data[i + 1] = pixels.data[i + 1] - 50; //green
  pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0];//red
    pixels.data[i + 500] = pixels.data[i + 1]; //green
    pixels.data[i -550] = pixels.data[i + 2]; //blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  // selecting all sliders for RBG mix/max values
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  // iterate through each of those pixels
  for (let i = 0; i < pixels.data.length; i+= 4) {
    let red = pixels.data[i + 0];
    let green = pixels.data[i + 1];
    let blue = pixels.data[i + 2];
    let alpha = pixels.data[i + 3];

  // check to see if that pixel, the R G and B values are between our min/max range
  // if not then we remove it
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      // we 'take it out' by setting the alpha of that pixel to 0, e.g. totally transparent!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
// filters get pixels out of canvas, mess with em, then put back in
getVideo();

video.addEventListener('canplay', paintToCanvas);