# How to Get a Valid Gemini API Key

The AI Code Assistant feature requires a valid Google Gemini API key. Follow these steps:

## Step 1: Go to Google AI Studio
Visit: https://aistudio.google.com/app/apikey

## Step 2: Create API Key
1. Click "Get API Key" or "Create API Key"
2. Select or create a Google Cloud project
3. Copy the generated API key (starts with "AIza...")

## Step 3: Update Your .env File
1. Open the `.env` file in the root of this project
2. Replace the current key with your new key:
   ```
   VITE_GEMINI_API_KEY=YOUR_NEW_KEY_HERE
   ```
3. Save the file

## Step 4: Restart the Dev Server
Stop the current server (Ctrl+C) and run:
```bash
npm run dev
```

## Important Notes:
- The API key must have access to the Gemini API
- Free tier keys work fine for this application
- Keep your API key private (never commit .env to git)

## If You Don't Want to Use AI Features:
The app will work perfectly fine without the AI Code Assistant. You can still:
- Solve daily challenges
- Run test cases
- Track your streak
- Use hints

The AI Assistant is an optional enhancement feature.
