# Job Command Center

A comprehensive job search tracking application designed for strategic job seekers. Built with React + Vite for fast performance and easy deployment. **Works completely offline and without AI** - all AI features are optional.

## Quick Deploy for Free

The easiest way to get this running for your team:

### Option 1: Vercel (Recommended - 2 minutes)
1. Fork this repository to your GitHub account
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your forked repository
4. Click "Deploy" - done! Share the URL with your team.

### Option 2: Netlify (2 minutes)
1. Fork this repository to your GitHub account
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your forked repository
5. Deploy - share the URL with your team.

**Both options are free** and will automatically redeploy when you push updates.

---

## Features

### Core Tracking
- **Application Management**: Track all your job applications with detailed status history
- **Pipeline View**: Visual Kanban-style board showing applications by status
- **Dashboard Analytics**: Response rates, trends, and insights into what's working

### Campaign Management
- **Target Companies**: Maintain a list of 30-40 target companies with research notes
- **Company Research Hub**: Track company news, key people, pain points, and culture
- **2nd Degree Connections**: Find and track connections at target companies

### Networking & Outreach
- **Daily Touch Tracker**: Track your "5 touches per day" networking goal with streak tracking
- **Outreach Templates**: Save and reuse high-performing message templates
- **Contact Management**: Track contacts at each company with outreach history

### Quality & AI Features
- **Application Quality Tracking**: Track customized resumes, cover letters, and ATS optimization
- **AI Qualification Checklist**: Get AI-powered analysis of your fit for specific jobs
- **AI Job Coach**: Strategic coaching based on all your job search data

### Follow-up & Learning
- **Follow-up Cadence**: Never miss a follow-up with scheduled reminders
- **Rejection Learning Log**: Capture feedback and learnings from rejections
- **Pattern Analytics**: See where you're getting rejected and why

## Quick Start

### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd job_command_center_app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Configuration

### AI Features (Optional)

The app works fully without AI features. To enable AI-powered analysis:

1. Click the **Settings** (gear icon) in the top right
2. Go to the **AI Match** tab
3. Configure your preferred LLM provider:
   - **OpenAI**: GPT-4o, GPT-4o-mini, etc.
   - **Anthropic**: Claude models
   - **Google Gemini**: Free tier available
   - **Ollama**: Run locally for free (requires Ollama installed)

See [SETUP.md](./SETUP.md) for detailed API key configuration instructions.

## Deployment

### Static Hosting (Recommended)

The app builds to static files and can be hosted anywhere:

#### Vercel (Easiest)
1. Push your code to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Deploy - Vercel auto-detects Vite

#### Netlify
1. Push your code to GitHub
2. Import at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

#### GitHub Pages
1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json scripts: `"deploy": "npm run build && gh-pages -d dist"`
3. Run: `npm run deploy`

### Self-Hosted
Simply serve the `dist/` folder from any web server (nginx, Apache, etc.).

## Data Storage & Backup

All data is stored locally in your browser's localStorage. This means:
- **Privacy**: Your data never leaves your browser (except when using AI features)
- **No account needed**: Just start using it
- **Works offline**: Full functionality even without internet

### IMPORTANT: Back Up Your Data!
Since data is stored in your browser:
- Use the **Export** button regularly to save backups
- The Settings panel will remind you if it's been more than 7 days since your last backup
- To restore: Use the **Import** button to load your backup file
- Backups are JSON files you can store anywhere (Google Drive, Dropbox, email to yourself, etc.)

### Storage Keys
- `pharma_job_tracker_applications` - Job applications
- `pharma_job_tracker_resume_versions` - Resume versions
- `pharma_job_tracker_target_companies` - Target company list
- `pharma_job_tracker_networking_touches` - Networking activity
- `pharma_job_tracker_outreach_templates` - Message templates
- `pharma_job_tracker_llm_settings` - AI provider settings

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Switch to Table view |
| `2` | Switch to Pipeline view |
| `3` | Switch to Dashboard |
| `4` | Switch to Resumes |
| `5` | Switch to Companies |
| `6` | Switch to Networking |
| `7` | Switch to AI Match |
| `n` | Add new application |
| `/` | Focus search |
| `?` | Show keyboard shortcuts |

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Recharts** - Charts and analytics
- **Lucide React** - Icons
- **UUID** - Unique identifiers
- **Mammoth** - Word document parsing
- **PDF.js** - PDF parsing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own job search!

---

Built with care for job seekers navigating career transitions. Good luck with your search!
