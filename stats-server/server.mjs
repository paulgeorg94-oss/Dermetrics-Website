// Dermetrics Sammel-Server für die eigene Besucherstatistik.
// Node.js >= 18, keine externen Pakete.
//
// Datenschutz-Prinzipien:
// - IP-Adresse und User-Agent werden nie gespeichert. Für die Zählung
//   eindeutiger Besucher pro Tag wird ein Hash aus (Tagesschlüssel + IP + UA)
//   nur im Arbeitsspeicher gehalten. Der Tagesschlüssel ist zufällig, wird nie
//   gespeichert und täglich verworfen; eine Wiedererkennung über Tage ist so
//   nicht möglich.
// - Gespeichert werden nur Tagessummen (Zähler), keine Einzelereignisse.
//
// Umgebungsvariablen:
//   PORT            (Standard 8787)
//   DATA_DIR        (Standard ./data)
//   EXPORT_TOKEN    (Pflicht für /export; langer Zufallswert)
//   ALLOWED_ORIGINS (Standard https://dermetrics.ch,https://www.dermetrics.ch)
//   RETENTION_DAYS  (Standard 400)

import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = path.resolve(process.env.DATA_DIR || "./data");
const EXPORT_TOKEN = process.env.EXPORT_TOKEN || "";
const ALLOWED = (process.env.ALLOWED_ORIGINS || "https://dermetrics.ch,https://www.dermetrics.ch")
  .split(",").map((s) => s.trim()).filter(Boolean);
const RETENTION_DAYS = Number(process.env.RETENTION_DAYS || 400);
const TZ = "Europe/Zurich";

const EVENTS = new Set(["whatsapp", "telefon", "email", "zuweiser", "google_profil", "buchung"]);
const DEVICES = new Set(["mobile", "tablet", "desktop"]);
const BOT = /bot|crawl|spider|slurp|headless|preview|lighthouse|pagespeed|monitor|curl|wget|python|java\/|httpclient/i;

fs.mkdirSync(DATA_DIR, { recursive: true });

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());

let day = today();
let salt = crypto.randomBytes(32);
let seen = new Set();
let agg = load(day);
let dirty = false;

function empty(date) {
  return { date, pageviews: 0, visitors: 0, pages: {}, sources: {}, campaigns: {}, devices: {}, langs: {}, events: {} };
}
function file(date) { return path.join(DATA_DIR, `${date}.json`); }
function load(date) {
  try { return JSON.parse(fs.readFileSync(file(date), "utf8")); } catch { return empty(date); }
}
function flush() {
  if (!dirty) return;
  const tmp = file(agg.date) + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(agg));
  fs.renameSync(tmp, file(agg.date));
  dirty = false;
}
function rollDay() {
  const d = today();
  if (d === day) return;
  flush();
  day = d;
  salt = crypto.randomBytes(32); // alter Schlüssel ist damit unwiederbringlich weg
  seen = new Set();
  agg = load(d);
  prune();
}
function prune() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 864e5).toISOString().slice(0, 10);
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (/^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f.slice(0, 10) < cutoff) fs.unlinkSync(path.join(DATA_DIR, f));
  }
}
const inc = (obj, key) => { obj[key] = (obj[key] || 0) + 1; };
const clean = (v, max = 120) => (typeof v === "string" ? v.replace(/[\u0000-\u001f]/g, "").slice(0, max) : "");

function clientIp(req) {
  // Hinter einem Reverse Proxy (z. B. Caddy/nginx) steht die echte IP im ersten X-Forwarded-For-Eintrag.
  const xff = req.headers["x-forwarded-for"];
  return (typeof xff === "string" && xff.split(",")[0].trim()) || req.socket.remoteAddress || "";
}

