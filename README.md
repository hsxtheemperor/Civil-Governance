# CJP Community Platform

**By the people. For the people. Documented.**

A transparent, GitHub-powered civic governance platform where community members report problems, vote on solutions, and engage in documented debates. All data is public, immutable, and auditable.

## Features

### Problem Reporting
- Community members submit problems affecting the organization
- Problems are initially labeled "pending" and await moderator review
- Moderators accept or reject submissions with documented reasons
- All submissions (accepted and rejected) are preserved in the public repository

### Issue Management
- Accepted problems become issues displayed to the community
- Community members vote anonymously on issues using reactions
- Issues are sorted by vote count, ensuring community prioritization
- Three status categories: Pending Review, Open & Voting, Resolved

### Debate System
- When an issue has been discussed and resolved, a debate log is published
- Debate logs document the discussion, decision, and rationale
- Issues with published debate logs are automatically marked as "Resolved"
- All debates are publicly visible for transparency and learning

### Code of Conduct Suggestions
- Community members can suggest improvements to the Code of Conduct
- Suggestions follow the same voting and approval process as problems
- Accepted CoC suggestions are merged into the official document
- Rejected suggestions include documented rejection reasons
- Terms of Suggestions outline what is acceptable and prohibited

## Quick Start

### For Users

1. **Report a Problem**: Click "Report a Problem" button on home page
2. **Vote on Issues**: Browse issues and upvote ones you support
3. **View Debates**: See how resolved issues were discussed
4. **Suggest CoC Changes**: Propose improvements to our Code of Conduct

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/hsxtheemperor/Civil-Governance
   cd Civil-Governance
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or: pnpm install / yarn install
   ```

3. **Set environment variable**
   ```bash
   export GITHUB_PAT=your_github_personal_access_token
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Repository Structure

```
Civil-Governance/
├── issues/                 # GitHub Issues folder (stores reported problems)
├── debates/               # Debate log files (issue-{number}.md)
├── suggestions/           # Archive of all CoC suggestions
├── code-of-conduct.md     # Official Code of Conduct document
├── README.md             # This file
└── app/                  # Next.js application code
```

## How It Works

### Problem → Issue → Resolution Flow

**Step 1: Submit Problem** (Anyone)
- Fill out problem form with title and description
- Auto-labeled "pending"
- Saved to GitHub as an issue

**Step 2: Moderator Review**
- Moderators review all pending submissions
- Accept: Add "accepted" label → Issue becomes visible
- Reject: Add "rejected" label → Document rejection reason
- All decisions public and auditable

**Step 3: Community Voting**
- Community sees accepted issues on Issues page
- Vote anonymously using 👍 reaction
- Issues sorted by vote count
- Status: "⏳ Voting"

**Step 4: Debate & Resolution**
- Issue discussed and resolved
- Debate log created: `debates/issue-{number}.md`
- Issue auto-marked "✓ Resolved"
- Community learns from documented discussion

### Code of Conduct (CoC) Suggestions

**Step 1: Suggest Change**
- Click "Suggest CoC Changes"
- Specify affected section
- Detail your suggested improvement
- Saved as issue with "coc-suggestion" label

**Step 2: Community Review**
- Community votes on suggestions
- Voting shows support level

**Step 3: Moderation Decision**
- Moderators review + vote count
- Accept: Merged into `code-of-conduct.md`
- Reject: Label + rejection reason documented

## Security & Privacy

### Security First
- ✅ GitHub PAT stored in **secure environment variable only**
- ✅ `NEXT_PUBLIC_GITHUB_PAT` explicitly disabled
- ✅ All input validated and sanitized
- ✅ Server-side API calls only (no client-side tokens)
- ✅ Rate limiting respected

### Privacy Protected
- ✅ Anonymous voting - votes cannot be traced
- ✅ No user tracking or analytics
- ✅ All decisions publicly visible (for transparency)
- ✅ Data immutable via git history

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Backend | Serverless Next.js API Routes |
| Data Storage | GitHub Repository (public) |
| API | GitHub REST API v3 |
| Authentication | GitHub PAT (environment variable) |

## File Organization

```
app/
├── page.tsx                      # Home with overview + recent issues
├── problems/page.tsx             # Submit new problems
├── issues/
│   ├── page.tsx                 # Browse & filter all issues
│   └── [number]/page.tsx        # Issue detail with voting
├── coc-suggestions/
│   ├── page.tsx                 # Browse CoC suggestions
│   ├── new/page.tsx             # Submit new CoC suggestion
│   └── [number]/page.tsx        # CoC suggestion detail
├── terms-of-suggestions/page.tsx # Terms document
└── debate-logs/page.tsx         # Published debates

components/
├── Header.tsx          # Navigation header
├── Footer.tsx          # Footer
├── MarkdownRenderer.tsx # Markdown to HTML

lib/
├── github.ts           # GitHub API utilities
└── validation.ts       # Input validation
```

## GitHub Labels

The platform uses labels to manage workflow:

| Label | Purpose |
|-------|---------|
| `cjp-issue` | Problem/issue reported by community |
| `pending` | Awaiting moderator review |
| `accepted` | Approved and visible to community |
| `rejected` | Rejected with documented reason |
| `coc-suggestion` | Code of Conduct improvement |

## Terms of Suggestions

All submissions must comply with our [Terms of Suggestions](./app/terms-of-suggestions/page.tsx):

✅ **Acceptable**
- Constructive criticism
- Specific, well-reasoned suggestions
- Clear documentation
- Respectful tone

❌ **Not Acceptable**
- Hate speech or discrimination
- Harassment or threats
- Spam or off-topic
- Explicit content
- Circumventing platform rules

**Violations Result In**: Permanent removal with documented reason

## Deployment

### Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Select "Next.js" framework

2. **Add Environment Variable**
   - Project Settings → Environment Variables
   - Add `GITHUB_PAT` = your GitHub PAT
   - Redeploy

3. **Done!**
   - Your CJP Community Platform is live
   - Automatic deploys on every push

## Contributing

### Report a Problem
1. Click "Report a Problem" on home page
2. Fill out title and description
3. Submit (becomes "pending" issue)

### Suggest CoC Changes
1. Click "Suggest CoC Changes"
2. Specify section + detailed suggestion
3. Community votes + moderators review

### Vote
1. Browse issues or suggestions
2. Click 👍 to support
3. Vote is anonymous and recorded

## Transparency & Audit

- ✅ All issues publicly visible
- ✅ All moderator decisions documented
- ✅ Rejection reasons always provided
- ✅ GitHub commit history auditable
- ✅ Data immutable via git

## GitHub API Integration

All data fetched from GitHub REST API v3:

```
GET  /repos/{owner}/{repo}/issues          → Fetch issues
POST /repos/{owner}/{repo}/issues           → Create issue
POST /repos/{owner}/{repo}/issues/{n}/reactions → Vote
GET  /repos/{owner}/{repo}/contents/{path}  → Fetch file
```

## License

MIT License - See LICENSE file

## Support

- **Report Issue**: Use platform's "Report Problem" feature
- **Suggest Improvement**: Use "Suggest CoC Changes"
- **Read Terms**: Review [Terms of Suggestions](./app/terms-of-suggestions/page.tsx)

---

**By the people. For the people. Documented.**

*CJP Community Platform — Making governance transparent, one issue at a time.*
