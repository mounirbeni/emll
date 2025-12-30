# Vercel Deployment Guide

This guide will help you deploy the Marrakech platform to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- A PostgreSQL database (recommended: [Vercel Postgres](https://vercel.com/storage/postgres), [Supabase](https://supabase.com), or [Neon](https://neon.tech))
- GitHub/GitLab/Bitbucket account (for automatic deployments)

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Create a new Postgres database
4. Copy the connection string (it will be automatically added as `POSTGRES_PRISMA_URL`)

### Option B: External PostgreSQL Database

1. Set up a PostgreSQL database with your preferred provider:
   - [Supabase](https://supabase.com) (Free tier available)
   - [Neon](https://neon.tech) (Free tier available)
   - [Railway](https://railway.app) (Free tier available)
   - [Render](https://render.com) (Free tier available)

2. Get your database connection string (format: `postgresql://user:password@host:port/database`)

## Step 2: Environment Variables

Add the following environment variables in your Vercel project settings:

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# NextAuth.js
AUTH_SECRET=your-secret-key-minimum-32-characters-long
NEXTAUTH_URL=https://your-domain.vercel.app

# Node Environment
NODE_ENV=production
```

### Optional Variables

```bash
# Google OAuth (if using Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Other services
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### How to Add Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Variable value
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
4. Click **Save**

### Generate AUTH_SECRET

Run this command to generate a secure AUTH_SECRET:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 3: Database Migrations

### First-Time Setup

1. **Option A: Using Prisma Migrate (Recommended)**
   ```bash
   # Run migrations locally first
   npx prisma migrate deploy
   
   # Or push schema directly (for development)
   npx prisma db push
   ```

2. **Option B: Using Vercel Build Command**
   The build command will automatically generate Prisma Client. For migrations, you can:
   - Run migrations manually after deployment
   - Use a migration script in your build process
   - Use Vercel's Postgres migration feature

### Running Migrations on Vercel

You can add a migration step to your build process or run migrations manually:

```bash
# Connect to your production database
npx prisma migrate deploy
```

Or add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or your project root)
   - **Build Command**: `prisma generate && next build` (or leave default)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
5. Add all environment variables (from Step 2)
6. Click **Deploy**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 5: Post-Deployment Setup

### 1. Run Database Migrations

After first deployment, run migrations:

```bash
# Set your DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

### 2. Seed Database (Optional)

If you have seed data:

```bash
npx prisma db seed
```

### 3. Verify Deployment

1. Visit your deployed URL: `https://your-project.vercel.app`
2. Test key features:
   - Homepage loads
   - User registration/login
   - Database connections
   - API routes

## Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains** in your Vercel project
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable with your custom domain

## Troubleshooting

### Build Failures

**Issue**: Prisma Client not generated
```bash
# Solution: Ensure postinstall script runs
# Check package.json has: "postinstall": "prisma generate"
```

**Issue**: Database connection errors
```bash
# Solution: Verify DATABASE_URL is correct
# Ensure SSL is enabled: ?sslmode=require
# Check database is accessible from Vercel's IPs
```

**Issue**: Environment variables not loading
```bash
# Solution: 
# 1. Verify variables are set in Vercel dashboard
# 2. Redeploy after adding variables
# 3. Check variable names match exactly (case-sensitive)
```

### Runtime Errors

**Issue**: AUTH_SECRET error
```bash
# Solution: Ensure AUTH_SECRET is at least 32 characters
# Generate new secret: openssl rand -base64 32
```

**Issue**: NEXTAUTH_URL error
```bash
# Solution: Set NEXTAUTH_URL to your production URL
# Format: https://your-domain.vercel.app
```

### Database Issues

**Issue**: Migration errors
```bash
# Solution: Run migrations manually
npx prisma migrate deploy
# Or reset and push schema
npx prisma db push --force-reset
```

**Issue**: Connection pool exhausted
```bash
# Solution: Add connection pooling
# Use connection pooler URL if available
# Or increase pool size in Prisma schema
```

## Environment-Specific Configuration

### Production
- `NODE_ENV=production`
- `NEXTAUTH_URL=https://your-domain.vercel.app`
- Use production database
- Enable all security features

### Preview (Staging)
- `NODE_ENV=production`
- `NEXTAUTH_URL=https://your-preview-url.vercel.app`
- Use staging database (optional)
- Same security as production

### Development
- `NODE_ENV=development`
- `NEXTAUTH_URL=http://localhost:3000`
- Use local database
- Debug mode enabled

## Performance Optimization

### 1. Enable Edge Functions (if applicable)
- Some routes can use Edge Runtime for faster response times
- Already configured for `icon.tsx` and `opengraph-image.tsx`

### 2. Database Connection Pooling
- Use connection pooler URL from your database provider
- Reduces connection overhead

### 3. Image Optimization
- Next.js Image component is already configured
- Remote patterns are set in `next.config.ts`

### 4. Caching
- Static pages are automatically cached
- API routes can implement caching headers

## Monitoring

### Vercel Analytics
1. Enable in **Settings** → **Analytics**
2. View metrics in dashboard

### Error Tracking
- Consider adding Sentry or similar service
- Monitor logs in Vercel dashboard

## Security Checklist

- [ ] All environment variables are set
- [ ] AUTH_SECRET is strong and unique
- [ ] Database uses SSL connection
- [ ] NEXTAUTH_URL matches production domain
- [ ] Security headers are configured (already in `next.config.ts`)
- [ ] Rate limiting is enabled (already in middleware)
- [ ] CORS is properly configured

## Support

For issues specific to:
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Prisma**: [Prisma Documentation](https://www.prisma.io/docs)

## Additional Resources

- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
