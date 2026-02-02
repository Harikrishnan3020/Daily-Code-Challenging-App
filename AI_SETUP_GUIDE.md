# AI Problem Generation Setup Guide

## 🎯 What's Happening?

The "AI Generation Failed" message appears when the app tries to generate a new coding problem using AI but doesn't have the required API keys configured. When this happens, the app automatically falls back to using curated classic problems from the static problem set.

## ✅ Solution: Add Your API Key

You have **two options** to enable AI-generated problems:

### Option 1: Through the App Settings (Recommended)
1. Click on your profile or navigate to **Settings** in the app
2. Scroll to the **API Configuration** section
3. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Paste your API key in the input field
5. Click **Save Key**
6. Refresh the page or click "Next Challenge" to generate a new AI problem!

### Option 2: Using Environment Variables
1. Copy `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   VITE_GROQ_API_KEY=your_groq_key_here  # Optional fallback
   ```
3. Restart the development server:
   ```bash
   npm run dev
   ```

## 🔑 Getting API Keys

### Google Gemini API (Primary)
- **Free tier**: 60 requests per minute
- **Get it here**: https://aistudio.google.com/app/apikey
- **Steps**:
  1. Sign in with your Google account
  2. Click "Get API Key"
  3. Create a new API key
  4. Copy and save it securely

### Groq API (Optional Fallback)
- **Free tier**: Very generous limits
- **Get it here**: https://console.groq.com/keys
- **Note**: This is optional and only used if Gemini fails

## 🎨 What Changes Were Made?

### 1. Improved Error Messages
- **Before**: "AI Generation Failed - Using a classic problem instead"
- **After**: 
  - If no API key: "🔑 API Key Required - Add your Gemini API key in Settings to unlock AI-generated problems!" with a direct link to Settings
  - If other error: "Using Classic Problem - AI generation temporarily unavailable. You're getting a curated challenge instead!"

### 2. Better User Experience
- Error messages now include actionable buttons
- Toast notifications are more informative and friendly
- Longer duration for important messages (6 seconds for API key requirement)

## 🚀 Benefits of AI Generation

With AI generation enabled, you get:
- **Unique problems** tailored to your skill level
- **Adaptive learning** - problems focus on your weak areas
- **Infinite variety** - never run out of challenges
- **Personalized difficulty** - problems match your progress

## 📝 Fallback Behavior

Even without API keys, the app works perfectly:
- Uses a curated set of **50+ classic coding problems**
- Problems are filtered by your current difficulty level
- All features (hints, test cases, XP, streaks) work normally
- You can always add an API key later to unlock AI generation

## 🔒 Security Note

- API keys stored in the app Settings are saved in **localStorage** (browser only)
- Keys are never sent to any server except Google's/Groq's official APIs
- For production apps, consider using a backend proxy to protect API keys
- Never commit `.env` files to version control (already in `.gitignore`)

## 🐛 Troubleshooting

**Problem**: Still seeing "AI Generation Failed" after adding key
- **Solution**: Make sure you saved the key and refreshed the page

**Problem**: "Invalid API Key" error
- **Solution**: Double-check your key from Google AI Studio, ensure no extra spaces

**Problem**: API key works but still getting classic problems
- **Solution**: Check browser console for detailed error messages

---

**Need help?** Check the browser console (F12) for detailed error logs.
