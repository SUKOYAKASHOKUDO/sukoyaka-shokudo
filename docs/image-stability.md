# お知らせ画像の整合性検証と診断

## 2026-10-15の調査結果

- Next.js 16.3.4、Next.jsが依存するsharp 0.35.4、GitHub main連携のVercel公開。
- 対象のお知らせ画像は既存の `unoptimized` 指定により、`/images/news/` の元JPEG/PNGを配信。画像最適化URL・WebP/AVIFへの自動変換は使用していない。
- 元画像とリポジトリの写真4点のSHA-256が一致。ロゴを含む5画像は、配信バイト・MIME・寸法・全画素デコードも一致した。
- 実測の画像応答は `Cache-Control: public, max-age=0, must-revalidate`。通常取得、再検証要求、WebP/AVIF対応Acceptのいずれも同じ元データを返した。
- `/news` は `private, no-cache, no-store, max-age=0, must-revalidate`、トップと記事HTMLは `public, max-age=0, must-revalidate`。新旧の画像内容が同一URLで上書きされた履歴は対象写真にない。
- お知らせの画像を変換するビルドスクリプトや、Service Workerの登録コードはリポジトリ内にない。既存の手動最適化スクリプトはお知らせ画像を対象にせず、ビルドからも呼び出されない。
- ノイズ発生は今回再現できず、異常時の応答データも未取得。CDN障害・ブラウザキャッシュ・画像デコーダー・GPU描画のどれが原因かは断定できない。画像やCSS、URL、キャッシュ設定を推測で変更しない。

## 自動検証

`npm run build` の前後で画像を検証し、不一致・デコード失敗時は終了コード1でビルドを失敗させる。

```sh
npm run verify:news-images
node --test tests/news.test.mjs tests/news-images.test.mjs
npm run build
```

`config/news-image-integrity.json` は確認済み原本のSHA-256・バイト数・形式・寸法を記録する。ヘッダーだけでなく、sharpによる全画素のデコードも実行する。全画素ハッシュは実行環境のデコーダーで算出し、その場でローカルとHTTP応答を比較する。プラットフォーム間のデコーダー差を誤検知しないよう、全画素ハッシュを固定の合否基準にはしない。

ビルド後は画像を再検証し、生成HTMLの画像参照が既知のファイルを指すか、お知らせ画像が意図せず最適化経路に変わっていないかを調べる。`public` の画像は変換・再保存しない。

新しい画像を追加する場合は、掲載許可と原本の正常性を確認し、原本とコピーのハッシュを照合してからマニフェストを追記する。不一致を回避するために既存ハッシュを自動更新してはいけない。写真を更新する必要がある場合は、同じURLの内容を上書きせず新しいファイル名を使い、古いHTMLからの参照が必要な間は旧ファイルも保持する。

## 配信の診断

公開設定・環境変数の変更は不要。保存先には作業リポジトリの外を指定する。

```sh
npm run diagnose:news-images -- --base-url=https://www.sukoyaka-shokudo.com --rounds=30 --output-dir=../sukoyaka-image-check
```

5画像×4条件×30回の最大600要求。各応答の実URL、時刻、ステータス、全ヘッダー、受信バイト数、SHA-256、全画素ハッシュを `http-report.json` に記録する。Content-Length、MIME、デコード、原本との一致を検証し、最初の失敗で停止する。自動リトライやキャッシュ削除は行わない。1回だけの確認は `--rounds=1` とする。

- `normal`: 通常のHTTP GET。
- `revalidate`: `Cache-Control: no-cache` / `Pragma: no-cache` を要求。ブラウザの強制再読み込みやCDNキャッシュ削除ではない。
- `android` / `ios`: User-AgentとAcceptを変えたHTTP試験。実際のAndroid Chrome / iPhone Safariでの描画試験ではない。
- `--profiles=normal --slow-kbps=128`: 応答本文の読み取りを128KiB/秒に制限。実回線の帯域・遅延やブラウザの低速通信を再現するものではない。

HTTP 200とデコード成功だけでは画像の正しさは保証できない。別の有効なJPEGや、正常にデコードできるノイズ画像も、原本とのSHA-256不一致で検出する。一方、ブラウザの描画面だけが乱れる問題はこのCLIだけでは検出できない。

## 異常が再発した場合

1. 画像を差し替える前に、発生時刻、端末・OS・ブラウザ／アプリのバージョン、ページURL、画像URL、スクリーンショットを保存する。
2. 利用できる場合は開発者ツールのNetworkで、異常時そのものの応答本文とヘッダーを保存する。別プロセスのCLIで取り直した応答は、ブラウザが実際に表示した応答と同一とは限らない。
3. 診断CLIのハッシュと原本を比較する。異常時本文のバイトが違えば配信・キャッシュ段階を、同じバイトなのに表示が乱れる場合はデコーダーや描画段階を重点調査する。どちらも追加の証拠なしに原因を断定しない。
4. 別ブラウザ／別端末でも比較し、必要に応じてVercelの該当デプロイと `x-vercel-id` のリージョンを確認する。サイト全体のキャッシュ破棄や、利用者のGPU設定の一括変更は行わない。

## 仕様資料

- [Next.js Image / unoptimized](https://nextjs.org/docs/app/api-reference/components/image#unoptimized)
- [Next.js publicフォルダー](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)
- [Vercel CDNキャッシュ](https://vercel.com/docs/caching/cdn-cache)
- [Vercel Skew Protection](https://vercel.com/docs/skew-protection)

既存のGit連携によるVercel公開を維持する。デプロイ単位で扱われる静的アセットと、開いたままのブラウザの旧HTMLは区別する。今回の対象ファイルは上書きも削除もしていないため、旧HTMLから同じ画像URLを参照しても元データは維持される。Skew Protectionの追加設定やキャッシュの一括削除は行わない。
