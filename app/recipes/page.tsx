import type { Metadata } from "next";
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
          description="材料と手順に加えて、アレルゲンと調理時の安全注意を確認できます。お子さんが作るときは、必ず大人が付き添ってください。"
        />
        <section className="section listing-section">
          <div className="shell recipe-grid">
            {publishedRecipes.map((recipe) => (
              <article className="recipe-card" key={recipe.slug}>
                <div className={`recipe-illustration ${recipe.tone}`}>
                  <span aria-hidden="true">{recipe.symbol}</span>
                  <small>{recipe.time}</small>
                </div>
                <div className="recipe-body">
                  <p>{recipe.label}</p>
                  <h2>{recipe.title}</h2>
                  <p>{recipe.description}</p>
                  <p className="recipe-serving">{recipe.servings}</p>
                  <Link
                    className="text-link recipe-link"
                    href={`/recipes/${recipe.slug}`}
                  >
                    材料と作り方を見る →
                  </Link>
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
