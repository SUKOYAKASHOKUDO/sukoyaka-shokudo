export type PublicationStatus = "draft" | "published";

export const site = {
  name: "すこやか食堂",
  subtitle: "札幌の子ども食堂",
  url: "https://sukoyaka-shokudo.com",
  operator: "ミレポリト合同会社",
  address:
    "〒064-0809 北海道札幌市中央区南9条西8丁目1-26 オリンピア南9条 1階",
  shortAddress: "札幌市中央区南9条西8丁目1-26 オリンピア南9条 1階",
  email: "sukoyakashokudo@gmail.com",
  phone: "080-8216-7040",
  phoneHref: "tel:+818082167040",
  instagram: "https://www.instagram.com/mi_repollito/",
  line: "https://line.me/R/ti/p/%40424ryewz",
  youtube: "https://www.youtube.com/watch?v=eZLZiTmpS3s",
  oldWebsite: "https://sukoyakegao.wixstudio.com/kidsdining-sukoyaka",
  map: "https://www.google.com/maps/search/?api=1&query=%E3%81%99%E3%81%93%E3%82%84%E3%81%8B%E9%A3%9F%E5%A0%82+%E6%9C%AD%E5%B9%8C%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8D%979%E6%9D%A1%E8%A5%BF8%E4%B8%81%E7%9B%AE1-26",
  informationNote:
    "開催日時・料金・支援方法は変更される場合があります。最新情報は公式Instagramをご確認ください。",
  sourceCheckedAt: "2026年7月26日（旧公式サイトを確認）",
};

export const navigation = [
  { href: "/about", label: "すこやか食堂について" },
  { href: "/schedule", label: "日程とメニュー" },
  { href: "/team", label: "私たち・ボランティア" },
  { href: "/support", label: "ご支援" },
  { href: "/columns", label: "活動記録" },
  { href: "/recipes", label: "レシピ・食育" },
  { href: "/#access", label: "アクセス" },
];

