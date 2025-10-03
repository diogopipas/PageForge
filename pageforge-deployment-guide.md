# PageForge Pro - Complete Deployment Guide

## 📦 Project Structure

```
pageforge/
├── frontend/                 # React app
│   ├── src/
│   │   ├── App.jsx          # Main PageForge component
│   │   └── index.js
│   ├── package.json
│   └── .env.production
├── backend/                  # Node.js API
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env
├── vercel.json              # Vercel config (frontend)
└── railway.json             # Railway config (backend)
```

## 🚀 Quick Deployment Steps

### Option 1: Vercel (Recommended - Easiest)

**Frontend + Backend in One**

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Create `vercel.json` in root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key"
  }
}
```

3. **Deploy:**
```bash
cd pageforge
vercel --prod
```

4. **Set environment variables:**
```bash
vercel env add ANTHROPIC_API_KEY
# Paste your Claude API key when prompted
```

### Option 2: Railway (Backend) + Netlify (Frontend)

**Backend on Railway:**

1. Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node backend/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Deploy:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

3. Set environment variables in Railway dashboard:
   - `ANTHROPIC_API_KEY` = your Claude API key
   - `FRONTEND_URL` = your frontend URL
   - `PORT` = 3001

**Frontend on Netlify:**

1. Create `netlify.toml`:
```toml
[build]
  command = "cd frontend && npm run build"
  publish = "frontend/build"

[build.environment]
  REACT_APP_API_ENDPOINT = "https://your-railway-app.railway.app/api/generate"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Option 3: DigitalOcean App Platform

1. Create `app.yaml`:
```yaml
name: pageforge
services:
  - name: api
    source_dir: backend
    environment_slug: node-js
    github:
      repo: yourusername/pageforge
      branch: main
    run_command: node server.js
    envs:
      - key: ANTHROPIC_API_KEY
        scope: RUN_TIME
        type: SECRET
      - key: PORT
        value: "8080"
    
  - name: web
    source_dir: frontend
    environment_slug: node-js
    build_command: npm run build
    run_command: npx serve -s build -l $PORT
    envs:
      - key: REACT_APP_API_ENDPOINT
        value: ${api.PUBLIC_URL}/api/generate
```

2. Push to GitHub and connect to DigitalOcean App Platform
3. Add `ANTHROPIC_API_KEY` secret in the dashboard

---

## 📋 Backend Package.json

Create `backend/package.json`:

```json
{
  "name": "pageforge-api",
  "version": "1.0.0",
  "type": "module",
  "description": "PageForge API server with Claude integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 📋 Frontend Package.json Updates

Add to your `frontend/package.json`:

```json
{
  "name": "pageforge-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:3001"
}
```

---

## 🔐 Environment Variables

### Backend `.env` file:
```bash
# Claude API Key (get from console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# Frontend URL (update for production)
FRONTEND_URL=https://pageforge.yourdomain.com

# Port
PORT=3001

# Optional: Database connection
DATABASE_URL=mongodb://localhost:27017/pageforge

# Optional: Stripe keys for payments
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Frontend `.env.production`:
```bash
REACT_APP_API_ENDPOINT=https://api.pageforge.com/api/generate
```

---

## 💳 Adding Stripe Payment Integration

### 1. Install Stripe in backend:
```bash
cd backend
npm install stripe
```

### 2. Add to `server.js`:
```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pricing tiers
const PRICING = {
  free: { generations: 3, price: 0 },
  starter: { generations: 50, price: 1900 }, // $19.00
  pro: { generations: 200, price: 4900 },    // $49.00
  unlimited: { generations: -1, price: 9900 } // $99.00
};

// Create checkout session
app.post('/api/create-checkout', async (req, res) => {
  const { plan } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `PageForge ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
          description: `${PRICING[plan].generations} landing page generations`,
        },
        unit_amount: PRICING[plan].price,
      },
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
  });

  res.json({ url: session.url });
});

// Webhook to handle successful payments
app.post('/api/webhook/stripe', 
  express.raw({type: 'application/json'}), 
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // TODO: Update user's subscription in database
      console.log('Payment successful:', session.id);
    }

    res.json({ received: true });
});
```

---

## 🗄️ Database Setup (Optional but Recommended)

### MongoDB Schema Example:

```javascript
// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  stripeCustomerId: String,
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'unlimited'],
    default: 'free'
  },
  generationsUsed: { type: Number, default: 0 },
  generationsLimit: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
  subscriptionEnd: Date
});

