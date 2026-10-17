# 再入場で上部が欠ける症状の比較検証

## 利用者からの結果

2026-10-17: 「一番初めの入場は正常表示、その後サイトを閉じて再入場すると、その後はずっと上部が表示されない。症状は変わらない」との報告。
確認先が再構築Previewか本番か、空白1回タップで今回も復旧するかは、追加確認中。
この報告から修正成功とは判断できない。本番mainへの反映は引き続き保留。

前回再構築で変えたのは上部のレイアウトと画像表示方式。ホームのスクロール復元autoとCSSのsmoothは維持したため、次はそれぞれ独立に比較する。

## 同じPreviewで比較する設定

| URLの指定 | スクロール復元 | CSS scroll-behavior | 計測 |
|---|---|---|---|
| 追加なし | auto | smooth | なし |
| `home-test=manual` | manual | smooth | なし |
| `home-test=instant` | auto | auto | なし |
| 上記に `home-debug=1` 追加 | 同じ | 同じ | 読み取り計測あり |

manualはブラウザの履歴スクロール復元だけを無効化する。instantはCSSによる滑らかなスクロールだけを無効化する。両方を同時には変更しない。
通常版・画像・余白・文字・クリック範囲を維持する。強制scrollTo、疑似タップ、リロード、body移動、再描画の連打を加えない。
まず計測なしで確認し、再発する場合だけ同じ設定にhome-debug=1を追加して記録する。観測によるレイアウト計算自体が症状に影響する可能性を区別する。

## 環境と影響範囲

設定用スクリプトと診断はサーバー側で `VERCEL_ENV === "preview"` の場合だけ出力。
RouteScrollResetへサーバーからPreview判定を渡し、hydrate後にmanualがautoへ戻らないようにする。クライアントで非公開環境変数を読んで判定しない。
どちらの設定もホームの指定クエリだけで有効。instantのCSSはホームのマーカーがあるhtmlだけに一致し、他ページは対象外。
Productionはクエリを指定しても従来のauto/smoothのまま。画像・公開ページのCSS・SEO・依存関係は変更しない。

## 計測と取り出し

既存のPreview診断を使う。通常版・manual・instantの記録は別のsessionStorageキーへ保存し、混ぜない。
headの記録は既定の復元設定と比較設定を適用した後に取得。pageshow、visibilitychange、freeze/resume、Visual Viewport、タップ前後のスクロール値・header/hero矩形を比較する。
症状が出たら、スクロールする前に空白を1回タップして復旧したかを記録する。取り出すときだけ下へスクロールし、TOPを約1秒長押しして診断JSONをコピーする。
PCはAlt+Shift+Dでも取り出せる。自動送信なし。記録の保持上限・1時間の期限は既存のまま。

## 判定の限界

- manualだけ改善: 復元との関連を示す材料。単独では内部原因の確定ではない。
- instantだけ改善: 滑らかなスクロールとの関連を示す材料。
- どちらも再発、座標は変化: 実測されたスクロール・Viewport・DOM値を元に次の修正を絞る。
- 表示だけ変化し座標不変: 描画状態やアプリ側の表示領域も候補。数値不変だけでWebViewの不具合とは断定しない。
- 計測版だけ改善: 観測が症状に影響した可能性を記録し、計測なしと区別する。

Google Pixel / Yahoo! JAPANアプリでの実機結果を得るまで解決済みとしない。

参考: [Chrome Page Lifecycle](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)、[History.scrollRestoration](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration)。
