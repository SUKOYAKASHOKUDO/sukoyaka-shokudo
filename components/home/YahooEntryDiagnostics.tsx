"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { YahooEntryDiagnosticManager, YahooEntryDiagnosticStatus } from "../../lib/yahooEntryDiagnostics";

/** No UI, storage access or measurement on ordinary homepage visits. */
export function YahooEntryDiagnostics() {
  const management = useSearchParams().get("entry-diagnostics") === "manage";
  const [manager, setManager] = useState<YahooEntryDiagnosticManager | null>(null);
  const [status, setStatus] = useState<YahooEntryDiagnosticStatus | null>(null);
  const [message, setMessage] = useState("");
  const [report, setReport] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const api = window.__sukoyakaEntryManager;
    if (!management || !api) return;
    setManager(api);
    setStatus(api.read());
  }, [management]);

  useEffect(() => {
    const element = dialog.current;
    if (!management || !manager || !element) return;
    if (!element.open) element.showModal();
    return () => element.close();
  }, [management, manager]);

  if (!management || !manager || !status) return null;

  const update = (next: YahooEntryDiagnosticStatus, text: string) => {
    setStatus(next);
    setMessage(next.storageAvailable ? text : "端末内の保存領域を利用できません。計測不能です。通常サイトの表示は継続できます。");
    setReport("");
  };
  const copy = async () => {
    const next = manager.read();
    setStatus(next);
    setReport(next.report);
    if (!next.report) { setMessage("コピーできる記録がありません。正常表示の確認結果としては扱えません。"); return; }
    try {
      await navigator.clipboard.writeText(next.report);
      setMessage("診断ログをコピーしました。共有する場合は、ご自身で貼り付けてください。");
    } catch { setMessage("自動コピーを利用できません。下の欄を選択して手動でコピーしてください。"); }
  };
  const download = () => {
    const next = manager.read();
    setStatus(next);
    if (!next.report) { setMessage("保存できる記録がありません。通常URLでの計測を確認してください。"); return; }
    try {
      const url = URL.createObjectURL(new Blob([next.report], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `sukoyaka-entry-${Date.now()}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("JSONファイルの保存を要求しました。保存できないアプリでは「診断ログをコピー」を使ってください。");
    } catch { setMessage("ファイル保存を利用できません。「診断ログをコピー」を使ってください。"); }
  };
  const buttonStyle = { padding: "10px 14px", minHeight: 44, cursor: "pointer" };

  return <dialog ref={dialog} aria-labelledby="yahoo-entry-title" style={{ width: "min(640px, calc(100% - 24px))", maxHeight: "85vh", overflow: "auto", padding: 20, borderRadius: 12 }}>
    <h2 id="yahoo-entry-title">検索経由の表示診断 v2</h2>
    <p>表示を修正せず、端末内だけで状態を記録します。この画面を開くだけでは開始しません。</p>
    <p role="status">{!status.storageAvailable ? "保存領域を利用できません：計測不能" : status.enabled ? "診断：有効（期限後は自動停止）" : "診断：停止中"}<br />
      {status.expiresAt ? <>有効期限：{new Date(status.expiresAt).toLocaleTimeString("ja-JP")}<br /></> : null}
      通常ページの記録：{status.events}件／{status.documents}文書、保存データ：{status.bytes} bytes</p>
    <p>通常URLの記録が0件の場合、アプリ内の保存領域の分離などで計測できていない可能性があります。「問題なし」とは判定できません。</p>
    <p>時刻・文書番号・DPR・要素の位置とスタイル・画面内の固定点の判定を記録します。アプリ側のWebView境界や描画サーフェスは取得できません。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button type="button" style={buttonStyle} onClick={() => update(manager.enable(), "30分間の診断を有効にしました。検索画面へ戻り、検索結果から通常の公式URLを開いてください。")}>30分間診断を有効にする</button>
      <button type="button" style={buttonStyle} onClick={() => update(manager.read(), "状態を更新しました。")}>現在の診断状態を確認</button>
      <button type="button" style={buttonStyle} onClick={copy}>診断ログをコピー</button>
      <button type="button" style={buttonStyle} onClick={download}>診断ログをJSON保存</button>
      <button type="button" style={buttonStyle} onClick={() => update(manager.stop(), "診断を停止しました。保存ログは期限までコピーできます。")}>診断を直ちに停止</button>
      <button type="button" style={buttonStyle} onClick={() => update(manager.clear(), "診断を停止し、保存ログを削除しました。")}>保存ログを削除</button>
      <button type="button" style={buttonStyle} onClick={() => dialog.current?.close()}>管理画面を閉じる</button>
    </div>
    <p aria-live="polite">{message}</p>
    {report ? <label>コピー用診断ログ<textarea readOnly value={report} rows={8} style={{ display: "block", width: "100%" }} /></label> : null}
    <p>検索語・Cookie・個人情報・URL全文は保存せず、自動送信もしません。測定のための位置読取が表示に影響する可能性があります。</p>
    <p>測定は30分で停止します。ページを閉じている間に期限が切れた保存データは、次に診断機能を開いた際に破棄します。</p>
  </dialog>;
}
