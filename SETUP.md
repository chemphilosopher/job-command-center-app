# API Key Setup Guide

This guide walks you through setting up API keys for the AI features in Job Command Center. **All AI features are optional** - the app works fully without them.

## Quick Recommendation

| Your Situation | Best Choice |
|----------------|-------------|
| Want to try AI features for free | **Google Gemini** (free tier) |
| Want best quality analysis | **OpenAI GPT-4o** or **Anthropic Claude** |
| Want 100% privacy / offline | **Ollama** (runs on your computer) |
| On a tight budget | **Google Gemini** (free) or **Ollama** (free) |

---

## Option 1: Google Gemini (FREE - Recommended to Start)

Google Gemini has a generous free tier - perfect for job searching.

### Step-by-Step Setup:

**1. Go to Google AI Studio**
   - Open your browser
   - Go to: **https://aistudio.google.com**
   - Sign in with your Google account (Gmail)

**2. Get Your API Key**
   - Look at the left sidebar
   - Click **"Get API key"**
   - Click the blue **"Create API key"** button
   - Select **"Create API key in new project"**
   - Your API key will appear - it starts with `AIza...`
   - Click the **copy icon** to copy it

**3. Add to Job Command Center**
   - Open the Job Command Center app
   - Go to the **"AI Match"** tab (or click Settings gear icon)
   - Click **"Settings"** button (gear icon in AI Match section)
   - Under "LLM Provider", select **"Google Gemini"**
   - Under "Model", select **"gemini-1.5-flash"** (fastest, free-tier friendly)
   - Paste your API key in the "API Key" field
   - Click **"Save"**

**4. Test It**
   - Upload your resume in the AI Match tab
   - Try analyzing a job posting
   - If it works, you're all set!

### Free Tier Limits (Very Generous!)
- ✅ 15 requests per minute
- ✅ 1,500 requests per day
- ✅ Completely free

This is **more than enough** for even heavy job searching!

---

## Option 2: OpenAI (ChatGPT) - Best Quality

OpenAI's GPT-4o provides the highest quality analysis.

### Step-by-Step Setup:

**1. Create an OpenAI Account**
   - Go to: **https://platform.openai.com**
   - Click **"Sign up"** (top right)
   - Sign up with email, Google, or Microsoft account
   - Verify your email if prompted

**2. Add Payment Method (Required)**
   - After logging in, click your profile icon (top right)
   - Click **"Settings"**
   - In the left sidebar, click **"Billing"**
   - Click **"Add payment method"**
   - Enter your credit card details
   - **Set a usage limit** (recommended: $10/month to start)
     - Under "Usage limits", set "Hard limit" to $10

**3. Generate Your API Key**
   - In the left sidebar, click **"API keys"**
   - Or go directly to: **https://platform.openai.com/api-keys**
   - Click the green **"+ Create new secret key"** button
   - Give it a name: `Job Command Center`
   - Click **"Create secret key"**
   - **IMPORTANT**: Copy the key NOW - you won't see it again!
   - The key starts with `sk-...`

**4. Add to Job Command Center**
   - Open the Job Command Center app
   - Go to **"AI Match"** tab → click **Settings** (gear icon)
   - Under "LLM Provider", select **"OpenAI"**
   - Under "Model", select **"gpt-4o-mini"** (best value) or **"gpt-4o"** (best quality)
   - Paste your API key in the "API Key" field
   - Click **"Save"**

### Cost Estimate
| Model | Cost per Analysis | Monthly Estimate |
|-------|-------------------|------------------|
| gpt-4o-mini | ~$0.01 | $1-3/month |
| gpt-4o | ~$0.03 | $3-10/month |

---

## Option 3: Anthropic Claude - Excellent Reasoning

Claude excels at nuanced analysis and thoughtful recommendations.

### Step-by-Step Setup:

**1. Create an Anthropic Account**
   - Go to: **https://console.anthropic.com**
   - Click **"Sign up"**
   - Enter your email and create a password
   - Verify your email (check inbox for verification link)

**2. Add Credits**
   - After logging in, click **"Settings"** (bottom of left sidebar)
   - Click **"Billing"**
   - Click **"Add payment method"**
   - Enter credit card details
   - Click **"Add credits"** - minimum is $5
   - Add $5 to start (this will last weeks of job searching)

**3. Generate Your API Key**
   - Click **"API Keys"** in the left sidebar
   - Or go to: **https://console.anthropic.com/settings/keys**
   - Click **"Create Key"**
   - Give it a name: `Job Command Center`
   - Click **"Create Key"**
   - Copy the key - it starts with `sk-ant-...`

