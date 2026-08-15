# すこやか食堂 公式サイト

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
