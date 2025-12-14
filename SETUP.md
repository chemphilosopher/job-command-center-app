# API Key Setup Guide

This guide walks you through setting up API keys for the AI features in Job Command Center. **All AI features are optional** - the app works fully without them.

---

## What is an API Key?

Think of an API key like a **password that lets this app talk to AI services**. When you analyze a job posting, the app sends your resume and the job description to the AI service, which sends back the analysis.

**Important things to know:**
- API keys are **free to create** (you only pay for usage)
- Your data is **only sent when you click "Analyze"**
- You can **delete your API key anytime** to stop access
- Each provider has different pricing (some are free!)

---

## Quick Recommendation

| Your Situation | Best Choice |
|----------------|-------------|
| Want to try AI features for free | **Google Gemini** (free tier) |
| Want best quality analysis | **OpenAI GPT-4o** or **Anthropic Claude** |
| Want 100% privacy / offline | **Ollama** (runs on your computer) |
| On a tight budget | **Google Gemini** (free) or **Ollama** (free) |

---

# Option 1: Google Gemini (FREE - Recommended to Start)

Google Gemini has a generous free tier - perfect for job searching. This is **the easiest option** if you have a Google/Gmail account.

## Step 1: Go to Google AI Studio

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to: **https://aistudio.google.com**
3. You'll see a Google sign-in page

**What you'll see:**
```
┌─────────────────────────────────────┐
│         Google AI Studio            │
│                                     │
│  [Sign in with Google]              │
│                                     │
└─────────────────────────────────────┘
```

4. Click **"Sign in with Google"**
5. Select your Gmail account (or enter your Gmail email/password)
6. If prompted, accept the terms of service

## Step 2: Get Your API Key

Once signed in, you'll see the AI Studio dashboard.

1. Look at the **left sidebar** (the menu on the left side of the screen)
2. Find and click **"Get API key"**

**What the sidebar looks like:**
```
┌──────────────────┐
│ ☰ AI Studio     │
├──────────────────┤
│ + Create         │
│ 📁 My Projects   │
│ 🔑 Get API key  │  ← Click this
│ 📚 Documentation │
└──────────────────┘
```

3. On the API keys page, click the blue **"Create API key"** button
4. A popup will appear - select **"Create API key in new project"**

**What the popup looks like:**
```
┌─────────────────────────────────────┐
│     Create API key                  │
│                                     │
│  ○ Create API key in new project    │  ← Select this
│  ○ Create API key in existing...    │
│                                     │
│         [Create API key]            │
└─────────────────────────────────────┘
```

5. Your API key will appear! It looks like this: `AIzaSyB-abc123def456...`

**IMPORTANT:**
- Click the **copy icon** (📋) next to the key to copy it
- The key is a long string starting with `AIza`
- You can always come back to this page to see your key again

## Step 3: Add to Job Command Center

1. Open the Job Command Center app in your browser
2. Click the **"AI Match"** tab at the top of the screen
3. Look for a **gear icon (⚙️)** - click it to open Settings
4. In the Settings panel:
   - **LLM Provider**: Select **"Google Gemini"** from the dropdown
   - **Model**: Select **"gemini-2.5-flash-preview-05-20"** (recommended)
   - **API Key**: Paste your key (Ctrl+V on Windows, Cmd+V on Mac)
5. Click **"Save"**

**What the settings look like:**
```
┌─────────────────────────────────────┐
│  AI Provider Settings               │
├─────────────────────────────────────┤
│  LLM Provider:                      │
│  [ Google Gemini          ▼]        │
│                                     │
│  Model:                             │
│  [ gemini-2.5-flash-preview ▼]      │
│                                     │
│  API Key:                           │
│  [ AIzaSyB-abc123def456... ]        │
│                                     │
│         [Cancel]  [Save]            │
└─────────────────────────────────────┘
```

## Step 4: Test It!

1. You should see a green **"AI Ready"** badge in the header
2. Go to the **AI Match** tab
3. Upload your resume (or paste text)
4. Paste a job description
5. Click **"Analyze"**

If you get results, you're all set!

## Gemini Free Tier Limits

| Limit | Amount |
|-------|--------|
| Requests per minute | 15 |
| Requests per day | 1,500 |
| Cost | **$0 (FREE)** |

