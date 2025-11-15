import { Button } from "@/components/ui/button";

export default function PopupApp() {
  function openPalette() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id)
        chrome.tabs.sendMessage(tabs[0].id, { type: "TOGGLE_PALETTE" });
    });
  }

  return (
    <div className="p-4 w-[300px] space-y-2">
      <Button onClick={openPalette} className="w-full">
        Open Command Palette
      </Button>
    </div>
  );
}
