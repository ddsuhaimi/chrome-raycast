import { createRoot } from "react-dom/client";
import { CommandPalette } from "./CommandPalette";
import "../styles/index.css";

// Create container for React app
const container = document.createElement("div");
container.id = "raychrome-root";
document.body.appendChild(container);

const root = createRoot(container);

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

