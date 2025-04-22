import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { changelog } from "../lib/changelog";

export default function Changelog() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (path === "/changelog") {
      document.title = "Changelog - Noisefill";
    }
  }, [path]);
  return (
    <div className="max-w-3xl">
      <div>
        {changelog.map((entry) => (
          <div key={entry.date} className="mb-4">
            <div className="flex gap-2 items-center">
              <p className="text-white font-semibold p-1 px-2 rounded-lg select-none bg-zinc-700">
                {new Date(entry.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-lg font-semibold">{entry.title}</p>
            </div>
            <div className="mt-4">
              {entry.body.map((item) => (
                <div
                  key={item.content}
                  className={
                    item.type === "heading" ? "text-lg font-semibold" : ""
                  }
                >
                  {item.content}
                </div>
              ))}
            </div>
            <hr className="mt-4 mb-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
