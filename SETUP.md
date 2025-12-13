# API Key Setup Guide

This guide walks you through setting up API keys for the AI features in Job Command Center. **All AI features are optional** - the app works fully without them.

## Supported LLM Providers

| Provider | Cost | Best For |
|----------|------|----------|
| OpenAI | Pay-per-use (~$0.01-0.03/analysis) | Best quality, most reliable |
| Anthropic (Claude) | Pay-per-use (~$0.01-0.02/analysis) | Excellent reasoning |
| Google Gemini | **Free tier available** | Budget-conscious users |
| Ollama | **Free (local)** | Privacy-focused, offline use |

---

## OpenAI Setup

OpenAI provides GPT-4o and GPT-4o-mini models.

### Steps:

1. **Create an Account**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in

2. **Add Payment Method**
   - Go to Settings > Billing
   - Add a payment method (required even for small usage)
   - Set a usage limit to control costs

3. **Generate API Key**
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Give it a name like "Job Command Center"
   - Copy the key (you won't see it again!)

4. **Configure in App**
   - Open Job Command Center
   - Click Settings (gear icon) > AI Match tab
   - Select "OpenAI" as provider
   - Paste your API key
   - Choose a model (gpt-4o-mini is cost-effective)

### Cost Estimate
- GPT-4o-mini: ~$0.01 per job analysis
- GPT-4o: ~$0.03 per job analysis
- Monthly cost for active job search: $1-5

---

## Anthropic (Claude) Setup

Anthropic provides Claude models known for thoughtful, nuanced responses.

### Steps:

1. **Create an Account**
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Sign up with email

2. **Add Credits**
   - Go to Settings > Billing
   - Add a payment method
   - Purchase credits ($5 minimum)

3. **Generate API Key**
   - Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
   - Click "Create Key"
   - Copy the key

4. **Configure in App**
   - Open Job Command Center
   - Click Settings > AI Match tab
   - Select "Anthropic (Claude)" as provider
   - Paste your API key
   - Choose a model (claude-sonnet-4 recommended)

### Cost Estimate
- Claude Sonnet 4: ~$0.015 per analysis
- Claude 3.5 Sonnet: ~$0.01 per analysis
- Monthly cost: $1-5

---

## Google Gemini Setup (Free Tier Available!)

Google Gemini offers a generous free tier - great for trying out AI features.

### Steps:

1. **Get API Key**
   - Go to [aistudio.google.com](https://aistudio.google.com)
   - Sign in with Google account
   - Click "Get API Key" in the left sidebar
   - Click "Create API Key"
   - Choose "Create API key in new project"
   - Copy the key

2. **Configure in App**
   - Open Job Command Center
   - Click Settings > AI Match tab
   - Select "Google Gemini" as provider
   - Paste your API key
   - Choose gemini-1.5-flash (free tier friendly)

### Free Tier Limits
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per minute

This is more than enough for job searching!

### Cost (Beyond Free Tier)
- Gemini 1.5 Flash: ~$0.001 per analysis
- Gemini 1.5 Pro: ~$0.007 per analysis

---

## Ollama Setup (Free & Local)

Ollama runs AI models locally on your computer. Completely free and private.

### Requirements
- 8GB+ RAM (16GB recommended)
- 5-10GB disk space per model

### Steps:

1. **Install Ollama**

   **macOS:**
   ```bash
   brew install ollama
   ```

   **Linux:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

   **Windows:**
   Download from [ollama.com/download](https://ollama.com/download)

2. **Start Ollama**
   ```bash
   ollama serve
   ```
   (Keep this running in a terminal)

3. **Download a Model**
   ```bash
   # Recommended for job analysis
   ollama pull llama3.1

   # Smaller/faster option
   ollama pull phi3

   # Best quality (requires 16GB+ RAM)
   ollama pull llama3.1:70b
   ```

4. **Configure in App**
   - Open Job Command Center
   - Click Settings > AI Match tab
   - Select "Ollama (Local)" as provider
   - No API key needed!
   - Choose the model you downloaded

### Recommended Models
| Model | RAM Needed | Quality | Speed |
|-------|-----------|---------|-------|
| phi3 | 4GB | Good | Fast |
| llama3 | 8GB | Great | Medium |
| llama3.1 | 8GB | Great | Medium |
| mistral | 8GB | Great | Fast |

### Troubleshooting
- Make sure `ollama serve` is running
- Test connection: `curl http://localhost:11434/api/tags`
- Check model is downloaded: `ollama list`

---

## Security Best Practices

1. **Never share your API keys** - Treat them like passwords
2. **Set spending limits** - Most providers allow this
3. **Use separate keys** - Create a key just for this app
4. **Rotate keys periodically** - Generate new ones monthly
5. **Monitor usage** - Check provider dashboards for unexpected activity

---

## Troubleshooting

### "API Key Required" Error
- Make sure you've entered the key in Settings > AI Match
- Check for spaces before/after the key
- Verify the key is for the correct provider

### "API Error" Messages
- Check your internet connection
- Verify the API key is valid (try in provider's playground)
- Check if you have credits/quota remaining

### Slow Responses
- Try a faster model (gpt-4o-mini, gemini-1.5-flash, phi3)
- For Ollama, ensure nothing else is using RAM
- Check your internet speed for cloud providers

### Ollama Not Connecting
- Ensure `ollama serve` is running
- Check port 11434 is not blocked
- Try `ollama run llama3.1` to verify model works

---

## FAQ

**Q: Do I need an API key to use the app?**
A: No! All core features work without AI. API keys only enable AI analysis and coaching.

**Q: Which provider should I choose?**
A: Start with Google Gemini (free) or Ollama (local/free). Upgrade to OpenAI or Anthropic for better quality.

**Q: Is my data sent to AI providers?**
A: Only when you click "Analyze" or use AI Coach. Your data is sent to process the request and is not stored by providers.

**Q: How much will this cost me?**
A: With Gemini free tier or Ollama: $0. With OpenAI/Anthropic: typically $1-5/month for active job searching.

---

Happy job hunting! The AI features are here to help, but the real magic is your consistent effort and strategic approach.
