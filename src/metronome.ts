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
let ctx: AudioContext;
let gain: GainNode;
let isPlaying = false;

let beatNumber = 0;
const button = document.getElementById("button")! as HTMLButtonElement;

button.onclick = ({ currentTarget }) => {
  if (!ctx) {
    ctx = new AudioContext();
    // unlock
    const node = new AudioBufferSourceNode(ctx);
    node.buffer = new AudioBuffer({
      length: 1,
      numberOfChannels: 1,
      sampleRate: ctx.sampleRate,
    });
    node.connect(ctx.destination);
    node.start();
  }

  isPlaying = !isPlaying;

  if (isPlaying) {
    nextNoteTime = ctx.currentTime + 0.1;
    beatNumber = 0;
    tick();
    gain = new GainNode(ctx);
    gain.gain.value = 0.5;
    gain.connect(ctx.destination);
    ctx.resume();
  } else {
    gain.disconnect();
    ctx.suspend();
  }
  (currentTarget as HTMLButtonElement).innerText = isPlaying ? "stop" : "play";
};

function tick() {
  if (!isPlaying) {
    return;
  }
  setTimeout(tick, INTERVAL);

  while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
    // schedule note
    const osc = new OscillatorNode(ctx);
    osc.frequency.value = 440;
    osc.connect(gain);
    osc.start(nextNoteTime);
    osc.stop(nextNoteTime + NOTELENGTH);

    // next note
    nextNoteTime += bps / 2; // 4 = 16分音符, 2 = 8分音符, 1 = 4分音符
    beatNumber = ++beatNumber % 3;
  }
}