function record(req, data) {
  rollDay();
  const ua = String(req.headers["user-agent"] || "");
  if (!ua || BOT.test(ua)) return;
  const p = clean(data.p, 200);
  if (!p.startsWith("/")) return;

  if (data.t === "pv") {
    agg.pageviews++;
    inc(agg.pages, p);
    const h = crypto.createHash("sha256").update(salt).update(clientIp(req)).update(ua).digest("base64").slice(0, 16);
    if (!seen.has(h)) { seen.add(h); agg.visitors++; }
    const r = clean(data.r, 80).toLowerCase();
    const us = clean(data.us, 60).toLowerCase();
    inc(agg.sources, us ? `utm:${us}` : r || "direkt");
    if (us || data.um || data.uc) inc(agg.campaigns, [us, clean(data.um, 60).toLowerCase(), clean(data.uc, 80).toLowerCase()].join("|"));
    if (DEVICES.has(data.d)) inc(agg.devices, data.d);
    const l = clean(data.l, 5).toLowerCase().slice(0, 2);
    if (l) inc(agg.langs, l);
  } else if (data.t === "ev" && EVENTS.has(data.e)) {
    inc(agg.events, `${data.e}|${clean(data.k, 40)}|${p}`);
  } else return;
  dirty = true;
}

function exportRows(fromDate, toDate) {
  flush();
  const days = fs.readdirSync(DATA_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.slice(0, 10)).filter((d) => d >= fromDate && d <= toDate).sort();
  const out = { daily: [], pages: [], sources: [], campaigns: [], devices: [], events: [] };
  for (const d of days) {
    const a = d === agg.date ? agg : load(d);
    const ev = { whatsapp: 0, telefon: 0, email: 0, zuweiser: 0, google_profil: 0, buchung: 0 };
    for (const [k, n] of Object.entries(a.events)) {
      const [e, target, page] = k.split("|");
      ev[e] = (ev[e] || 0) + n;
      out.events.push({ date: d, event: e, target, page, count: n });
    }
    out.daily.push({ date: d, pageviews: a.pageviews, visitors: a.visitors, ...ev });
    for (const [k, n] of Object.entries(a.pages)) out.pages.push({ date: d, page: k, views: n });
    for (const [k, n] of Object.entries(a.sources)) out.sources.push({ date: d, source: k, views: n });
    for (const [k, n] of Object.entries(a.campaigns)) {
      const [source, medium, campaign] = k.split("|");
      out.campaigns.push({ date: d, source, medium, campaign, views: n });
    }
    for (const [k, n] of Object.entries(a.devices)) out.devices.push({ date: d, device: k, views: n });
  }
  return out;
}

function cors(req, res) {
  const o = req.headers.origin;
  if (o && ALLOWED.includes(o)) {
    res.setHeader("Access-Control-Allow-Origin", o);
    res.setHeader("Vary", "Origin");
  }
}

function safeEqual(a, b) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "POST" && url.pathname === "/e") {
    cors(req, res);
    const origin = req.headers.origin || "";
    if (origin && !ALLOWED.includes(origin)) { res.writeHead(403).end(); return; }
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 2048) req.destroy(); });
    req.on("end", () => {
      try { record(req, JSON.parse(body)); } catch { /* ungültige Daten verwerfen */ }
      res.writeHead(204).end();
    });
    return;
  }
  if (req.method === "OPTIONS" && url.pathname === "/e") {
    cors(req, res);
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204).end();
    return;
  }
  if (req.method === "GET" && url.pathname === "/export") {
    const auth = String(req.headers.authorization || "");
    if (!EXPORT_TOKEN || !safeEqual(auth, `Bearer ${EXPORT_TOKEN}`)) { res.writeHead(401).end(); return; }
    const to = url.searchParams.get("to") || today();
    const from = url.searchParams.get("from") || new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify(exportRows(from, to)));
    return;
  }
  if (url.pathname === "/health") { res.writeHead(200).end("ok"); return; }
  res.writeHead(404).end();
});

setInterval(() => { rollDay(); flush(); }, 60_000).unref();
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => { flush(); process.exit(0); });
prune();
server.listen(PORT, () => console.log(`Dermetrics stats on :${PORT}, data in ${DATA_DIR}`));