This is **more than enough** for even heavy job searching!

## Troubleshooting Gemini

**"Invalid API key" error:**
- Make sure you copied the entire key (it's long!)
- Check there are no extra spaces before or after the key
- Try creating a new key at https://aistudio.google.com

**"Quota exceeded" error:**
- You've hit the free tier limit - wait until tomorrow
- Or upgrade to a paid plan in Google Cloud Console

---

# Option 2: OpenAI (ChatGPT)

OpenAI's GPT-4o provides high-quality analysis. This option **requires a credit card** but costs are typically $1-5/month.

## Step 1: Create an OpenAI Account

1. Go to: **https://platform.openai.com**
   - **Note:** This is different from chat.openai.com (ChatGPT)
   - The API platform is at **platform.openai.com**

2. Click **"Sign up"** in the top right corner

**What you'll see:**
```
┌─────────────────────────────────────┐
│  OpenAI                [Log in] [Sign up]
├─────────────────────────────────────┤
│                                     │
│  OpenAI Platform                    │
│  Build with our APIs                │
│                                     │
└─────────────────────────────────────┘
```

3. Choose how to sign up:
   - **Email**: Enter email, create password, verify email
   - **Google**: Click "Continue with Google"
   - **Microsoft**: Click "Continue with Microsoft"

4. Complete the signup process:
   - Verify your email (check your inbox, click the link)
   - Enter your name and organization (can be "Personal")
   - Verify your phone number (they'll text you a code)

## Step 2: Add Payment Method (Required)

OpenAI requires a payment method before you can use the API.

1. After logging in, click your **profile icon** (circle in top right)
2. Click **"Settings"**
3. In the left sidebar, click **"Billing"**

**What the sidebar looks like:**
```
┌──────────────────┐
│ Settings         │
├──────────────────┤
│ Profile          │
│ Organization     │
│ Billing          │  ← Click this
│ Limits           │
│ API keys         │
└──────────────────┘
```

4. Click **"Add payment method"**
5. Enter your credit card details
6. **IMPORTANT - Set a spending limit:**
   - Go to **"Limits"** in the sidebar
   - Set **"Monthly budget"** to $10 (or whatever you're comfortable with)
   - This prevents surprise bills!

**Recommended limits for job searching:**
```
┌─────────────────────────────────────┐
│  Usage Limits                       │
├─────────────────────────────────────┤
│  Monthly budget: $10                │
│  Email alert at: $5                 │
└─────────────────────────────────────┘
```

## Step 3: Generate Your API Key

1. In the left sidebar, click **"API keys"**
   - Or go directly to: **https://platform.openai.com/api-keys**

2. Click the green **"+ Create new secret key"** button

3. Give it a name: `Job Command Center` (or anything you'll remember)

4. Click **"Create secret key"**

**CRITICAL:**
```
┌─────────────────────────────────────┐
│  ⚠️  Save your key!                 │
│                                     │
│  sk-proj-abc123def456ghi789...      │
│                        [Copy]       │
│                                     │
│  You won't be able to see this      │
│  key again after closing this       │
│  window!                            │
│                                     │
│              [Done]                 │
└─────────────────────────────────────┘
```

- **Copy the key NOW** - you will never see it again!
- The key starts with `sk-` (usually `sk-proj-...`)
- If you lose it, you'll need to create a new one

## Step 4: Add to Job Command Center

1. Open the Job Command Center app
2. Click the **"AI Match"** tab
3. Click the **gear icon (⚙️)** for Settings
4. Configure:
   - **LLM Provider**: Select **"OpenAI"**
   - **Model**: Select **"gpt-4o-mini"** (recommended - best value)
   - **API Key**: Paste your key
5. Click **"Save"**

## OpenAI Cost Estimate

| Model | Quality | Cost per Analysis | Monthly Estimate |
|-------|---------|-------------------|------------------|
| gpt-4o-mini | Great | ~$0.01 | $1-3/month |
| gpt-4o | Best | ~$0.03 | $3-10/month |

**Recommendation:** Start with **gpt-4o-mini** - it's excellent for job analysis and very affordable.

## Troubleshooting OpenAI

**"Invalid API key" error:**
- Make sure you're using an API key (starts with `sk-`), not your account password
- Check that you copied the entire key
- Create a new key if needed

**"You exceeded your current quota" error:**
- Add credits to your account in Billing settings
- Check if your spending limit was reached

**"Rate limit exceeded" error:**
- Wait a minute and try again
- You're making too many requests too quickly

---

# Option 3: Anthropic Claude

Claude excels at nuanced analysis and thoughtful recommendations. Requires **prepaid credits** (minimum $5).

## Step 1: Create an Anthropic Account

1. Go to: **https://console.anthropic.com**

**What you'll see:**
```
┌─────────────────────────────────────┐
│         Anthropic Console           │
│                                     │
│  [Sign in]  [Sign up]               │
│                                     │
└─────────────────────────────────────┘
```

2. Click **"Sign up"**
3. Enter your email address
4. Create a password (must be strong)
5. Click **"Create account"**
6. **Check your email** for a verification link
7. Click the link in the email to verify your account

## Step 2: Add Credits (Required)

Unlike OpenAI (which bills you later), Anthropic requires you to **buy credits upfront**.

1. After logging in, look at the **left sidebar**
2. Click **"Settings"** (near the bottom)
3. Click **"Billing"**

**What the billing page looks like:**
```
┌─────────────────────────────────────┐
│  Billing                            │
├─────────────────────────────────────┤
│  Credit Balance: $0.00              │
│                                     │
│  [Add payment method]               │
│  [Buy credits]                      │
└─────────────────────────────────────┘
```

4. Click **"Add payment method"**
5. Enter your credit card details
6. Click **"Buy credits"**
7. Select an amount (minimum $5)
   - $5 will last **weeks** of job searching
8. Complete the purchase

## Step 3: Generate Your API Key

1. In the left sidebar, click **"API Keys"**
   - Or go to: **https://console.anthropic.com/settings/keys**

2. Click **"Create Key"**

3. Give it a name: `Job Command Center`

4. Click **"Create Key"**

**What you'll see:**
```
┌─────────────────────────────────────┐
│  Your new API key                   │
│                                     │
│  sk-ant-api03-abc123def456...       │
│                        [Copy]       │
│                                     │
│  Make sure to copy this key now.    │
│  You won't be able to see it again! │
│                                     │
│              [Done]                 │
└─────────────────────────────────────┘
```

- Copy the key immediately!
- It starts with `sk-ant-`
- You can create new keys anytime, but can't see old ones

## Step 4: Add to Job Command Center

1. Open the Job Command Center app
2. Click the **"AI Match"** tab
3. Click the **gear icon (⚙️)** for Settings
4. Configure:
   - **LLM Provider**: Select **"Anthropic (Claude)"**
   - **Model**: Select **"claude-sonnet-4-20250514"** (recommended)
   - **API Key**: Paste your key
5. Click **"Save"**

## Claude Cost Estimate

| Model | Quality | Cost per Analysis | Monthly Estimate |
|-------|---------|-------------------|------------------|
| Claude 3.5 Haiku | Good | ~$0.005 | $0.50-2/month |
| Claude Sonnet 4 | Best | ~$0.015 | $1-5/month |

**Recommendation:** Start with **Claude Sonnet 4** - it's excellent for nuanced job analysis.

## Troubleshooting Claude

**"Invalid API key" error:**
- Make sure the key starts with `sk-ant-`
- Check for extra spaces
- Create a new key if needed

**"Insufficient credits" error:**
- Add more credits in the Billing section
- Check your credit balance

**"Permission denied" error:**
- Your account may not be fully set up
- Make sure you've verified your email
- Try logging out and back in

---

# Option 4: Ollama (FREE - Runs Locally)

Ollama runs AI models **on your own computer**. 100% free, 100% private - your data never leaves your machine.

## Requirements

Before starting, check your computer meets these requirements:

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| RAM | 8GB | 16GB |
| Free disk space | 5GB | 10GB |
| Operating System | Windows 10+, macOS 11+, Linux | Any |

## Step 1: Install Ollama

### On Windows:

1. Go to: **https://ollama.com/download**
2. Click **"Download for Windows"**
3. Open the downloaded file (`OllamaSetup.exe`)
4. Follow the installation wizard:
   - Click **"Next"**
   - Accept the license agreement
   - Click **"Install"**
   - Click **"Finish"**
5. Ollama will start automatically

### On Mac:

1. Go to: **https://ollama.com/download**
2. Click **"Download for macOS"**
3. Open the downloaded file (`Ollama-darwin.zip`)
4. Drag **Ollama** to your Applications folder
5. Open Ollama from Applications
6. You'll see the Ollama icon (🦙) in your menu bar

### On Linux:

Open Terminal and run:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## Step 2: Download a Model

Ollama needs to download an AI model to your computer. This is a one-time download.

1. **Open a terminal/command prompt:**
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter
   - **Linux**: Press `Ctrl + Alt + T`

2. **Download a model** by typing this command and pressing Enter:
```bash
ollama pull llama3.1
```

**What you'll see:**
```
pulling manifest
pulling 8eeb52dfb3bb... 100% ████████████████ 4.7 GB
pulling 73b313b5552d... 100% ████████████████ 1.4 KB
pulling fa8235e5b48f... 100% ████████████████ 7.0 KB
verifying sha256 digest
writing manifest
success
```

3. Wait for the download to complete (5-15 minutes depending on your internet)

## Step 3: Make Sure Ollama is Running

**On Windows:**
- Ollama usually starts automatically
- Look for the 🦙 icon in your system tray (bottom right)
- If not running, search for "Ollama" in the Start menu and open it

**On Mac:**
- Look for the 🦙 icon in your menu bar (top right)
- If not there, open Ollama from Applications

**On Linux:**
- Open Terminal and run: `ollama serve`
- Keep this terminal window open while using the app

## Step 4: Add to Job Command Center

1. Make sure Ollama is running (check for the 🦙 icon)
2. Open the Job Command Center app
3. Click the **"AI Match"** tab
4. Click the **gear icon (⚙️)** for Settings
5. Configure:
   - **LLM Provider**: Select **"Ollama (Local)"**
   - **Model**: Select **"llama3.1"** (or whatever you downloaded)
   - **API Key**: Leave blank (not needed!)
6. Click **"Save"**

## Recommended Models for Ollama

| Model | Size | RAM Needed | Quality | Speed | Command |
|-------|------|-----------|---------|-------|---------|
| phi3 | 2.3GB | 4GB | Good | Fast | `ollama pull phi3` |
| llama3.1 | 4.7GB | 8GB | Great | Medium | `ollama pull llama3.1` |
| mistral | 4.1GB | 8GB | Great | Fast | `ollama pull mistral` |

**Recommendation:**
- Low RAM (8GB): Use **phi3**
- More RAM (16GB+): Use **llama3.1** for better quality

## Troubleshooting Ollama

**"Connection refused" error:**
- Ollama isn't running
- **Windows/Mac**: Look for 🦙 icon, or restart Ollama from Start menu/Applications
- **Linux**: Run `ollama serve` in a terminal

**"Model not found" error:**
- You haven't downloaded the model yet
- Run: `ollama pull llama3.1` (or your chosen model)
- Check installed models: `ollama list`

**Very slow responses:**
- Close other applications to free up RAM
- Try a smaller model like `phi3`
- Check if your computer meets the minimum requirements

**Download stuck or failed:**
- Check your internet connection
- Try again: `ollama pull llama3.1`
- Delete partial download: `ollama rm llama3.1` then try again

---

# How to Configure in the App

Once you have your API key, here's how to add it:

```
Step 1: Open Job Command Center
        ↓
Step 2: Click "AI Match" tab at the top
        ↓
Step 3: Click the gear icon (⚙️) to open Settings
        ↓
Step 4: Select your provider from dropdown
        ↓
Step 5: Select a model
        ↓
Step 6: Paste your API key (not needed for Ollama)
        ↓
Step 7: Click "Save"
        ↓
Step 8: Look for green "AI Ready" badge ✓
```

---

# Security Tips

1. **Never share your API keys** - treat them like passwords
2. **Set spending limits** - prevent surprise bills (especially OpenAI)
3. **Create dedicated keys** - use a separate key for each app
4. **Monitor usage** - check your provider's dashboard weekly
5. **Revoke old keys** - delete keys you no longer use

---

# Troubleshooting

## "API Key Required" Error
- Make sure you entered the key in Settings → AI Match tab
- Check for extra spaces before/after the key
- Verify you selected the correct provider

## "Unauthorized" or "Invalid Key" Error
- Double-check you copied the entire key
- Make sure the key is for the right provider:
  - OpenAI keys start with `sk-`
  - Anthropic keys start with `sk-ant-`
  - Gemini keys start with `AIza`
- Try generating a new key

## "Insufficient Credits" Error
- Add more credits in your provider's billing settings
- Switch to Google Gemini (free tier)

## Responses are Slow
- Try a faster model (gpt-4o-mini, gemini-2.5-flash, phi3)
- Check your internet connection
- For Ollama: close other apps to free RAM

## "Network Error" or "Failed to Fetch"
- Check your internet connection
- The provider's service may be down - try again later
- Check if your firewall is blocking the connection

---

# ⚠️ Security Warnings

## Shared Computer Warning

**If you're using a shared or public computer:**

1. **Never save your API key** on shared computers
2. **Use the "Clear API Keys Only" button** in Settings before leaving
3. **Clear your browser data** when you're done (History → Clear browsing data)
4. **Consider using a private/incognito window** - all data is erased when you close it

**The "Clear API Keys Only" feature** (in Settings) removes your API keys while keeping your job tracking data. This is safer than "Clear All Data" if you want to keep your applications but remove sensitive credentials.

## API Key Safety

Your API keys are stored in your browser's **localStorage** - this means:

| Scenario | Your Keys Are... |
|----------|------------------|
| Different browser (Chrome vs Firefox) | **Separate** - each browser has its own storage |
| Different device | **Not shared** - keys stay on this device only |
| Incognito/Private window | **Temporary** - erased when window closes |
| Browser data cleared | **Deleted** - you'll need to re-enter them |
| Same browser, different user | **Potentially visible** - be careful on shared profiles |

**Best Practices:**

1. **Use a dedicated key** for this app - don't reuse keys from other projects
2. **Set spending limits** on your API provider accounts (especially OpenAI)
3. **Delete unused keys** from your provider's dashboard periodically
4. **Use Ollama** for maximum privacy - runs locally, no API keys needed
5. **Clear keys before sharing** your computer with others

**If you think your key was compromised:**
1. Go to your provider's dashboard immediately
2. Revoke/delete the compromised key
3. Create a new key
4. Update the key in Job Command Center settings

---

# FAQ

**Q: Do I need an API key to use the app?**
A: No! All core tracking features work without AI. API keys only enable AI analysis.

**Q: Which provider is best?**
A: Start with **Google Gemini** (free). Upgrade to OpenAI or Claude if you want better quality.

**Q: How much will it cost?**
A: Gemini and Ollama are **free**. OpenAI/Claude typically cost **$1-5/month** for active job searching.

**Q: Is my resume data safe?**
A: Your data is only sent when you click "Analyze". It's processed and not stored by providers. For maximum privacy, use Ollama (runs locally).

**Q: Can I switch providers later?**
A: Yes! Just go back to Settings and change your provider anytime.

**Q: What if I run out of credits?**
A: The app still works for tracking jobs - you just can't use AI analysis. Add credits or switch to Gemini (free).

**Q: Do I need technical skills?**
A: No! Just follow the step-by-step instructions above. If you can copy/paste, you can set this up.

---

# Quick Start Summary

| Step | Action |
|------|--------|
| 1 | Pick a provider (start with **Gemini** - it's free) |
| 2 | Create account at provider's website |
| 3 | Find and copy your API key |
| 4 | Open app → AI Match tab → Settings (gear icon) |
| 5 | Select provider, paste key, save |
| 6 | Upload resume and start analyzing jobs! |

---

# Still Stuck?

If you're having trouble:

1. **Try Gemini first** - it's the easiest to set up
2. **Double-check the key** - make sure you copied the whole thing
3. **Check your internet** - API calls need internet access
4. **Try a different browser** - some browsers have strict security settings

Good luck with your job search!
