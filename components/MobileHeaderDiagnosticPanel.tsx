"use client";

import { useEffect, useState } from "react";

type Diagnostics = {
  entries: Array<Record<string, unknown>>;
  capture: (event: string) => void;
  userAgent: string;
};

declare global {
  interface Window {
    __sukoyakaHeaderDebug?: Diagnostics;
  }
}

export function MobileHeaderDiagnosticPanel() {
  const [report, setReport] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const diagnostics = window.__sukoyakaHeaderDebug;
    if (!diagnostics) return;
    diagnostics.capture("hydrated");
    const refresh = () => setReport(JSON.stringify({
      userAgent: diagnostics.userAgent, entries: diagnostics.entries,
    }, null, 2));
    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!report) return null;

  const copyReport = async () => {
    const diagnostics = window.__sukoyakaHeaderDebug;
    if (!diagnostics) return;
    diagnostics.capture("copy");
    const latest = JSON.stringify({ userAgent: diagnostics.userAgent, entries: diagnostics.entries }, null, 2);
    setReport(latest);
    try {
      await navigator.clipboard.writeText(latest);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside aria-label="ヘッダー表示の診断" style={{
      position: "fixed", zIndex: 99999, bottom: 8, left: 8, right: 8,
      maxWidth: 600, marginInline: "auto", padding: 10, background: "#fff",
      border: "2px solid #075666", borderRadius: 8, color: "#075666", fontSize: 13,
    }}>
      <div>ヘッダー診断（このURLだけに表示・自動送信なし）</div>
      <button type="button" onClick={copyReport}>
        {copied ? "記録をコピーしました" : "記録をコピー"}
      </button>
      <details>
        <summary>診断記録を表示</summary>
        <textarea aria-label="診断記録" readOnly value={report}
          style={{ width: "100%", height: 150, fontSize: 11 }} />
      </details>
    </aside>
  );
}
