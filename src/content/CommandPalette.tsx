import { useEffect, useMemo, useState, useRef } from "react";
import { builtInCommands, Command } from "../commands/builtInCommands";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Tab {
  id?: number;
  title?: string;
  url?: string;
  favIconUrl?: string;
}

export function CommandPalette() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const selectedItemRef = useRef<HTMLLIElement>(null);

  // Determine if we're in action mode (query starts with ">")
  const isActionMode = query.startsWith(">");
  const searchQuery = isActionMode ? query.slice(1) : query;

  // Fetch all tabs on mount
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_ALL_TABS" }, (response) => {
      if (response?.tabs) {
        setTabs(response.tabs);
      }
    });
  }, []);

  // Fuse for commands
  const commandFuse = useMemo(
    () =>
      new Fuse(builtInCommands, {
        keys: ["title", "description"],
        threshold: 0.4,
      }),
    []
  );

  // Fuse for tabs
  const tabFuse = useMemo(
    () =>
      new Fuse(tabs, {
        keys: ["title", "url"],
        threshold: 0.4,
      }),
    [tabs]
  );

  // Get results based on mode
  const results = isActionMode
    ? searchQuery
      ? commandFuse.search(searchQuery).map((r) => r.item)
      : builtInCommands
    : searchQuery
    ? tabFuse.search(searchQuery).map((r) => r.item)
    : tabs;

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        const root = document.getElementById("raychrome-root");
        if (root) root.innerHTML = "";
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + results.length) % results.length
        );
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelection(results[selectedIndex]);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, results, isActionMode]);

  function handleSelection(item: Command | Tab) {
    if (isActionMode) {
      // Execute command
      (item as Command).action();
    } else {
      // Switch to tab
      const tab = item as Tab;
      if (tab.id) {
        chrome.runtime.sendMessage({
          type: "SWITCH_TO_TAB",
          tabId: tab.id,
        });
      }
    }
    // Close the command palette
    const root = document.getElementById("raychrome-root");
    if (root) root.innerHTML = "";
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-9999 pt-24 font-sans antialiased">
      <Card className="w-[640px] bg-zinc-900 text-white border-zinc-800 shadow-2xl">
        <CardContent className="p-4 space-y-3">
          <Input
            autoFocus
            placeholder={
              isActionMode
                ? "Type a command..."
                : "Search tabs... (type '>' for commands)"
            }
            className="bg-transparent border-b border-zinc-700 rounded-none px-2 text-lg focus-visible:ring-0 focus-visible:border-zinc-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="max-h-96 overflow-y-auto space-y-1">
            {results.length === 0 ? (
              <li className="p-3 text-zinc-400 text-center">
                {isActionMode ? "No commands found" : "No tabs found"}
              </li>
            ) : isActionMode ? (
              // Render commands
              results.map((item, index) => {
                const cmd = item as Command;
                return (
                  <li
                    key={cmd.id}
                    ref={index === selectedIndex ? selectedItemRef : null}
                    className={`p-3 cursor-pointer rounded-lg transition-colors ${
                      index === selectedIndex
                        ? "bg-zinc-700 ring-2 ring-zinc-500"
                        : "hover:bg-zinc-800"
                    }`}
                    onClick={() => handleSelection(cmd)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="font-medium">{cmd.title}</div>
                    {cmd.description && (
                      <div className="text-sm text-zinc-400">
                        {cmd.description}
                      </div>
                    )}
                  </li>
                );
              })
            ) : (
              // Render tabs
              results.map((item, index) => {
                const tab = item as Tab;
                return (
                  <li
                    key={tab.id}
                    ref={index === selectedIndex ? selectedItemRef : null}
                    className={`p-3 cursor-pointer rounded-lg transition-colors flex items-center ${
                      index === selectedIndex
                        ? "bg-zinc-700 ring-2 ring-zinc-500"
                        : "hover:bg-zinc-800"
                    }`}
                    onClick={() => handleSelection(tab)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {tab.favIconUrl ? (
                      <img
                        src={tab.favIconUrl}
                        alt=""
                        className="w-4 h-4 shrink-0 mr-3"
                      />
                    ) : (
                      <div className="w-4 h-4 shrink-0 mr-3 bg-zinc-600 rounded-sm flex items-center justify-center text-[10px] text-zinc-300">
                        🌐
                      </div>
                    )}
                    <div className="flex-1 min-w-0 flex items-baseline gap-2">
                      <span className="font-medium truncate">
                        {tab.title || "Untitled"}
                      </span>
                      {tab.url && (
                        <span className="text-sm text-zinc-400 truncate flex-1">
                          {tab.url}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
