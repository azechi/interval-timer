import "./style.css";

let bps = 0.5;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="button" type="button">play</button>
    <span id="timestamp">0</span>
  </div>
  <div>
    <input type="range" id="range_bpm" min="40" max="218" value="${
      60 / bps
    }" style="width:200px;"  />
    <div>
    <span id="span_bpm">80</span><span style="margin-left:0.5em;">BPM</span>
    </div>
  </div>
`;

const range_bpm = document.getElementById("range_bpm")! as HTMLInputElement;
const span_bpm = document.getElementById("span_bpm")!;
range_bpm.oninput = () => {
  span_bpm.textContent = range_bpm.value;
  bps = 60 / parseInt(range_bpm.value);
};

const NOTELENGTH = 0.05; //s
const INTERVAL = 100; //ms
const LOOKAHEAD = 0.1; //s

let nextNoteTime = 0.0; //s
let audioCtx: any;
let high: any;
let mid: any;
let low: any;
let isPlaying = false;
const VOLUME = 0.3;

let beatNumber = 0;
const button = document.getElementById("button")! as HTMLButtonElement;

button.onclick = ({ currentTarget }) => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    high = new GainNode(audioCtx, { gain: 0 });
    high.connect(audioCtx.destination);
    mid = new GainNode(audioCtx, { gain: 0 });
    mid.connect(audioCtx.destination);
    low = new GainNode(audioCtx, { gain: 0 });
    low.connect(audioCtx.destination);
    {
      const osc = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 880,
      });
      osc.connect(high);
      osc.start();
    }
    {
      const osc = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 440,
      });
      osc.connect(mid);
      osc.start();
    }
    {
      const osc = new OscillatorNode(audioCtx, {
        type: "sine",
        frequency: 220,
      });
      osc.connect(low);
      osc.start();
    }
  }

  isPlaying = !isPlaying;

  if (isPlaying) {
    console.log("play");
    nextNoteTime = audioCtx.currentTime;
    beatNumber = 0;
    tick();
    audioCtx.resume();
  } else {
    console.log("stop");
    audioCtx.suspend();
    high.gain.cancelScheduledValues(0);
    high.gain.setValueAtTime(0, 0);
    mid.gain.cancelScheduledValues(0);
    mid.gain.setValueAtTime(0, 0);
    low.gain.cancelScheduledValues(0);
    low.gain.setValueAtTime(0, 0);
  }
  (currentTarget as HTMLButtonElement).innerText = isPlaying ? "stop" : "play";
};

function tick() {
  if (!isPlaying) {
    return;
  }
  setTimeout(tick, INTERVAL);

  while (nextNoteTime < audioCtx.currentTime + LOOKAHEAD) {
    // schedule note
    let tone = beatNumber % 3 ? low : mid;
    tone.gain.setValueAtTime(VOLUME, nextNoteTime);
    tone.gain.setValueAtTime(0, nextNoteTime + NOTELENGTH);

    // next note
    nextNoteTime += bps;
    beatNumber = ++beatNumber % 3;
  }
}
