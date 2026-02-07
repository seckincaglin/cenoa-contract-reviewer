# AI Contract Reviewer

AI-powered contract analysis tool for freelancers and remote workers. Part of Cenoa's value-add strategy.

## Features

- 📋 Paste contract text for instant analysis
- 🚨 Identifies critical deal-breaker issues
- ⚠️ Highlights warning signs and risky terms
- ✅ Recognizes protective clauses
- 💡 Suggests missing important terms
- 🎯 Overall risk score (1-10)

## Tech Stack

- **Frontend:** Pure HTML/CSS/JavaScript (no frameworks)
- **Backend:** Vercel Serverless Functions
- **AI:** Anthropic Claude Sonnet 4.5 (~$0.02-0.03 per analysis)

## Deployment

Deployed on Vercel with automatic deployments from GitHub.

### Environment Variables

Required in Vercel:
- `ANTHROPIC_API_KEY` - Anthropic API key for Claude access

## Cost Analysis

- Build cost: ~$0.50
- Per-review cost: ~$0.02-0.03
- 100 reviews/day = ~$3/day = $90/month

## Target Audience

Freelancers and remote workers reviewing:
- Service agreements
- Freelance contracts
- Employment contracts
- NDAs
- Client agreements

## Disclaimer

This tool provides general guidance only and does not constitute legal advice. 
Always consult with a qualified attorney before signing any contract.

---

Built with ❤️ by [Cenoa](https://cenoa.com)
