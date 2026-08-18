import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// NextAuth route handler. Uses the credentials provider defined in
// src/lib/auth.ts (single hardcoded admin account from env vars).
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
