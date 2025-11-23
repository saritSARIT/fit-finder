import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { client } from "../../../../lib/mongo";
import { findUserByEmail, createUser, UserType } from "../../../../services/userService";

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

    async session({ session, token }: any) {
      try {
        const db = client.db("FitFinder");
        const type: UserType = "Trainee";

        // נטען את המשתמש מה-DB כדי לקבל את השם המעודכן
        const email = token?.email || session.user?.email;
        if (email) {
          const dbUser = await findUserByEmail(email, db, type);
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            // ⭐ עדכון השם מה-DB כדי להבטיח שהוא תמיד מעודכן
            session.user.name = dbUser.name;
            session.user.email = dbUser.email;
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