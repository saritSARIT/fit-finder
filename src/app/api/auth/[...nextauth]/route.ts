import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { client } from "../../../../lib/mongo";
import { findUserByEmail, createUser, UserType } from "../../../../services/userService";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent", 
          access_type: "offline",
          response_type: "code"
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }: any) {
      try {
        const db = client.db("FitFinder");
        const type: UserType = "Trainee";

        const existing = await findUserByEmail(user.email, db, type);
        if (!existing) {
          await createUser(
            {
              name: user.name,
              email: user.email,
              password: account?.provider === "google" ? "" : user.password,
              phone: user.phone,
              isTrainer: false,
            },
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

        const email = token?.email || session.user?.email;
        if (email) {
          const dbUser = await findUserByEmail(email, db, type);
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.password = dbUser.password;
            session.user.name = dbUser.name;
            session.user.email = dbUser.email;
            session.user.phone = dbUser.phone;
          }
        }
      } catch (err) {
        console.error("❌ session callback error:", err);
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard/trainee/searchTraining";
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };