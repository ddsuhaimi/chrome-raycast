export interface Command {
  id: string;
  title: string;
  description?: string;
  action: () => void;
}

export const builtInCommands: Array<Command> = [
  {
    id: "open_new_tab",
    title: "Open New Tab",
    action: () => {
      chrome.runtime.sendMessage({ type: "OPEN_NEW_TAB" });
    },
  },
  {
    id: "copy_url",
    title: "Copy Current URL",
    action: () => {
      chrome.runtime.sendMessage({ type: "COPY_URL" });
    },
  },
  {
    id: "highlight_page_text",
    title: "Highlight All Text",
    description: "Quick visual test — highlight page text",
    action: () => {
      chrome.runtime.sendMessage({ type: "HIGHLIGHT_TEXT" });
    },
  },
  {
    id: "remove_highlight",
    title: "Remove Highlights",
    action: () => {
      chrome.runtime.sendMessage({ type: "REMOVE_HIGHLIGHT" });
    },
  },
];
