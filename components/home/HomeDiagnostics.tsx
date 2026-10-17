"use client";

import { useEffect, useRef, useState } from "react";

/** Closed dialog occupies no space. Open only after the user requests export. */
export function HomeDiagnostics() {
  const [report, setReport] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const text = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const d = window.__sukoyakaHomeFlow;
    if (!d) return;
    d.capture("hydrated");
    let heldAt: number | null = null, suppressClick = false;
    const isTop = (target: EventTarget | null) => target instanceof Element && !!target.closest(".back-to-top-button");
    const show = () => {
      d.capture("export-request"); d.persist();
      const value = JSON.stringify(d.report(), null, 2);
      d.pause(); setReport(value); setStatus("");
    };
    const down = (event: PointerEvent) => { suppressClick = false; heldAt = isTop(event.target) ? performance.now() : null; };
    const cancel = () => { heldAt = null; };
    const up = (event: PointerEvent) => {
      if (heldAt !== null && isTop(event.target) && performance.now() - heldAt >= 900) { suppressClick = true; show(); }
      heldAt = null;
    };
    const menu = (event: MouseEvent) => { if (isTop(event.target)) { event.preventDefault(); suppressClick = true; show(); } };
    const click = (event: MouseEvent) => {
      if (suppressClick && isTop(event.target)) { suppressClick = false; event.preventDefault(); event.stopPropagation(); }
    };
    const key = (event: KeyboardEvent) => { if (event.altKey && event.shiftKey && event.code === "KeyD") { event.preventDefault(); show(); } };
    const hash = () => { if (location.hash === "#home-flow-report") show(); };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", cancel, true);
    document.addEventListener("contextmenu", menu, true);
    document.addEventListener("click", click, true);
    document.addEventListener("keydown", key);
    window.addEventListener("hashchange", hash);
    if (new URLSearchParams(location.search).get("home-report") === "1") show();
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("contextmenu", menu, true);
      document.removeEventListener("click", click, true);
      document.removeEventListener("keydown", key);
      window.removeEventListener("hashchange", hash);
      d.resume();
    };
  }, []);
  useEffect(() => { if (report !== null && !dialog.current?.open) dialog.current?.showModal(); }, [report]);
  const close = () => dialog.current?.close();
  return <dialog ref={dialog} aria-labelledby="home-flow-export-title" onClose={() => {
    setReport(null); window.__sukoyakaHomeFlow?.resume();
  }} style={{ width: "min(620px, calc(100vw - 32px))", maxHeight: "80dvh", padding: 20, border: "2px solid #075666", borderRadius: 12, background: "white", color: "#075666" }}>
    <h2 id="home-flow-export-title">再入場の診断記録</h2>
    <p>この端末の同じタブ内だけに一時保存します。外部送信は行いません。確認後にこの画面を開いた時点の記録です。</p>
    <button type="button" onClick={async () => {
      if (!report) return;
      try { await navigator.clipboard.writeText(report); setStatus("コピーしました"); }
      catch { text.current?.select(); setStatus("記録を選択しました。端末のコピー操作を使ってください。"); }
    }}>診断記録をコピー</button>{" "}<button type="button" onClick={close}>閉じる</button>
    <p role="status">{status}</p>
    <textarea ref={text} aria-label="再入場の診断JSON" readOnly value={report ?? ""} style={{ width: "100%", height: 240, fontSize: 12 }} />
    <button type="button" onClick={() => { window.__sukoyakaHomeFlow?.clear(); close(); }}>この比較版の記録を消去して閉じる</button>
  </dialog>;
}
