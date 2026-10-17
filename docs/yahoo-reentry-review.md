# Yahoo! JAPAN / Pixel 再入場の切り分け（Preview専用）

本番mainの基準は `6b452c4a4ef9f367bf5d56a09b0c9fd738c5010c`。
今回の症状は「初回正常・再入場で上部欠け・空白1回タップで回復」。PCは利用者も正常と確認しています。
本番を変更せず、実機の比較結果と次の明示承認が得られるまで公開しません。PCの合格をPixel/Yahoo! JAPANの解決と扱いません。

## 比較URL（同じPreviewのクエリだけを変更）

| クエリ | 比較内容 |
|---|---|
| 指定なし | 計測なし。現行と同じauto/smooth。計測の影響を確認する対照 |
| `?home-debug=1` | A: 読み取り診断。現行auto/smoothを維持 |
| `?home-debug=1&home-test=manual` | B: 復元だけmanual。smoothは維持。強制スクロールなし |
| `?home-debug=1&home-test=instant` | C: HTMLのscroll-behaviorだけauto。復元はautoのまま |

B/Cはそれぞれ1変数の実験です。同時には適用しません。CのCSSはホームのマーカーがある文書だけに一致し、他ページへ移動すると無効になります。通常のTOPボタンの明示的なsmooth動作や他ページの処理は変更しません。
本番ビルドでは診断スクリプト・UIを出力せず、クエリを指定しても実験しません。環境変数・Vercel設定の追加変更は不要です。

## Pixelでの実機試験

まず計測なしのPreviewでも同じ症状が出るか確認し、その後Aを試します。
利用者が確認した再現操作は「Yahooの検索結果へ戻り、同じ検索結果をもう一度タップ」です。別アプリから戻る操作や、サイトへ履歴の「戻る」で復帰する操作と混同しません。
Yahoo! JAPANアプリ内で、同じ比較URLについて初回→検索結果へ戻る→同じ結果をもう一度開く、を5回以上繰り返してください。Previewが検索結果に存在しない場合は、同じ共有URLをYahooアプリで開く入口を使って、検索結果側へ戻ってから開き直してください。開き直し方が本番と異なる場合は、その違いも報告してください。
欠けたときはスクロールせず空白を1回だけタップし、戻ったかを記録します。
アプリ完全終了後と、しばらく時間を置いた後も確認します。
Aで記録を取り出してからB、Cを別々に試し、各版で5回以上同じ操作を行います。

記録は後から取り出します。確認操作が終わった後に少し下へスクロールして既存のTOPボタンを表示し、約1秒長押しして離してください。
診断ダイアログが開いたら「診断記録をコピー」を押して、このチャットに貼り付けてください。ボタンの通常の短いタップは従来どおりTOPへ移動します。
長押しがアプリ側に処理される場合は、同じタブのURL末尾に `#home-flow-report` を付けるか、同じ診断URLに `&home-report=1` を追加して開いてください。別タブや別アプリでは保存領域が共有されず記録が見えない場合があります。
PC用の取り出し操作はAlt+Shift+Dです。

記録と一緒に「版A/B/C」「5回中何回欠けたか」「空白タップで戻ったか」「アプリ完全終了後/時間を置いた後の結果」を知らせてください。
`inputCoverage` が `no-page-pointer-observed` なのに実際に空白をタップした場合は、その事実も知らせてください。Webページでイベントを観測していない事実と、アプリがタップを処理したという推定は区別します。

## 取得する事実と限界

pageshow/pagehideのpersisted、visibilitychange、focus、resize、scroll、Visual Viewportのresize/scroll、captureフェーズのpointerdown/up/cancel、復帰・タップ後の2フレームを記録します。
スクロール値・html/body/root/header/heroの座標・Visual Viewport・復元モード・スクロール動作を収集し、`tapComparisons` にタップ前→pointerup後2フレームの差分を保存します。
URL全文、リンク先、referrer、Cookie、閲覧履歴、本文、入力文字、UA、IPは収集しません。通信・自動アップロードはありません。
モードごとのsessionStorageに最大400件・タップ差分40件を一時保存します。連続scrollはフレームごとにまとめ、上限ではscrollサンプルを優先的に捨てます。保存の期限は最後の保存から1時間（次の文書読み込み時に判定）。コピー後はその版の記録だけを削除できます。
保存が拒否される場合はメモリーだけで動き、`storage: unavailable` を報告します。その場合は文書が破棄される前に取り出してください。アプリ側で別WebView/タブを作り直す場合の継続保存は保証できません。
初期画面に固定パネル・オーバーレイ・新しい余白を追加しません。閉じたdialogは配置に参加しません。取り出す操作の直前に記録を固定し、取り出しUIが開いている間は計測を止めます。
DOMの座標読み取り自体がブラウザのレイアウト計算に影響する可能性は排除できません。計測なし対照とAで再現の有無が違う場合、それ自体を重要な結果として報告してください。

## 仮説別の判定材料

- A（復元）: タップ前後のwindow/document/bodyスクロール値とBの比較。
- B（Viewport）: offsetTop/pageTop/height/scaleとDOM座標のタップ前後差。
- C（描画）: 画像は変化したのに上記数値が変わらないという実機結果。数値不変だけではWebViewの描画異常と断定しない。
- D（BFCache）: pageshow.persisted=trueで復元を確認。pagehide.persisted=trueだけでは復元成功の証明にしない。新文書かどうかはdocumentIdも参照。
- E（アプリ領域）: Web側pointerがない、またはDOM/Viewportが正常なのに実画面が隠れる等の実機結果。ネイティブのツールバー寸法はWeb側から直接測定できない。

実測を得るまで復帰時の再描画・スクロール補正は追加しません。interval、タイマーの連打、body移動、全要素will-change、強制リロード、疑似タップは使用しません。

参考: [Chrome BFCache](https://web.dev/articles/bfcache)、[MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)。
