import "./style.css";

let bps = 0.5;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="button" type="button">play</button>
    <div id="beat" style="display:flex;justify-content:space-between;">
      <div style="width:40px;height:40px;background:gray;"></div>
      <div style="width:40px;height:40px;background:gray;"></div>
      <div style="width:40px;height:40px;background:gray;"></div>
      <div style="width:40px;height:40px;background:gray;"></div>
    </div>
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
const beat = document.getElementById("beat")!;

const scheduledNotes: any = [];

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
    draw();
    nextNoteTime = ctx.currentTime + 0.1;
    [...beat.children].map(
      (e) => ((e as HTMLDivElement).style.background = "gray")
    );
    (beat.children[0] as HTMLDivElement).style.background = "red";

    beatNumber = 0;
    tick();
    gain = new GainNode(ctx);
    gain.gain.value = 0.5;
    gain.connect(ctx.destination);
    ctx.resume();
  } else {
    scheduledNotes.splice(0, scheduledNotes.length);
    gain.disconnect();
    ctx.suspend();
  }
  (currentTarget as HTMLButtonElement).innerText = isPlaying ? "stop" : "play";
};

function draw() {
  if (!isPlaying) {
    return;
  }
  requestAnimationFrame(draw);

  const now = ctx.currentTime;

  while (scheduledNotes.length && (scheduledNotes[0][0] as any) < now) {
    const beatNumber = scheduledNotes.shift()[1];
    [...beat.children].map((e, i) => {
      (e as HTMLDivElement).style.background = i == beatNumber ? "red" : "gray";
    });
  }
}

function tick() {
  if (!isPlaying) {
    return;
  }
  setTimeout(tick, INTERVAL);

  while (nextNoteTime < ctx.currentTime + LOOKAHEAD) {
    // schedule note
    const osc = new OscillatorNode(ctx);
    osc.frequency.value = beatNumber ? 880 : 440;
    osc.connect(gain);
    osc.start(nextNoteTime);
    osc.stop(nextNoteTime + NOTELENGTH);

    // next note
    nextNoteTime += bps / 4; // 4 = 16分音符, 2 = 8分音符, 1を4分音符として
    beatNumber = ++beatNumber % 4;
    scheduledNotes.push([nextNoteTime, beatNumber]);
  }
}
