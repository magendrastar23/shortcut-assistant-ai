export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>This page didn't load</title></head>
<body style="font-family:system-ui;display:grid;place-items:center;min-height:100vh;background:#111;color:#fff">
<main style="max-width:28rem;text-align:center"><h1>This page didn't load</h1><p>Something went wrong. Try refreshing or return home.</p><a href="/" style="color:#fff">Go home</a></main>
</body></html>`;
}
