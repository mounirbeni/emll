# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Configuration Files
- [x] `vercel.json` - Updated with proper build command and Prisma generation
- [x] `next.config.ts` - Production optimizations added (compress, security headers)
- [x] `package.json` - Added `postinstall` script for Prisma Client generation
- [x] Build command includes Prisma generation

### Documentation
- [x] `DEPLOYMENT.md` - Comprehensive deployment guide created
- [x] `VERCEL_QUICK_START.md` - Quick reference guide created
- [x] `README.md` - Updated with deployment information

### Environment Variables Required

#### Required
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `AUTH_SECRET` - 32+ character secret (generate with `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Production URL (e.g., `https://your-project.vercel.app`)
- [ ] `NODE_ENV` - Set to `production`

#### Optional
- [ ] `GOOGLE_CLIENT_ID` - For Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - For Google OAuth
- [ ] `RESEND_API_KEY` - For email functionality
- [ ] `NEXT_PUBLIC_APP_URL` - Public app URL

### Database Setup
- [ ] PostgreSQL database created
- [ ] Connection string obtained
- [ ] SSL enabled (add `?sslmode=require` to connection string)
- [ ] Database migrations ready to run

### Pre-Deployment Steps
1. [ ] Test build locally: `npm run build`
2. [ ] Verify all environment variables are set
3. [ ] Check database connection works
4. [ ] Review security settings

### Deployment Steps
1. [ ] Push code to Git repository
2. [ ] Import project in Vercel dashboard
3. [ ] Add all environment variables
4. [ ] Deploy project
5. [ ] Run database migrations: `npx prisma migrate deploy`
6. [ ] Verify deployment works
7. [ ] Test authentication
8. [ ] Test database operations

### Post-Deployment
- [ ] Verify site is accessible
- [ ] Test user registration/login
- [ ] Test booking functionality
- [ ] Check admin panel access
- [ ] Verify API routes work
- [ ] Test image loading
- [ ] Check mobile responsiveness

## 🔧 Build Configuration

### Current Build Command
```bash
prisma generate && next build
```

### Vercel Configuration
- Framework: Next.js (auto-detected)
- Build Command: `prisma generate && next build`
- Output Directory: `.next`
- Install Command: `npm install`

## 📝 Notes

- Prisma Client is automatically generated via `postinstall` script
- Database migrations should be run after first deployment
- All environment variables must be set before deployment
- SSL is required for database connections in production

## 🚨 Common Issues & Solutions

### Build Fails
- **Issue**: Prisma Client not found
- **Solution**: Ensure `postinstall` script runs: `"postinstall": "prisma generate"`

### Database Connection Errors
- **Issue**: Connection refused or timeout
- **Solution**: 
  - Verify DATABASE_URL is correct
  - Ensure SSL is enabled: `?sslmode=require`
  - Check database allows connections from Vercel IPs

### Authentication Errors
- **Issue**: AUTH_SECRET error
- **Solution**: Ensure AUTH_SECRET is 32+ characters and set correctly

### Migration Errors
- **Issue**: Schema out of sync
- **Solution**: Run `npx prisma migrate deploy` after deployment

## 📚 Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Quick Start Guide](./VERCEL_QUICK_START.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
