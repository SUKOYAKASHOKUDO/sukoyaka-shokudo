# 新トップページの実機確認と公開条件

この実装は `codex/home-document-flow-rebuild-20261017` の検証候補です。
**Google PixelのYahoo! JAPANアプリ内ブラウザでの実機確認と、利用者の明示的な本番反映承認が済むまで、mainへ反映・Productionへ公開しないでください。**

## 構成

- `app/page.tsx`: 新しい `HomePage` の入口。
- `components/home/`: 専用ヘッダー、元素材のSVG表示、文書フロー上のヒーローとメニュー、本文、専用CSS。
- `components/HomeNews.tsx` と `SiteFooter.tsx`: 表示・素材・機能を維持する既存の共有部品。NEWSのデコード完了待ちも維持。
- `components/RouteScrollReset.tsx`: ホームへの強制スクロールをしない。他ページの既存のスクロールリセットは維持。
- `app/layout.tsx`: ホームはブラウザ標準のスクロール復元、他ページは従来のmanual。メタデータ・viewport設定は維持。
- `lib/homeFlowDiagnostics.ts`: Previewとローカルで `/?home-debug=1` を開いたときだけ有効な読み取り専用診断。自動送信・スクロール補正・プロトタイプの置換はしない。

グローバルCSS、旧ヘッダー・旧ヒーロー、記事・データ・画像・動画・ロゴ・フォント・リンク先・料金・問い合わせ先は変更しない方針です。専用CSSのhtml/body指定は、新トップのマーカーがある文書だけに適用されます。

元画像を加工せず、SVGのviewBoxで必要な表示範囲を指定しています。画像に重ねるリンク・装飾以外は通常の文書フローです。ヒーロー全体を負のtransformで移動するcanvasや、内部スクロール可能なhiddenの表示枠を使いません。

## 検証コマンド

```powershell
npm.cmd run typecheck
node --test tests/home-flow.test.mjs tests/news.test.mjs tests/news-images.test.mjs
npm.cmd run build
npm.cmd run start
```

Lintコマンドは既存package.jsonにありません。依存関係・Next設定は変更していません。

## 実機確認

実際の共有プレビューURLをGoogle PixelのYahoo! JAPANアプリから開き、次を確認してください。PCでのモバイルエミュレーションやYahoo風のUser-Agentだけでは実機合格とはしません。

1. 初回アクセスでロゴ・HOME・私たちについて・お問い合わせとヒーロー上部が欠けない。
2. アプリを完全終了して再度開いても欠けない。
3. 上端で再読み込みしても欠けない。
4. メニューから日程等へ進み、トップへ戻ったときも正常。
5. 戻る／進む、上下スクロール、TOPボタン、FAQ、NEWSカードが正常。

問題があれば、同じPreviewの `/?home-debug=1` で「表示記録をコピー」を使います。URLの共有用認証パラメータは維持してください。診断パネルがレイアウトを直す処理はありません。

## 公開と復旧

開始時の本番コミットは `120a8dc9ea1b4a540b81c8592697fe406fbfdfa3`。コード・public素材を含む全追跡ファイルのZIPと、未コミット変更の保護は作業用バックアップに保存しています。

バックアップブランチは `codex/backup-home-before-rebuild-20261017`。確認・承認後のみ、最新mainとの差分を再確認し、既存GitHub main → Vercelの正式な連携で公開します。

公開後に重大な問題があれば、Vercelの公開前デプロイへRollbackします。Gitの履歴は最新mainから今回の変更だけをrevertして合わせます。他の変更を消すresetやforce pushは使用しません。
