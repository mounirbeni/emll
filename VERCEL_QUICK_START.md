# Quick Start: Deploy to Vercel

## 🚀 Fast Deployment Steps

### 1. Prepare Your Database
- Set up PostgreSQL (Vercel Postgres, Supabase, Neon, etc.)
- Get your connection string

### 2. Set Environment Variables in Vercel

Go to **Settings → Environment Variables** and add:

```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
AUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-project.vercel.app
NODE_ENV=production
```

### 3. Deploy

**Option A: Via Dashboard**
1. Import your Git repository in Vercel
2. Vercel will auto-detect Next.js
3. Add environment variables
4. Click Deploy

**Option B: Via CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. Run Migrations

After first deployment:
```bash
npx prisma migrate deploy
```

Or add to build command in `vercel.json`:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

## ✅ Checklist

- [ ] Database created and connection string ready
- [ ] Environment variables set in Vercel
- [ ] AUTH_SECRET generated (32+ characters)
- [ ] NEXTAUTH_URL matches your domain
- [ ] Database migrations run
- [ ] Site is accessible and working

## 📚 Full Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔧 Troubleshooting

**Build fails?**
- Check DATABASE_URL is correct
- Verify AUTH_SECRET is 32+ characters
- Ensure Prisma generates: `prisma generate`

**Database errors?**
- Verify connection string format
- Check SSL mode: `?sslmode=require`
- Ensure database is accessible

**Auth errors?**
- Verify NEXTAUTH_URL matches your domain
- Check AUTH_SECRET is set correctly
