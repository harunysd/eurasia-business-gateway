import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// NextAuth configuration. A single hardcoded admin account (email + bcrypt
// password hash) is sourced from environment variables. There is no user
// database — this is intentionally a minimal content-editor login.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        // The hash is stored base64-encoded in the env var to avoid dotenv
        // `$VAR` expansion mangling the bcrypt hash (which contains `$`).
        const passwordHashB64 = process.env.ADMIN_PASSWORD_HASH;
        const passwordHash = passwordHashB64
          ? Buffer.from(passwordHashB64, 'base64').toString('utf-8')
          : undefined;

        if (!adminEmail || !passwordHash) {
          return null;
        }

        if (
          !credentials?.email ||
          !credentials?.password ||
          credentials.email.toLowerCase() !== adminEmail.toLowerCase()
        ) {
          return null;
        }

        const valid = await bcrypt.compare(
          credentials.password,
          passwordHash,
        );
        if (!valid) return null;

        return { id: 'admin', email: adminEmail, name: 'Admin' };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
