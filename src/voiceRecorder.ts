import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="button" type="button">録音しますか？</button>
    <div id="clip"></div>
  </div>
`;
async function setupCounter(element: HTMLButtonElement) {
  const clip = document.getElementById("clip")!;
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType: "audio/webm;codecs=opus",
  });

  let chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });

    const audioURL = URL.createObjectURL(blob);
    chunks = [];

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.autoplay = true;
    clip.appendChild(audio);

    audio.src = audioURL;
  };

  const toggle = () => {
    if (mediaRecorder.state == "recording") {
      mediaRecorder.stop();
    } else {
      mediaRecorder.start();
    }

    element.innerHTML = `${mediaRecorder.state}`;
  };

  element.addEventListener("click", toggle);
}

setupCounter(document.querySelector<HTMLButtonElement>("#button")!);
