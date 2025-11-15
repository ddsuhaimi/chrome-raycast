// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-palette") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id)
        chrome.tabs.sendMessage(tabs[0].id, { type: "TOGGLE_PALETTE" });
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_ALL_TABS") {
    chrome.tabs.query({}, (tabs) => {
      sendResponse({ tabs });
    });
    return true; // Keep the message channel open for async response
  }

  if (msg.type === "SWITCH_TO_TAB") {
    chrome.tabs.update(msg.tabId, { active: true }, (tab) => {
      if (tab?.windowId) {
        chrome.windows.update(tab.windowId, { focused: true });
      }
    });
  }

  if (msg.type === "OPEN_NEW_TAB") {
    chrome.tabs.create({});
  }

  if (msg.type === "COPY_URL") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.url) {
        // Send URL back to content script for clipboard access
        if (sender.tab?.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "COPY_TO_CLIPBOARD",
            data: tabs[0].url,
          });
        }
      }
    });
  }

  if (msg.type === "HIGHLIGHT_TEXT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id)
        chrome.tabs.sendMessage(tabs[0].id, { type: "HIGHLIGHT_TEXT" });
    });
  }

  if (msg.type === "REMOVE_HIGHLIGHT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id)
        chrome.tabs.sendMessage(tabs[0].id, { type: "REMOVE_HIGHLIGHT" });
    });
  }
});
