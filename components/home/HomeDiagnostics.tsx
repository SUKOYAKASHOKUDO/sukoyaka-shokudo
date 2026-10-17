"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __sukoyakaHomeFlow?: { entries: Record<string, unknown>[]; capture: (event: string) => void; userAgent: string };
  }
}

export function HomeDiagnostics() {
  const [report, setReport] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const d = window.__sukoyakaHomeFlow;
    if (!d) return;
    d.capture("hydrated");
    const update = () => setReport(JSON.stringify({ userAgent: d.userAgent, entries: d.entries }, null, 2));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (!report) return null;
  return <aside aria-label="新トップページの表示診断" style={{ position: "fixed", zIndex: 99999, inset: "auto 8px 8px", maxWidth: 600, marginInline: "auto", padding: 10, background: "white", color: "#075666", border: "2px solid #075666", borderRadius: 8, fontSize: 13 }}>
    <div>検証用の表示記録（自動送信なし）</div>
    <button type="button" onClick={async () => {
      const d = window.__sukoyakaHomeFlow;
      d?.capture("copy");
      try { await navigator.clipboard.writeText(JSON.stringify(d && { userAgent: d.userAgent, entries: d.entries }, null, 2)); setCopied(true); } catch { setCopied(false); }
    }}>{copied ? "コピーしました" : "表示記録をコピー"}</button>
    <details><summary>記録を見る</summary><textarea aria-label="表示診断記録" readOnly value={report} style={{ width: "100%", height: 150, fontSize: 11 }} /></details>
  </aside>;
}
