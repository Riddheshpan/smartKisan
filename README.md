# smartKisan

## Deployment

To deploy this project to production:

1.  **Build**: Run `npm run build`. This generates the static files in the `dist` folder.
2.  **Preview**: Run `npm run preview` to test the production build locally.
3.  **Host**: Upload the `dist` folder to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

### Environment Variables
Ensure the following environment variables are set in your production environment:
- `VITE_HF_TOKEN`: Your Hugging Face API token.
- `VITE_SUPABASE_URL`: Your Supabase URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.

The API calls to Hugging Face will automatically switch to the direct URL in production, bypassing the local proxy.