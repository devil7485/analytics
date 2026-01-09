# 🌐 Deployment Guide

Complete guide to deploy your Solana Memecoin Analytics tool to production.

## Prerequisites

✅ Project tested locally and working  
✅ Helius API key obtained  
✅ Code pushed to GitHub (for most platforms)  
✅ Domain name (optional but recommended)

---

## Option 1: Vercel (Recommended) ⭐

**Best for**: Instant deployment, zero configuration, free tier

### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Select your repository
   - Configure:
     - Framework Preset: Next.js (auto-detected)
     - Root Directory: `./`
     - Build Command: `npm run build` (auto-filled)
     - Output Directory: `.next` (auto-filled)

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     Name: NEXT_PUBLIC_HELIUS_API_KEY
     Value: [Your Helius API Key]
     ```
   - Add optional:
     ```
     Name: NEXT_PUBLIC_SOLANA_RPC
     Value: https://api.mainnet-beta.solana.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

5. **Custom Domain** (Optional)
   - Go to project settings
   - Click "Domains"
   - Add your custom domain
   - Update DNS records as instructed

### Vercel Advantages
- ✅ Automatic HTTPS
- ✅ CDN worldwide
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Free for hobby projects
- ✅ Zero configuration needed

---

## Option 2: Netlify

**Best for**: Similar to Vercel, great CI/CD

### Deployment Steps

1. **Push to GitHub** (same as Vercel)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add:
     ```
     NEXT_PUBLIC_HELIUS_API_KEY=[Your Key]
     NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Site is live!

### Netlify Advantages
- ✅ Similar to Vercel
- ✅ Form handling
- ✅ Split testing
- ✅ Free tier available

---

## Option 3: Railway

**Best for**: More control, database support if needed

### Deployment Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Next.js
   - Add environment variables in settings:
     ```
     NEXT_PUBLIC_HELIUS_API_KEY=[Your Key]
     ```

4. **Deploy**
   - Click "Deploy"
   - Get your public URL

### Railway Advantages
- ✅ Easy PostgreSQL/Redis addition
- ✅ Simple pricing
- ✅ Good for scaling
- ✅ $5/month free credit

---

## Option 4: DigitalOcean App Platform

**Best for**: Traditional hosting feel, good pricing

### Deployment Steps

1. **Create Account**
   - Go to [digitalocean.com](https://digitalocean.com)
   - Sign up (get $200 credit with referral)

2. **Create App**
   - Apps → Create App
   - Connect GitHub
   - Select repository

3. **Configure**
   - Detected: Node.js
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment Variables:
     ```
     NEXT_PUBLIC_HELIUS_API_KEY=[Your Key]
     ```

4. **Choose Plan**
   - Basic: $5/month (512MB RAM)
   - Professional: $12/month (1GB RAM)

5. **Launch**
   - Click "Launch App"
   - Takes ~5 minutes

### DigitalOcean Advantages
- ✅ Predictable pricing
- ✅ Good performance
- ✅ Easy scaling
- ✅ Database options

---

## Option 5: AWS Amplify

**Best for**: AWS ecosystem integration

### Deployment Steps

1. **AWS Console**
   - Go to AWS Amplify
   - Choose "Host web app"
   - Connect GitHub

2. **Configure Build**
   - Framework: Next.js SSR
   - Add environment variables

3. **Deploy**
   - Auto-deploy on push
   - Global CDN

### AWS Advantages
- ✅ Part of AWS ecosystem
- ✅ Advanced features
- ✅ Enterprise-ready

---

## Option 6: Self-Hosted (VPS)

**Best for**: Maximum control, learning experience

### Requirements
- Ubuntu 22.04 LTS VPS
- Node.js 18+
- Nginx
- PM2 or systemd
- SSL certificate (Let's Encrypt)

### Quick Setup

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 5. Install dependencies
npm install

# 6. Create .env.local
nano .env.local
# Add your environment variables

# 7. Build
npm run build

# 8. Start with PM2
pm2 start npm --name "memecoin-analytics" -- start

# 9. Configure PM2 to start on reboot
pm2 startup
pm2 save

# 10. Install Nginx
sudo apt install nginx

# 11. Configure Nginx
sudo nano /etc/nginx/sites-available/your-domain.com
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 12. Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to git
- ✅ Use platform-specific env variable management
- ✅ Rotate API keys regularly

### API Keys
- ✅ Use read-only keys when possible
- ✅ Set up rate limiting (already included)
- ✅ Monitor usage on Helius dashboard

### CORS & Security Headers
Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

---

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (if using Vercel)
   - Real-time traffic
   - Performance metrics
   - Free tier available

2. **Google Analytics**
   - Add to `app/layout.tsx`
   - Track user behavior

3. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```

4. **Helius Dashboard**
   - Monitor API usage
   - Check rate limits
   - View costs

---

## 🚀 Performance Optimization

### 1. Enable Caching
Already implemented! Adjust TTL in `lib/cache.ts`

### 2. Image Optimization
Already using Next.js Image component

### 3. Code Splitting
Next.js does this automatically

### 4. CDN
Most platforms include CDN automatically

---

## 💰 Cost Breakdown

### Free Tier (Recommended for MVP)

| Service | Free Tier | Good For |
|---------|-----------|----------|
| Helius | 100k req/month | Perfect for MVP |
| Vercel | 100GB bandwidth | Up to 10k visitors/month |
| Netlify | 100GB bandwidth | Similar to Vercel |
| Railway | $5 credit/month | Light usage |

**Total Monthly Cost: $0** 🎉

### Paid Tier (For Growth)

| Service | Cost | When to Upgrade |
|---------|------|----------------|
| Helius Pro | $20/month | >100k requests |
| Vercel Pro | $20/month | >10k visitors |
| Railway | $5-20/month | Need database |
| Domain | $10-15/year | Professional look |

---

## 🔄 CI/CD Setup

Most platforms (Vercel, Netlify) have automatic deployments. For others:

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run deploy # Configure per platform
```

---

## ✅ Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Verify environment variables
- [ ] Check SSL certificate
- [ ] Test rate limiting
- [ ] Monitor initial traffic
- [ ] Set up error tracking
- [ ] Configure custom domain
- [ ] Share on social media
- [ ] Monitor API usage on Helius

---

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies installed
- Check build logs for specific errors

### Environment Variables Not Working
- Prefix with `NEXT_PUBLIC_` for client-side
- Restart build after adding variables
- Check for typos

### API Errors in Production
- Verify API key is correct
- Check Helius dashboard for issues
- Review rate limits

### Slow Performance
- Check Helius tier limits
- Review cache settings
- Consider upgrading hosting plan

---

## 🎯 Domain Setup

### Buy a Domain
Recommended registrars:
- Namecheap (~$10/year)
- Google Domains (~$12/year)
- Cloudflare (~$10/year)

### Connect to Platform

**Vercel:**
1. Project Settings → Domains
2. Add domain
3. Follow DNS instructions

**Netlify:**
1. Domain Settings → Add custom domain
2. Update nameservers or CNAME

**Others:**
Create A record pointing to platform IP

---

## 📈 Scaling Tips

### When to Scale

- API requests approaching limit
- Response times increasing
- Running out of bandwidth
- Need more compute power

### How to Scale

1. **Upgrade Helius Tier**
   - More requests
   - Better support

2. **Upgrade Hosting**
   - More RAM
   - More CPU
   - Better caching

3. **Add Redis**
   - Persistent caching
   - Better performance

4. **Use CDN**
   - Most platforms include
   - Faster global access

---

**Your app is ready for the world! 🚀**

For questions, check the main README or open an issue on GitHub.
