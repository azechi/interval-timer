import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="button" type="button">start</button>
    <span id="timestamp">0</span>
  </div>
`;

async function setup(element: HTMLButtonElement) {
  let onoff = true;

  const ctx = new AudioContext();
  const gain = new GainNode(ctx, { gain: 0 });
  const osc = new OscillatorNode(ctx, { type: "sine" });
  gain.connect(ctx.destination);
  osc.connect(gain);
  osc.start();

  const span = document.getElementById("timestamp")!;
  let offset = 0;
  function step() {
    span.textContent = (ctx.currentTime - offset).toFixed(2);
    if (onoff) {
      window.requestAnimationFrame(step);
    }
  }

  const toggle = () => {
    onoff = !onoff;
    element.innerHTML = `${onoff}`;

    if (onoff) {
      offset = ctx.currentTime;
      step();
      [...Array(100)].map((_, i) => {
        const s = 1.0 * i + offset;
        gain.gain.setValueAtTime(0.25, s);
        gain.gain.setValueAtTime(0, s + 0.1);
      });
      ctx.resume();
    } else {
      gain.gain.cancelScheduledValues(0);
      gain.gain.setValueAtTime(0, 0);
      ctx.suspend();
    }
  };

  element.addEventListener("click", toggle);

  toggle();
}

setup(document.querySelector<HTMLButtonElement>("#button")!);
