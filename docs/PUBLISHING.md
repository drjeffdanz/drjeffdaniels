# Thought Leadership publishing

The public pages use the site's existing dark background, gold accents, fonts, cards, and spacing. The separate authoring screen uses Keystatic's editor. The homepage shows the three newest published articles; the archive shows all published articles, newest article date first. Drafts are excluded from public pages, direct article URLs, and the sitemap.

## Review locally

Run `npm ci`, then `npm run dev`. Open `http://localhost:3000` to review the site and `http://localhost:3000/keystatic` to write locally in the browser. Development mode saves files in this checkout. It does not publish to GitHub or production.

The included **Weekly post template** is a draft for testing. Replace its text or create a new entry. Use the editor for titles, summaries, dates, topics, formatted text, links, lists, and images. Set Status to Published to preview an article on the local site. Local changes become public only after the code/content is committed to the hosting production branch and successfully deployed. Do not push or deploy this review without Jeff's approval.

## One-time live editor setup (after approval)

1. Configure a GitHub App using Keystatic's setup flow. Set `NEXT_PUBLIC_KEYSTATIC_GITHUB_MODE=true` in `.env.local` and restart the development server to enter that flow at `/keystatic`.
2. Give the app access to `drjeffdanz/drjeffdaniels`. The production editor requires GitHub authentication and repository write access. Only development uses unauthenticated local file storage.
3. Add the generated `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to the hosting environment. Keep credentials out of commits. Configure the GitHub App callback URL for the deployed site's `/api/keystatic/github/oauth/callback` route.
4. Verify the hosting project builds from the intended production branch. Redeploy once configured and test GitHub sign-in. The current review does not create a GitHub App, configure hosting secrets, or publish a deployment.

Official setup reference: https://keystatic.com/docs/github-mode

## Weekly workflow

1. Sign in at `/keystatic`, select Thought Leadership, and create a post.
2. Write the title, short summary, article date, topics, and article. Keep Status as Draft while editing.
3. For review before production, save on a non-production branch and use the hosting provider's preview deployment. Mark the article Published on that preview branch to see the public rendering there. Merge only after review. Keystatic's status controls visibility; it does not replace branch/deployment review.
4. When ready, set Status to Published and save/merge to the production branch. A successful hosting rebuild makes the article available on the homepage, archive, article URL, and sitemap.

The date is a display/sort date, not an automatic publishing schedule. This version supports manual weekly publishing. Draft content is stored in Git, so it is not confidential if the repository is public. No sample article is published in the delivered review.

## Resource Library

The four tools are initial guided worksheets created for review, not imported reference documents. Visitors can fill them in and export their answers as text files. Answers are held only in page memory and are lost on navigation or refresh unless downloaded. The prompts live in `src/lib/free-tools.ts`; confirm the content before production.

## Jeffasketch

`public/jeffasketch/index.html` is copied unchanged from https://github.com/drjeffdanz/jeffasketch at commit `404ea6a86d65ab0373eb0fc54ba346da88ebb0e2`. The `/jeffasketch` page embeds it beneath the shared site navigation, matching the existing game integration. Future game updates must be copied from the source repository explicitly.
