import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "../../components/PageIntro";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { recipes } from "../../content/siteContent";

export const metadata: Metadata = {
  title: "親子で作るレシピ",
  description:
    "材料、手順、アレルゲン、安全上の注意を確認できる、親子向けのやさしいレシピです。",
  alternates: {
    canonical: "/recipes",
  },
};

export default function RecipesPage() {
  const publishedRecipes = recipes.filter(
    (recipe) => recipe.status === "published",
  );

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <SiteHeader />
      <main id="main">
        <PageIntro
          eyebrow="RECIPES"
          title="親子で作るレシピ"
          description="親子で一緒に作れる、やさしくておいしいレシピを集めました。材料と手順、安全上の注意も分かりやすくご覧いただけます。"
        />
        <section className="section listing-section">
          <div className="shell recipe-grid">
            {publishedRecipes.map((recipe) => (
              <article
                className={`recipe-card ${recipe.tone}`}
                key={recipe.slug}
              >
                <div className="recipe-card-visual">
                  <Link
                    className="recipe-sheet-link"
                    href={`/recipes/${recipe.slug}`}
                    aria-label={`${recipe.title}の材料と作り方を見る`}
                  >
                    <Image
                      className="recipe-sheet-image"
                      src={recipe.cardImage}
                      alt={recipe.cardImageAlt}
                      width={1400}
                      height={990}
                      sizes="(max-width: 760px) calc(100vw - 56px), (max-width: 1200px) 46vw, 560px"
                      loading="eager"
                    />
                  </Link>
                  {recipe.mascotImage ? (
                    <Image
                      className="recipe-card-mascot"
                      src={recipe.mascotImage}
                      alt=""
                      width={210}
                      height={140}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="recipe-time">{recipe.time}</span>
                </div>
                <div className="recipe-body">
                  <p className="recipe-kicker">{recipe.label}</p>
                  <h2>{recipe.title}</h2>
                  <p>{recipe.description}</p>
                  <p className="recipe-serving">{recipe.servings}</p>
                  <div className="recipe-card-actions">
                    <Link
                      className="button button-small recipe-link"
                      href={`/recipes/${recipe.slug}`}
                    >
                      材料と作り方を見る
                    </Link>
                    <a
                      className="text-link recipe-sheet-download"
                      href={recipe.recipeSheetUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      A4レシピを見る →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
