import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { homeFlowDiagnostics } from "../lib/homeFlowDiagnostics.ts";

function environment(pathname = "/", search = "?home-debug=1") {
  const listeners = new Map();
  const listen = (event, callback) => {
    const callbacks = listeners.get(event) ?? [];
    callbacks.push(callback);
    listeners.set(event, callbacks);
  };
  const element = Object.freeze({ scrollTop: 0, scrollLeft: 0, scrollHeight: 2000, clientHeight: 900,
    getBoundingClientRect: () => ({ top: 0, bottom: 900, left: 0, width: 390, height: 900 }) });
  const viewport = Object.freeze({ offsetTop: 0, offsetLeft: 0, pageTop: 0, width: 390, height: 900, scale: 1, addEventListener: listen });
  const window = { scrollY: 0, visualViewport: viewport, addEventListener: listen };
  const sandbox = { window, location: { pathname, search }, URLSearchParams, navigator: { userAgent: "test browser" },
    history: Object.freeze({ scrollRestoration: "auto" }), innerWidth: 390, innerHeight: 900,
    performance: { now: () => 1 }, requestAnimationFrame: callback => callback(),
    document: { readyState: "loading", scrollingElement: { tagName: "HTML", scrollTop: 0 }, querySelector: () => element, addEventListener: listen },
    getComputedStyle: () => ({ position: "static", transform: "none", overflowX: "visible", overflowY: "visible" }) };
  vm.runInNewContext(homeFlowDiagnostics, sandbox);
  return { window, listeners, sandbox };
}

test("homepage diagnostics are opt-in and leave other routes alone", () => {
  assert.equal(environment("/", "").window.__sukoyakaHomeFlow, undefined);
  assert.equal(environment("/schedule").window.__sukoyakaHomeFlow, undefined);
});

test("diagnostics observe layout and events without scroll, prototype, or network APIs", () => {
  const { window, listeners, sandbox } = environment();
  const d = window.__sukoyakaHomeFlow;
  assert.equal(d.entries[0].event, "head");
  assert.equal(d.entries[0].scrollY, 0);
  assert.equal(d.entries[0].header.transform, "none");
  for (const callback of listeners.get("pageshow")) callback({ persisted: true });
  assert.ok(d.entries.some(entry => entry.event === "pageshow:frame2"));
  assert.equal(sandbox.history.scrollRestoration, "auto");
  assert.equal(window.scrollY, 0);
  assert.equal("fetch" in sandbox, false);
  assert.equal("scrollTo" in window, false);
});

test("a long diagnostic session has bounded local storage", () => {
  const { window } = environment();
  for (let i = 0; i < 1000; i++) window.__sukoyakaHomeFlow.capture("scroll");
  assert.equal(window.__sukoyakaHomeFlow.entries.length, 150);
});
