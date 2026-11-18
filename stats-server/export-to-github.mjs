// Schreibt die Tagessummen als CSV in ein PRIVATES GitHub-Repository,
// aus dem das Claude-Dashboard täglich liest. Node.js >= 18, keine Pakete.
// Einmal täglich per cron ausführen (siehe README.md).
//
// Umgebungsvariablen:
//   STATS_URL     (Standard http://127.0.0.1:8787)
//   EXPORT_TOKEN  (wie beim Server)
//   GITHUB_TOKEN  (Fine-grained Token, nur «Contents: Read and write» für das Statistik-Repo)
//   GITHUB_REPO   (z. B. paulgeorg94-oss/dermetrics-stats — muss privat sein)
//   DAYS          (Standard 400)

const STATS_URL = process.env.STATS_URL || "http://127.0.0.1:8787";
const { EXPORT_TOKEN, GITHUB_TOKEN, GITHUB_REPO } = process.env;
const DAYS = Number(process.env.DAYS || 400);
if (!EXPORT_TOKEN || !GITHUB_TOKEN || !GITHUB_REPO) {
  console.error("EXPORT_TOKEN, GITHUB_TOKEN und GITHUB_REPO setzen.");
  process.exit(1);
}

const from = new Date(Date.now() - DAYS * 864e5).toISOString().slice(0, 10);
const r = await fetch(`${STATS_URL}/export?from=${from}`, { headers: { Authorization: `Bearer ${EXPORT_TOKEN}` } });
if (!r.ok) { console.error("Export fehlgeschlagen:", r.status); process.exit(1); }
const data = await r.json();

const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (rows, cols) => [cols.join(","), ...rows.map((row) => cols.map((c) => esc(row[c])).join(","))].join("\n") + "\n";

const files = {
  "daily.csv": toCsv(data.daily, ["date", "pageviews", "visitors", "whatsapp", "telefon", "email", "zuweiser", "google_profil", "buchung"]),
  "pages.csv": toCsv(data.pages, ["date", "page", "views"]),
  "sources.csv": toCsv(data.sources, ["date", "source", "views"]),
  "campaigns.csv": toCsv(data.campaigns, ["date", "source", "medium", "campaign", "views"]),
  "devices.csv": toCsv(data.devices, ["date", "device", "views"]),
  "events.csv": toCsv(data.events, ["date", "event", "target", "page", "count"]),
};

const api = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;
const headers = { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "dermetrics-stats" };

const meta = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, { headers });
if (!meta.ok) { console.error("Repo nicht erreichbar:", meta.status); process.exit(1); }
if (!(await meta.json()).private) { console.error("Abbruch: Das Statistik-Repo ist nicht privat."); process.exit(1); }

for (const [name, content] of Object.entries(files)) {
  const cur = await fetch(api + name, { headers });
  const sha = cur.ok ? (await cur.json()).sha : undefined;
  const put = await fetch(api + name, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `Statistik ${new Date().toISOString().slice(0, 10)}: ${name}`,
      content: Buffer.from(content).toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  console.log(name, put.ok ? "ok" : `Fehler ${put.status}`);
  if (!put.ok) process.exitCode = 1;
}
