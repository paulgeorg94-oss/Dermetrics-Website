# Eigene Besucherstatistik für dermetrics.ch

Ohne Drittanbieter-Tools und ohne Cookies. Drei Teile:

1. `assets/stats.js` auf der Website: sendet Seitenaufrufe und Klicks auf Kontaktwege (WhatsApp, Telefon, E-Mail, MediX-Zuweiserseiten, Google-Profil, OneDoc) an den eigenen Server.
2. `server.mjs`: nimmt die Daten an und speichert nur Tagessummen.
3. `export-to-github.mjs`: schreibt die Tagessummen einmal täglich als CSV in ein privates GitHub-Repository. Das Claude-Dashboard liest von dort.

Voraussetzung: ein Server, auf dem Node.js 18 oder neuer läuft, erreichbar unter `https://stats.dermetrics.ch` (HTTPS über einen Reverse Proxy, z. B. Caddy oder nginx).

## Was gespeichert wird

| Gespeichert (Tagessummen) | Nie gespeichert |
|---|---|
| Seitenaufrufe je Seite | IP-Adresse |
| Eindeutige Besucher je Tag (nur die Zahl) | User-Agent |
| Herkunfts-Domain, UTM-Kampagne | Cookies oder Kennungen im Browser |
| Gerätetyp, Sprache | Einzelne Besuche oder Klickfolgen |
| Klicks je Kontaktweg und Seite | Formular-, Pre-Check- oder Nachrichteninhalte |

Eindeutige Besucher: Aus einem zufälligen Tagesschlüssel, der IP-Adresse und dem User-Agent wird ein Hash gebildet und nur im Arbeitsspeicher gehalten. Der Schlüssel wird täglich verworfen. Wird der Server tagsüber neu gestartet, kann ein Besucher an diesem Tag doppelt gezählt werden.

Bots (User-Agent mit «bot», «crawl», «headless» usw.) werden nicht gezählt. «Do Not Track» und «Global Privacy Control» werden respektiert.

## Einrichten

```bash
# 1. Server
cd stats-server
export EXPORT_TOKEN="$(openssl rand -hex 32)"   # sicher aufbewahren
node server.mjs                                  # oder als systemd-Dienst, siehe unten

# 2. Reverse Proxy (Beispiel Caddyfile)
# stats.dermetrics.ch {
#   reverse_proxy 127.0.0.1:8787
# }

# 3. DNS: A/AAAA-Eintrag für stats.dermetrics.ch auf den Server

# 4. Website: in assets/stats.js  ENABLED = true  setzen

# 5. Privates GitHub-Repo anlegen, z. B. paulgeorg94-oss/dermetrics-stats,
#    Fine-grained Token nur für dieses Repo mit «Contents: Read and write»

# 6. Täglicher Export per cron (z. B. 05:10 Uhr)
# 10 5 * * * cd /opt/dermetrics/stats-server && EXPORT_TOKEN=... GITHUB_TOKEN=... GITHUB_REPO=paulgeorg94-oss/dermetrics-stats node export-to-github.mjs
```

### systemd-Dienst (Beispiel)

```ini
[Unit]
Description=Dermetrics Statistik
After=network.target

[Service]
WorkingDirectory=/opt/dermetrics/stats-server
Environment=EXPORT_TOKEN=...
Environment=DATA_DIR=/var/lib/dermetrics-stats
ExecStart=/usr/bin/node server.mjs
Restart=always
DynamicUser=yes
StateDirectory=dermetrics-stats

[Install]
WantedBy=multi-user.target
```

## Kampagnen messen

Links in Werbung, Flyern oder Social Media mit UTM-Parametern versehen, z. B.
`https://dermetrics.ch/?utm_source=instagram&utm_medium=social&utm_campaign=eroeffnung`.
Das Dashboard zeigt sie unter «Kampagnen».

## Endpunkte

- `POST /e` — Ereignisse von der Website (max. 2 KB, nur erlaubte Origins)
- `GET /export?from=YYYY-MM-DD&to=YYYY-MM-DD` — Tagessummen als JSON, nur mit `Authorization: Bearer <EXPORT_TOKEN>`
- `GET /health` — Statusprüfung
