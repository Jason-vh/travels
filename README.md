# Travels ✈️

Static itinerary sites for group trips. Deployed to [travel.vhtm.eu](https://travel.vhtm.eu) via Railway.

## Trips

| Trip | Dates | URL |
|------|-------|-----|
| 🇮🇹 Cinque Terre | May 22–25, 2026 | [cinqueterre.travels.vhtm.eu](https://cinqueterre.travels.vhtm.eu/) |

## Adding a new trip

1. Create a folder: `my-trip/`
2. Add an `index.html` (and any variants)
3. Add a `COPY` line to the `Dockerfile`
4. Add a `server` block to `nginx.conf` for `mytrip.travels.vhtm.eu`
5. Push — Railway auto-deploys (wildcard DNS handles the subdomain)
