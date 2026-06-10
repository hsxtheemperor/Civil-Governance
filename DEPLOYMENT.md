# CJP Community Platform - Deployment Guide

## Quick Start for Vercel

You've already added `GITHUB_PAT` to your Vercel environment variables. Here's how to deploy:

### Step 1: Verify Environment Variable is Set

In Vercel project settings:
- Go to **Settings → Environment Variables**
- Confirm `GITHUB_PAT` is present and set to your GitHub personal access token
- The token must have permissions to read repository contents

### Step 2: Deploy to Vercel

```bash
# If using Vercel CLI
vercel deploy

# Or push to GitHub and let Vercel auto-deploy
git push origin main
```

Your platform is now live!

---

## How the GitHub Integration Works

### Documents Fetched from GitHub

The platform dynamically fetches these documents from your repository:

| Document | File | Purpose | Updates |
|----------|------|---------|---------|
| Code of Conduct | `code-of-conduct.md` | Community guidelines | Edit in repo, displays on home page |
| Terms of Suggestions | `terms-of-suggestions.md` | Platform rules | Edit in repo, displays on terms page |

### Data Stored on GitHub

All platform data is stored as GitHub Issues with labels:

```
Issues/
├── cjp-issue/pending    → Problems awaiting review
├── cjp-issue/accepted   → Approved problems
├── cjp-issue/rejected   → Rejected problems

Debates/
├── issue-1.md           → Published debate about issue #1
├── issue-2.md           → Published debate about issue #2
└── ...

Code of Conduct/
├── code-of-conduct.md   → Official community guidelines
├── terms-of-suggestions.md → Platform rules
```

### Labels Used

The platform uses these GitHub labels for workflow:

- `cjp-issue` - Problem/issue reported by community
- `pending` - Awaiting moderator review
- `accepted` - Approved and visible
- `rejected` - Declined with reason
- `coc-suggestion` - Code of Conduct improvement

---

## Environment Variables Required

### Required

```bash
GITHUB_PAT=ghp_xxxxxxxxxxxxxxxxxxxx
```

This is your GitHub Personal Access Token. It must have:
- `repo` scope (access to repository contents and issues)
- No expiration (or long expiration)
- Write access to create/update issues and reactions

**Never** expose this token:
- ❌ NOT in `NEXT_PUBLIC_GITHUB_PAT` (public)
- ❌ NOT in `.env` file in repository
- ✅ In Vercel project settings only
- ✅ In `.env.local` for local development (not committed)

### Optional

None required.

---

## Local Development

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/hsxtheemperor/Civil-Governance.git
cd Civil-Governance

# 2. Install dependencies
npm install

# 3. Set environment variable
export GITHUB_PAT=your_github_personal_access_token

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

### Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

---

## Updating Documents

### Update Code of Conduct

1. Edit `code-of-conduct.md` in the repository
2. Commit and push to GitHub
3. Platform automatically fetches latest version on next page load
4. No redeploy needed!

### Update Terms of Suggestions

1. Edit `terms-of-suggestions.md` in the repository
2. Commit and push to GitHub
3. Terms page fetches latest version dynamically
4. No redeploy needed!

---

## Troubleshooting

### "GITHUB_PAT environment variable is not set"

**Local Development:**
```bash
export GITHUB_PAT=your_token_here
npm run dev
```

**Vercel:**
1. Go to project Settings
2. Environment Variables
3. Verify `GITHUB_PAT` is set
4. Redeploy the project

### "Terms of Suggestions document not found in repository"

This means the API call succeeded but the file doesn't exist.

**Solution:**
1. Ensure `terms-of-suggestions.md` exists in repo root
2. File must be named exactly (lowercase, with hyphens)
3. Commit and push the file
4. Wait 1-2 minutes for GitHub API cache to update

### "Rate limit reached"

GitHub API has rate limits (60 requests/hour unauthenticated, 5000/hour authenticated).

**Solution:**
1. Ensure `GITHUB_PAT` is set (increases limit to 5000/hour)
2. Wait 1 hour for rate limit to reset
3. Optimize: Cache responses, reduce API calls

### Cannot create issues (from /problems page)

**Solution:**
1. Verify `GITHUB_PAT` has write access
2. Check GitHub token hasn't expired
3. Verify token has `repo` scope

---

## API Rate Limits

With authenticated requests (using `GITHUB_PAT`):

- **Rate Limit:** 5,000 requests per hour
- **Reset:** Resets every hour
- **Current Usage:** Check with `GET /rate_limit`

The platform uses approximately:

| Action | Requests | Notes |
|--------|----------|-------|
| Home page load | 4 | Issues, debates, suggestions, CoC |
| Browse issues | 1 | Per page load |
| Submit problem | 1 | Create new issue |
| Vote on issue | 1 | Add reaction |
| View CoC | 1 | Fetch document |
| View Terms | 1 | Fetch document |

**Estimate:** ~500 users × 10 requests/day = 5,000 requests/day (well within limits)

---

## Security Checklist

- ✅ `GITHUB_PAT` is backend-only (not in `NEXT_PUBLIC_*`)
- ✅ All API calls made server-side only
- ✅ No tokens logged or exposed in client code
- ✅ Input validation on all user submissions
- ✅ HTML sanitization prevents XSS
- ✅ GitHub API used for all data storage (immutable via git)

---

## Monitoring

### Check Deployment Status

```bash
# Vercel CLI
vercel projects list
vercel deployments

# Or check Vercel dashboard
https://vercel.com/dashboard
```

### Check GitHub API Usage

```bash
# See rate limit
curl -H "Authorization: token YOUR_PAT" \
  https://api.github.com/rate_limit
```

### Monitor Errors

Check Vercel project logs:
1. Go to project in Vercel dashboard
2. Click "Logs"
3. Check for `[CJP]` errors

---

## Scaling Considerations

### Current Performance

- Next.js Turbopack: ~300ms page generation
- GitHub API: ~500ms per request
- Total home page load: ~1s

### High Traffic

If you exceed rate limits:

1. **Implement caching:**
   ```typescript
   // Cache responses for 5 minutes
   const cached = await fetch(url, {
     next: { revalidate: 300 }
   })
   ```

2. **Batch API calls:** Combine related queries

3. **Use GitHub GraphQL:** More efficient than REST API

4. **Consider CDN:** Cache static pages at edge

---

## Version History

- **v1.0** - Initial platform launch
  - Problem reporting system
  - Issue voting
  - CoC suggestions
  - Debate logs
  - Full GitHub integration

---

## Support

For issues or questions:

1. **Platform Issues:** Use "Report a Problem" button
2. **Feature Requests:** Use "Suggest CoC Changes"
3. **Technical Help:** Check [README.md](./README.md)

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Code of Conduct](./code-of-conduct.md)
- [Terms of Suggestions](./terms-of-suggestions.md)

---

**Your CJP Community Platform is ready to empower transparent, participatory governance!**

*By the people. For the people. Documented.*
