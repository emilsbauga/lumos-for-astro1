# STUDEJA preview

Work from `/Users/emilsbauga/Projects/studeja.lv`. The Documents/ChatGPT copy is an obsolete template checkout.

The site and `/anketa` deploy together to the `studeja-lv` Cloudflare Worker at https://studeja-lv.emils-aac.workers.dev. The form is intentionally absent from navigation and the site search index.

Connect the GitHub repository to the existing Worker under Settings → Builds:

- Production branch: `main`
- Root directory: repository root
- Build command: `npm run check && npm run build`
- Deploy command: `npx wrangler deploy --keep-vars`

After connecting, a push to `main` builds and deploys both the website and form. Use a branch for unfinished changes, then merge into `main` when ready to publish.

Set `RESEND_API_KEY` as a secret and `RESEND_FROM` and `RESEND_TO` as variables or secrets in Worker settings. No values belong in Git. The keep-vars option preserves dashboard variables across deployments. Email delivery is unavailable until these are configured.

The preview Worker sends no-index headers on all pages. Remove that preview-wide header before attaching the production domain; keep `/anketa` excluded via `NOINDEX_ROUTES`. A hidden URL is not authentication.
