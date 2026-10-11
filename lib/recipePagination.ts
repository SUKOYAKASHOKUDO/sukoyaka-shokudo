export const RECIPES_PER_PAGE = 6;

/** Keep a notebook page to six recipes, including when more are published. */
export function paginateRecipes<T>(
  recipes: readonly T[],
  pageInput?: string | string[],
) {
  const totalPages = Math.max(1, Math.ceil(recipes.length / RECIPES_PER_PAGE));
  const requestedPage = Number(Array.isArray(pageInput) ? pageInput[0] : pageInput);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1;

  return {
    page,
    totalPages,
    items: recipes.slice((page - 1) * RECIPES_PER_PAGE, page * RECIPES_PER_PAGE),
  };
}
