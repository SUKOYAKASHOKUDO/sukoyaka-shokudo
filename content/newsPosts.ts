export type NewsPost = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  publishedAt: string;
  author?: string;
  coverImage?: string;
  coverImageAlt?: string;
  body: string;
  additionalImages: { src: string; alt: string; afterParagraph: number }[];
  status: "draft" | "published";
};

export const newsPosts: NewsPost[] = [
  {
    "slug": "website-renewal",
    "title": "すこやか食堂のホームページを新しく公開しました。",
    "category": "お知らせ",
    "summary": "すこやか食堂のホームページを新しく公開しました。日々の活動や温かいご支援をお伝えしていきます。",
    "publishedAt": "2026-10-15",
    "author": "林 祐樹",
    "body": "最近、すこやか食堂のホームページを新しく公開しました。\n\nこんにちは。すこやか食堂の活動を、裏方からお手伝いしている林 祐樹です。\n\n普段は主にホームページの制作などを担当しており、表に出ることはほぼありません。\n\n私自身に子どもはいませんが、子どもたちが安心して過ごし、地域の人々と自然につながれる居場所をつくりたいという代表の思いに共感し、私も微力ながら活動に携わっています。\n\nこのホームページを通じて、食堂の日々の様子や、地域の皆さまからいただいた温かいご支援、ちょっとした出来事などもお伝えしていければと思っています。\n\nこれからも、表には見えないところから、すこやか食堂を支えていければと思っています。\n\nどうぞよろしくお願いいたします。\n\n**すこやか食堂 ボランティア**  \n**林 祐樹**",
    "additionalImages": [],
    "status": "published"
  },
  {
    "slug": "aka-to-ao",
    "title": "📚 絵本『アカとアオ』をいただきました",
    "category": "ご寄付・ご支援",
    "summary": "絵本『アカとアオ』をお送りいただきました。本棚での展示と、一緒に絵本を読んだ様子をご紹介します。",
    "publishedAt": "2026-10-15",
    "coverImage": "/images/news/aka-to-ao-bookshelf.jpg",
    "coverImageAlt": "棚に飾られた絵本『アカとアオ』とドライフラワー",
    "body": "# 📚 絵本『アカとアオ』をいただきました\n\nこのたび、Webコンサルタントの山和さん（Xhttps://x.com/yama7713）からのご紹介で、\n絵本『アカとアオ』の著者、出石 卓（いずし たく）さんから絵本をお送りいただきました。\n\n先日、すこやか食堂の本棚に飾らせていただきました。\n\n『アカとアオ』は、人間と友達になりたいサルの兄弟を描いた物語です。\n\n物をあげるだけでなく、相手の気持ちを考えて行動することの大切さや、本当の友情とは何かを考えさせてくれる絵本です。\n\nまた、同じくボランティア活動をしている飯田さんの娘さんと、一緒に絵本を読ませていただきました。\n\nご紹介くださった山和さん、絵本をお送りくださった出石さん、ありがとうございました。\n\nすこやか食堂にお越しの際は、ぜひ手に取って読んでみてください。\n\n📖 絵本『アカとアオ』のWebサイト\n\n公式サイトでは、物語を読んだり聴いたりできるほか、登場人物との会話や英語学習なども楽しめます。\n\nhttps://storybloom-talkgrow.lovable.app/",
    "additionalImages": [
      {
        "src": "/images/news/aka-to-ao-bookshelf.jpg",
        "alt": "棚に飾られた絵本『アカとアオ』とドライフラワー",
        "afterParagraph": 1
      },
      {
        "src": "/images/news/aka-to-ao-reading.jpg",
        "alt": "テーブルで絵本を開いて読み聞かせをしている様子",
        "afterParagraph": 4
      }
    ],
    "status": "published"
  }
];

export function getPublishedNewsPosts(posts: readonly NewsPost[] = newsPosts): NewsPost[] {
  return posts.filter((post) => post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