export default mongoose.model('User', userSchema);
```

### Connect to database in `server.js`:
```javascript
import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database error:', err));
```

---

## 🚦 Testing Your Deployment

### 1. Test API endpoint:
```bash
curl -X POST https://your-api.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Generate landing page for...",
    "formData": { "businessName": "TestCo", "industry": "saas" }
  }'
```

### 2. Test health check:
```bash
curl https://your-api.com/api/health
```

### 3. Monitor Claude API usage:
- Visit console.anthropic.com
- Check API usage dashboard
- Set spending limits

---

## 💰 Monetization Strategy

### Pricing Tiers:

| Plan | Price/Month | Generations | Target Audience |
|------|-------------|-------------|-----------------|
| Free | $0 | 3 | Trial users |
| Starter | $19 | 50 | Freelancers |
| Pro | $49 | 200 | Small agencies |
| Unlimited | $99 | Unlimited | Large agencies |

### Cost Breakdown:
- Claude API: ~$0.015 per generation (2000 tokens)
- Hosting: $10-50/month (Vercel/Railway)
- Stripe fees: 2.9% + $0.30 per transaction

### Profitability Example:
- 100 Starter subscribers: $1,900/month
- 25 Pro subscribers: $1,225/month
- API costs (2,500 gens): ~$37.50/month
- **Net profit: ~$3,087/month**

---

## 🔒 Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use environment variables for all secrets**
3. **Implement rate limiting** (already in backend code)
4. **Add user authentication** (Firebase, Auth0, or custom)
5. **Validate all inputs** on backend
6. **Use HTTPS only** in production
7. **Set up CORS properly** to only allow your domain

---

## 📊 Analytics & Monitoring

### Add Google Analytics to frontend:
```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Monitor API with Sentry:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🚀 Launch Checklist

- [ ] Get Claude API key from console.anthropic.com
- [ ] Set up Stripe account and get API keys
- [ ] Deploy backend to Railway/Vercel
- [ ] Deploy frontend to Netlify/Vercel
- [ ] Configure environment variables
- [ ] Test API endpoints
- [ ] Set up domain name and SSL
- [ ] Add payment integration
- [ ] Test complete user flow
- [ ] Set up monitoring and analytics
- [ ] Create marketing landing page
- [ ] Launch on Product Hunt
- [ ] Start marketing campaign

---

## 📈 Growth Tips

1. **SEO**: Create blog content about landing pages
2. **Free tier**: Let users try 3 generations for free
3. **Referral program**: Give credits for referrals
4. **Templates showcase**: Show examples on homepage
5. **Product Hunt launch**: Can drive 1000+ signups
6. **Reddit marketing**: Share in r/entrepreneur, r/SaaS
7. **YouTube demos**: Create tutorial videos
8. **Affiliate program**: 20% commission for referrals

---

## 🆘 Troubleshooting

### API returns 401 error:
- Check ANTHROPIC_API_KEY is set correctly
- Verify key at console.anthropic.com

### CORS errors:
- Update FRONTEND_URL in backend .env
- Check CORS configuration in server.js

### Rate limit errors:
- Increase limits in express-rate-limit config
- Check Claude API rate limits in console

### Deployment fails:
- Check all environment variables are set
- Verify package.json has correct dependencies
- Check logs in deployment dashboard

---

## 📞 Support & Resources

- **Claude API Docs**: https://docs.anthropic.com
- **Stripe Docs**: https://stripe.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app

---

## 🎯 Next Features to Add

1. **User authentication** (Firebase/Auth0)
2. **Save/edit pages** (database storage)
3. **More templates** (20+ designs)
4. **Image upload** for logos
5. **Custom domains** for generated pages
6. **A/B testing** features
7. **Analytics integration**
8. **Team collaboration** features
9. **White label** option for agencies
10. **API access** for developers

---

**You're ready to launch! 🎉**

Estimated time to first paying customer: 2-4 weeks
Estimated revenue at 6 months: $5,000-15,000/month
