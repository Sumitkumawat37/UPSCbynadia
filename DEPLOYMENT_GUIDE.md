# Deployment Guide - UPSC Nadiya Platform

This guide will help you deploy both the frontend and backend to Vercel with the backend always running for email functionality.

## Prerequisites

- GitHub account with repositories for both frontend and backend
- Vercel account (connected to GitHub)
- Gmail account with app-specific password for nodemailer
- Supabase project configured

## Step 1: Deploy Backend to Vercel

### 1.1 Push Backend to GitHub

```bash
cd C:\Users\ASUS\Desktop\teachingplatform-backend\backend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/teachingplatform-backend.git
git push -u origin main
```

### 1.2 Deploy Backend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your `teachingplatform-backend` repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `SMTP_USER`: Your Gmail address (e.g., nadiyakhan0205@gmail.com)
   - `SMTP_PASS`: Your Gmail app-specific password
   - `SMTP_FROM_NAME`: UPSC by Nadiya Maam
   - `FRONTEND_URL`: Your frontend URL (e.g., https://your-frontend.vercel.app)
   - `PORT`: 5000

6. Click "Deploy"

### 1.3 Configure Backend for Always-On

Vercel serverless functions have execution time limits. For always-on email service, use one of these options:

**Option A: Use Vercel Cron Jobs (Recommended)**
- Add a `vercel.json` in backend root with cron configuration
- This keeps the backend warm and responsive

**Option B: Use a Dedicated Server**
- Deploy backend to Render, Railway, or DigitalOcean
- Update frontend `VITE_BACKEND_URL` to point to the dedicated server

**Option C: Use Vercel Edge Functions**
- Convert backend to use Vercel Edge Functions
- Better for API endpoints but may have limitations for schedulers

### 1.4 Get Backend URL

After deployment, Vercel will provide a URL like:
```
https://teachingplatform-backend.vercel.app
```

Copy this URL for the frontend configuration.

## Step 2: Deploy Frontend to Vercel

### 2.1 Push Frontend to GitHub

```bash
cd C:\Users\ASUS\Desktop\teachingplatform-main
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/teachingplatform-main.git
git push -u origin main
```

### 2.2 Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your `teachingplatform-main` repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key
   - `VITE_BACKEND_URL`: Your backend URL from Step 1.4

6. Click "Deploy"

### 2.3 Get Frontend URL

After deployment, Vercel will provide a URL like:
```
https://teachingplatform-main.vercel.app
```

## Step 3: Update Backend Environment Variable

1. Go to your backend project on Vercel
2. Navigate to Settings → Environment Variables
3. Update `FRONTEND_URL` with your frontend URL from Step 2.3
4. Redeploy the backend

## Step 4: Test Email Functionality

1. Visit your frontend URL
2. Try signing up a new account
3. Check if verification email is sent
4. Try password reset functionality
5. Check if reset email is sent

## Step 5: Configure Custom Domains (Optional)

### 5.1 Frontend Custom Domain
1. Go to frontend project on Vercel
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### 5.2 Backend Custom Domain
1. Go to backend project on Vercel
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update frontend `VITE_BACKEND_URL` environment variable

## Important Notes

### Email Service Always-On
For production, consider these alternatives to ensure email service is always available:

1. **Render.com** - Free tier with always-on web service
2. **Railway.app** - Paid but reliable with background workers
3. **DigitalOcean** - Full control with dedicated server
4. **AWS Lambda + API Gateway** - Serverless with cron jobs

### Gmail App-Specific Password
To get a Gmail app-specific password:
1. Go to Google Account settings
2. Security → 2-Step Verification
3. App passwords → Generate
4. Use this password in `SMTP_PASS` environment variable

### Supabase Configuration
Ensure your Supabase project has:
- Email confirmation enabled/disabled as per your preference
- Correct redirect URLs configured in Supabase dashboard
- Row Level Security (RLS) policies set up

### Monitoring
- Set up Vercel Analytics for both projects
- Monitor email delivery rates
- Set up error tracking (Sentry, LogRocket, etc.)

## Troubleshooting

### Backend Not Responding
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Ensure SMTP credentials are valid

### Emails Not Sending
- Verify Gmail app-specific password
- Check if email is in spam folder
- Test SMTP connection locally first

### Frontend Cannot Connect to Backend
- Verify `VITE_BACKEND_URL` is correct
- Check CORS configuration in backend
- Ensure backend is deployed and accessible

## Cost Considerations

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - Serverless functions with 60s timeout
  - Good for MVP and testing

- **Paid Plans**: 
  - Better for production with higher limits
  - Consider if you have high traffic

## Alternative: Deploy to Railway (Recommended for Backend)

Railway provides better support for always-on services:

1. Create Railway account
2. Import backend repository
3. Configure environment variables
4. Railway keeps the service running 24/7
5. Update frontend `VITE_BACKEND_URL` to Railway URL

## Support

For issues:
- Check Vercel deployment logs
- Review Supabase dashboard
- Test backend endpoints locally
- Verify email service configuration
