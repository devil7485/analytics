# 🚀 Quick Start Guide

Get your Solana Memecoin Analytics tool running in 5 minutes!

## Step 1: Get Your Helius API Key (2 minutes)

1. Go to [https://helius.dev](https://helius.dev)
2. Click "Sign Up" (top right)
3. Create account with email or Google
4. Click "Create New API Key"
5. Name it "Memecoin Analytics"
6. Click "Create"
7. **Copy your API key** (you'll need it next!)

## Step 2: Set Up Project (1 minute)

Open your terminal in VS Code:

```bash
# Navigate to project folder
cd solana-memecoin-analytics

# Install dependencies
npm install
```

## Step 3: Configure Environment (1 minute)

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` in VS Code

3. Replace `your_helius_api_key_here` with your actual API key:
```env
NEXT_PUBLIC_HELIUS_API_KEY=your_actual_key_here
```

4. Save the file (Ctrl+S / Cmd+S)

## Step 4: Run the App (1 minute)

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 3.2s
```

## Step 5: Test It Out! 🎉

1. Open browser to [http://localhost:3000](http://localhost:3000)

2. Click on "BONK" example token (or paste this address):
   ```
   DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
   ```

3. Click "Analyze" button

4. Wait 3-5 seconds for analysis

5. See the magic! ✨

## 🎯 What You Should See

- ✅ Token name, symbol, and logo
- ✅ Total traders and trades count
- ✅ Highest and lowest prices
- ✅ Top buyer wallet
- ✅ Most profitable wallet
- ✅ Biggest loser wallet
- ✅ Beautiful price chart

## 🔥 Pro Tips

### Try These Test Tokens

**BONK** (High activity):
```
DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
```

**WIF** (Very popular):
```
EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm
```

### Test Caching
1. Analyze a token (takes 3-5 seconds)
2. Analyze the same token again (instant!)
3. See the green "Loaded from cache" message

### Test Rate Limiting
Try analyzing 11 different tokens in 1 minute - you'll get rate limited on the 11th!

## 🐛 Quick Troubleshooting

### Problem: "Module not found" errors
**Solution**: Run `npm install` again

### Problem: "Invalid API key"
**Solution**: 
- Check your `.env.local` file
- Make sure there are no extra spaces
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

### Problem: Port 3000 already in use
**Solution**: 
- Kill the process using port 3000, or
- Run on different port: `npm run dev -- -p 3001`

### Problem: "No trading history found"
**Solution**: Try one of the example tokens above - they definitely have trading history!

## 🌐 Deploy to Production

Ready to share with the world?

### Deploy to Vercel (Easiest - 5 minutes)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repo

5. Add environment variable:
   - Name: `NEXT_PUBLIC_HELIUS_API_KEY`
   - Value: Your Helius API key

6. Click "Deploy"

7. Done! Your app is live 🎉

## 📱 Share Your App

Once deployed, you'll get a URL like:
```
https://your-app-name.vercel.app
```

Share it with friends, on Twitter, or anywhere you'd like!

## 🎓 Next Steps

- Customize the colors (edit `tailwind.config.js`)
- Change fonts (edit `app/globals.css`)
- Add more features (check README.md)
- Share on Twitter with #Solana hashtag

## 💬 Need Help?

- Check the main README.md for detailed docs
- Review code comments in each file
- Visit Helius docs: [docs.helius.dev](https://docs.helius.dev)

---

**You're all set! Happy analyzing! 🚀**
