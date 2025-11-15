import React from "react";
import { createRoot } from "react-dom/client";
import PopupApp from "./Popup";
import "../styles/index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<PopupApp />);
