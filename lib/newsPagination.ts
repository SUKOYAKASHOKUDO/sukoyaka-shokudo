export const NEWS_PER_PAGE = 12;

export function paginateNews<T>(posts: readonly T[], pageInput?: string | string[]) {
  const totalPages = Math.max(1, Math.ceil(posts.length / NEWS_PER_PAGE));
  const value = Array.isArray(pageInput) ? pageInput[0] : pageInput;
  const requested = value && /^\d+$/.test(value) ? Number(value) : 1;
  const page = Number.isSafeInteger(requested) && requested > 0
    ? Math.min(requested, totalPages) : 1;
  return { page, totalPages, items: posts.slice((page - 1) * NEWS_PER_PAGE, page * NEWS_PER_PAGE) };
}
