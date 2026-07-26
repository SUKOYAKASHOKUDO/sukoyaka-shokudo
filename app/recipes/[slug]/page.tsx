import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { recipes } from "../../../content/siteContent";

type RecipePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return recipes
    .filter((recipe) => recipe.status === "published")
    .map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = recipes.find(
    (item) => item.slug === slug && item.status === "published",
  );

  if (!recipe) {
    return {};
  }

  return {
    title: recipe.title,
    description: recipe.description,
    alternates: {
      canonical: `/recipes/${recipe.slug}`,
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = recipes.find(
    (item) => item.slug === slug && item.status === "published",
  );

  if (!recipe) {
    notFound();
  }

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main">
        <article className="article-page recipe-detail">
          <header className={`recipe-detail-header ${recipe.tone}`}>
            <div className="shell recipe-detail-grid">
              <div
                className={`recipe-illustration recipe-detail-symbol ${recipe.tone}`}
              >
                <span aria-hidden="true">{recipe.symbol}</span>
                <small>{recipe.time}</small>
              </div>
              <div>
                <nav aria-label="パンくずリスト" className="breadcrumb">
                  <Link href="/">ホーム</Link>
                  <span aria-hidden="true">／</span>
                  <Link href="/recipes">レシピ</Link>
                </nav>
                <p className="eyebrow">{recipe.label}</p>
                <h1>{recipe.title}</h1>
                <p>{recipe.description}</p>
                <span className="recipe-serving">{recipe.servings}</span>
              </div>
            </div>
          </header>

          <div className="shell recipe-detail-body">
            <section>
              <h2>材料</h2>
              <ul className="ingredient-list">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2>作り方</h2>
              <ol className="step-list">
                {recipe.steps.map((step, index) => (
                  <li key={step}>
                    <span aria-hidden="true">{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
            <aside className="recipe-notes" aria-label="調理前の注意">
              <p className="allergen-note">{recipe.allergenNote}</p>
              <p className="safety-note">{recipe.safetyNote}</p>
              <p>
                食物アレルギーがある場合は、使用するすべての商品の原材料表示を確認してください。
              </p>
            </aside>
            <Link className="text-link article-back" href="/recipes">
              ← レシピ一覧へ戻る
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
