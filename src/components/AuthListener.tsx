"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { userStore } from "@/store/userStore";

export default function AuthListener() {
  const { data: session, status } = useSession();
  const setUser = userStore((state) => state.setUser);

  useEffect(() => {
    // אחרי רענון, אם יש session, נטען את המידע ל-store
    if (status === "authenticated" && session?.user?.email) {
      setUser({
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email,
      });
    }
  }, [status, session, setUser]);

  return null; // לא מציג כלום, רק מאזין
}