export const homePage = {
  hero: {
    eyebrow: "SAPPORO COMMUNITY KITCHEN",
    headingLine1: "みんなで囲む",
    headingLine2: "ごはんが、",
    headingAccent: "すこやか",
    headingAfter: "なまちを",
    headingClosing: "つくる。",
    lead:
      "管理栄養士が考えるあたたかな食事と、世代をこえたつながりを。子どもも大人も、気軽に立ち寄れる地域の食卓です。",
    primaryCta: "開催案内を見る",
    secondaryCta: "企業・団体のご支援",
    handNote: "今日も、いっしょに食べよう。",
    quickFacts: [
      {
        value: "中学生以下 無料",
        label: "旧公式サイト掲載",
      },
      {
        value: "大人 1食500円",
        label: "旧公式サイト掲載",
      },
      {
        value: "管理栄養士",
        label: "メニューを検討",
      },
    ],
  },
  announcement: {
    label: "大切なお知らせ",
    text: site.informationNote,
    linkLabel: "Instagramを見る",
  },
  about: {
    eyebrow: "ABOUT US",
    title: "「今日は頼ってもいい」と思える場所へ",
    description:
      "ごはんは、毎日の元気のもと。すこやか食堂は、食事をきっかけに子ども・保護者・地域の人が顔見知りになれる、明るい居場所を目指しています。",
    values: [
      {
        number: "01",
        title: "おいしく、楽しく",
        description:
          "管理栄養士とスタッフが、子どもたちに喜んでもらえる食事を考えます。",
        tone: "yellow",
      },
      {
        number: "02",
        title: "地域とつながる",
        description:
          "子どもから大人まで、誰かと一緒に食卓を囲める地域の交流拠点です。",
        tone: "mint",
      },
      {
        number: "03",
        title: "親御さんにも休息を",
        description:
          "忙しい日には少し肩の力を抜いて、自分の時間も大切にしてほしいと考えています。",
        tone: "coral",
      },
    ],
  },
  schedule: {
    eyebrow: "NEXT TABLE",
    title: "開催案内",
    description:
      "旧公式サイトでは不定期開催と案内されています。ご来場前に公式Instagramの最新投稿をご確認ください。",
    status: "最新日程はInstagramでご案内",
    details: [
      { label: "対象", value: "子ども・保護者・地域の皆さま" },
      {
        label: "料金",
        value: "旧公式サイト掲載：中学生以下 無料／大人 1食500円",
      },
      { label: "場所", value: site.shortAddress },
    ],
    cta: "最新の開催情報を確認",
    note:
      "旧公式サイトでは、アレルギー対応はしていないと案内されています。",
    photoNote: "こののぼりが目印です",
  },
  movie: {
    eyebrow: "MOVIE",
    title: "動画で見る、すこやか食堂",
    description:
      "活動の空気感や、食を通じた地域とのつながりを動画でご覧いただけます。",
  },
  support: {
    eyebrow: "PARTNERS",
    title: "一緒に、地域の食卓を支えてください",
    description:
      "すこやか食堂は、企業・団体・地域の皆さまからの食材提供、ボランティア、寄付に支えられています。",
    cta: "支援について相談する",
    sponsorEyebrow: "THANK YOU",
    sponsorTitle: "ご支援いただいた企業・団体・皆さま",
    sponsorDescription: "ご支援としていただいた物資をご紹介します。",
    sponsorPolicy:
      "企業・団体名と支援内容は運営者から提供された掲載情報です。支援額や品数による順位付けは行いません。",
  },
  columns: {
    eyebrow: "SUKOYAKA COLUMN",
    title: "親子で読める、すこやかコラム",
    description:
      "食事、子育て、地域のこと。親御さん向け・お子さん向け・地域向けに、読みやすく発信します。",
    emptyText: "現在、公開準備中です。新しい記事を順次追加します。",
  },
  recipes: {
    eyebrow: "RECIPES",
    title: "おうちで作る、やさしいレシピ",
    description:
      "親子で挑戦しやすい料理を紹介します。火や刃物を使う工程は必ず大人と一緒に行ってください。",
    emptyText: "現在、公開準備中です。新しいレシピを順次追加します。",
  },
  faq: {
    eyebrow: "FAQ",
    title: "よくあるご質問",
    description:
      "掲載内容だけで判断できない場合は、公式Instagramからお問い合わせください。",
  },
  access: {
    eyebrow: "ACCESS",
    title: "すこやか食堂へのアクセス",
    note: "ご来場前に開催情報をご確認ください。経路は地図で確認できます。",
    mapCta: "地図を開く",
  },
};

export const youtubeVideos = [
  {
    id: "eZLZiTmpS3s",
    category: "すこやか食堂の活動",
    title: "動画で知る、すこやか食堂",
  },
];

export const storyPage = {
  title: "すこやか食堂を知る",
  description:
    "代表インタビューと活動紹介を通じて、すこやか食堂の始まりや大切にしている想いをご紹介します。",
  interview: {
    eyebrow: "INTERVIEW",
    title: "運営者インタビュー",
    status: "取材原稿準備中",
    notice:
      "インタビュー本文は、取材と内容確認の完了後に掲載します。人物名・肩書き・発言は、確認できる原稿が届くまで掲載しません。",
  },
  movie: {
    eyebrow: "MOVIE",
    title: "動画で知る、すこやか食堂",
    description:
      "活動の空気感や、食を通じた地域とのつながりをご覧いただけます。",
  },
} as const;

export const supportMethods = [
  {
    symbol: "🌱",
    title: "寄付金による支援",
    description:
      "食材・会場・運営に必要な費用に活用します。お振込前に最新の活動状況と口座情報をご確認ください。",
  },
  {
    symbol: "🥕",
    title: "食材や物品の提供",
    description:
      "食材、調味料、加工品、備品など。保管条件や賞味期限を確認して個別にご相談します。",
  },
  {
    symbol: "🤝",
    title: "協賛など、そのほかの支援方法",
    description:
      "調理補助、配膳、片付け、広報などのボランティアや協賛について、内容と日程を個別にご相談します。",
  },
];

