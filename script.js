window.onload = () => {
  const file = document.getElementById("file");
  const audio = document.getElementById("audio");
  // const rgb = document.getElementById("rgb");

  file.onchange = function () {
    const files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    spectrum(audio);
  };

  const spectrum = (audio) => {
    audio.play();
    const audioContext = new AudioContext();
    const src = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const canvasContext = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 1024; // default: 2048. range: 32, 64, 128, 256, 512, 1024, 2048, 4096, 16384, 32768
    analyser.minDecibels = -80; // default: -100. range: -100...-31
    analyser.maxDecibels = -20; // default: -30. range: -30...0
    analyser.smoothingTimeConstant = 0.7; // default: 0.8. range: 0...0.9

    const bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    const dataArray = new Uint8Array(bufferLength);
    // console.log(dataArray);

    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;

    const barWidth = (CANVAS_WIDTH / bufferLength) * 2.5;
    let barHeight = 0;
    let frequencyWidth = 0;

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);

      frequencyWidth = 0;

      analyser.getByteFrequencyData(dataArray);

      canvasContext.fillStyle = "#000";
      canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        // console.log(barHeight);

        // let r = Math.floor(barHeight + 20 * (i / bufferLength));
        // let b = Math.floor(360 * (i / bufferLength));
        // let g = 40;

        // rgb.innerHTML = `rgb(${r},${g},${b})`;
        let gradient = canvasContext.createLinearGradient(
          0,
          0,
          0,
          CANVAS_HEIGHT
        );
        gradient.addColorStop(1.0, "green");
        gradient.addColorStop(0.95, "blue");
        gradient.addColorStop(0.85, "orange");
        gradient.addColorStop(0.8, "red");
        canvasContext.fillStyle = gradient;

        // canvasContext.fillStyle = `rgb(${r},${g},${b})`;
        canvasContext.fillRect(
          frequencyWidth,
          CANVAS_HEIGHT - barHeight,
          barWidth,
          barHeight
        );

        frequencyWidth += barWidth + 1;
      }
    };

    audio.play();
    renderFrame();
  };

  setTimeout(() => {
    spectrum(audio);
  }, 1000);
};
