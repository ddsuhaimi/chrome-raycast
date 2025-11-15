import { createRoot } from "react-dom/client";
import { CommandPalette } from "./CommandPalette";
import styles from "../styles/index.css?inline";

// Create shadow host
const shadowHost = document.createElement("div");
shadowHost.id = "raychrome-shadow-host";
document.body.appendChild(shadowHost);

// Create shadow DOM for CSS isolation
const shadowRoot = shadowHost.attachShadow({ mode: "open" });

// Inject styles into shadow DOM with CSS reset
const styleElement = document.createElement("style");
// Replace :root with :host for Shadow DOM compatibility
const shadowStyles = styles.replace(/:root/g, ":host");
styleElement.textContent = `
  /* Tailwind styles with :host instead of :root */
  ${shadowStyles}
  
  /* Additional isolation - prevent host page font inheritance */
  :host {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
shadowRoot.appendChild(styleElement);

// Create React root container inside shadow DOM
const container = document.createElement("div");
container.id = "raychrome-root";
shadowRoot.appendChild(container);

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

