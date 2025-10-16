# Swiftly - URL Shortener

A modern, fast, and beautiful URL shortener built with Next.js 15 and better-auth.

## Features

✨ **URL Shortening** - Quickly shorten long URLs with a clean, modern interface
🔐 **Authentication** - Secure authentication with better-auth (email/password + OAuth)
👤 **User Accounts** - Create an account to manage unlimited URLs
🔗 **Anonymous Usage** - Non-authenticated users can create up to 5 URLs
📊 **URL Management** - Track and manage your shortened URLs
🎨 **Beautiful UI** - Modern design with Tailwind CSS and custom fonts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: better-auth
- **Database**: SQLite (development) / PostgreSQL (production recommended)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd swiftly-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```env
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```

   Optional (for OAuth):
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. Generate a secure secret for production:
   ```bash
   openssl rand -base64 32
   ```
   Add this to your `BETTER_AUTH_SECRET` in `.env`

5. Run database migrations:
   ```bash
   npx @better-auth/cli migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication

Swiftly uses [better-auth](https://better-auth.com) for authentication, which provides:

- Email/Password authentication
- Social login (Google, GitHub)
- Password reset functionality
- Secure session management
- Middleware-based route protection

### Setting up OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Add credentials to `.env`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add credentials to `.env`

## Project Structure

```
swiftly-fe/
├── app/                          # Next.js app directory
│   ├── api/auth/[...all]/       # Better Auth API routes
│   ├── sign-in/                 # Sign-in page
│   ├── sign-up/                 # Sign-up page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   │   ├── divider.tsx
│   │   ├── form-fields.tsx
│   │   └── oauth-buttons.tsx
│   ├── ui/                      # UI components
│   ├── hero.tsx
│   ├── navbar.tsx
│   └── shorten.tsx
├── hooks/                        # Custom React hooks
│   └── useAuthSync.tsx
├── lib/                          # Utilities and configurations
│   ├── auth.ts                  # Better Auth server config
│   ├── auth-client.ts           # Better Auth client
│   └── utils.ts
├── public/                       # Static assets
├── .env                          # Environment variables
├── .env.example                 # Environment variables template
├── MIGRATION_GUIDE.md           # Migration from Clerk to better-auth
└── middleware.ts                # Next.js middleware for auth
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database

The project uses SQLite for development. For production, it's recommended to use PostgreSQL or MySQL.

### Migrating to PostgreSQL

Update `lib/auth.ts`:

```typescript
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // ... rest of config
});
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (your production URL)
   - `NEXT_PUBLIC_BETTER_AUTH_URL` (your production URL)
   - `NEXT_PUBLIC_BACKEND_URL`
   - OAuth credentials (if using)
4. Deploy!

### Other Platforms

Make sure to:
1. Set all required environment variables
2. Update `BETTER_AUTH_URL` to your production domain
3. Update OAuth redirect URIs to use production domain
4. Consider using a production database (PostgreSQL/MySQL)

## Migration from Clerk

This project has been migrated from Clerk to better-auth. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Support

For issues and questions:
- [better-auth Documentation](https://better-auth.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Authentication by [better-auth](https://better-auth.com)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)
