import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="button" type="button">start</button>
  </div>
`;
async function setup(element: HTMLButtonElement) {
  let onoff = true;

  const toggle = () => {
    onoff = !onoff;
    element.innerHTML = `${onoff}`;
  };
  element.addEventListener("click", toggle);
  toggle();
}

setup(document.querySelector<HTMLButtonElement>("#button")!);
