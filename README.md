# すこやか食堂 公式サイト

## Instagram API OAuth基盤

このブランチでは、Meta公式の「Instagram API with Instagram Login」を使うためのサーバー側OAuth基盤だけを追加しています。写真ギャラリーの表示は変更していません。

2026年8月31日にMeta公式ドキュメントを確認し、API v26.0、`instagram_business_basic`、次の公式エンドポイントを前提にしています。

- `https://www.instagram.com/oauth/authorize`
- `https://api.instagram.com/oauth/access_token`
- `https://graph.instagram.com/access_token`
- `https://graph.instagram.com/refresh_access_token`

必要なルート:

- `GET /api/instagram/auth`: OAuth開始。`INSTAGRAM_OAUTH_ENABLED=true` の期間だけ利用できます。ブラウザのBasic認証にはユーザー名 `instagram` と `INSTAGRAM_OAUTH_SETUP_SECRET` を使います。これはInstagramのパスワードではありません。
- `GET /api/instagram/callback`: state検証、短期・長期トークン交換、プロアカウントと`mi_repollito`の照合、メディア接続確認を行います。
- `GET /api/instagram/test`: 管理用Bearer認証後、安全なアカウント情報と最新3件だけを返します。

Metaへ登録する本番Redirect URIは、次の完全一致URLです。

```text
https://www.sukoyaka-shokudo.com/api/instagram/callback
```

環境変数名は `.env.example` を参照してください。平文トークンをブラウザへ返さないため、callbackはAES-256-GCMで暗号化した設定値だけを返します。`INSTAGRAM_TOKEN_ENCRYPTION_KEY` は32バイトのランダム値をbase64url形式で設定し、暗号化値を `INSTAGRAM_ACCESS_TOKEN_SEALED` としてVercelへ手動登録します。callbackからVercelへの自動書き込みは行いません。

`INSTAGRAM_ACCESS_TOKEN` はMetaダッシュボードなどから管理者が安全に直接設定できる場合の互換用です。`INSTAGRAM_ACCESS_TOKEN_SEALED` が設定されている場合は暗号化値を優先します。

`INSTAGRAM_OAUTH_SETUP_SECRET` と `INSTAGRAM_TEST_SECRET` は、それぞれ異なる32文字以上のランダム値にしてください。OAuth承認後は、`INSTAGRAM_OAUTH_ENABLED=false` に戻してください。接続テストは次のように管理用シークレットをHTTPヘッダーへ設定します。URLやチャットへシークレットを貼らないでください。

```powershell
$headers = @{ Authorization = "Bearer <INSTAGRAM_TEST_SECRET>" }
Invoke-RestMethod -Uri "https://www.sukoyaka-shokudo.com/api/instagram/test" -Headers $headers
```

対象Instagramは開発者所有ではないため、開発・テスト中は対象所有者をアプリのTester等へ追加してStandard Accessで確認します。アプリの役割に含まれない第三者へ本番サービスを提供する場合は、`instagram_business_basic` のAdvanced AccessとApp Reviewが必要です。

札幌市中央区の子ども食堂「すこやか食堂」の公式Webサイトです。

## 技術構成

- Next.js App Router
- React
- TypeScript
- CSS
- Vercel

現段階では、CMS、データベース、会員機能、問い合わせ送信APIは使用していません。確認できる連絡先として、公式Instagram、メール、電話へ案内します。

## 主なページ

- `/` ホーム
- `/kids` こどものみんなへ・はじめての方向け案内
- `/schedule` 開催カレンダー・最新日程案内
- `/support` 企業・団体向け支援案内、支援先口座、支援実績
- `/columns` 公開済みコラム一覧
- `/columns/[slug]` コラム詳細
- `/recipes` 公開済みレシピ一覧
- `/recipes/[slug]` レシピ詳細
- `/sitemap.xml` サイトマップ
- `/robots.txt` クローラー設定

## Instagram開催カレンダー連携

`/schedule` は `/api/instagram/calendar` の共通形式を読み込みます。現在は未連携時の案内枠を表示し、次のVercel環境変数を設定するとカレンダー画像へ切り替わります。

- `INSTAGRAM_CALENDAR_IMAGE_URL`: 公開するカレンダー画像のHTTPS URL
- `INSTAGRAM_CALENDAR_POST_URL`: 画像に対応するInstagram投稿URL（未設定時は公式プロフィール）
- `INSTAGRAM_CALENDAR_IMAGE_ALT`: 画像の代替テキスト
- `INSTAGRAM_CALENDAR_UPDATED_AT`: 公開画面に表示する更新日時

Instagram Graph APIとの本接続時は、アクセストークンを公開環境変数へ渡さず、[`lib/instagramCalendar.ts`](lib/instagramCalendar.ts) 内の取得処理だけを置き換えます。

## 情報の更新

基本情報、YouTube、支援方法、支援実績、コラム、レシピは
[`content/siteContent.ts`](content/siteContent.ts) に集約しています。

### コラム

- `status: "draft"` は公開されません。
- `status: "published"` の記事だけが一覧、詳細、サイトマップへ出ます。
- 公開記事には重複しない `slug` と本文 `sections` が必要です。

### レシピ

- 材料、手順、所要時間、分量、アレルゲン注意、安全注意を入力します。
- 医療・栄養効果は根拠なく断定しません。
- 食物アレルギーがある場合は、使用する商品の原材料表示確認を促します。

### ご支援者

- 運営者から掲載許可を得た企業・団体・支援者だけを `sponsors` に追加します。
- 公式URLやロゴは確認できた場合だけ追加し、推測しません。
- 支援額や数量による順位付けは行いません。

## 画像

公開用画像は `public/images/` に置きます。元写真と手書き参考資料は、Git対象外の `.source-assets/` に保存します。

画像を更新した場合は、PowerShellで次を実行してください。

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\optimize-images.ps1
```

この処理は元写真を残したまま、公開用JPEGを長辺2,000px・品質82で生成します。手書き案は公開ディレクトリへ出力しません。

## ローカル確認

```powershell
npm.cmd ci
npm.cmd run typecheck
npm.cmd run build
npm.cmd run dev
```

公開前には、PC幅とスマートフォン幅で次を確認します。

- ホーム、支援、コラム、レシピ、404
- モバイルメニューとキーボードフォーカス
- YouTube埋め込み
- Instagram、メール、電話、地図のリンク
- アレルゲン・安全注意
- favicon、metadata、canonical、robots、sitemap

## GitHub / Vercel

- GitHub: `SUKOYAKASHOKUDO/sukoyaka-shokudo`
- Production Branch: `main`
- Vercel Project: `sukoyaka-shokudo`
- Production Domain: `https://sukoyakashokudo.com`

`.env*`、`.vercel`、Vercelの認証情報、元画像、ビルド成果物はコミットしません。
