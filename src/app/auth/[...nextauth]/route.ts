// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { client } from "../../../services/server/mongo";
import { findUserByEmail, createUser, UserType } from "../../../services/server/userService";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: any) {
      try {
        const db = client.db("FitFinder");

        // קביעת סוג המשתמש (לדוגמה: ברירת מחדל 'trainee')
        const type: UserType = "Trainee";

        const existing = await findUserByEmail(user.email, db, type);
        if (!existing) {
          await createUser(
            { name: user.name, email: user.email, password: user.password },
            db,
            type
          );
        }
        return true;
      } catch (err) {
        console.error("❌ signIn callback error:", err);
        return false;
      }
    },

    async session({ session }: any) {
      try {
        const db = client.db("FitFinder");

        // סוג המשתמש צריך להתאים למה שנשמר במסד
        const type: UserType = "Trainee";

        const dbUser = await findUserByEmail(session.user?.email, db, type);
        if (dbUser) {
          session.user.id = dbUser._id.toString();
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