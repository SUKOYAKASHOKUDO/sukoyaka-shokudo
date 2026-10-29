import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "../../components/PageIntro";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { recipes } from "../../content/siteContent";
import { paginateRecipes } from "../../lib/recipePagination";
import styles from "./recipes.module.css";

export const metadata: Metadata = {
  title: "親子で作るレシピ",
  description:
    "材料、手順、アレルゲン、安全上の注意を確認できる、親子向けのやさしいレシピです。",
  alternates: {
    canonical: "/recipes",
  },
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const publishedRecipes = recipes.filter(
    (recipe) => recipe.status === "published",
  );
  const { page, totalPages, items } = paginateRecipes(
    publishedRecipes,
    (await searchParams).page,
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
          <div
            id="recipe-note"
            className="shell recipe-editorial-frame"
            aria-label={`すこやかレシピノート 第${page}号`}
          >
            <div className="recipe-editorial-header" aria-hidden="true">
              <span>すこやかレシピノート</span>
              <small>VOL.{String(page).padStart(2, "0")}</small>
            </div>
            <div className="recipe-grid">
              {items.map((recipe) => (
                <article
                  className={`recipe-card ${recipe.tone}${recipe.slug === "ohagi" || recipe.slug === "scallop-takikomi-gohan" ? ` ${styles.uncroppedMascot}` : ""}`}
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
                        sizes="(max-width: 760px) calc(100vw - 80px), (max-width: 1200px) 42vw, 510px"
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
            {totalPages > 1 ? (
              <nav className={styles.pagination} aria-label="レシピノートのページ切り替え">
                {page > 1 ? (
                  <Link href={page === 2 ? "/recipes#recipe-note" : `/recipes?page=${page - 1}#recipe-note`} rel="prev">
                    ← 前のページ
                  </Link>
                ) : null}
                <span aria-current="page">{page} / {totalPages}</span>
                {page < totalPages ? (
                  <Link href={`/recipes?page=${page + 1}#recipe-note`} rel="next">
                    次のページ →
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
