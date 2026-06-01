# exe.dev deployment — travels

```text
https://<trip>.travels.vhtm.eu
```

Static itinerary sites served by nginx. Hosted on the shared
`vhtm-eu` VM. The arch and conventions live in
<https://github.com/Jason-vh/vhtm.eu>.

## Architecture

```text
client
  -> https://<trip>.travels.vhtm.eu
  -> exe.dev edge (TLS, wildcard registration)
  -> vhtm-eu :8080 → Caddy (wildcard host match) → 127.0.0.1:3006
  -> nginx → static files under /usr/share/nginx/html/<trip>/
```

The Caddy snippet uses a wildcard `host *.travels.vhtm.eu`, so any
subdomain that resolves to `vhtm-eu.exe.xyz` routes to nginx. nginx
then dispatches by `server_name` to the right document root.

Note: the exe.dev edge does **not** accept wildcard registrations and
rejects any host whose parent zone contains a wildcard CNAME. So:

- Porkbun: **no** `*.travels` wildcard record — one explicit CNAME per trip
- exe.dev: one `domain add` call per trip
- Caddy: one snippet for the whole prefix (this file) — the wildcard works fine here

## Adding a new trip

1. Create a folder: `my-trip/` with an `index.html`.
2. Add a `COPY my-trip/ /usr/share/nginx/html/my-trip/` line to the `Dockerfile`.
3. Add a `server { … server_name mytrip.travels.vhtm.eu; … }` block to `nginx.conf`.
4. Porkbun: add an **explicit** `mytrip.travels` CNAME → `vhtm-eu.exe.xyz`.
5. exe.dev: `ssh exe.dev domain add vhtm-eu mytrip.travels.vhtm.eu`.
6. Push — the runner builds and reloads.

## Operations

```bash
ssh vhtm-eu.exe.xyz
cd /home/exedev/apps/travels
docker compose logs -f app
curl -H "Host: cinqueterre.travels.vhtm.eu" http://localhost:3006/
```
