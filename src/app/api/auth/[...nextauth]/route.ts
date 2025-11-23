import NextAuth, { type SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "../../../../lib/mongo";
import { findUserByEmail, createUser, UserType } from "../../../../services/userService";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const db = client.db("FitFinder");
          const type: UserType = "Trainee";
          const user = await findUserByEmail(credentials.email, db, type);

          if (!user) {
            return null;
          }

          // בדיקת סיסמה
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("❌ authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: any) {
      // רק עבור Google provider, נשמור את המשתמש אם הוא לא קיים
      if (account?.provider === "google") {
        try {
          const db = client.db("FitFinder");
          const type: UserType = "Trainee";

          const existing = await findUserByEmail(user.email, db, type);
          if (!existing) {
            await createUser(
              { name: user.name, email: user.email, password: "" },
              db,
              type
            );
          }
        } catch (err) {
          console.error("❌ signIn callback error:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }: any) {
      // שמירת המידע ב-token בזמן ההתחברות הראשונית
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      // אחרי רענון, נטען את המידע מה-DB אם אין אותו ב-token
      if (!token.name && token.email) {
        try {
          const db = client.db("FitFinder");
          const type: UserType = "Trainee";
          const dbUser = await findUserByEmail(token.email, db, type);
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.email = dbUser.email;
            token.name = dbUser.name;
          }
        } catch (err) {
          console.error("❌ jwt callback error:", err);
        }
      }
      
      return token;
    },

    async session({ session, token }: any) {
      try {
        // אם יש מידע ב-token (מגיע מה-jwt callback), נשתמש בו
        if (token?.email && token?.name) {
          session.user.id = token.id || "";
          session.user.name = token.name;
          session.user.email = token.email;
        } else {
          // אם אין מידע ב-token, נטען מה-DB (fallback)
          const db = client.db("FitFinder");
          const type: UserType = "Trainee";
          const email = token?.email || session.user?.email;
          
          if (email) {
            const dbUser = await findUserByEmail(email, db, type);
            if (dbUser) {
              session.user.id = dbUser._id.toString();
              session.user.name = dbUser.name;
              session.user.email = dbUser.email;
            }
          }
        }
      } catch (err) {
        console.error("❌ session callback error:", err);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };