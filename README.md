# OpenRouter Tester

A mobile-friendly web app to test OpenRouter free models (GPT-OSS 120B, Qwen3, DeepSeek R1, etc.) with reasoning support.

## Deploy to Vercel in 3 steps

### Step 1 — Push to GitHub
1. Go to [github.com](https://github.com) and create a **new repository** called `openrouter-tester`
2. Upload all these files (or use Git)

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `openrouter-tester` repository
4. Click **Deploy** (no build settings needed — Vercel auto-detects Next.js)

### Step 3 — Add your API key
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** your key from [openrouter.ai/keys](https://openrouter.ai/keys)
3. Click **Save**, then go to **Deployments** and click **Redeploy**

Your app is now live at `https://openrouter-tester.vercel.app` (or similar URL)!

## Features
- Test GPT-OSS 120B, GPT-OSS 20B, Qwen3 Coder, DeepSeek R1 (all free)
- Toggle reasoning / chain-of-thought on/off
- View ANSWER, REASONING, and RAW JSON tabs
- Token usage display (prompt / output / reasoning)
- Mobile-optimized UI