export type Sponsor = {
  name: string;
  url?: string;
  summary?: string;
  support: string;
  message?: string;
  supportPeriod?: string;
  logo?: string;
};

// 運営者から掲載許可を得た企業・団体・支援者のみ追加してください。
const sponsorSortKey = (name: string) =>
  name
    .replace(/^(株式会社|合同会社|有限会社|\(有\)|（有）)/, "")
    .replace(/様$/, "")
    .trim();

const sponsorNameCollator = new Intl.Collator("ja", {
  numeric: true,
  sensitivity: "base",
});

const sponsorEntries: Sponsor[] = [
  { name: "(有)日本マスターリンク社様", support: "お米、卵" },
  { name: "株式会社明治様", support: "チョコレート、グミなど" },
  { name: "きちのせ(株)様", support: "食器" },
  { name: "株式会社INNOVEGG様", support: "枝幸産の毛蟹" },
  { name: "株式会社ダスキン中嶋様", support: "お掃除用品" },
  { name: "株式会社かめはたリカーズ様", support: "飲料" },
  { name: "株式会社YOKI 代表取締役佐藤様", support: "飲料" },
  { name: "合同会社ＫＥＬ高橋様", support: "中華おこわ" },
  { name: "一家水産様", support: "厚岸産のあさり" },
  { name: "株式会社エフエー天内様", support: "野菜や果物、お米" },
  { name: "サリーズカップケーキ様", support: "カップケーキ" },
  { name: "株式会社TASKAL様", support: "野菜とお肉とヨーグルト" },
  { name: "キープグループ小林様", support: "お米" },
  { name: "株式会社ホームエージェント 中川様", support: "お米" },
  { name: "土屋様", support: "鶏肉と調味料" },
  { name: "株式会社pit様", support: "お米" },
  { name: "One's Own Master様", support: "飲料" },
  { name: "株式会社札幌春木商店様", support: "海鮮と絵本" },
  { name: "株式会社さがみ屋様", support: "ラーメンの麺" },
  { name: "株式会社亀井精肉店様", support: "お肉やハム" },
  { name: "MarcheJapan株式会社様", support: "クリームシチュー" },
];

export const sponsors = sponsorEntries.sort((a, b) =>
  sponsorNameCollator.compare(sponsorSortKey(a.name), sponsorSortKey(b.name)),
);

export type CommunityPartner = {
  name: string;
  summary: string;
  url: string;
  logo?: string;
  supportLabel?: string;
};

// 会社情報・ロゴ・URLの掲載許可を確認できた企業のみ追加してください。
export const communityPartners: CommunityPartner[] = [];

export const supportBankAccount = {
  bankName: "北海道銀行",
  branchName: "薄野支店",
  branchNumber: "109",
  accountType: "普通",
  accountNumber: "0866973",
  accountName: "ミレポリト合同会社",
};

export type ColumnArticle = {
  slug: string;
  audience: "親御さん向け" | "お子さん向け" | "地域の皆さん向け";
  readingTime: string;
  title: string;
  summary: string;
  tone: "parent" | "kids" | "community";
  status: PublicationStatus;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
};

