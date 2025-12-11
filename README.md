<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NeuroSIMRS - Agentic AI Hospital System

Multi-Agent AI system untuk manajemen rumah sakit dengan 4 agent khusus: Admin & Billing, Pharmacy, Laboratory, dan Staff Resources.

View your app in AI Studio: https://ai.studio/apps/drive/1LezAntBluoJBfsTIudRtf1UcDlbZE1ic

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` environment variable:
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local and add your Gemini API key
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`

## Deploy to Netlify

### Method 1: Netlify UI (Recommended)

1. Push your code to GitHub
2. Login to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will auto-detect the settings from `netlify.toml`
6. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
7. Click "Deploy"

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

**Important:** Don't forget to set the `GEMINI_API_KEY` environment variable in Netlify dashboard under:
Site settings → Build & deploy → Environment variables

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Google Gemini AI (Function Calling)
- Recharts (Data Visualization)
- Tailwind CSS
- Lucide Icons
