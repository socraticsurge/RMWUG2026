import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const html = await readFile(new URL("../.next-pages/index.html", import.meta.url), "utf8");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

test("server-renders the workshop operating system", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>RMWUG 2026/);
  assert.match(html, /Eighty defensible studies/);
  assert.match(html, /Workshop journey/);
  assert.match(html, /6 mock students/);
  assert.match(html, /docs\.google\.com\/forms\/d\/e\//);
  assert.doesNotMatch(html, /Facilitator control room|student001@placeholder\.invalid|Restore placeholders/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("ships the complete Markdown guidance kit and social card", async () => {
  const guideRoot = new URL("../public/guides/", import.meta.url);
  const files = (await readdir(guideRoot)).filter((file) => file.endsWith(".md")).sort();
  assert.equal(files.length, 14);
  assert.ok(files.includes("02_TOPIC_BANK_80_STUDIES.md"));
  assert.ok(files.includes("05_AI_AGENT_RESEARCH_PROTOCOL.md"));
  assert.ok(files.includes("08_LATEX_COMPILATION_SPEC.md"));
  assert.ok(files.includes("10_FACILITATOR_IMPLEMENTATION_GUIDE.md"));
  assert.ok(files.includes("12_WORKSHOP_OPERATIONS_AND_INCIDENT_PLAYBOOK.md"));
  assert.ok(files.includes("13_DRY_RUN_REHEARSAL.md"));

  const topics = await readFile(new URL("../app/data/topics.ts", import.meta.url), "utf8");
  for (const prefix of ["PV", "AP", "CR", "PM", "EM", "IA", "SR", "AD"]) {
    assert.match(topics, new RegExp(`code: "${prefix}"`));
  }
  const interfaceSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(interfaceSource, /RMWUG-AI-1\.0/);
  assert.match(interfaceSource, /jsonpLookup/);
  assert.match(interfaceSource, /script\.google\.com\/macros\/s\//);
  assert.match(interfaceSource, /Use the card issued to you/);
  assert.doesNotMatch(interfaceSource, /makePlaceholderRoster|localStorage|type View = .*facilitator/);
  const controlPlane = await readFile(new URL("../facilitator-apps-script/Code.gs", import.meta.url), "utf8");
  assert.match(controlPlane, /Only LOCKED assignments are returned to students/);
  assert.match(controlPlane, /maxFailedAttempts: 8/);
  await access(new URL("../public/og.png", import.meta.url));
});
