# Netlify Environment Variables Setup

## Required Environment Variables

You need to set these environment variables in your Netlify dashboard:

### 1. Navigate to Netlify Dashboard

1. Go to your Netlify dashboard
2. Select your deployed site
3. Go to **Site settings** → **Environment variables**

### 2. Add Required Variables

Add these environment variables:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Get Supabase Credentials

To get your Supabase credentials:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → use for `VITE_SUPABASE_URL`
   - **Project API Keys** → **anon public** → use for `VITE_SUPABASE_ANON_KEY`

### 4. Optional Environment Variables

You can also add these optional variables:

```
VITE_APP_URL=https://your-domain.netlify.app
VITE_USE_NEON=false
VITE_ENABLE_DUAL_DATABASE=false
```

### 5. Redeploy

After adding the environment variables:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete

### 6. Verify Configuration

After deployment, check the browser console for any Supabase connection warnings. You should see successful connections to your Supabase backend.

## Troubleshooting

If you still see placeholder warnings:

1. **Check variable names**: Make sure they start with `VITE_` (not `NEXT_PUBLIC_`)
2. **Clear cache**: Clear your browser cache and hard refresh
3. **Check build logs**: Look at Netlify build logs for any errors
4. **Verify credentials**: Test your Supabase URL/key in Supabase dashboard

## Build Configuration

The `netlify.toml` file is configured to:

- Use Node.js version 20
- Build with `npm run build:production`
- Serve from `dist/spa` directory
- Handle client-side routing with redirects

## Security Notes

- Never commit real environment variables to your repository
- Use Netlify's environment variable dashboard for all secrets
- The `VITE_` prefix makes variables available to the client-side build
- Keep your Supabase service role key (if needed) as a build-only secret
