import Image from "next/image";

const imageBase = "/images/press/zaikai-sapporo-2026-07";

export function ZaikaiSapporoArticle() {
  return (
    <section className="zaikai-reprint-section">
      <div className="shell">
        <article className="zaikai-reprint">
          <header className="zaikai-reprint__header">
            <h2>ミレポリト</h2>
            <time dateTime="2026-07">2026年07月取材</time>
          </header>

          <figure className="zaikai-reprint__lead-photo">
            <div className="zaikai-reprint__image">
              <Image
                src={`${imageBase}/01-cooking-class.jpg`}
                alt=""
                fill
                sizes="(max-width: 900px) 92vw, 900px"
              />
            </div>
            <figcaption>月２回の頻度で「食育ランチクッキング」を開催</figcaption>
          </figure>

          <div className="zaikai-reprint__body">
            <h3>食を通じて子どもたちが集まる子ども食堂を運営</h3>
            <p>
              　中島公園近くで子ども食堂を運営する「ミレポリト」。南真白代表は長らくススキノの飲食業界で活躍し、現在は「クラブ燭台」などを運営している。
            </p>
            <p>
              　南代表は全国で貧困家庭が増えていることを知り、２０２３年５月に子ども食堂の「すこやか食堂」を開設した。
            </p>
            <p>
              「週２回程度開店し、１回につき小学校低学年から高校生の約50人が利用しています」と南代表。特徴的なのは、食事を提供するだけではなく〝食を通じて子どもたちが集まる場所〟になっていることだ。
            </p>
            <p>
              「子どもを預かるわけではありませんが、体験型の行事なども行っており、どちらかというと児童館に近い施設です。企業主導型保育園がありますが〝企業主導型子ども食堂〟と言えばイメージしやすいかと思います」（南代表）
            </p>
            <p>
              　このスタイルを支えているのが豊富な人脈。「子どもや地域への支援をしたい」「フードロスに貢献したい」という企業経営者などからの支援物資や食材の提供を受けるほか、各種公演のチケットや観覧、工作、食育に関わるイベントの共同開催の要望なども舞い込む。
            </p>
            <p>
              　例えば、子どもたち自らが料理を体験できる「食育ランチクッキング」も月２回行っている。ラーメン専門店がラーメン教室を開いたり、蕎麦専門店が蕎麦打ち体験教室を開催。普通の一般的な子ども食堂ではできない体験ができるのも同施設ならではと言えよう。
            </p>
            <p>
              　また、子ども同士でルールを共有したり、マナーや礼儀を学ぶ場にもなっている。「家でもない」「学校でもない」ひとつの社会を形成し、子ども同士で教えながら成長する姿も見られる。
            </p>
            <p>
              「子ども食堂は格差社会が生み出したもの。政治や行政が解決できれば子ども食堂はなくてもいい存在です。ただ、救いが必要な親御さんや子どもがいるのも現実。当施設は『楽しいからみんなで行こう』と思ってもらえる場所を目指しています。子どもたちには、小さな食堂で大きな善意を受けながら、大人になってもらいたいです」と南代表。
            </p>
          </div>

          <div className="zaikai-reprint__gallery">
            <figure>
              <div className="zaikai-reprint__image">
                <Image
                  src={`${imageBase}/02-article-photo.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 92vw, 440px"
                />
              </div>
            </figure>
            <figure>
              <div className="zaikai-reprint__image">
                <Image
                  src={`${imageBase}/03-meal.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 92vw, 440px"
                />
              </div>
              <figcaption>通常の子ども食堂とは一線を画す食事を提供</figcaption>
            </figure>
            <figure className="zaikai-reprint__portrait">
              <div className="zaikai-reprint__image">
                <Image
                  src={`${imageBase}/04-mashiro-minami.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 72vw, 320px"
                />
              </div>
              <figcaption>南真白代表</figcaption>
            </figure>
            <figure>
              <div className="zaikai-reprint__image">
                <Image
                  src={`${imageBase}/05-building.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 92vw, 440px"
                />
              </div>
              <figcaption>札幌市中央区にある施設外観</figcaption>
            </figure>
          </div>

          <aside className="zaikai-reprint__company">
            <h3>会社情報</h3>
            <div className="zaikai-reprint__table-wrap">
              <table>
                <tbody>
                  <tr>
                    <th scope="row">企業名</th>
                    <td>ミレポリト</td>
                  </tr>
                  <tr>
                    <th scope="row">住所</th>
                    <td>札幌市中央区南9条西8丁目1-26</td>
                  </tr>
                  <tr>
                    <th scope="row">TEL</th>
                    <td>080-8261-7040</td>
                  </tr>
                  <tr>
                    <th scope="row">企業URL</th>
                    <td>https://sukoyakegao.wixstudio.com/kidsdining-sukoy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside>
        </article>
      </div>
    </section>
  );
}
