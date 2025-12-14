import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongo";
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
          response_type: "code",
          scope: "openid email profile"
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        image: { label: "Image", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("חסר מייל או סיסמא");
        }

        const client = await clientPromise; // <-- כאן
        const db = client.db("FitFinder");
        const type: UserType = "Trainee";
        const dbUser = await findUserByEmail(credentials.email, db, type);

        if (!dbUser) throw new Error("משתמש לא קיים");

        const isValid = await bcrypt.compare(credentials.password, dbUser.password);
        if (!isValid) throw new Error("סיסמא שגויה");

        return {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          image: dbUser.image || "/images/UserProfile.png",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      if (account?.provider === "google") {
        token.picture = user?.image || profile?.picture || token.picture;
      }
      return token;
    },
    async signIn({ user, account }: any) {
      const client = await clientPromise;
      const db = client.db("FitFinder");
      const type: UserType = "Trainee";

      const existing = await findUserByEmail(user.email, db, type);
      if (!existing) {
        if (account?.provider !== "google") return false;
        await createUser({
          name: user.name,
          email: user.email,
          password: account?.provider === "google" ? "" : user.password,
          phone: user.phone || "",
          image: user.image || "",
        }, db, type);
      }
      return true;
    },
    async session({ session, token }: any) {
      const client = await clientPromise;
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
          session.user.image = dbUser.image || token.picture || session.user.image;
        }
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