export const columns: ColumnArticle[] = [
  {
    slug: "a-day-to-rely-on-others",
    audience: "親御さん向け",
    readingTime: "約3分",
    title: "「今日は頼る日」で大丈夫",
    summary:
      "忙しい毎日の食事づくり。地域の食卓を上手に頼りながら、親子の時間を整えるヒントをお届けします。",
    tone: "parent",
    status: "published",
    sections: [
      {
        heading: "毎日のごはんを、一人で抱え込まないために",
        paragraphs: [
          "食事を用意することは、献立を考え、買い物をし、調理して片付けるところまで続く大きな仕事です。忙しい日や疲れた日に、すべてを完璧にできないのは自然なことです。",
          "子ども食堂のような地域の食卓は、ごはんを食べるだけでなく、親子が地域の人と顔を合わせ、少し気持ちをゆるめられる場所でもあります。",
        ],
      },
      {
        heading: "出かける前に、最新の開催案内を確認",
        paragraphs: [
          "開催日や利用方法は変わることがあります。すこやか食堂へお越しになる前に、公式Instagramの最新投稿をご確認ください。",
          "食物アレルギーへの対応可否や、小さなお子さんと参加する場合の相談事項も、開催ごとの事前確認をお願いします。",
        ],
      },
      {
        heading: "頼ることも、家族を大切にする選択です",
        paragraphs: [
          "地域の食卓を利用することは、特別なことではありません。「今日は地域の人と一緒に食べよう」と選べる場所があることも、親子の日常を支える一つの方法です。",
        ],
      },
    ],
  },
  {
    slug: "discover-the-colors-of-vegetables",
    audience: "お子さん向け",
    readingTime: "約2分",
    title: "野菜の色にはひみつがある？",
    summary:
      "赤・黄・緑の野菜を見つけてみよう。食べものをもっと楽しく知る、やさしい食育コラムです。",
    tone: "kids",
    status: "draft",
    sections: [],
  },
  {
    slug: "from-donation-to-the-table",
    audience: "地域の皆さん向け",
    readingTime: "約4分",
    title: "食材の寄付が一皿になるまで",
    summary:
      "お預かりした食材を確認し、メニューを考え、食卓に届けるまで。活動の裏側を紹介します。",
    tone: "community",
    status: "draft",
    sections: [],
  },
];

export type Recipe = {
  slug: string;
  label: string;
  title: string;
  description: string;
  symbol: string;
  time: string;
  servings: string;
  tone: "egg" | "scone";
  ingredients: string[];
  steps: string[];
  allergenNote: string;
  safetyNote: string;
  status: PublicationStatus;
};

export const recipes: Recipe[] = [
  {
    slug: "fluffy-tamagoyaki",
    label: "親子でまぜまぜ",
    title: "ふんわり卵焼き",
    description:
      "だしの香りとやさしい甘さ。朝ごはんやお弁当にも使いやすい定番です。",
    symbol: "🍳",
    time: "約15分",
    servings: "作りやすい分量",
    tone: "egg",
    ingredients: [
      "卵 3個",
      "だし汁 大さじ2",
      "砂糖 小さじ1",
      "しょうゆ 小さじ1/2",
      "油 少量",
    ],
    steps: [
      "卵と調味料をボウルでよく混ぜます。",
      "油を薄くひいたフライパンに卵液を数回に分けて流します。",
      "半熟のうちに巻き、形を整えて食べやすく切ります。",
    ],
    allergenNote:
      "アレルゲン：卵・大豆。使用する調味料を含め、各商品の表示を確認してください。",
    safetyNote:
      "加熱調理と包丁を使う工程は、必ず大人が行うか付き添ってください。",
    status: "published",
  },
  {
    slug: "chocolate-scones",
    label: "おやつ時間に",
    title: "チョコごろごろスコーン",
    description:
      "材料をさっくり混ぜて焼くだけ。親子で形をつくる工程も楽しめます。",
    symbol: "🍪",
    time: "約30分",
    servings: "6個分の目安",
    tone: "scone",
    ingredients: [
      "ホットケーキミックス 200g",
      "無塩バター 50g",
      "牛乳 50ml",
      "板チョコレート 1枚",
    ],
    steps: [
      "バターを小さく切り、粉とすり合わせるように混ぜます。",
      "牛乳と割ったチョコレートを加え、ひとまとめにします。",
      "食べやすい大きさに分け、180℃に予熱したオーブンで約15分焼きます。",
    ],
    allergenNote:
      "アレルゲン：小麦・乳・大豆。商品により卵等を含む場合があるため、各商品の表示を確認してください。",
    safetyNote:
      "オーブン、包丁、熱い天板は、必ず大人が扱ってください。",
    status: "published",
  },
];
