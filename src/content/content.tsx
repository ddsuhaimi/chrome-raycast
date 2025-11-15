import { createRoot } from "react-dom/client";
import { CommandPalette } from "./CommandPalette";
import stylestr from "../styles/index.css?inline";

// Create container for the shadow host
const host = document.createElement("div");
host.id = "raychrome-root";
document.body.appendChild(host);

// Attach Shadow DOM
const shadow = host.attachShadow({ mode: "open" });

// Inject style into Shadow DOM
const style = document.createElement("style");
// Use .replace(/:root/g, ":host ") for compatibility instead of .replaceAll
const replacedStylestr = stylestr.replace(/:root/g, ":host #raychrome-root");
style.textContent = replacedStylestr;
shadow.appendChild(style);

// Create a container for React app inside shadow root
const reactContainer = document.createElement("div");
reactContainer.id = "raychrome-react-root";
shadow.appendChild(reactContainer);

const root = createRoot(reactContainer);

let visible = false;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE_PALETTE") {
    visible = !visible;
    root.render(visible ? <CommandPalette /> : null);
  }

  if (msg.type === "COPY_TO_CLIPBOARD") {
    navigator.clipboard.writeText(msg.data).then(() => {
      console.log("URL copied to clipboard:", msg.data);
    });
  }

  if (msg.type === "HIGHLIGHT_TEXT") {
    document.querySelectorAll("*").forEach((el) => {
      const node = el as HTMLElement;
      if (node && node.innerText) node.classList.add("bg-yellow-300");
    });
  }

  if (msg.type === "REMOVE_HIGHLIGHT") {
    document.querySelectorAll("*").forEach((el) => {
      const node = el as HTMLElement;
      if (node) node.classList.remove("bg-yellow-300");
    });
  }
});
