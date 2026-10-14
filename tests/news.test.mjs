import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { newsPosts, getPublishedNewsPosts } from "../content/newsPosts.ts";
import { formatNewsDate } from "../lib/newsFormatting.ts";
import { paginateNews, NEWS_PER_PAGE } from "../lib/newsPagination.ts";

const hash = (content) => createHash("sha256").update(content).digest("hex");

test("initial article bodies match the supplied instructions, including whitespace", () => {
  assert.equal(hash(newsPosts.find((post) => post.slug === "website-renewal").body), "33d83d4c68a9cf152e66094cab646841ccaddd2e9c5c9feab0e472a317d22d13");
  assert.equal(hash(newsPosts.find((post) => post.slug === "aka-to-ao").body), "28b2ef6209cbc55d02f07ebb5988c9d756ebf74dadf47e138eb77a71fbb8662c");
  assert.equal(formatNewsDate("2026-10-15"), "2026年10月15日");
});

test("both supplied photos are kept byte-for-byte", () => {
  assert.equal(hash(readFileSync(new URL("../public/images/news/aka-to-ao-bookshelf.jpg", import.meta.url))), "7a196ca49f00d301396cf89e04188fdc7b853a75050915d25d414afc728e4e27");
  assert.equal(hash(readFileSync(new URL("../public/images/news/aka-to-ao-reading.jpg", import.meta.url))), "a15bdf5faf26e9b2ab29f894722c1b4c17079218a7d52a667ef4fda4b7118c8e");
});

test("drafts are excluded and later publications come first without mutating source data", () => {
  const posts = [
    { ...newsPosts[0], slug: "old", publishedAt: "2026-01-01" },
    { ...newsPosts[0], slug: "draft", status: "draft", publishedAt: "2026-12-01" },
    { ...newsPosts[1], slug: "new", publishedAt: "2026-10-15" },
  ];
  assert.deepEqual(getPublishedNewsPosts(posts).map((post) => post.slug), ["new", "old"]);
  assert.deepEqual(posts.map((post) => post.slug), ["old", "draft", "new"]);
});

test("fifty articles can be traversed without omission or repetition; invalid pages remain safe", () => {
  const posts = Array.from({ length: 50 }, (_, index) => index);
  const first = paginateNews(posts, "1");
  assert.equal(first.totalPages, 5);
  assert.equal(first.items.length, NEWS_PER_PAGE);
  const all = Array.from({ length: first.totalPages }, (_, index) => paginateNews(posts, String(index + 1)).items).flat();
  assert.deepEqual(all, posts);
  for (const value of [undefined, "0", "-1", "NaN", "2.5", "1e3"]) assert.equal(paginateNews(posts, value).page, 1);
  assert.equal(paginateNews(posts, "999").page, 5);
  assert.deepEqual(paginateNews([], "3"), { page: 1, totalPages: 1, items: [] });
});
