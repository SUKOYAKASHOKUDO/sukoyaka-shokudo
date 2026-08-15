import type { MetadataRoute } from "next";
import { columns, recipes, site } from "../content/siteContent";

export default function sitemap(): MetadataRoute.Sitemap {
  const publishedColumns = columns.filter(
    (column) => column.status === "published",
  );
  const publishedRecipes = recipes.filter(
    (recipe) => recipe.status === "published",
  );

  return [
    {
      url: site.url,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/about`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/partners`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/schedule`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/kids`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/team`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/support`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/columns`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...publishedColumns.map((column) => ({
      url: `${site.url}/columns/${column.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${site.url}/recipes`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...publishedRecipes.map((recipe) => ({
      url: `${site.url}/recipes/${recipe.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
