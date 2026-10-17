# ヘッダー・ヒーロー再構築（実機確認前）

## 基準とバックアップ

- GitHub main / `backup/pre-header-hero-rebuild-20261017`: `6b452c4a4ef9f367bf5d56a09b0c9fd738c5010c`。
- 開始時Production: `dpl_F1DYgUtpMc1yPCdFpVD3GgAF4BBn`, READY。ドメイン `www.sukoyaka-shokudo.com`、同じGitコミット。
- 作業ブランチ: `codex/header-hero-rebuild-20261017`。元の作業フォルダとは別worktree。
- ローカル退避先: `C:\Users\yuuki\.codex\artifacts\sukoyaka-header-hero-20261017`。
- `production-6b452c4.zip`: public素材を含む全追跡ファイル。
- `original-uncommitted.patch`: 元の作業フォルダのHEADからのバイナリ対応差分。
- `original-status.txt`: 元の未コミット・未追跡ファイル一覧。未追跡ファイルは元の場所に保持し、移動・削除しない。既存tmp内のアクセス拒否ディレクトリは一覧取得できないため、その中身の複製は保証しない。
- `before-*.png`, `baseline.json`: 6幅の本番画面・座標・リンク・下部本文の基準。

## 履歴調査

- `028b8e2` (2026-10-11): ホームヘッダーだけに幅 `min(100%,1672px)`、中央配置を追加。幅を揃えた変更そのものには、スクロール・復帰処理の追加なし。
- 旧実装には画像のtranslate、clip-path、幅からの高さ算出が存在。その後も復元関連の変更が複数継続。
- `8b094d7` (2026-10-11): モバイルのブラウザ標準スクロール復元を維持する変更。
- `49cea7b` (2026-10-12): Yahooでの確認用としてモバイル上部余白を20pxから32pxに拡大。
- `439fccd` (2026-10-17): HomePage専用構造へ再構築。ただしSVG viewBox/clipPath/filter、cqw依存の高さ計算は継続。
- 今回の再構築前の実測Pixelログはない。時期の一致やコードの複雑さだけで原因と断定しない。

## 構造

HomeHeader / HomeHeroに専用 `home-top.module.css` を追加。ヘッダーは同じGridセルに画像背景と操作領域を重ね、ヒーローは画像と2段メニューを文書フローで積む。画像は寸法・縦横比を明示。最大幅1672px、モバイルヘッダーの既存32px余白・2段ナビゲーションを維持。PCヘッダーは親幅の12.891344%の通常paddingで高さを予約し、元の接続位置を維持する1pxのみ差し引く。コンテナクエリの評価やJavaScriptの再計算は不要。PC操作領域の0.365px補正も、元の1px接続差分に由来する。

表示用の9画像は、現行本番のSVGが表示していた範囲・色・切り抜きをブラウザで一度だけラスタライズした派生PNG。元のWebP/PNG、ロゴ、アイコンは保存する。実行時の画像SVG、フィルター、マスク、cqw、負の位置移動には依存しない。ナビゲーションの小さい単純SVGアイコンは元のpathのまま。

home.module.css、HomeSections、HomeNews、SiteFooter、RouteScrollReset、globals.css、storybook-world.css、SEO、依存関係、他ページは変更しない。HomePageの変更はヒーロー先読み画像と診断環境条件のみ。共有layoutの変更は診断を `VERCEL_ENV === "preview"` に限定する条件のみ。

## Preview診断

通常URLは計測なし。`?home-debug=1` を付けたホームだけ読み取り計測する。Productionビルドには診断スクリプト・UIを出力しない。自動送信、外部API、強制スクロール、疑似タップ、リロード、描画補正をしない。

スクロール復元設定、window.scrollY、実スクローラーscrollTop、Visual ViewportのoffsetTop/pageTop/height/scale、header/heroの矩形、pageshow/pagehide.persisted、visibilitychange、freeze/resume、pointerdown/up/cancelと2描画フレーム後を保存する。`tapComparisons` はタップ前後の数値差分。

同じタブのsessionStorageへ最大400イベント・40タップ差分を一時保持（期限1時間）。WebViewが別タブを作る場合の記録継続は保証しない。URL全文・本文・入力値・Cookie・IP・メール・閲覧履歴は収集しない。Web側の座標読み取り自体が描画タイミングへ影響する可能性があるため、まず計測なしのURLで試す。

記録を取り出すときだけ下へスクロールし、既存TOPボタンを約1秒長押しする。PCはAlt+Shift+D。同じタブで `#home-flow-report` へ変更する方法も使用可能。診断ダイアログの「診断記録をコピー」でチャットへ共有する。診断UIを開く前に記録を固定し、UI表示中の計測は停止する。

## Pixel / Yahoo! JAPANで必要な試験

1. Preview通常URLをYahooアプリ内で開き、タップしないで最上部を確認。
2. 直後に離れて同じ入口から再入場。5回連続で繰り返す。
3. アプリを完全終了して再アクセス。
4. サイト内の別ページへ移動し、戻る操作。
5. 欠けがあれば診断URLで再現し、空白を1回タップした前後を記録。

「5回中何回欠けたか」「タップ前後で表示が戻ったか」「本番と開き方に違いがあるか」と診断記録を確認する。Chromeエミュレーションだけで合格としない。実機確認までmain / Productionには反映しない。

## 復旧

Previewだけの段階ではProductionは変更されていないため、本番復旧は不要。
本番反映後に問題が出た場合は、Vercelで `dpl_F1DYgUtpMc1yPCdFpVD3GgAF4BBn` へのRollbackを実施する。main側は今回のコミットのみrevertし、他の変更を消すreset/force pushをしない。Rollback後に自動エイリアス割当が停止する場合は、確認済みProductionをPromoteして再開する。
ソースは復旧ブランチから新しいworktreeへ展開するか、保存ZIPを別フォルダへ解凍して比較できる。元の未コミット変更へpatchを重ね直す前に重複適用を確認する。

## ローカル検証

- `npm run typecheck`: 成功。
- `node --test tests/home-flow.test.mjs tests/news.test.mjs tests/news-images.test.mjs`: 18件成功。
- lintスクリプトは既存package.jsonにない。追加しない。
- ローカル依存インストールが遅かったため、同じpackage.json/lockfileの既存インストールをjunction参照。Turbopackはroot外リンクを拒否するため、ローカルの画面確認とビルドは `--webpack` を使用。アプリ設定・依存関係は変更しない。Vercelでは新規インストールによる標準ビルドを別途確認する。
- 6幅（360 / 390 / 430 / 768 / 1366 / 1680）の本番・変更後比較: 横スクロールなし、ヘッダー・ヒーロー高さ、下部全6セクションの開始位置・本文一致。リンク先一致。操作領域の差は最大0.016 CSS px程度の丸め差。
- PNG派生画像と元のSVG内WebP表示には縮小補間・輪郭の描画差がある。画素完全一致とは扱わない。比較JSONと差分画像は上記のローカル退避先に保持する。
- Pixel/Yahoo! JAPAN実機と、実機タップ前後の測定値は未取得。修正済み・解決済み・本番公開済みとはしない。