**4. Add to Job Command Center**
   - Open the Job Command Center app
   - Go to **"AI Match"** tab → click **Settings** (gear icon)
   - Under "LLM Provider", select **"Anthropic (Claude)"**
   - Under "Model", select **"claude-sonnet-4-20250514"** (recommended)
   - Paste your API key
   - Click **"Save"**

### Cost Estimate
| Model | Cost per Analysis | Monthly Estimate |
|-------|-------------------|------------------|
| Claude 3.5 Haiku | ~$0.005 | $0.50-2/month |
| Claude Sonnet 4 | ~$0.015 | $1-5/month |

---

## Option 4: Ollama (FREE - Runs Locally)

Ollama runs AI models on your own computer. 100% free, 100% private.

### Requirements
- Computer with 8GB+ RAM (16GB recommended)
- 5-10GB free disk space
- Works on Mac, Windows, or Linux

### Step-by-Step Setup:

**1. Install Ollama**

**On Mac:**
```bash
# If you have Homebrew:
brew install ollama

# Or download from: https://ollama.com/download
```

**On Windows:**
- Go to: **https://ollama.com/download**
- Click **"Download for Windows"**
- Run the installer
- Follow the installation prompts

**On Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**2. Start Ollama**
- **Mac/Linux**: Open Terminal and run: `ollama serve`
- **Windows**: Ollama starts automatically, or find it in Start Menu

**3. Download a Model**

Open a terminal/command prompt and run:
```bash
# Recommended - good balance of quality and speed
ollama pull llama3.1

# Alternative - smaller and faster
ollama pull phi3
```

Wait for the download to complete (may take 5-10 minutes).

**4. Add to Job Command Center**
   - Make sure Ollama is running (`ollama serve`)
   - Open the Job Command Center app
   - Go to **"AI Match"** tab → click **Settings** (gear icon)
   - Under "LLM Provider", select **"Ollama (Local)"**
   - Under "Model", select the model you downloaded (e.g., `llama3.1`)
   - **No API key needed!**
   - Click **"Save"**

### Recommended Models
| Model | RAM Needed | Quality | Speed | Download |
|-------|-----------|---------|-------|----------|
| phi3 | 4GB | Good | Fast | `ollama pull phi3` |
| llama3.1 | 8GB | Great | Medium | `ollama pull llama3.1` |
| mistral | 8GB | Great | Fast | `ollama pull mistral` |

### Troubleshooting Ollama
- **"Connection refused"**: Make sure `ollama serve` is running
- **Slow responses**: Close other apps to free up RAM
- **Model not found**: Run `ollama list` to see installed models

---

## How to Configure in the App

Once you have your API key, here's how to add it:

1. Open Job Command Center
2. Click the **"AI Match"** tab at the top
3. Click the **gear icon (⚙️)** to open API Settings
4. Select your provider from the dropdown
5. Select a model
6. Paste your API key (not needed for Ollama)
7. Click **"Save"**

You'll see a green "AI Ready" badge in the header when configured correctly.

---

## Security Tips

1. **Never share your API keys** - treat them like passwords
2. **Set spending limits** - prevent surprise bills
3. **Create dedicated keys** - use a separate key for this app
4. **Monitor usage** - check your provider's dashboard weekly

---

## Troubleshooting

### "API Key Required" Error
- Make sure you entered the key in Settings → AI Match tab
- Check for extra spaces before/after the key
- Verify you selected the correct provider

### "Unauthorized" or "Invalid Key" Error
- Double-check you copied the entire key
- Make sure the key is for the right provider
- Try generating a new key

### "Insufficient Credits" Error
- Add more credits in your provider's billing settings
- Or switch to Google Gemini (free tier)

### Responses are Slow
- Try a faster model (gpt-4o-mini, gemini-1.5-flash, phi3)
- Check your internet connection
- For Ollama: close other apps to free RAM

---

## FAQ

**Q: Do I need an API key to use the app?**
A: No! All core tracking features work without AI. API keys only enable AI analysis.

**Q: Which provider is best?**
A: Start with **Google Gemini** (free). Upgrade to OpenAI or Claude if you want better quality.

**Q: How much will it cost?**
A: Gemini and Ollama are free. OpenAI/Claude typically cost $1-5/month for active job searching.

**Q: Is my resume data safe?**
A: Your data is only sent when you click "Analyze". It's processed and not stored by providers. For maximum privacy, use Ollama (runs locally).

**Q: Can I switch providers later?**
A: Yes! Just go back to Settings and change your provider anytime.

---

## Quick Start Summary

| Step | Action |
|------|--------|
| 1 | Pick a provider (start with Gemini - it's free) |
| 2 | Create account and get API key |
| 3 | Open app → AI Match tab → Settings (gear icon) |
| 4 | Select provider, paste key, save |
| 5 | Upload resume and start analyzing jobs! |

---

Good luck with your job search! 🎯
